// MainDashboard component
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';

function MainDashboard() {
    // gets logged in user and logout function from saved context
    const {user, logout} = useAuth();
    // hook to navigate to login if user logs out
    const navigate = useNavigate();

    // logout click handler
    const logoutUser = () => {
        // deletes user details from local storage and redirects user to login
        logout();
        navigate('/login');
    }
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user.first_name}!</p>
            <button onClick = {logoutUser}>Log out</button>
        </div>
    );
}

export default MainDashboard;