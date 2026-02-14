import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SellerSidebar from "./SellerSidebar";
import "./SellerLayout.css";

const SellerLayout = () => {
    const { user } = useAuth();

    // Only render seller layout if user is a seller
    if (user?.role !== "seller") {
        return (
            <div className="access-denied">
                <div className="access-denied-card">
                    <span className="denied-icon">🚫</span>
                    <h2>Access Denied</h2>
                    <p>You need seller privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="seller-layout">
            <SellerSidebar />
            <main className="seller-main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default SellerLayout;
