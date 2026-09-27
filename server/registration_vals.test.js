const {checkName, checkEmail, 
    checkPassword, checkRegistration} = require('./registration_vals.js');

describe('checkName', () => {
    // UT-01
    test('Error message when both names are empty', () => {
        const result = checkName('', '');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter first and last name');
    });
    // UT-02
    test('Error message when both names are whitespace only', () => {
        const result = checkName('   ', '   ');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter first and last name');
    });
    // UT-03
    test('Error message when both names are undefined', () => {
        const result = checkName(undefined, undefined);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter first and last name');
    });
    // UT-04
    test('Error message when only first name is empty', () => {
        const result = checkName('', 'Rosas');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter first name');
    });
    // UT-05
    test('Error message when only first name is whitespace', () => {
        const result = checkName('  ', 'Rosas');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter first name');
    });
    // UT-06
    test('Error message when only last name is empty', () => {
        const result = checkName('Andres', '');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter last name');
    });
    // UT-07
    test('Error message when only last name is whitespace', () => {
        const result = checkName('Andres', '  ');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Please enter last name');
    });
    // UT-08
    test('Error message when first name is over 50 characters', () => {
        const result = checkName('a'.repeat(51), 'Rosas');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('First and last name cannot be longer than 50 chars each');
    });
    // UT-09
    test('Error message when last name is over 50 characters', () => {
        expect(checkName('Andres', 'a'.repeat(51)).valid).toBe(false);
    });
    // UT-10
    test('Accepts exactly 50 characters for first name and last name', () => {
        expect(checkName('A'.repeat(50), 'R'.repeat(50)).valid).toBe(true);
    });
    // UT-11
    test('Valid names are accepted', () => {
        expect(checkName('Andres', 'Rosas')).toEqual({valid: true});
    });
    // UT-12
    test('Names padded with whitespace are accepted', () => {
        expect(checkName('  Andres  ', '  Rosas  ').valid).toBe(true);
    });
    // UT-13
    test('Names with exactly 50 chars and padded with extra white space are accepted', 
    () => {
        expect(checkName(' ' + 'A'.repeat(50) + ' ', ' ' + 'R'.repeat(50) + ' ').valid).toBe(true);
    });
});

describe('checkEmail', () => {
    // UT-14
    test('Error message when email is empty', () => {
        const result = checkEmail('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Required field');
    });

    // UT-15
    test('Error message when email is whitespace only', () => {
        const result = checkEmail('   ');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Required field');
    });

    // UT-16
    test('Error message when email is undefined', () => {
        const result = checkEmail(undefined);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Required field');
    });

    // UT-17
    test('Error message when email is longer than 300 chars', () => {
        const result = checkEmail('A'.repeat(301));
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Email cannot be longer than 300 chars');
    });

    // UT-18
    test('Emails with exactly 300 chars are accepted', () => {
        expect(checkEmail('A'.repeat(290) + '@abcdef.ca').valid).toBe(true);
    });

    // UT-19
    test('Emails with exactly 300 chars and padded with extra white space are accepted', () => {
        expect(checkEmail('  ' + 'A'.repeat(290) + '@abcdef.ca   ').valid).toBe(true);
    });

    // UT-20
    test('Error message when email has no domain value', () => {
        const result = checkEmail('andres@ca');
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Invalid email format. Must be: 'username@domain.tld'");
    });

    // UT-21
    test('Error message when email has no @ symbol', () => {
        const result = checkEmail('andresmohawk.ca');
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Invalid email format. Must be: 'username@domain.tld'");
    });

    // UT-22
    test('Error message when email has no username value', () => {
        const result = checkEmail('@mohawk.ca');
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Invalid email format. Must be: 'username@domain.tld'");
    });

    // UT-23
    test('Error message when email has a space', () => {
        const result = checkEmail('andres rosas@mohawk.ca');
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Invalid email format. Must be: 'username@domain.tld'");
    });

    // UT-24
    test('Valid email is accepted', () => {
        expect(checkEmail('andres@mohawk.ca').valid).toBe(true);
    });

    // UT-25
    test('Accepts a valid email padded with whitespace', () => {
        expect(checkEmail('  andres@example.com  ').valid).toBe(true);
    });
});


