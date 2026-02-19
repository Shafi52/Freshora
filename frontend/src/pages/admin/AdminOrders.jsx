import { useEffect, useState } from "react";
import API from "../../api/api";
import "./AdminOrders.css";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    useEffect(() => {
        let list = [...orders];
        if (statusFilter !== "All") list = list.filter(o => o.status === statusFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(o =>
                o._id.toLowerCase().includes(q) ||
                (o.user?.name || "").toLowerCase().includes(q) ||
                (o.user?.email || "").toLowerCase().includes(q)
            );
        }
        setFiltered(list);
    }, [orders, statusFilter, search]);

    const fetchOrders = async () => {
        try {
            const res = await API.get("/admin/orders");
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert("Failed to update order status.");
        }
    };

    const handleCancel = async (orderId) => {
        if (!window.confirm("Cancel this order?")) return;
        await handleStatusChange(orderId, "Cancelled");
    };

    const statusColor = (s) => {
        const map = { Pending: "pending", Processing: "processing", Shipped: "shipped", Delivered: "delivered", Cancelled: "cancelled" };
        return map[s] || "pending";
    };

    if (loading) return (
        <div className="ao-loading">
            <div className="ao-spinner"></div>
            <p>Loading orders...</p>
        </div>
    );

    return (
        <div className="admin-orders">
            <div className="ao-header">
                <div>
                    <h1>Order Management</h1>
                    <p className="ao-subtitle">View and manage all customer bookings</p>
                </div>
                <div className="ao-summary-chips">
                    {STATUS_OPTIONS.map(s => (
                        <span key={s} className={`ao-chip ao-chip-${s.toLowerCase()}`}>
                            {s}: {orders.filter(o => o.status === s).length}
                        </span>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="ao-filters">
                <div className="ao-search">
                    <span>🔍</span>
                    <input
                        type="text" placeholder="Search by order ID or customer..."
                        value={search} onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="ao-status-filters">
                    <button className={`ao-filter-btn ${statusFilter === "All" ? "active" : ""}`} onClick={() => setStatusFilter("All")}>All</button>
                    {STATUS_OPTIONS.map(s => (
                        <button key={s} className={`ao-filter-btn ao-filter-${s.toLowerCase()} ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
                            {s}
                        </button>
                    ))}
                </div>
                <span className="ao-count"><strong>{filtered.length}</strong> orders</span>
            </div>

            {/* Orders List */}
            <div className="ao-orders-list">
                {filtered.length === 0 && (
                    <div className="ao-empty">
                        <span>🛒</span>
                        <p>No orders found</p>
                    </div>
                )}
                {filtered.map(order => (
                    <div key={order._id} className={`ao-order-card ${order.status === "Cancelled" ? "cancelled" : ""}`}>
                        <div className="ao-order-header" onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                            <div className="ao-order-meta">
                                <span className="ao-order-id">#{order._id.slice(-8).toUpperCase()}</span>
                                <span className="ao-order-customer">
                                    👤 {order.user?.name || "N/A"} · {order.user?.email || ""}
                                </span>
                                <span className="ao-order-date">
                                    📅 {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                            </div>
                            <div className="ao-order-right">
                                <span className="ao-order-total">₹{order.totalPrice}</span>
                                <span className={`ao-status-badge ${statusColor(order.status)}`}>{order.status}</span>
                                <span className="ao-expand-icon">{expandedOrder === order._id ? "▲" : "▼"}</span>
                            </div>
                        </div>

                        {expandedOrder === order._id && (
                            <div className="ao-order-body">
                                {/* Items */}
                                <div className="ao-items-section">
                                    <h4>Items Ordered</h4>
                                    <div className="ao-items-list">
                                        {(order.items || []).map((item, i) => (
                                            <div key={i} className="ao-item">
                                                <span className="ao-item-name">{item.name}</span>
                                                <span className="ao-item-qty">×{item.quantity}</span>
                                                <span className="ao-item-price">₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="ao-price-breakdown">
                                        <span>Items: ₹{order.itemsPrice}</span>
                                        <span>Shipping: ₹{order.shippingPrice}</span>
                                        <span className="ao-total-price">Total: ₹{order.totalPrice}</span>
                                    </div>
                                </div>

                                {/* Shipping */}
                                <div className="ao-shipping-section">
                                    <h4>Shipping Address</h4>
                                    <p>{order.shippingAddress?.fullName}</p>
                                    <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                                    <p>{order.shippingAddress?.state} - {order.shippingAddress?.zipCode}</p>
                                    <p>📞 {order.shippingAddress?.phone}</p>
                                </div>

                                {/* Actions */}
                                <div className="ao-actions-section">
                                    <h4>Update Status</h4>
                                    <div className="ao-action-row">
                                        <select
                                            value={order.status}
                                            onChange={e => handleStatusChange(order._id, e.target.value)}
                                            className="ao-status-select"
                                            disabled={order.status === "Cancelled"}
                                        >
                                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        {order.status !== "Cancelled" && order.status !== "Delivered" && (
                                            <button className="ao-btn-cancel" onClick={() => handleCancel(order._id)}>
                                                ❌ Cancel Order
                                            </button>
                                        )}
                                        <span className="ao-payment-method">💳 {order.paymentMethod} · {order.paymentStatus}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminOrders;
