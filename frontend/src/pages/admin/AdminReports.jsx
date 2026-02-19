import { useEffect, useState } from "react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import API from "../../api/api";
import "./AdminReports.css";

const COLORS = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#ffa000", "#43e97b", "#38f9d7", "#4facfe", "#00f2fe", "#a18cd1"];

const AdminReports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeChart, setActiveChart] = useState("orders");

    useEffect(() => { fetchReports(); }, []);

    const fetchReports = async () => {
        try {
            const res = await API.get("/admin/reports");
            setData(res.data);
        } catch (err) {
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="ar-loading">
            <div className="ar-spinner"></div>
            <p>Generating reports...</p>
        </div>
    );
    if (!data) return <div className="ar-error"><p>Failed to load reports.</p></div>;

    return (
        <div className="admin-reports">
            <div className="ar-header">
                <h1>📈 Reports & Analytics</h1>
                <p className="ar-subtitle">Sales, booking counts, and performance insights</p>
            </div>

            {/* Summary Cards */}
            <div className="ar-summary-grid">
                <div className="ar-stat-card ar-card-green">
                    <div className="ar-stat-icon">💰</div>
                    <div className="ar-stat-info">
                        <p className="ar-stat-label">Total Revenue</p>
                        <h2 className="ar-stat-value">₹{data.totalSales.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="ar-stat-card ar-card-blue">
                    <div className="ar-stat-icon">📦</div>
                    <div className="ar-stat-info">
                        <p className="ar-stat-label">Total Orders</p>
                        <h2 className="ar-stat-value">{data.totalOrders}</h2>
                    </div>
                </div>
                <div className="ar-stat-card ar-card-purple">
                    <div className="ar-stat-icon">🧾</div>
                    <div className="ar-stat-info">
                        <p className="ar-stat-label">Avg Order Value</p>
                        <h2 className="ar-stat-value">₹{data.avgOrderValue.toLocaleString()}</h2>
                    </div>
                </div>
                <div className="ar-stat-card ar-card-red">
                    <div className="ar-stat-icon">❌</div>
                    <div className="ar-stat-info">
                        <p className="ar-stat-label">Cancelled Orders</p>
                        <h2 className="ar-stat-value">{data.cancelledOrders}</h2>
                    </div>
                </div>
            </div>

            {/* Chart Tabs */}
            <div className="ar-chart-card">
                <div className="ar-chart-tabs">
                    <button className={`ar-tab ${activeChart === "orders" ? "active" : ""}`} onClick={() => setActiveChart("orders")}>
                        Orders per Day (30d)
                    </button>
                    <button className={`ar-tab ${activeChart === "sales" ? "active" : ""}`} onClick={() => setActiveChart("sales")}>
                        Sales per Day (30d)
                    </button>
                </div>

                {activeChart === "orders" ? (
                    data.ordersPerDayData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.ordersPerDayData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="orders" stroke="#667eea" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <div className="ar-no-data">No order data in the last 30 days</div>
                ) : (
                    data.salesPerDayData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.salesPerDayData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(v) => `₹${v}`} />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#43e97b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <div className="ar-no-data">No sales data in the last 30 days</div>
                )}
            </div>

            {/* Two column: Category + Status */}
            <div className="ar-two-col">
                {/* Sales by Category */}
                <div className="ar-chart-card">
                    <h3 className="ar-chart-title">💹 Sales by Category</h3>
                    {data.salesByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={data.salesByCategory} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                                <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={80} />
                                <Tooltip formatter={v => `₹${v}`} />
                                <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
                                    {data.salesByCategory.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <div className="ar-no-data">No category data available</div>}
                </div>

                {/* Order Status Distribution */}
                <div className="ar-chart-card">
                    <h3 className="ar-chart-title">📊 Booking Status Counts</h3>
                    <div className="ar-status-table">
                        {data.statusCounts.map(({ status, count }) => (
                            <div key={status} className={`ar-status-row ar-status-${status.toLowerCase()}`}>
                                <span className="ar-status-name">{status}</span>
                                <div className="ar-status-bar-wrapper">
                                    <div
                                        className="ar-status-bar"
                                        style={{ width: data.totalOrders > 0 ? `${(count / data.totalOrders) * 100}%` : "0%" }}
                                    />
                                </div>
                                <span className="ar-status-count">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="ar-chart-card">
                <h3 className="ar-chart-title">🏆 Top 5 Products by Revenue</h3>
                {data.topProducts.length > 0 ? (
                    <table className="ar-top-table">
                        <thead>
                            <tr>
                                <th>#</th><th>Product</th><th>Units Sold</th><th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topProducts.map((p, i) => (
                                <tr key={i}>
                                    <td>
                                        <span className={`ar-rank ar-rank-${i + 1}`}>
                                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                        </span>
                                    </td>
                                    <td className="ar-product-name">{p.name || "Unknown Product"}</td>
                                    <td>{p.unitsSold}</td>
                                    <td className="ar-revenue">₹{p.revenue.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : <div className="ar-no-data">No sales data available to rank products</div>}
            </div>
        </div>
    );
};

export default AdminReports;
