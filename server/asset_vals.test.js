const {checkAssetName, checkBrand, checkModel, checkSerial, checkPurchaseDate, checkAsset}
    = require('./asset_vals');

describe('checkAssetName', () => {
    // UT-06
    test('Rejects an asset name shorter than 4 characters', () => {
        const result = checkAssetName('TV');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Asset name must have at least 4 characters');
    });
    // UT-07
    test('Rejects an asset name longer than 50 characters', () => {
        const result = checkAssetName('A'.repeat(51));
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Asset name cannot be longer than 50 chars');
    });
    test('Accepts exactly 4 characters', () => {
        expect(checkAssetName('iMac').valid).toBe(true);
    });
    test('Accepts exactly 50 characters', () => {
        expect(checkAssetName('A'.repeat(50)).valid).toBe(true);
    });
    test('Rejects an empty asset name', () => {
        expect(checkAssetName('').valid).toBe(false);
    });

    test('Error message when asset name is whitespace only', () => {
        expect(checkAssetName('    ').valid).toBe(false);
    });
    test('Error message when asset name is undefined', () => {
        expect(checkAssetName(undefined).valid).toBe(false);
    });
});

describe('checkBrand', () => {
    // UT-08
    test('Rejects an empty brand', () => {
        const result = checkBrand('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Required field');
    });
    test('accepts a single character brand', () => {
        expect(checkBrand('A').valid).toBe(true);
    });
    test('rejects a brand longer than 50 characters', () => {
        expect(checkBrand('A'.repeat(51)).valid).toBe(false);
    });
    test('Error message when brand is whitespace only', () => {
        expect(checkBrand('   ').valid).toBe(false);
    });
    test('Accepts brand with exactly 50 characters', () => {
        expect(checkBrand('A'.repeat(50)).valid).toBe(true);
    });
});

describe('checkModel', () => {
    // UT-09
    test('rejects a model containing special characters', () => {
        const result = checkModel('Model #1');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Model can only contain letters and numbers');
    });
    test('rejects a model shorter than 2 characters', () => {
        expect(checkModel('A').valid).toBe(false);
    });
    test('accepts an alphanumeric model', () => {
        expect(checkModel('A2338').valid).toBe(true);
    });
    test('Error message when model is longer than 50 chars', () => {
        const result = checkModel('A'.repeat(51));
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Model cannot be longer than 50 chars');
    });
    test('Accepts model with exactly 2 characters', () => {
        expect(checkModel('A1').valid).toBe(true);
    });
    test('Accepts model with exactly 50 characters', () => {
        expect(checkModel('A'.repeat(50)).valid).toBe(true);
    });
    test('Error message when model is undefined', () => {
        expect(checkModel(undefined).valid).toBe(false);
    });
});

describe('checkSerial', () => {
    // UT-10
    test('rejects a serial containing an underscore', () => {
        const result = checkSerial('SN_123');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Serial number can only contain letters, numbers, and hyphens');
    });
    test('rejects a serial shorter than 5 characters', () => {
        expect(checkSerial('SN12').valid).toBe(false);
    });
    test('accepts letters, numbers and hyphens', () => {
        expect(checkSerial('C02XL-1234').valid).toBe(true);
    });
    test('Error message when serial is longer than 50 chars', () => {
        const result = checkSerial('A'.repeat(51));
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Serial number cannot be longer than 50 chars');
    });
    test('Accepts serial with exactly 5 characters', () => {
        expect(checkSerial('AB-12').valid).toBe(true);
    });
    test('Accepts serial with exactly 50 characters', () => {
        expect(checkSerial('A'.repeat(50)).valid).toBe(true);
    });
    test('Error message when serial is undefined', () => {
        expect(checkSerial(undefined).valid).toBe(false);
    });
});

describe('checkPurchaseDate', () => {
    // UT-11
    test('rejects a date in the future', () => {
        const result = checkPurchaseDate('2027-01-01');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Purchase date cannot be in the future');
    });
    test('rejects a date that does not exist', () => {
        expect(checkPurchaseDate('2026-02-30').valid).toBe(false);
    });
    test('rejects a badly formatted date', () => {
        expect(checkPurchaseDate('15/03/2024').valid).toBe(false);
    });
    test('accepts a past date', () => {
        expect(checkPurchaseDate('2024-03-15').valid).toBe(true);
    });
    test('Error message when purchase date is empty', () => {
        const result = checkPurchaseDate('');
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Required field');
    });
    test('Error message when purchase date is undefined', () => {
        expect(checkPurchaseDate(undefined).valid).toBe(false);
    });
    test('Accepts today as the purchase date', () => {
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        expect(checkPurchaseDate(today).valid).toBe(true);
    });
    test('Accepts a valid leap day', () => {
        expect(checkPurchaseDate('2024-02-29').valid).toBe(true);
    });
    test('Error message when month is out of range', () => {
        expect(checkPurchaseDate('2024-13-01').valid).toBe(false);
    });
});

describe('checkAsset', () => {
    test('valid input maps to a new asset object', () => {
        const result = checkAsset('MacBook Pro', 'Apple', 'A2338', 'C02XL-1234', '2024-03-15');
        expect(result.valid).toBe(true);
        expect(result.asset).toEqual({
            asset_name: 'MacBook Pro',
            brand: 'Apple',
            model: 'A2338',
            serial_number: 'C02XL-1234',
            purchase_date: '2024-03-15'
        });
    });
    test('collects errors from every failing field at once', () => {
        const result = checkAsset('TV', '', 'Model #1', 'SN_123', '2027-01-01');
        expect(result.valid).toBe(false);
        expect(Object.keys(result.errors)).toEqual(
            ['asset_name', 'brand', 'model', 'serial_number', 'purchase_date']
        );
    });
    test('Trims all asset fields', () => {
        const result = checkAsset('  MacBook Pro  ', '  Apple  ', '  A2338  ', '  C02XL-1234  ', '  2024-03-15  ');
        expect(result.asset).toEqual({
            asset_name: 'MacBook Pro',
            brand: 'Apple',
            model: 'A2338',
            serial_number: 'C02XL-1234',
            purchase_date: '2024-03-15'
        });
    });
    test('Returns only a model error when only model is not valid', () => {
        const result = checkAsset('MacBook Pro', 'Apple', 'Model #1', 'C02XL-1234', '2024-03-15');
        expect(result.valid).toBe(false);
        expect(Object.keys(result.errors)).toEqual(['model']);
    });
    test('Does not return an asset object when validation fails', () => {
        const result = checkAsset('TV', '', 'Model #1', 'SN_123', '2027-01-01');
        expect(result.asset).toBeUndefined();
    });
});