import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminSidebar.css";

const AdminSidebar = () => {
    const location = useLocation();
    const { user } = useAuth();

    if (user?.role !== "admin") return null;

    const menuItems = [
        { path: "/admin/dashboard", icon: "📊", label: "Dashboard", description: "Overview & Stats" },
        { path: "/admin/products", icon: "📦", label: "Products", description: "Add, Edit, Delete" },
        { path: "/admin/orders", icon: "🛒", label: "Orders", description: "Manage Bookings" },
        { path: "/admin/users", icon: "👥", label: "Users", description: "Roles & Accounts" },
        { path: "/admin/reports", icon: "📈", label: "Reports", description: "Analytics & Sales" },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar-header">
                <div className="admin-badge">
                    <span className="admin-badge-icon">🛡️</span>
                    <div className="admin-badge-content">
                        <h3>Admin Panel</h3>
                        <p>{user?.name}</p>
                    </div>
                </div>
            </div>

            <nav className="admin-sidebar-nav">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`admin-sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                    >
                        <span className="admin-item-icon">{item.icon}</span>
                        <div className="admin-item-content">
                            <span className="admin-item-label">{item.label}</span>
                            <span className="admin-item-description">{item.description}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            <div className="admin-sidebar-footer">
                <div className="admin-role-badge">
                    <span>🛡️ Administrator</span>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
