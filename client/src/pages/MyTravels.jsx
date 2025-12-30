import Header from "../components/Header";
import Footer from "../components/Footer";
import '../styles/my-travels.css';
import { usePlannedTrips } from '../context/plannedTripsContext';
import { useUser } from '../context/userContext';
import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function MyTravels() {
    const { trips, removeTrip, markTripAsCompleted } = usePlannedTrips();
    const { user } = useUser();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    if (!user) {
        return (
            <div>
                <Header />
                <div className="my-trips">
                    <p>To view your trips, please, <a href="/login">log in to the account</a>.</p>
                </div>
                <Footer />
            </div>
        );
    }

    console.log('Fetched trips:', trips);

    const planned = trips.filter(trip => trip.status === 'planned');
    const completed = trips.filter(trip => trip.status === 'completed');

    const handleRemove = (id) => {
        console.log("Trying to remove trip with id:", id);
        if (!id) {
            console.error("Trip id is undefined in handleRemove");
            return;
        }

        const trip = trips.find(t => t.id === id);
        if (trip && window.confirm(`Are you sure you want to remove "${trip.name}"?`)) {
            removeTrip(id);
            toast.error(`Trip "${trip.name}" removed`);
        }
    };

    const handleComplete = (id) => {
        if (!id) {
            console.error("Trip id is undefined in handleComplete");
            return;
        }

        const trip = trips.find(t => t.id === id);
        if (trip){
            markTripAsCompleted(id);
            toast.success(`Trip "${trip.name}" completed!`);
        }
    };

    return (
        <div>
            <Header />
            <div className="my-trips">
                <div className="planned-trips">
                    <h3>Planned Trips</h3>
                    <div className="planned-trips-list">
                        {planned.length === 0 ? (
                            <p style={{textAlign: 'center', margin: '100px'}}>
                                No planned trips yet
                            </p>
                        ) : (
                            planned.map((trip) => (
                                <div className="trip-card" 
                                    key={trip.id}
                                    onMouseEnter={() => setHoveredIndex(trip.id)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <img src={trip.image} alt={trip.name} />
                                    <div className="trip-info">
                                        <h4>{trip.name}</h4>
                                        <p>{trip.date}</p>
                                    </div>

                                    {hoveredIndex === trip.id && (
                                        <div className='hover-buttons'>
                                            <button 
                                                className='remove-btn'
                                                onClick={() => handleRemove(trip.id)}
                                            >
                                                Remove
                                            </button>
                                            <button 
                                                className='complete-btn'
                                                onClick={() => handleComplete(trip.id)}
                                            >
                                                Complete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            
                <div className="completed-trips">
                    <h3>Completed Trips</h3>
                    <div>
                        {completed.length === 0 ? (
                            <p style={{ textAlign: 'center', margin: '100px' }}>
                                No completed trips yet.
                            </p>
                        ) : (
                            completed.map((trip) => (
                                <div className="trip-card completed" key={trip.id}>
                                    <img src={trip.image} alt={trip.name} />
                                    <div className="trip-info">
                                        <h4>{trip.name}</h4>
                                        <p>5-10 March 2024</p>
                                    </div>
                                    <div className='hover-buttons'>
                                        <button className="remove-btn"
                                        onClick={() => removeTrip(trip.id)}>Remove</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />  
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar /> 
        </div>
    );
}