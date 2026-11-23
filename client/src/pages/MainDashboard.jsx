// MainDashboard component
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../AuthContext';
import NavBar from '../components/NavBar';

const assets_url = '/api/assets';

function MainDashboard() {
    // gets logged in user from saved context
    const {user} = useAuth();

    const [assets, setAssets] = useState([]);

    // loads the user's assets once so the summary cards can count them
    useEffect(() => {
        const loadAssets = async () => {
            try {
                const serverResponse = await fetch(assets_url, {
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')}
                });
                const data = await serverResponse.json();
                if (serverResponse.ok) setAssets(data);
            } catch (err) {
                // dashboard still renders with zero counts if this fails
            }
        };
        loadAssets();
    }, []);

    // counts how many different categories the user's assets belong to
    const categoryCount = new Set(assets.map((asset) => asset.category_name)).size;

    return (
        <>
            <NavBar />
            <div className="page">
                <h1 className="page-title">Welcome back, {user.first_name}!</h1>
                <p className="page-sub">Here's what's happening with your assets today.</p>

                <div className="stat-row">
                    <div className="stat-card">
                        <div className="stat-value">{assets.length}</div>
                        <div className="stat-label">Total Assets</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{categoryCount}</div>
                        <div className="stat-label">Categories Used</div>
                    </div>
                </div>

                <h2 className="page-title" style={{fontSize: '1.2rem'}}>Recent Assets</h2>

                {assets.length === 0 ? (
                    <p className="page-sub">
                        You have not added any assets yet. <Link to="/assets/new">Add your first one</Link>.
                    </p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Purchase Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* slice(0, 5) shows only the five most recent */}
                            {assets.slice(0, 5).map((asset) => (
                                <tr key={asset.asset_id}>
                                    <td>{asset.asset_name}</td>
                                    <td>{asset.category_name}</td>
                                    <td>{asset.brand}</td>
                                    <td>{asset.purchase_date.split('T')[0]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <p style={{marginTop: '20px'}}>
                    <Link to="/assets">View all assets →</Link>
                </p>
            </div>
        </>
    );
}

export default MainDashboard;