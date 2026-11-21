// this file contains validation functions for asset creation - name, brand, model, serial, purchase date

// asset name validation
function checkAssetName(assetName) {
    if (!assetName || assetName.trim().length === 0)
        return {valid: false, error: "Required field"};
    if (assetName.trim().length < 4)
        return {valid: false, error: "Asset name must have at least 4 characters"};
    if (assetName.trim().length > 50)
        return {valid: false, error: "Asset name cannot be longer than 50 chars"};

    return {valid: true};
}

// brand validation
function checkBrand(brand) {
    if (!brand || brand.trim().length === 0)
        return {valid: false, error: "Required field"};
    if (brand.trim().length > 50)
        return {valid: false, error: "Brand cannot be longer than 50 chars"};

    return {valid: true};
}

// model validation - alphanumeric only
function checkModel(model) {
    if (!model || model.trim().length === 0)
        return {valid: false, error: "Required field"};
    if (model.trim().length < 2)
        return {valid: false, error: "Model must have at least 2 characters"};
    if (model.trim().length > 50)
        return {valid: false, error: "Model cannot be longer than 50 chars"};
    // ^ and $ anchor the match to the whole string, so any other char fails
    if (!/^[A-Za-z0-9]+$/.test(model.trim()))
        return {valid: false, error: "Model can only contain letters and numbers"};

    return {valid: true};
}

// serial number validation - alphanumeric and hyphen only
function checkSerial(serialNumber) {
    if (!serialNumber || serialNumber.trim().length === 0)
        return {valid: false, error: "Required field"};
    if (serialNumber.trim().length < 5)
        return {valid: false, error: "Serial number must have at least 5 characters"};
    if (serialNumber.trim().length > 50)
        return {valid: false, error: "Serial number cannot be longer than 50 chars"};
    // hyphen is placed last inside the brackets so it's treated as a literal
    if (!/^[A-Za-z0-9-]+$/.test(serialNumber.trim()))
        return {valid: false, error: "Serial number can only contain letters, numbers, and hyphens"};

    return {valid: true};
}

// purchase date validation - must be a valid date, not in future
function checkPurchaseDate(purchaseDate) {
    if (!purchaseDate || purchaseDate.trim().length === 0)
        return {valid: false, error: "Required field"};

    const dateString = purchaseDate.trim();

    // date input sends YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString))
        return {valid: false, error: "Invalid value"};

    const [year, month, day] = dateString.split('-').map(Number);
    // builds date in UTC so that timezone does not break the comparison
    const entered = new Date(Date.UTC(year, month - 1, day));

    // catches dates that do not exist, like Feb 30th
    if (entered.getUTCFullYear() !== year
        || entered.getUTCMonth() !== month - 1
        || entered.getUTCDate() !== day)
        return {valid: false, error: "Invalid value"};

    const now = new Date();
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    if (entered > today)
        return {valid: false, error: "Purchase date cannot be in the future"};

    return {valid: true};
}

// checks all asset validations together
// returns an errors object upon failure, or asset object upon success
function checkAsset(assetName, brand, model, serialNumber, purchaseDate) {
    const errors = {};

    const nameCheck = checkAssetName(assetName);
    const brandCheck = checkBrand(brand);
    const modelCheck = checkModel(model);
    const serialCheck = checkSerial(serialNumber);
    const dateCheck = checkPurchaseDate(purchaseDate);

    if (!nameCheck.valid) errors.asset_name = nameCheck.error;
    if (!brandCheck.valid) errors.brand = brandCheck.error;
    if (!modelCheck.valid) errors.model = modelCheck.error;
    if (!serialCheck.valid) errors.serial_number = serialCheck.error;
    if (!dateCheck.valid) errors.purchase_date = dateCheck.error;

    if (Object.keys(errors).length > 0)
        return {valid: false, errors};

    return {
        valid: true,
        asset: {
            asset_name: assetName.trim(),
            brand: brand.trim(),
            model: model.trim(),
            serial_number: serialNumber.trim(),
            purchase_date: purchaseDate.trim()
        }
    };
}

module.exports = {checkAssetName, checkBrand, checkModel, checkSerial, checkPurchaseDate, checkAsset};