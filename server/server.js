// Express setup
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Admin SDK setup
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const { getAuth } = require('firebase-admin/auth');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // databaseURL: "https://my-web-project.firebaseio.com"
});
const db = admin.firestore();

app.use(cors());
app.use(express.json());

// React build static files
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// Authentication middleware
async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('No token provided');

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        req.user = decodedToken; // Attach user ID to request
        next();
    } catch (error) {
        if (error.code === 'auth/id-token-expired') {
            res.status(401).send('Token has expired');
        } else if (error.code === 'auth/invalid-id-token') {
            res.status(401).send('Invalid token');
        } else {
            res.status(403).send('Unauthorized');
        }
    }
}

app.get('/api/test', (req, res) => {
  res.json({ ok: true });
});

app.get("/api/trips", authenticateToken, async (req, res) => {
    const uid = req.user.uid;

    try {
        const tripsRef = db.collection('users').doc(uid).collection('trips');
        const snapshot = await tripsRef.get();

        const trips = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(trips);
    } catch (error) {
        console.error("Error fetching trips:", error);
        res.status(500).json({ error: "Failed to fetch planned trips" });
    }
});

app.post('/api/trips', authenticateToken, async (req, res) => {
    const uid = req.user.uid;
    const tripData = req.body;

    console.log('Request body:', req.body);

    try {
        const tripRef = await db
            .collection('users')
            .doc(uid)
            .collection('trips')
            .add({ ...tripData, status: 'planned' });

        await tripRef.update({ id: tripRef.id }); // Update the document with its own ID

        res.status(201).json({ id: tripRef.id, ...tripData, status: 'planned' });
    } catch (error) {
        console.error("Error adding trip:", error);
        res.status(500).json({ error: "Failed to add trip" });
    }
})

app.delete('/api/trips/:tripId', authenticateToken, async (req, res) => {
    const { tripId } = req.params;
    const uid = req.user.uid;

    try {
        const tripRef = db.collection('users').doc(uid).collection('trips').doc(tripId);
        await tripRef.delete();
        res.status(200).json({ message: `Trip ${tripId} deleted` });
    } catch (error) {
        console.error("Error deleting trip:", error);
        res.status(500).json({ error: "Failed to delete trip" });
    }
});

app.patch('/api/trips/:tripId/complete', authenticateToken, async (req, res) => {
  const { tripId } = req.params;
  const uid = req.user.uid;
  console.log('PATCH /api/trips/:tripId/complete', { tripId, uid });

  try {
    const tripRef = db.collection('users').doc(uid).collection('trips').doc(tripId);
    await tripRef.update({ status: 'completed' });
    res.status(200).json({ message: `Trip ${tripId} marked as completed` });
  } catch (error) {
    console.error('Error marking trip as completed:', error);
    res.status(500).json({ error: 'Failed to mark trip as completed' });
  }

  console.log("PATCH complete trip", req.params.tripId);
});

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
