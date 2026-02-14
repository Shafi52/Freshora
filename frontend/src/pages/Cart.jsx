import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = subtotal > 199 ? 0 : 40;
  const discount = subtotal > 500 ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee - discount;

  const handleQuantityChange = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQty);
    }
  };

  // Restrict sellers from accessing cart/checkout
  if (user?.role === "seller") {
    return (
      <div className="cart-container">
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
      <div className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <button className="shop-now-btn" onClick={() => navigate("/products")}>
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h1>Shopping Cart</h1>
            <p className="item-count">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item-card">
                <img src={item.image} alt={item.name} className="item-image" />

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  {item.brand && <p className="item-brand">🏷️ {item.brand}</p>}
                  <p className="item-category">{item.category}</p>
                  <p className="item-unit-price">₹{item.price} per {item.unit}</p>
                </div>

                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item._id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="qty-display">{item.qty}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item._id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-price">
                    <span className="price-label">Total:</span>
                    <span className="price-value">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount (5%)</span>
                <span className="discount-value">−₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="free-delivery">FREE</span>
              ) : (
                <span>₹{deliveryFee.toFixed(2)}</span>
              )}
            </div>

            {subtotal < 199 && (
              <div className="delivery-tip">
                Add ₹{(199 - subtotal).toFixed(2)} more for FREE delivery!
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span className="total-value">₹{total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              <span className="btn-icon">🛍️</span>
              Proceed to Checkout
            </button>

            <div className="trust-badges">
              <div className="badge">
                <span className="badge-icon">✓</span>
                <span>Secure Payment</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🚚</span>
                <span>Fast Delivery</span>
              </div>
              <div className="badge">
                <span className="badge-icon">↻</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
