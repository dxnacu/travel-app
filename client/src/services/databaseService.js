import { collection, getDocs, setDoc, doc, getDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function getPlaces() {
    const placesCol = collection(db, "places");
    const placesSnapshot = await getDocs(placesCol);
    console.log("Places: ", placesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    return placesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getPlaceById = async (id) => {
    const docRef = doc(db, 'places', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        throw new Error('Place not found');
    }

    return { ...docSnap.data(), firebaseId: docSnap.id };
};

export const addTripToFirestore = async (uid, tripData) => {
    const userTripsRef = collection(db, 'users', uid, 'trips');
    const { id: _discardedId, ...cleanTripData } = tripData;

    const docRef = await addDoc(userTripsRef, { ...cleanTripData, status: 'planned' });

    // Optionally, update the document to include its own Firestore ID as a field
    await setDoc(docRef, { ...cleanTripData, status: 'planned', id: docRef.id });

    console.log(`Trip added with ID: ${docRef.id}`);

    return { ...cleanTripData, id: docRef.id, status: 'planned' };
};

export const getTripsFromFirestore = async (uid) => {
    const tripsRef = collection(db, 'users', uid, 'trips');
    const snapshot = await getDocs(tripsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteTripFromFirestore = async (uid, tripid) => {
  try {
    const tripRef = doc(db, 'users', uid, 'trips', tripid);
    await deleteDoc(tripRef);
    console.log(`Trip "${tripid}" deleted from Firestore`);
  } catch (error) {
    console.error('Error deleting trip from Firestore:', error);
  }
};

export const markTripAsCompletedInFirestore = async (uid, tripid) => {
    const tripRef = doc(db, 'users', uid, 'trips', tripid);
    await updateDoc(tripRef, { status: 'completed' });
};

export async function addUserToDatabase(user, role) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()){
            await setDoc(userRef, {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                createdAt: new Date()
            });
            console.log("User added to database: ", user.email);
        } else {
            console.log("User already exists in database: ", user.email);
        }
    } catch (error) {
        console.error("Error adding user to database: ", error);
        throw error;
    }
}