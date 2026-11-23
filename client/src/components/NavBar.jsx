// top navigation bar shown on every logged in page
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';

function NavBar() {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const logoutUser = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="brand">
                <div className="brand-mark">AT</div>
                <div className="brand-text">
                    <div className="brand-name">AssetTracker</div>
                    <div className="brand-sub">Warranty &amp; Maintenance</div>
                </div>
            </Link>

            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/assets">Assets</Link>
            </div>

            <div className="nav-right">
                <span className="nav-user">{user.first_name} {user.last_name}</span>
                <button className="nav-logout" onClick={logoutUser}>Log out</button>
            </div>
        </nav>
    );
}

export default NavBar;