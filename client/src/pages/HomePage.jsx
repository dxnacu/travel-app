import Header from '../components/Header';
import Footer from '../components/Footer';
import "../styles/general.css";
import "../styles/main.css";
import "../styles/places.css";
import { useState, useMemo, useEffect } from "react";
import PlaceCard from "../components/PlaceCard";
import { usePlannedTrips } from '../context/plannedTripsContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { getPlaces } from '../services/databaseService';

const HomePage = () => {
    const { plannedTrips, addTrip } = usePlannedTrips();
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPlaces = async () => {
            try {
                const placesData = await getPlaces();
                setPlaces(placesData);
            } catch(error) {
                console.error("Error fetching places data: ", error);
            } finally {
                setLoading(false);
            }
        };

        loadPlaces();
    }, []);

    const topPlaces = useMemo(() => {
        return [...places].sort((a, b) => b.rating - a.rating).slice(0, 4);
    }, [places]);

    if(loading) {
        return <p>Loading...</p>;
    }

    const checkAuth = () => {
        if(!auth.currentUser) {
            navigate('/login');
            return false;
        }
        return true;
    }

    const handleBudgetClick = () => {
        if(checkAuth()) {
            navigate('/budget');
        }
    }

    return (
        <>
            <Header />
            <main>
                <section className="hero">
                    <div className="hero-container">
                        <img src={"/images/beach-picture.jpg"} alt="Hero" className="hero-image" />
                        <div className="hero-text">
                            <h1 id='hero-h1'>Explore Beautiful Places</h1>
                        </div>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="Location"/>
                        <input type="date"/>
                        <input type="text" placeholder="€"/>
                        <button className="search-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px"><path d="M 20.5 6 C 12.509634 6 6 12.50964 6 20.5 C 6 28.49036 12.509634 35 20.5 35 C 23.956359 35 27.133709 33.779044 29.628906 31.75 L 39.439453 41.560547 A 1.50015 1.50015 0 1 0 41.560547 39.439453 L 31.75 29.628906 C 33.779044 27.133709 35 23.956357 35 20.5 C 35 12.50964 28.490366 6 20.5 6 z M 20.5 9 C 26.869047 9 32 14.130957 32 20.5 C 32 23.602612 30.776198 26.405717 28.791016 28.470703 A 1.50015 1.50015 0 0 0 28.470703 28.791016 C 26.405717 30.776199 23.602614 32 20.5 32 C 14.130953 32 9 26.869043 9 20.5 C 9 14.130957 14.130953 9 20.5 9 z"/></svg>
                        </button>
                    </div>
                </section>
                <section id="why-us" className="why-us">
                    <div className="container">
                        <h2>Why Choose Us?</h2>
                        <div className="content">
                            <div className="why-us-img">
                                <img src={"/images/why-us.jpg"} alt="why us"/>
                            </div>
                            <div className="text">
                                <h3>We Deliver Experience</h3>
                                <p>
                                At our company, we prioritize customer satisfaction and innovation. 
                                With a team of dedicated professionals, we ensure high-quality services, 
                                reliable support, and cutting-edge solutions tailored to your needs.
                                </p>
                                <p>
                                Our mission is to create long-lasting relationships with our clients 
                                by providing value-driven services. Choose us for a seamless experience and 
                                results that matter.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="places-to-visit" className="content">
                    <h2>Top Destinations For You</h2>
                    <p>Discover breathtaking locations for your next trip.</p>
                    <div className="places-container">
                        {topPlaces.map((place) => (
                            <PlaceCard 
                                key={place.id}
                                place={place}
                                plannedTrips={plannedTrips}
                                onAdd={addTrip}
                            />
                        ))}
                    </div>
                </section>
                <section id="budget" className="content">
                    <div>
                        <h2>Budget</h2>
                        <p>Plan your expenses and manage your travel costs wisely.</p>
                        <div className="budget-btn-div">
                            <button className="budg-btn" onClick={handleBudgetClick}>
                                Get Started
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
};

export default HomePage;