describe('checkPassword', () => {
    test('Error message when password is empty', () => {
        const result = checkPassword('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Required field');
    });

    test('Error message when password is whitespace only', () => {
         const result = checkPassword('   ');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Required field');
    });

    test('Error message when password is undefined', () => {
        const result = checkPassword(undefined);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Required field');
    });

    test('Error message when password is shorter than 8 chars', () => {
        const result = checkPassword('Pass1!a');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password must have at least 8 characters');
    });

    test('Error message when password is longer than 50 chars', () => {
        const result = checkPassword('Pass1!' + 'a'.repeat(45));
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password cannot be longer than 50 chars');
    });

    test('Error message when password has no uppercase letter', () => {
        const result = checkPassword('password1!');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password must have at least one uppercase letter');
    });

    test('Error message when password has no lowercase letter', () => {
        const result = checkPassword('PASSWORD1!');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password must have at least one lowercase letter');
    });

    test('Error message when password has no number', () => {
        const result = checkPassword('Password!');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password must have at least one number');
    });

    test('Error message when password has no special character', () => {
        const result = checkPassword('Password123');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Password must have at least one special character (non-alphanumeric)');
    });

    test('Accepts password with exactly 8 characters', () => {
        expect(checkPassword('Passw1!a').valid).toBe(true);
    });

    test('Accepts password with exactly 50 characters', () => {
        expect(checkPassword('Pass1!' + 'a'.repeat(44)).valid).toBe(true);
    });

    test('Accepts a valid password', () => {
        expect(checkPassword('Password1!').valid).toBe(true);
    });
});


describe('checkRegistration', () => {
    test('Valid input maps to new user object', () => {
        const result = checkRegistration('Andres', 'Rosas', 'andres@mohawk.ca', 'Password1!');
        expect(result.valid).toBe(true);
        expect(result.user).toEqual({
            first_name: 'Andres',
            last_name: 'Rosas',
            email: 'andres@mohawk.ca',
            password: 'Password1!'
        });
    });

    test('Trims names and email, lowercases email', () => {
        const result = checkRegistration('  Andres  ', '  Rosas  ', '  Andres@Mohawk.CA  ', 'Password1!');
        expect(result.user).toEqual({
            first_name: 'Andres',
            last_name: 'Rosas',
            email: 'andres@mohawk.ca',
            password: 'Password1!'
        });
    });

    test('Does not trim or alter password', () => {
        const result = checkRegistration('Andres', 'Rosas', 'andres@mohawk.ca', ' Password1! ');
        expect(result.user.password).toBe(' Password1! ');
    });

    test('Returns only a name error when only name is not valid', () => {
        const result = checkRegistration('', 'Rosas', 'andres@mohawk.ca', 'Password1!');
        expect(result.valid).toBe(false);
        expect(Object.keys(result.errors)).toEqual(['name']);
    });

    test('Returns only an email error when only email is not valid', () => {
        const result = checkRegistration('Andres', 'Rosas', 'andres@com', 'Password1!');
        expect(result.valid).toBe(false);
        expect(Object.keys(result.errors)).toEqual(['email']);
    });

    test('Returns only a password error when only password is not valid', () => {
        const result = checkRegistration('Andres', 'Rosas', 'andres@mohawk.ca', '2short');
        expect(result.valid).toBe(false);
        expect(Object.keys(result.errors)).toEqual(['password']);
    });

    test('Returns errors from every failed check at once', () => {
        const result = checkRegistration('', '', 'bademail', '2short');
        expect(result.valid).toBe(false);
        expect(Object.keys(result.errors)).toEqual(['name', 'email', 'password']);
    });

    test('Does not return a user object when validation fails', () => {
        const result = checkRegistration('', '', 'bad', 'short');
        expect(result.user).toBeUndefined();
    });
});