import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./Orders.css";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await API.get("/orders");
            setOrders(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            await API.put(`/orders/${orderId}/cancel`);
            fetchOrders(); // Refresh orders
            alert("Order cancelled successfully");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel order");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: "#ff9800",
            Processing: "#2196F3",
            Shipped: "#9C27B0",
            Delivered: "#4CAF50",
            Cancelled: "#f44336",
        };
        return colors[status] || "#666";
    };

    if (loading) {
        return (
            <div className="orders-container">
                <p>Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-container">
                <div className="error">
                    <p>{error}</p>
                    <button onClick={fetchOrders}>Retry</button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="orders-container">
                <div className="empty-orders">
                    <h2>No orders yet</h2>
                    <p>Start shopping to see your orders here!</p>
                    <button onClick={() => navigate("/products")}>Shop Now</button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h2>My Orders</h2>

            <div className="orders-list">
                {orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <div>
                                <p className="order-id">Order #{order._id.slice(-8)}</p>
                                <p className="order-date">
                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            <div>
                                <span
                                    className="order-status"
                                    style={{ backgroundColor: getStatusColor(order.status) }}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <div className="order-items">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <span>
                                        {item.name} x {item.quantity}
                                    </span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-footer">
                            <div className="order-address">
                                <strong>Shipping Address:</strong>
                                <p>
                                    {order.shippingAddress.fullName}, {order.shippingAddress.phone}
                                </p>
                                <p>
                                    {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                                    {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                                </p>
                            </div>

                            <div className="order-total">
                                <p>
                                    <strong>Total:</strong> ₹{order.totalPrice}
                                </p>
                                <p className="payment-method">
                                    Payment: {order.paymentMethod} ({order.paymentStatus})
                                </p>
                            </div>
                        </div>

                        {(order.status === "Pending" || order.status === "Processing") && (
                            <button
                                className="cancel-btn"
                                onClick={() => handleCancelOrder(order._id)}
                            >
                                Cancel Order
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
