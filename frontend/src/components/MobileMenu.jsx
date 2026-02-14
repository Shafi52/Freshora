import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MobileMenu.css";

const MobileMenu = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
    };

    const getDashboardLink = () => {
        if (!user) return "/login";
        if (user.role === "admin") return "/admin/dashboard";
        if (user.role === "seller") return "/seller/dashboard";
        return "/dashboard";
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && <div className="mobile-menu-backdrop" onClick={onClose}></div>}

            {/* Drawer */}
            <div className={`mobile-menu-drawer ${isOpen ? "open" : ""}`}>
                {/* Header */}
                <div className="mobile-menu-header">
                    <div className="mobile-menu-logo">
                        <span className="logo-icon">🛒</span>
                        <span className="logo-text">Freshora</span>
                    </div>
                    <button className="mobile-menu-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* User Section */}
                {user && (
                    <div className="mobile-menu-user">
                        <div className="user-avatar">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="user-info">
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="mobile-menu-nav">
                    <Link to="/" className="mobile-nav-link" onClick={onClose}>
                        <span className="nav-icon">🏠</span>
                        Home
                    </Link>

                    <Link to="/products" className="mobile-nav-link" onClick={onClose}>
                        <span className="nav-icon">🛍️</span>
                        Products
                    </Link>

                    {user && (
                        <>
                            <Link to="/cart" className="mobile-nav-link" onClick={onClose}>
                                <span className="nav-icon">🛒</span>
                                Cart
                            </Link>

                            <Link to="/orders" className="mobile-nav-link" onClick={onClose}>
                                <span className="nav-icon">📦</span>
                                Orders
                            </Link>

                            <Link to={getDashboardLink()} className="mobile-nav-link" onClick={onClose}>
                                <span className="nav-icon">📊</span>
                                Dashboard
                            </Link>

                            <Link to="/profile/edit" className="mobile-nav-link" onClick={onClose}>
                                <span className="nav-icon">👤</span>
                                Profile
                            </Link>
                        </>
                    )}

                    {!user && (
                        <Link to="/login" className="mobile-nav-link" onClick={onClose}>
                            <span className="nav-icon">🔐</span>
                            Login
                        </Link>
                    )}
                </nav>

                {/* Footer */}
                {user && (
                    <div className="mobile-menu-footer">
                        <button className="mobile-logout-btn" onClick={handleLogout}>
                            <span className="nav-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default MobileMenu;
