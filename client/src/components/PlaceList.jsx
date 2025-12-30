import PlaceCard from './PlaceCard';
import { usePlannedTrips } from '../context/plannedTripsContext';
import { getPlaces } from '../services/databaseService'; 
import { useState, useEffect } from 'react';
import '../styles/places-to-visit.css';
import "../styles/general.css";

export default function PlaceList() {
    const { plannedTrips, addTrip } = usePlannedTrips();

    const [allPlaces, setAllPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    let filters = ["Beach", "Mountains", "City", "Other"];

    useEffect(() => {
        const loadPlaces = async () => {
            try {
                const placesData = await getPlaces();
                setAllPlaces(placesData);
                setFilteredPlaces(placesData);
            } catch (error) {
                console.error("Error fetching places: ", error);
            } finally {
                setLoading(false);
            }
        };

        loadPlaces();
    }, []);

    useEffect(() => {
        if (selectedFilters.length > 0) {
            const filtered = allPlaces.filter((place) =>
                selectedFilters.includes(place.category)
            );
            setFilteredPlaces(filtered);
        } else {
            setFilteredPlaces(allPlaces);
        }
    }, [selectedFilters, allPlaces]);

    const handleFilterButtonClick = (selectedCategory) => {
        if (selectedFilters.includes(selectedCategory)) {
            let filters = selectedFilters.filter((el) => el !== selectedCategory);
            setSelectedFilters(filters);
        } else {
            setSelectedFilters([...selectedFilters, selectedCategory]);
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <div className="filter-buttons-container">
                {filters.map((category, idx) => (
                    <button
                        onClick={() => handleFilterButtonClick(category)}
                        className={`filter-btn ${
                            selectedFilters?.includes(category) ? "filter-active" : ""
                        }`}
                        key={`filters-${idx}`}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="places-container">
                {filteredPlaces.map((place, idx) => (
                    <PlaceCard
                        key={place.id || idx}
                        place={place}
                        plannedTrips={plannedTrips}
                        onAdd={addTrip}
                    />
                ))}
            </div>
        </div>
    );
}