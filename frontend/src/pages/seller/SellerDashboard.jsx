import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./SellerDashboard.css";

const SellerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [salesData, setSalesData] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, analyticsRes, lowStockRes, ordersRes] = await Promise.all([
                API.get("/seller/dashboard"),
                API.get("/seller/analytics"),
                API.get("/seller/inventory/low-stock?threshold=10"),
                API.get("/seller/orders"),
            ]);

            setStats(statsRes.data);
            setSalesData(analyticsRes.data.salesData || []);
            setLowStockProducts(lowStockRes.data);
            setRecentOrders(ordersRes.data.slice(0, 5)); // Latest 5 orders
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="seller-dashboard">
            <div className="dashboard-header">
                <h1>📊 Seller Dashboard</h1>
                <div className="header-actions">
                    <Link to="/seller/products" className="btn-primary">
                        📦 Manage Products
                    </Link>
                    <Link to="/seller/orders" className="btn-secondary">
                        📋 View All Orders
                    </Link>
                    <Link to="/seller/inventory" className="btn-secondary">
                        📊 Inventory
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card gradient-purple">
                    <div className="stat-icon">📦</div>
                    <div className="stat-content">
                        <h3>Total Products</h3>
                        <p className="stat-number">{stats?.totalProducts || 0}</p>
                    </div>
                </div>
                <div className="stat-card gradient-green">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>Approved Products</h3>
                        <p className="stat-number">{stats?.approvedProducts || 0}</p>
                    </div>
                </div>
                <div className="stat-card gradient-orange">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-content">
                        <h3>Pending Approval</h3>
                        <p className="stat-number">{stats?.pendingProducts || 0}</p>
                    </div>
                </div>
                <div className="stat-card gradient-blue">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
                    </div>
                </div>
                <div className="stat-card gradient-pink">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-content">
                        <h3>Total Orders</h3>
                        <p className="stat-number">{stats?.totalOrders || 0}</p>
                    </div>
                </div>
            </div>

            {/* Sales Chart */}
            {salesData.length > 0 && (
                <div className="chart-section">
                    <h2>📈 Sales Trends (Last 30 Days)</h2>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#667eea" strokeWidth={2} name="Revenue (₹)" />
                                <Line type="monotone" dataKey="orders" stroke="#764ba2" strokeWidth={2} name="Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Low Stock Alerts */}
            {lowStockProducts.length > 0 && (
                <div className="alert-section">
                    <h2>⚠️ Low Stock Alerts</h2>
                    <div className="alert-grid">
                        {lowStockProducts.map((product) => (
                            <div key={product._id} className="alert-card">
                                <img src={product.image} alt={product.name} />
                                <div className="alert-info">
                                    <h4>{product.name}</h4>
                                    <p className="stock-warning">Only {product.stock} left in stock!</p>
                                    <Link to="/seller/products" className="btn-small">
                                        Update Stock
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            <div className="recent-orders-section">
                <div className="section-header">
                    <h2>📦 Recent Orders</h2>
                    <Link to="/seller/orders" className="view-all-link">
                        View All →
                    </Link>
                </div>
                <div className="orders-table">
                    {recentOrders.length === 0 ? (
                        <p className="no-data">No orders yet</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>#{order._id.slice(-6)}</td>
                                        <td>{order.user?.name || "N/A"}</td>
                                        <td>{order.items.length} item(s)</td>
                                        <td>₹{order.sellerTotal?.toLocaleString()}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
