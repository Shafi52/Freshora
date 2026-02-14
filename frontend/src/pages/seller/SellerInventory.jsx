import { useEffect, useState } from "react";
import API from "../../api/api";
import "./SellerInventory.css";

const SellerInventory = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [threshold, setThreshold] = useState(10);

    useEffect(() => {
        fetchInventoryData();
    }, [threshold]);

    const fetchInventoryData = async () => {
        try {
            const [allRes, lowStockRes, outOfStockRes] = await Promise.all([
                API.get("/seller/products"),
                API.get(`/seller/inventory/low-stock?threshold=${threshold}`),
                API.get("/seller/inventory/out-of-stock"),
            ]);

            setAllProducts(allRes.data);
            setLowStockProducts(lowStockRes.data);
            setOutOfStockProducts(outOfStockRes.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStockUpdate = async (productId, newStock) => {
        try {
            await API.put(`/seller/products/${productId}`, { stock: newStock });
            alert("Stock updated successfully!");
            fetchInventoryData();
        } catch (error) {
            alert("Error updating stock");
        }
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: "Out of Stock", class: "out-of-stock" };
        if (stock <= threshold) return { label: "Low Stock", class: "low-stock" };
        return { label: "In Stock", class: "in-stock" };
    };

    const renderProductTable = (products) => {
        if (products.length === 0) {
            return <p className="no-data">No products in this category</p>;
        }

        return (
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Current Stock</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const status = getStockStatus(product.stock);
                        return (
                            <tr key={product._id}>
                                <td>
                                    <div className="product-cell">
                                        <img src={product.image} alt={product.name} />
                                        <div>
                                            <strong>{product.name}</strong>
                                            {product.brand && <p className="brand-text">{product.brand}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td>{product.category}</td>
                                <td>
                                    <strong>{product.stock}</strong> {product.unit}
                                </td>
                                <td>
                                    <span className={`stock-badge ${status.class}`}>
                                        {status.label}
                                    </span>
                                </td>
                                <td>₹{product.price}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            const newStock = prompt(`Enter new stock for ${product.name}:`, product.stock);
                                            if (newStock !== null && !isNaN(newStock)) {
                                                handleStockUpdate(product._id, parseInt(newStock));
                                            }
                                        }}
                                        className="btn-update"
                                    >
                                        Update Stock
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    if (loading) return <div className="loading">Loading inventory...</div>;

    return (
        <div className="seller-inventory">
            <div className="page-header">
                <h1>📊 Inventory Management</h1>
                <div className="threshold-control">
                    <label>Low Stock Threshold:</label>
                    <input
                        type="number"
                        value={threshold}
                        onChange={(e) => setThreshold(parseInt(e.target.value) || 10)}
                        min="1"
                        max="100"
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="inventory-summary">
                <div className="summary-card">
                    <div className="summary-icon">📦</div>
                    <div className="summary-content">
                        <h3>Total Products</h3>
                        <p className="summary-number">{allProducts.length}</p>
                    </div>
                </div>
                <div className="summary-card warning">
                    <div className="summary-icon">⚠️</div>
                    <div className="summary-content">
                        <h3>Low Stock</h3>
                        <p className="summary-number">{lowStockProducts.length}</p>
                    </div>
                </div>
                <div className="summary-card danger">
                    <div className="summary-icon">❌</div>
                    <div className="summary-content">
                        <h3>Out of Stock</h3>
                        <p className="summary-number">{outOfStockProducts.length}</p>
                    </div>
                </div>
                <div className="summary-card success">
                    <div className="summary-icon">✅</div>
                    <div className="summary-content">
                        <h3>In Stock</h3>
                        <p className="summary-number">
                            {allProducts.length - lowStockProducts.length - outOfStockProducts.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="inventory-tabs">
                <button
                    className={activeTab === "all" ? "active" : ""}
                    onClick={() => setActiveTab("all")}
                >
                    All Products ({allProducts.length})
                </button>
                <button
                    className={activeTab === "low" ? "active" : ""}
                    onClick={() => setActiveTab("low")}
                >
                    Low Stock ({lowStockProducts.length})
                </button>
                <button
                    className={activeTab === "out" ? "active" : ""}
                    onClick={() => setActiveTab("out")}
                >
                    Out of Stock ({outOfStockProducts.length})
                </button>
            </div>

            {/* Product Tables */}
            <div className="inventory-content">
                {activeTab === "all" && renderProductTable(allProducts)}
                {activeTab === "low" && renderProductTable(lowStockProducts)}
                {activeTab === "out" && renderProductTable(outOfStockProducts)}
            </div>
        </div>
    );
};

export default SellerInventory;
