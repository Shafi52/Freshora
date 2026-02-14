import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./SellerSidebar.css";

const SellerSidebar = () => {
    const location = useLocation();
    const { user } = useAuth();

    // Only render if user is a seller
    if (user?.role !== "seller") {
        return null;
    }

    const menuItems = [
        {
            path: "/seller/dashboard",
            icon: "📊",
            label: "Dashboard",
            description: "Overview & Analytics"
        },
        {
            path: "/seller/products",
            icon: "📦",
            label: "Products",
            description: "Add, Edit, Delete"
        },
        {
            path: "/seller/inventory",
            icon: "📋",
            label: "Inventory",
            description: "Stock Management"
        },
        {
            path: "/seller/orders",
            icon: "🛍️",
            label: "Orders",
            description: "Manage Orders"
        }
    ];

    return (
        <aside className="seller-sidebar">
            <div className="sidebar-header">
                <div className="seller-badge">
                    <span className="badge-icon">🏪</span>
                    <div className="badge-content">
                        <h3>Seller Center</h3>
                        <p>{user?.name}</p>
                    </div>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                    >
                        <span className="item-icon">{item.icon}</span>
                        <div className="item-content">
                            <span className="item-label">{item.label}</span>
                            <span className="item-description">{item.description}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="help-card">
                    <span className="help-icon">💡</span>
                    <h4>Need Help?</h4>
                    <p>Check our seller guide</p>
                </div>
            </div>
        </aside>
    );
};

export default SellerSidebar;
