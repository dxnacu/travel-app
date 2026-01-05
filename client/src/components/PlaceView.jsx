import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPlaceById } from '../services/databaseService';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { usePlannedTrips } from '../context/plannedTripsContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';
import '../styles/place-view.css';
import '../styles/main.css';

function PlaceView() {
    const { id } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addTrip } = usePlannedTrips();
    const [breakfastSelection, setBreakfastSelection] = useState({});
    
    const reviews = [
        { id: 1, user: 'John Doe', rating: 5, comment: 'Amazing place! Highly recommend.' },
        { id: 2, user: 'Jane Smith', rating: 4, comment: 'Great experience, but a bit crowded.' }
    ];
    // allow local reviews state (will persist later to backend)
    const [localReviews, setLocalReviews] = useState(reviews);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const placeData = await getPlaceById(id);
                setPlace(placeData);
            } catch (err) {
                setError('Place not found');
            } finally {
                setLoading(false);
            }
        };
        fetchPlace();
    }, [id]);

    // const handlePlanTrip = () => {
    //     if (!user) {
    //         if (window.confirm("You need to be logged in to plan a trip. Do you want to log in?")) {
    //             navigate('/login');
    //         }
    //         return;
    //     }
    //     // Тут можна додати логіку додавання подорожі, але поки що просто повідомлення
    //     alert(`Trip to ${place.name} planned!`);
    // };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    // Фіктивні дані для турів, готелів та відгуків
    const tours = [
        {
            id: 1,
            company: 'Adventure Tours',
            dates: '2025-05-01 to 2025-05-07',
            hotel: 'Luxury Hotel',
            breakfast: true,
            price: 1200
        },
        {
            id: 2,
            company: 'Budget Travels',
            dates: '2025-06-15 to 2025-06-20',
            hotel: 'Hostel',
            breakfast: false,
            price: 500
        }
    ];
    
    return (
        <div>
            <Header />
            <div className="place-view-container">
                <div className="place-hero">
                    <img src={place.image} alt={place.name} className="place-hero-image" />
                    <div className="place-hero-overlay">
                        <h1>{place.name}</h1>
                        <div className="place-stats">
                            <span>⭐ {place.rating}</span>
                            <span>•</span>
                            <span>{place.views} views</span>
                            {/* <span>•</span>
                            <span>€{place.price}</span> */}
                        </div>
                    </div>
                </div>

                <div className="place-details">
                    <div className="place-description">
                        <h2>About {place.name}</h2>
                        <p>{place.description}</p>
                        {/* <button className="plan-trip-btn" onClick={handlePlanTrip}>
                            Plan Trip Now
                        </button> */}
                    </div>

                    <div className="available-tours">
                        <h2>Available Tours</h2>
                        <div className="tours-grid">
                            {tours.map(tour => (
                                <div key={tour.id} className="tour-card tile">
                                    <div className="tour-head">
                                        <h3>{tour.company}</h3>
                                        <div className="tour-price">€{tour.price}</div>
                                    </div>
                                    <div className="tour-body">
                                        <p className="tour-dates"><strong>Dates:</strong> {tour.dates}</p>
                                        <p className="tour-hotel"><strong>Hotel:</strong> {tour.hotel}</p>
                                        <div className="tour-breakfast">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={breakfastSelection[tour.id] ?? tour.breakfast}
                                                    onChange={() =>
                                                        setBreakfastSelection(prev => ({
                                                            ...prev,
                                                            [tour.id]: !(prev[tour.id] ?? tour.breakfast)
                                                        }))
                                                    }
                                                />
                                                <span style={{ marginLeft: 8 }}>{(breakfastSelection[tour.id] ?? tour.breakfast) ? 'Breakfast' : 'No breakfast'}</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="tour-actions">
                                        <button
                                            className="book-tour-btn"
                                            onClick={async () => {
                                                const tripToAdd = {
                                                    name: place.name,
                                                    image: place.image,
                                                    date: tour.dates,
                                                    price: tour.price,
                                                    company: tour.company,
                                                    hotel: tour.hotel,
                                                    breakfast: breakfastSelection[tour.id] ?? tour.breakfast,
                                                    placeId: place.firebaseId || place.id,
                                                    status: 'planned'
                                                };
                                                try {
                                                    await addTrip(tripToAdd);
                                                    toast.success('Trip booked — added to My Travels');
                                                } catch (err) {
                                                    console.error('Booking failed', err);
                                                    toast.error('Failed to book tour');
                                                }
                                            }}
                                        >Book Now</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="reviews-section">
                        <h2>Reviews</h2>
                        <div className="reviews-list">
                            {localReviews.map(review => (
                                <div key={review.id} className="review-card">
                                    <div className="review-header">
                                        <span className="review-user">{review.user}</span>
                                        <span className="review-rating">⭐ {review.rating}/5</span>
                                    </div>
                                    <p className="review-comment">{review.comment}</p>
                                </div>
                            ))}
                        </div>

                        <div className="leave-review">
                            <h3>Leave a review</h3>
                            <div className="review-form">
                                <div className='star-rating'>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            className={`star ${star <= newRating ? 'active' : ''}`}
                                            onClick={() => setNewRating(star)}
                                            title={`${star} star`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <label>
                                    Comment:
                                    <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={4} />
                                </label>
                                <button
                                    className="submit-review-btn"
                                    onClick={() => {
                                        if (!newComment.trim()) {
                                            toast.error('Please write a comment');
                                            return;
                                        }
                                        const reviewer = user?.displayName || user?.email?.split('@')[0] || 'Anonymous';
                                        const newRev = {
                                            id: Date.now(),
                                            user: reviewer,
                                            rating: newRating,
                                            comment: newComment.trim()
                                        };
                                        setLocalReviews(prev => [newRev, ...prev]);
                                        setNewComment('');
                                        setNewRating(5);
                                        toast.success('Review added');
                                    }}
                                >Submit Review</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default PlaceView;