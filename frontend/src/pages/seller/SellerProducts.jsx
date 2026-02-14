import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./SellerProducts.css";

const SellerProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        originalPrice: "",
        category: "Vegetables",
        stock: "",
        unit: "kg",
        unitValue: "1",
        description: "",
        image: "",
        brand: "",
        discount: "0",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await API.get("/seller/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                // Update existing product
                await API.put(`/seller/products/${editingProduct._id}`, formData);
                alert("Product updated successfully!");
            } else {
                // Add new product
                await API.post("/seller/products", formData);
                alert("Product added! Waiting for admin approval.");
            }

            resetForm();
            fetchProducts();
        } catch (error) {
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice || "",
            category: product.category,
            stock: product.stock,
            unit: product.unit || "kg",
            unitValue: product.unitValue || "1",
            description: product.description || "",
            image: product.image,
            brand: product.brand || "",
            discount: product.discount || "0",
        });
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await API.delete(`/seller/products/${id}`);
                alert("Product deleted successfully!");
                fetchProducts();
            } catch (error) {
                alert("Error deleting product");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            price: "",
            originalPrice: "",
            category: "Vegetables",
            stock: "",
            unit: "kg",
            unitValue: "1",
            description: "",
            image: "",
            brand: "",
            discount: "0",
        });
        setEditingProduct(null);
        setShowAddForm(false);
    };

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div className="seller-products">
            <div className="page-header">
                <h1>📦 My Products</h1>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn-primary"
                >
                    {showAddForm ? "Cancel" : "+ Add New Product"}
                </button>
            </div>

            {/* Add/Edit Product Form */}
            {showAddForm && (
                <div className="product-form-container">
                    <h2>{editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Fresh Tomatoes"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Amul, Britannia"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category *</label>
                                <select name="category" value={formData.category} onChange={handleInputChange}>
                                    <option>Vegetables</option>
                                    <option>Fruits</option>
                                    <option>Dairy</option>
                                    <option>Bakery</option>
                                    <option>Beverages</option>
                                    <option>Snacks</option>
                                    <option>Meat</option>
                                    <option>Seafood</option>
                                    <option>Frozen</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Stock Quantity *</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 100"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Unit *</label>
                                <select name="unit" value={formData.unit} onChange={handleInputChange}>
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="g">Gram (g)</option>
                                    <option value="l">Liter (l)</option>
                                    <option value="ml">Milliliter (ml)</option>
                                    <option value="piece">Piece</option>
                                    <option value="dozen">Dozen</option>
                                    <option value="pack">Pack</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Unit Value</label>
                                <input
                                    type="number"
                                    name="unitValue"
                                    value={formData.unitValue}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 50"
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Original Price (₹)</label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 70"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label>Discount (%)</label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 10"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your product..."
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Image URL *</label>
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                                placeholder="https://example.com/image.jpg"
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                {editingProduct ? "Update Product" : "Add Product"}
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Products List */}
            <div className="products-grid">
                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No products yet. Add your first product!</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product._id} className="product-card">
                            <div className="product-image-wrapper">
                                <img src={product.image} alt={product.name} />
                                {product.stock === 0 && (
                                    <span className="out-of-stock-badge">Out of Stock</span>
                                )}
                                {product.stock > 0 && product.stock <= 10 && (
                                    <span className="low-stock-badge">Low Stock</span>
                                )}
                            </div>
                            <div className="product-details">
                                <h3>{product.name}</h3>
                                {product.brand && <p className="brand">🏷️ {product.brand}</p>}
                                <p className="category">{product.category}</p>
                                <div className="price-info">
                                    <span className="price">₹{product.price}/{product.unit}</span>
                                    {product.discount > 0 && (
                                        <span className="discount-badge">{product.discount}% OFF</span>
                                    )}
                                </div>
                                <p className="stock">Stock: {product.stock} {product.unit}</p>
                                <div className="approval-status">
                                    <span className={`status ${product.isApproved ? "approved" : "pending"}`}>
                                        {product.isApproved ? "✅ Approved" : "⏳ Pending Approval"}
                                    </span>
                                </div>
                                <div className="product-actions">
                                    <button onClick={() => handleEdit(product)} className="btn-edit">
                                        ✏️ Edit
                                    </button>
                                    <button onClick={() => handleDelete(product._id)} className="btn-delete">
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SellerProducts;
