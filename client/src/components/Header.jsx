import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { logout } from '../services/authService';
import '../styles/general.css';

const Header = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null); // Clear user state after logout
            navigate('/'); // Redirect to home after logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header>
            <div className="logo"><Link to="/">Traveller</Link></div>
            <nav>
                <NavLink to="/places-to-visit" 
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Places To Visit
                </NavLink>
                <NavLink to="/my-travels"
                    className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    My Travels
                </NavLink>
                {user && (
                    <>
                        <NavLink to="/budget"
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            Budget
                        </NavLink>
                    </>
                )}
            </nav>

            {user ? (
                <button className="logout-btn" onClick={handleLogout}>Log out</button>
            ) : (
                <Link to="/login" className="login-link">
                    <button className="login-btn">Log in</button>
                </Link>
            )}
        </header>
    );
};

export default Header;