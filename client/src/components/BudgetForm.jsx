import "../styles/budget.css";
import "../styles/general.css";
import { useState } from "react";

const destinations = [
  { value: "paris", label: "Paris (€100/day)", price: 100 },
  { value: "tokyo", label: "Tokyo (€150/day)", price: 150 },
  { value: "bali", label: "Bali (€80/day)", price: 80 },
  { value: "rome", label: "Rome (€120/day)", price: 120 },
];

export default function BudgetForm() {
    const [selectedTrip, setSelectedTrip] = useState(destinations[0]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [trips, setTrips] = useState([]);
    const [totalCost, setTotalCost] = useState(0);

    function handleAddTrip() {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if(isNaN(start) || isNaN(end) || end < start) {
            alert("Please enter valid start and end dates.");
            return;
        }

        const days = Math.ceil((end - start) / (1000 * 3600 * 24)) + 1;
        const tripCost = selectedTrip.price * days;

        const newTrip = {
            destination: selectedTrip.label,
            days,
            pricePerDay: selectedTrip.price,
            total: tripCost
        };

        setTrips([...trips, newTrip]);
        setTotalCost(totalCost + tripCost);
    }

    return (
        <section className="budget-section">
            <h1>Plan Your Travel Budget</h1>
            <p>Select destinations and travel dates to estimate your budget.</p>
            <p>You can add multiple trips</p>

            <form onSubmit={(e) => e.preventDefault()} id="budget-form">
                <label for="trip">Select Destination</label>
                <select id="trip" 
                    value={selectedTrip.value} 
                    onChange={(e) => setSelectedTrip(destinations.find(d => d.value === e.target.value))}
                >
                    {destinations.map((dest) => (
                        <option key={dest.value} value={dest.value}>
                            {dest.label}
                        </option>
                    ))}
                </select>

                <label htmlFor="start-date">Start Date</label>
                <input 
                    type="date" 
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />

                <label htmlFor="end-date">End Date</label>
                <input 
                    type="date" 
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />

                <button type="button" className="add-btn" onClick={handleAddTrip}>Add Trip</button>
            </form>

            <div className="budget-summary">
                <h2>Your Trips</h2>
                <ul id="trip-list">
                    {trips.map((trip, index) => (
                        <li key={index}>
                            {trip.destination}: {trip.days} day(s) * €{trip.pricePerDay} = €{trip.total}
                        </li>
                    ))}
                </ul>
                <h3>Total Cost: <span id="total-cost">€{totalCost}</span></h3>
            </div>
        </section>
    );
}