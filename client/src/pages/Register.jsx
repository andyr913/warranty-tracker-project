// Register page component
import {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';

const api_url = 'http://localhost:3001/api';

function Register() {
    // tracks the state of each input field
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <h1>Create an account</h1>
            <form>
                <div>
                    <label htmlFor = "firstName">First Name</label>
                    <input 
                        id = "firstName" 
                        value = {firstName} 
                        onChange = {(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor = "lasstName">Last Name</label>
                    <input 
                        id = "lastName" 
                        value = {lastName} 
                        onChange = {(e) => setLastName(e.target.value)}
                    />
                </div>
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
                        value = {password} 
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type = "submit">Register</button>
            </form>
        </div>
    );
}

export default Register;