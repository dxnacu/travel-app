import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import Budget from './pages/Budget';
import MyTravels from './pages/MyTravels';
import PlacesToVisit from './pages/PlacesToVisit';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PlaceView from './components/PlaceView';
import { PlannedTripsProvider } from './context/plannedTripsContext';
import { UserProvider } from './context/userContext';

function App() {
  return (
    <UserProvider>
      <PlannedTripsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/my-travels" element={<MyTravels />} />
            <Route path="/places-to-visit" element={<PlacesToVisit />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/places/:id" element={<PlaceView />} />
          </Routes>
        </Router>
      </PlannedTripsProvider>
    </UserProvider>
  );
}

export default App;