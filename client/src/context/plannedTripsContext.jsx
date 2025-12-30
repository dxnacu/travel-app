import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from "./userContext";
import { fetchIdToken } from '../services/authService'; // Adjust the import path as necessary

const PlannedTripsContext = createContext();

export function PlannedTripsProvider({ children }) {
  const { user } = useUser();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // const token = await user.getIdToken();
        const token = await fetchIdToken();
        const res = await fetch('/api/trips', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to load trips');
        }

        const tripsFromServer = await res.json();
        setTrips(tripsFromServer);
      } catch (error) {
        console.error("Error loading trips:", error);
      }
    };

    if(user) fetchTrips();
  }, [user]);

  const addTrip = async (trip) => {
    if (user) {
      try {
        const token = await fetchIdToken(); // <-- FIXED
  
        const res = await fetch('/api/trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(trip)
        });
  
        if (!res.ok) {
          throw new Error('Failed to add trip');
        }
  
        const newTrip = await res.json();
        setTrips(prevTrips => [...prevTrips, newTrip]);
      } catch (error) {
        console.error("Error adding trip:", error);
      }
    }
  }
  
  const removeTrip = async (tripid) => {
    if (!tripid) {
      console.error("No tripid provided to removeTrip!");
      return;
    }

    if (user) {
      try {
        const token = await fetchIdToken();
        const res = await fetch(`/api/trips/${tripid}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (!res.ok) {
          throw new Error("Failed to delete trip");
        }
  
        setTrips(prevTrips => prevTrips.filter(trip => trip.id !== tripid));
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  const markTripAsCompleted = async (tripid) => {
    if (!tripid) {
      console.error("No tripid provided to markTripAsCompleted!");
      return;
    }
    
    if (user) {
      try {
        const token = await fetchIdToken();
        const res = await fetch(`/api/trips/${tripid}/complete`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error("Failed to mark trip as completed");
        }

        setTrips(prevTrips => 
          prevTrips.map(trip => 
            trip.id === tripid ? { ...trip, status: 'completed' } : trip
          )
        );
      } catch (error) {
        console.error("Error marking trip as completed:", error);
      }
    }
  }

  return (
    <PlannedTripsContext.Provider value={{ trips, addTrip, removeTrip, markTripAsCompleted }}>
      {children}
    </PlannedTripsContext.Provider>
  );
}

export function usePlannedTrips() {
  return useContext(PlannedTripsContext);
}
