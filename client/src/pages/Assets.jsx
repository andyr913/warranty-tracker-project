// Assets list component
import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import NavBar from '../components/NavBar';

const api_url = '/api/assets';

function Assets() {
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // loads user's assets from the server
    const loadAssets = async () => {
        try {
            const serverResponse = await fetch(api_url, {
                headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
            });
            const data = await serverResponse.json();

            if (!serverResponse.ok) {
                setError(data.error);
                return;
            }

            setAssets(data);
        } catch (err) {
            setError('Server connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // useEffect with empty array runs once after the component first renders
    useEffect(() => {
        loadAssets();
    }, []);

    // deletes an asset then reloads the list
    const deleteAsset = async (assetId) => {
        try {
            const serverResponse = await fetch(api_url + '/' + assetId, {
                method: 'DELETE',
                headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
            });

            if (!serverResponse.ok) {
                const data = await serverResponse.json();
                setError(data.error);
                return;
            }

            loadAssets();
        } catch (err) {
            setError('Server connection failed. Please try again.');
        }
    };

        if (loading) {
        return (
            <>
                <NavBar />
                <div className="page"><p>Loading assets...</p></div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="page">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">My Assets</h1>
                        <p className="page-sub">Everything you are tracking warranties for.</p>
                    </div>
                    <Link to="/assets/new" className="btn-link">Add an asset</Link>
                </div>

                {error && <p className="error-text">{error}</p>}

                {assets.length === 0 ? (
                    <p>You have not added any assets yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Serial Number</th>
                                <th>Purchase Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset.asset_id}>
                                    <td><strong>{asset.asset_name}</strong></td>
                                    <td>{asset.category_name}</td>
                                    <td>{asset.brand}</td>
                                    <td>{asset.model}</td>
                                    <td>{asset.serial_number}</td>
                                    {/* splits the ISO timestamp so the date is not shifted by timezone */}
                                    <td>{asset.purchase_date.split('T')[0]}</td>
                                    <td>
                                        <button onClick={() => deleteAsset(asset.asset_id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Assets;