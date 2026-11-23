// Login page component
import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {useAuth} from '../AuthContext';

const api_url = '/api/auth/login';

function Login() {
    // tracks the state of input fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // tracks error message returned by the server
    const [error, setError] = useState('');

    // imports login function from saved context
    const {login} = useAuth();
    // hook to navigate to dashboard on successful login
    const navigate = useNavigate();

    // log in button handler
    const loginUser = async (event) => {
        // prevents page reloading when login button is clicked
        event.preventDefault();
        // resets error each time log in is clicked
        setError('');

        try {
            // stores response from POST request to server's login endpoint
            const serverResponse = await fetch(api_url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            const data = await serverResponse.json();

            // if server responded with an error, sets error to display
            if (!serverResponse.ok) {
                setError(data.error);
                return;
            }

            // otherwise saves user's login status and redirects to main dashboard
            login(data.token, data.user);
            navigate('/dashboard');

        } catch (err) {
            setError('Server connection failed. Please try again.');
        }
    }

    return (
        <div className="auth-page">
            {/* left side panel */}
            <div className="auth-panel">
                <div className="brand">
                    <div className="brand-mark">AT</div>
                    <div className="brand-text">
                        <div className="brand-name">AssetTracker</div>
                        <div className="brand-sub">Warranty &amp; Maintenance</div>
                    </div>
                </div>

                <h2 className="auth-headline">Manage All Your Assets in One Place</h2>
                <p className="auth-blurb">
                    Track warranties, log maintenance, and organize documents
                    for all your personal assets.
                </p>

                <div className="auth-feature">
                    <div className="auth-tick">&#10003;</div>
                    <div>
                        <strong>Track Warranty Status</strong>
                        <span>Get alerts before warranties expire</span>
                    </div>
                </div>
                <div className="auth-feature">
                    <div className="auth-tick">&#10003;</div>
                    <div>
                        <strong>Maintenance History</strong>
                        <span>Log all services and repairs</span>
                    </div>
                </div>
                <div className="auth-feature">
                    <div className="auth-tick">&#10003;</div>
                    <div>
                        <strong>Document Storage</strong>
                        <span>Store receipts and warranty documents</span>
                    </div>
                </div>
            </div>

            {/* login form */}
            <div className="auth-side">
                <div className="auth-box">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to manage your assets</p>

                    <form onSubmit={loginUser}>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && <p className="error-text">{error}</p>}

                        <button type="submit">Sign In</button>
                    </form>

                    <div className="auth-divider"><span>New to AssetTracker?</span></div>

                    <Link to="/register" className="btn-secondary">Create an Account</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;