// Register page component
import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';

const api_url = 'http://localhost:3001/api/auth/register';

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
                headers: { 'Content-Type': 'application/json'},
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

        } catch (error) {setServerError('Server connection failed. Please try again.')}
    }

    return (
        <div>
            <h1>Create an account</h1>
            <form onSubmit={registerUser}>
                <div>
                    <label htmlFor = "firstName">First Name</label>
                    <input 
                        id = "firstName" 
                        value = {firstName} 
                        onChange = {(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor = "lastName">Last Name</label>
                    <input 
                        id = "lastName" 
                        value = {lastName} 
                        onChange = {(e) => setLastName(e.target.value)}
                    />
                </div>
                {inputErrors.name && <p style = {{color: 'red'}}>{inputErrors.name}</p>}
                <div>
                    <label htmlFor = "email">Email</label>
                    <input 
                        id = "email" 
                        value = {email} 
                        onChange = {(e) => setEmail(e.target.value)}
                    />
                </div>
                {inputErrors.email && <p style = {{color: 'red'}}>{inputErrors.email}</p>}

                <div>
                    <label htmlFor = "password">Password</label>
                    <input 
                        id = "password" 
                        type = "password"
                        value = {password} 
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                </div>
                {inputErrors.password && <p style = {{color: 'red'}}>{inputErrors.password}</p>}

                <button type = "submit">Register</button>
            </form>
                {serverError && <p style = {{color: 'red'}}>{serverError}</p>}
        </div>
    );
}

export default Register;