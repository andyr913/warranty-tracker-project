// Register page component
import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';

const api_url = '/api/auth/register';

function Register() {
    // tracks the state of each input field
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // tracks input error messages returned by registration validation on server
    const [inputErrors, setInputErrors] = useState({});
    // tracks other server errors
    const [serverError, setServerError] = useState('');

    // hook for redirecting to login on successful registration
    const navigate = useNavigate();

    const registerUser = async (event) => {
        // prevents page reloading when register button is clicked
        event.preventDefault();

        // resets error messages each time this function runs
        setInputErrors({});
        setServerError('');

        try {
            // sends POST request to server's register endpoint
            const serverResponse = await fetch(api_url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: password
                })
            });

            const data = await serverResponse.json();

            // if server response is not a 200 code, sets errors to display and re renders component
            if (!serverResponse.ok) {
                // if server returned 'errors' set errors, else if 'error' then set auth error
                if (data.errors) setInputErrors(data.errors);
                else setServerError(data.error);

                return;
            }

            // otherwise redirects to login
            navigate('/login');

        } catch (error) {
            setServerError('Server connection failed. Please try again.');
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

            {/* registration form */}
            <div className="auth-side">
                <div className="auth-box">
                    <h1 className="auth-title">Create an Account</h1>

                    <form onSubmit={registerUser}>
                        <div>
                            <label htmlFor="firstName">First Name</label>
                            <input
                                id="firstName"
                                placeholder="Andres"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                id="lastName"
                                placeholder="Rosas"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            {inputErrors.name && <p className="error-text">{inputErrors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {inputErrors.email && <p className="error-text">{inputErrors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {inputErrors.password && <p className="error-text">{inputErrors.password}</p>}
                        </div>

                        {serverError && <p className="error-text">{serverError}</p>}

                        <button type="submit">Create Account</button>
                    </form>

                    <div className="auth-divider"><span>Already have an account?</span></div>

                    <Link to="/login" className="btn-secondary">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;