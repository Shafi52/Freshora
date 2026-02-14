import { useEffect, useState } from "react";
import API from "../../api/api";
import "./SellerOrders.css";

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await API.get("/seller/orders");
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === "all") return true;
        return order.status.toLowerCase() === filter.toLowerCase();
    });

    if (loading) return <div className="loading">Loading orders...</div>;

    return (
        <div className="seller-orders">
            <div className="page-header">
                <h1>📋 My Orders</h1>
                <div className="filter-buttons">
                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => setFilter("all")}
                    >
                        All ({orders.length})
                    </button>
                    <button
                        className={filter === "pending" ? "active" : ""}
                        onClick={() => setFilter("pending")}
                    >
                        Pending
                    </button>
                    <button
                        className={filter === "processing" ? "active" : ""}
                        onClick={() => setFilter("processing")}
                    >
                        Processing
                    </button>
                    <button
                        className={filter === "shipped" ? "active" : ""}
                        onClick={() => setFilter("shipped")}
                    >
                        Shipped
                    </button>
                    <button
                        className={filter === "delivered" ? "active" : ""}
                        onClick={() => setFilter("delivered")}
                    >
                        Delivered
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="no-orders">
                    <p>No orders found</p>
                </div>
            ) : (
                <div className="orders-list">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                                    <p className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="customer-info">
                                <h4>👤 Customer Details</h4>
                                <p><strong>Name:</strong> {order.user?.name || "N/A"}</p>
                                <p><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                            </div>

                            <div className="shipping-info">
                                <h4>📍 Shipping Address</h4>
                                <p>{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                                <p>{order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                                <p>📞 {order.shippingAddress.phone}</p>
                            </div>

                            <div className="order-items">
                                <h4>📦 Items (Your Products)</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="item-info">
                                                        <img src={item.product?.image} alt={item.name} />
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td>₹{item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>₹{(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="order-footer">
                                <div className="payment-info">
                                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                    <p><strong>Payment Status:</strong>
                                        <span className={`payment-status ${order.paymentStatus.toLowerCase()}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </p>
                                </div>
                                <div className="order-total">
                                    <h3>Your Revenue: ₹{order.sellerTotal?.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
