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
        expect(result.error).toBe('First and last name must each be 50 or fewer characters');
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