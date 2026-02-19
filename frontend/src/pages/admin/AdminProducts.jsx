import { useEffect, useState } from "react";
import API from "../../api/api";
import "./AdminProducts.css";

const CATEGORIES = ["Vegetables", "Fruits", "Dairy", "Bakery", "Beverages", "Snacks", "Meat", "Seafood", "Frozen", "Other"];
const UNITS = ["kg", "g", "l", "ml", "piece", "dozen", "pack"];

const emptyForm = {
    name: "", description: "", price: "", originalPrice: "",
    category: "Vegetables", stock: "", unit: "piece",
    image: "", brand: "", discount: "0", isFeatured: false,
};

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        let list = [...products];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
        }
        if (categoryFilter !== "All") list = list.filter(p => p.category === categoryFilter);
        setFiltered(list);
    }, [products, search, categoryFilter]);

    const fetchProducts = async () => {
        try {
            const res = await API.get("/admin/products");
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const openAdd = () => {
        setEditingProduct(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            originalPrice: product.originalPrice || "",
            category: product.category || "Vegetables",
            stock: product.stock || "",
            unit: product.unit || "piece",
            image: product.image || "",
            brand: product.brand || "",
            discount: product.discount || "0",
            isFeatured: product.isFeatured || false,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!form.name || !form.price || !form.stock) {
            alert("Name, price and stock are required.");
            return;
        }
        setSaving(true);
        try {
            if (editingProduct) {
                await API.put(`/admin/products/${editingProduct._id}`, form);
            } else {
                await API.post("/admin/products", form);
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            console.error("Error saving product:", err);
            alert("Failed to save product.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete product "${name}"?`)) return;
        try {
            await API.delete(`/admin/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert("Failed to delete product.");
        }
    };

    if (loading) return (
        <div className="ap-loading">
            <div className="ap-spinner"></div>
            <p>Loading products...</p>
        </div>
    );

    return (
        <div className="admin-products">
            {/* Header */}
            <div className="ap-header">
                <div>
                    <h1>Product Management</h1>
                    <p className="ap-subtitle">Add, edit and delete products</p>
                </div>
                <button className="ap-btn-add" onClick={openAdd}>+ Add Product</button>
            </div>

            {/* Filters */}
            <div className="ap-filters">
                <div className="ap-search">
                    <span>🔍</span>
                    <input
                        type="text" placeholder="Search products..."
                        value={search} onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="ap-select">
                    <option value="All">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="ap-count"><strong>{filtered.length}</strong> products</span>
            </div>

            {/* Table */}
            <div className="ap-table-wrapper">
                <table className="ap-table">
                    <thead>
                        <tr>
                            <th>Image</th><th>Name</th><th>Category</th>
                            <th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(p => (
                            <tr key={p._id}>
                                <td>
                                    <img
                                        src={p.image || "https://via.placeholder.com/50"}
                                        alt={p.name}
                                        className="ap-product-img"
                                        onError={e => { e.target.src = "https://via.placeholder.com/50"; }}
                                    />
                                </td>
                                <td>
                                    <div className="ap-product-name">{p.name}</div>
                                    {p.brand && <div className="ap-product-brand">{p.brand}</div>}
                                </td>
                                <td><span className="ap-category-badge">{p.category}</span></td>
                                <td>
                                    <span className="ap-price">₹{p.price}</span>
                                    {p.discount > 0 && <span className="ap-discount">{p.discount}% off</span>}
                                </td>
                                <td>
                                    <span className={`ap-stock ${p.stock === 0 ? "out" : p.stock < 10 ? "low" : "ok"}`}>
                                        {p.stock} {p.unit}
                                    </span>
                                </td>
                                <td>
                                    <span className={`ap-status-badge ${p.isActive ? "active" : "inactive"}`}>
                                        {p.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <div className="ap-actions">
                                        <button className="ap-btn-edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                                        <button className="ap-btn-delete" onClick={() => handleDelete(p._id, p.name)}>🗑️ Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="ap-empty">
                        <span>📦</span>
                        <p>No products found</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="ap-modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="ap-modal" onClick={e => e.stopPropagation()}>
                        <div className="ap-modal-header">
                            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                            <button className="ap-modal-close" onClick={() => setShowModal(false)}>✕</button>
                        </div>
                        <div className="ap-modal-body">
                            <div className="ap-form-grid">
                                <div className="ap-form-group">
                                    <label>Product Name *</label>
                                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Fresh Tomatoes" />
                                </div>
                                <div className="ap-form-group">
                                    <label>Brand</label>
                                    <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Brand name" />
                                </div>
                                <div className="ap-form-group ap-full-width">
                                    <label>Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description..." rows={3} />
                                </div>
                                <div className="ap-form-group">
                                    <label>Price (₹) *</label>
                                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" min="0" />
                                </div>
                                <div className="ap-form-group">
                                    <label>Original Price (₹)</label>
                                    <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} placeholder="0" min="0" />
                                </div>
                                <div className="ap-form-group">
                                    <label>Discount (%)</label>
                                    <input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="0" min="0" max="100" />
                                </div>
                                <div className="ap-form-group">
                                    <label>Category *</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="ap-form-group">
                                    <label>Stock *</label>
                                    <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" min="0" />
                                </div>
                                <div className="ap-form-group">
                                    <label>Unit</label>
                                    <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                                        {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div className="ap-form-group ap-full-width">
                                    <label>Image URL</label>
                                    <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                                </div>
                                <div className="ap-form-group ap-checkbox-group">
                                    <label>
                                        <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                                        Featured Product
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="ap-modal-footer">
                            <button className="ap-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="ap-btn-save" onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
