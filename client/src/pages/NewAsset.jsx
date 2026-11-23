// Create asset page component
import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import NavBar from '../components/NavBar';

const assets_url = '/api/assets';
const categories_url = '/api/categories';

function NewAsset() {
    const [assetName, setAssetName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');

    // categories for the dropdown, loaded from server
    const [categories, setCategories] = useState([]);

    const [inputErrors, setInputErrors] = useState({});
    const [serverError, setServerError] = useState('');

    const navigate = useNavigate();

    // loads category list once when page first renders
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const serverResponse = await fetch(categories_url, {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
                });
                const data = await serverResponse.json();
                if (serverResponse.ok) setCategories(data);
            } catch (err) {
                setServerError('Could not load categories.');
            }
        };
        loadCategories();
    }, []);

    const createAsset = async (event) => {
        event.preventDefault();
        setInputErrors({});
        setServerError('');

        try {
            const serverResponse = await fetch(assets_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    asset_name: assetName,
                    category_id: categoryId,
                    brand: brand,
                    model: model,
                    serial_number: serialNumber,
                    purchase_date: purchaseDate
                })
            });

            const data = await serverResponse.json();

            if (!serverResponse.ok) {
                if (data.errors) setInputErrors(data.errors);
                else setServerError(data.error);
                return;
            }

            // on success, goes back to asset list
            navigate('/assets');
        } catch (err) {
            setServerError('Server connection failed. Please try again.');
        }
    };

        return (
        <>
            <NavBar />
            <div className="page">
                <h1 className="page-title">Add an asset</h1>
                <p className="page-sub">Enter the details of the item you want to track.</p>

                <form onSubmit={createAsset}>
                    <div>
                        <label htmlFor="assetName">Asset name</label>
                        <input
                            id="assetName"
                            value={assetName}
                            onChange={(e) => setAssetName(e.target.value)}
                        />
                        {inputErrors.asset_name && <p className="error-text">{inputErrors.asset_name}</p>}
                    </div>

                    <div>
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        {inputErrors.category_id && <p className="error-text">{inputErrors.category_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="brand">Brand</label>
                        <input
                            id="brand"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                        {inputErrors.brand && <p className="error-text">{inputErrors.brand}</p>}
                    </div>

                    <div>
                        <label htmlFor="model">Model</label>
                        <input
                            id="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        />
                        {inputErrors.model && <p className="error-text">{inputErrors.model}</p>}
                    </div>

                    <div>
                        <label htmlFor="serialNumber">Serial number</label>
                        <input
                            id="serialNumber"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                        />
                        {inputErrors.serial_number && <p className="error-text">{inputErrors.serial_number}</p>}
                    </div>

                    <div>
                        <label htmlFor="purchaseDate">Purchase date</label>
                        {/* date input gives the browser's calendar picker */}
                        <input
                            id="purchaseDate"
                            type="date"
                            value={purchaseDate}
                            onChange={(e) => setPurchaseDate(e.target.value)}
                        />
                        {inputErrors.purchase_date && <p className="error-text">{inputErrors.purchase_date}</p>}
                    </div>

                    <button type="submit">Create asset</button>
                </form>

                {serverError && <p className="error-text">{serverError}</p>}

                <p style={{marginTop: '18px'}}><Link to="/assets">Back to my assets</Link></p>
            </div>
        </>
    );
}

export default NewAsset;