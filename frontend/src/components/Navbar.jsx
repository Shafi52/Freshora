import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import MobileMenu from "./MobileMenu";
import "./Navbar.css";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "seller") return "/seller/dashboard";
    return "/dashboard";
  };

  return (
    <>
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

      <nav className="professional-navbar">
        <div className="navbar-container">
          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            className="hamburger-btn"
            onClick={() => setShowMobileMenu(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">Freshora</span>
          </Link>

          {/* Search Bar */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <span className="search-icon-left">🔍</span>
            <input
              type="text"
              placeholder="Search for fresh vegetables, fruits, dairy & more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </form>

          {/* Navigation Links */}
          <div className="navbar-links">
            <Link to="/products" className="nav-link">
              <span className="link-icon">📦</span>
              <span>Products</span>
            </Link>

            <Link to="/cart" className="nav-link cart-link">
              <span className="link-icon">🛒</span>
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </Link>

            {isAuthenticated() ? (
              <div className="profile-dropdown">
                <button
                  className="profile-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="profile-name">{user?.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {showProfileMenu && (
                  <div className="dropdown-menu">
                    <Link
                      to={getDashboardLink()}
                      className="dropdown-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <span className="item-icon">📊</span>
                      Dashboard
                    </Link>

                    {/* Seller-specific menu items */}
                    {user?.role === "seller" && (
                      <>
                        <Link
                          to="/seller/products"
                          className="dropdown-item"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <span className="item-icon">📦</span>
                          My Products
                        </Link>
                        <Link
                          to="/seller/inventory"
                          className="dropdown-item"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <span className="item-icon">📋</span>
                          Inventory
                        </Link>
                        <Link
                          to="/seller/orders"
                          className="dropdown-item"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <span className="item-icon">🛍️</span>
                          Seller Orders
                        </Link>
                      </>
                    )}

                    {/* Customer-specific menu items */}
                    {user?.role === "user" && (
                      <Link
                        to="/orders"
                        className="dropdown-item"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <span className="item-icon">📦</span>
                        My Orders
                      </Link>
                    )}

                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <span className="item-icon">🚪</span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-link login-btn">
                <span className="link-icon">👤</span>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
