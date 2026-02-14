import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/api";
import "./UserDashboard.css";

const UserDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await API.get("/orders");
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="user-dashboard">
            <h1>My Dashboard</h1>
            <p>Welcome back, {user?.name}!</p>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Total Orders</h3>
                    <p className="stat-number">{orders.length}</p>
                    <Link to="/orders" className="card-link">View All Orders →</Link>
                </div>

                <div className="dashboard-card">
                    <h3>Profile</h3>
                    <p>{user?.email}</p>
                    <Link to="/profile/edit" className="card-link">Edit Profile →</Link>
                </div>

                <div className="dashboard-card">
                    <h3>Shopping</h3>
                    <p>Browse our products</p>
                    <Link to="/products" className="card-link">Shop Now →</Link>
                </div>
            </div>

            {orders.length > 0 && (
                <div className="recent-orders">
                    <h2>Recent Orders</h2>
                    <div className="orders-list">
                        {orders.slice(0, 5).map((order) => (
                            <div key={order._id} className="order-item">
                                <div className="order-info">
                                    <h4>Order #{order._id.slice(-6)}</h4>
                                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    <p className="order-total">₹{order.totalPrice}</p>
                                </div>
                                <span className={`order-status ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;
