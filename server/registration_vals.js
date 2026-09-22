// this file contains validation functions for user registration - full name, email, password

// full name validation
function checkName(firstName, lastName) {
    if ((!firstName || firstName.trim().length === 0) && (!lastName || lastName.trim().length === 0))
        return {valid: false, error: "Please enter first and last name"};
    if (!firstName || firstName.trim().length === 0)
        return {valid: false, error: "Please enter first name"};
    if (!lastName || lastName.trim().length === 0)
        return {valid: false, error: "Please enter last name"};
    if (firstName.trim().length > 50 || lastName.trim().length > 50)
        return {valid: false, error: "First and last name must each be 50 or fewer characters"};
    
    return {valid: true};
}

// email validation
function checkEmail(email) {
    // checks for empty email field
    if (!email || email.trim().length === 0)
        return {valid: false, error: "Required field"};
    // checks for valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        return {valid: false, error: "Invalid email format. Must be: 'username@domain.tld'"};

    return {valid: true};
}

// password validation
function checkPassword(password) {
    // checks for min/max password length
    if (!password || password.trim().length === 0) 
        return {valid: false, error: "Required field"};
    if (password.length < 8) 
        return {valid: false, error: "Password must have at least 8 characters"};
    // extra validation to keep pw short enough for bcrypt hashing
    if (password.length > 50)
        return {valid: false, error: "Password cannot be longer than 50 chars"};
    // regex checks for uppercase, lowercase, number, special char
    if (!/[A-Z]/.test(password))
        return {valid: false, error: "Password must have at least one uppercase letter"};
    if (!/[a-z]/.test(password))
        return {valid: false, error: "Password must have at least one lowercase letter"};
    if (!/[0-9]/.test(password))
        return {valid: false, error: "Password must have at least one number"};
    if (!/[^A-Za-z0-9]/.test(password))
        return {valid: false, error: "Password must have at least one special character (non-alphanumeric)"};

    return {valid: true};
}

module.exports = {checkName, checkEmail, checkPassword};