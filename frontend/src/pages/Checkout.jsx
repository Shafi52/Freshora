import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import "./Checkout.css";

const Checkout = () => {
    const { cart, getTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        paymentMethod: "COD",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderId, setOrderId] = useState("");

    // Payment details
    const [upiId, setUpiId] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate payment details
        if (formData.paymentMethod === "UPI") {
            const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
            if (!upiId.trim()) {
                setError("Please enter UPI ID");
                return;
            }
            if (!upiRegex.test(upiId)) {
                setError("Please enter a valid UPI ID (e.g., username@paytm)");
                return;
            }
        }

        if (formData.paymentMethod === "Card") {
            if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length !== 16) {
                setError("Please enter a valid 16-digit card number");
                return;
            }
            if (!cardName.trim()) {
                setError("Please enter cardholder name");
                return;
            }
            if (!expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
                setError("Please enter valid expiry date (MM/YY)");
                return;
            }
            if (!cvv.trim() || cvv.length !== 3) {
                setError("Please enter valid 3-digit CVV");
                return;
            }
        }

        setLoading(true);

        try {
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 2000));

            const orderData = {
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                },
                paymentMethod: formData.paymentMethod,
                paymentDetails: formData.paymentMethod === "UPI"
                    ? { upiId }
                    : formData.paymentMethod === "Card"
                        ? { cardLast4: cardNumber.slice(-4) }
                        : {},
                isPaid: formData.paymentMethod !== "COD",
                paidAt: formData.paymentMethod !== "COD" ? new Date() : null,
            };

            const res = await API.post("/orders", orderData);

            setOrderId(res.data._id);
            setShowSuccessModal(true);

            // Clear cart and redirect after 3 seconds
            setTimeout(async () => {
                await clearCart();
                navigate("/orders");
            }, 3000);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    // Restrict sellers from accessing checkout
    if (user?.role === "seller") {
        return (
            <div className="checkout-container">
                <div className="seller-restriction">
                    <div className="restriction-icon">🏪</div>
                    <h2>Seller Account Detected</h2>
                    <p>Sellers cannot place orders. This feature is for customers only.</p>
                    <p className="restriction-hint">
                        To manage your products, please visit your{" "}
                        <span className="link-text" onClick={() => navigate("/seller/dashboard")}>
                            Seller Dashboard
                        </span>
                    </p>
                    <button className="go-dashboard-btn" onClick={() => navigate("/seller/dashboard")}>
                        Go to Seller Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="checkout-container">
                <div className="empty-checkout">
                    <h2>Your cart is empty</h2>
                    <button onClick={() => navigate("/products")}>Shop Now</button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            <div className="checkout-content">
                <div className="checkout-form">
                    <h3>Shipping Address</h3>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Street Address *</label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>ZIP Code *</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Payment Method *</label>
                            <select
                                name="paymentMethod"
                                value={formData.paymentMethod}
                                onChange={handleChange}
                                required
                            >
                                <option value="COD">Cash on Delivery</option>
                                <option value="Card">Credit/Debit Card</option>
                                <option value="UPI">UPI</option>
                            </select>
                        </div>

                        {/* UPI Details */}
                        {formData.paymentMethod === "UPI" && (
                            <div className="payment-details">
                                <h4>Enter UPI Details</h4>
                                <div className="form-group">
                                    <label>UPI ID *</label>
                                    <input
                                        type="text"
                                        placeholder="username@paytm"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        required
                                    />
                                    <small>Enter your UPI ID (e.g., 9876543210@paytm)</small>
                                </div>
                            </div>
                        )}

                        {/* Card Details */}
                        {formData.paymentMethod === "Card" && (
                            <div className="payment-details">
                                <h4>Enter Card Details</h4>
                                <div className="form-group">
                                    <label>Card Number *</label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            const cleaned = e.target.value.replace(/\s/g, "");
                                            const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
                                            setCardNumber(formatted.slice(0, 19));
                                        }}
                                        maxLength="19"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cardholder Name *</label>
                                    <input
                                        type="text"
                                        placeholder="JOHN DOE"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date *</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={expiryDate}
                                            onChange={(e) => {
                                                const cleaned = e.target.value.replace(/\D/g, "");
                                                if (cleaned.length >= 2) {
                                                    setExpiryDate(cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4));
                                                } else {
                                                    setExpiryDate(cleaned);
                                                }
                                            }}
                                            maxLength="5"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>CVV *</label>
                                        <input
                                            type="password"
                                            placeholder="123"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                                            maxLength="3"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="place-order-btn">
                            {loading ? "Processing Payment..." : "Place Order"}
                        </button>
                    </form>
                </div>

                <div className="order-summary">
                    <h3>Order Summary</h3>

                    <div className="summary-items">
                        {cart.map((item) => (
                            <div key={item._id} className="summary-item">
                                <span>{item.name} x {item.qty}</span>
                                <span>₹{item.price * item.qty}</span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>₹{getTotal()}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>₹50</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>₹{getTotal() + 50}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <div className="success-icon">✅</div>
                        <h2>Payment Successful!</h2>
                        <p>Your payment has been processed successfully</p>
                        <div className="order-id">Order ID: #{orderId.slice(-8).toUpperCase()}</div>
                        <p className="success-message">Your order has been placed successfully!</p>
                        <p className="redirect-text">Redirecting to orders page...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
