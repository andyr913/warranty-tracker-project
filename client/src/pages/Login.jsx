// Login page component
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../AuthContext';

const api_url = 'http://localhost:3001/api/auth/login';

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
            // stores response from POST request to server's login endpoint with email and password
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

        } catch (err) {setError('Server connection failed. Please try again.')}
    }
    return (
        <div>
            <h1>Log in</h1>
            <form onSubmit = {loginUser}>
                <div>
                    <label htmlFor = "email">Email</label>
                    <input 
                        id = "email" 
                        value = {email} 
                        onChange = {(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor = "password">Password</label>
                    <input 
                        id = "password" 
                        type = "password"
                        value = {password} 
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p style = {{color: 'red'}}>{error}</p>}
                <button type = "submit">Log in</button>
            </form>

        </div>
    );
}

export default Login;