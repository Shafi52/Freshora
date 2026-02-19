import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import API from "../../api/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await API.get("/admin/stats");
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="admin-dashboard">
                <div className="error-container">
                    <p>Failed to load dashboard data</p>
                </div>
            </div>
        );
    }

    const COLORS = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#ffa000"];

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p className="dashboard-subtitle">Manage your e-commerce platform</p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card sales">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Total Sales</h3>
                        <p className="stat-value">₹{stats.totalSales.toLocaleString()}</p>
                    </div>
                </div>

                <div className="stat-card orders">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>Total Orders</h3>
                        <p className="stat-value">{stats.totalOrders}</p>
                    </div>
                </div>

                <div className="stat-card users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Total Users</h3>
                        <p className="stat-value">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="stat-card products">
                    <div className="stat-icon">🛍️</div>
                    <div className="stat-info">
                        <h3>Total Products</h3>
                        <p className="stat-value">{stats.totalProducts}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Sales Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">Sales Overview (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#667eea"
                                strokeWidth={3}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Order Status Chart */}
                <div className="chart-card">
                    <h3 className="chart-title">Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.orderStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ status, count }) => `${status}: ${count}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {stats.orderStatusData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Management Links */}
            <div className="management-section">
                <h2>Management</h2>
                <div className="management-grid">
                    <Link to="/admin/users" className="management-card">
                        <div className="management-icon">👥</div>
                        <h3>User Management</h3>
                        <p>View and manage all users</p>
                    </Link>

                    <Link to="/admin/products" className="management-card">
                        <div className="management-icon">📦</div>
                        <h3>Product Management</h3>
                        <p>Add, edit, and delete products</p>
                    </Link>

                    <Link to="/admin/orders" className="management-card">
                        <div className="management-icon">🛒</div>
                        <h3>Order Management</h3>
                        <p>View and update order status</p>
                    </Link>

                    <Link to="/admin/reports" className="management-card">
                        <div className="management-icon">📈</div>
                        <h3>Reports & Analytics</h3>
                        <p>View detailed sales reports</p>
                    </Link>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="recent-orders-section">
                <h2>Recent Orders</h2>
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>#{order._id.slice(-6)}</td>
                                    <td>{order.user?.name || "N/A"}</td>
                                    <td>₹{order.totalPrice}</td>
                                    <td>
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
