import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import "./AdminLayout.css";

const AdminLayout = () => {
    const { user } = useAuth();

    if (user?.role !== "admin") {
        return (
            <div className="admin-access-denied">
                <div className="admin-denied-card">
                    <span className="admin-denied-icon">🚫</span>
                    <h2>Access Denied</h2>
                    <p>You need administrator privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
