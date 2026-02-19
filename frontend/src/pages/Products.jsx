import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/api";
import ProductDetail from "../components/ProductDetail";
import "./Products.css";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sellerStores, setSellerStores] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if user is a seller
  const isSeller = user?.role === "seller";

  const categories = ["All", "Vegetables", "Fruits", "Dairy", "Bakery", "Beverages", "Snacks", "Meat", "Seafood", "Frozen", "Other"];

  // Get unique brands from products + seller store names (deduplicated)
  const productBrands = products.filter(p => p.brand).map(p => p.brand);
  const allBrandNames = [...new Set([...productBrands, ...sellerStores])].sort();
  const brands = ["All", ...allBrandNames];

  useEffect(() => {
    fetchProducts();
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await API.get("/seller/public");
      setSellerStores(res.data || []);
    } catch {
      // silently fail
    }
  };


  // Handle search and brand query from URL
  useEffect(() => {
    const search = searchParams.get("search");
    const brand = searchParams.get("brand");

    if (search) {
      setSearchQuery(search);
      setSelectedCategory("All");
      setSelectedBrand("");
    }

    if (brand) {
      setSelectedBrand(brand);
      setSelectedCategory("All");
      setSearchQuery("");
    }
  }, [searchParams]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [selectedCategory, selectedBrand, products, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      // Try to load from localStorage first
      const cachedProducts = localStorage.getItem("freshora_products");
      if (cachedProducts) {
        const parsedProducts = JSON.parse(cachedProducts);
        setProducts(parsedProducts);
        setFilteredProducts(parsedProducts);
        console.log("✅ Loaded products from localStorage:", parsedProducts.length);
      }

      // Fetch from API
      const response = await API.get("/products");
      console.log("✅ Fetched products from API:", response.data.length);

      setProducts(response.data);
      setFilteredProducts(response.data);

      // Save to localStorage for persistence
      localStorage.setItem("freshora_products", JSON.stringify(response.data));
      console.log("💾 Saved products to localStorage");

    } catch (error) {
      console.error("Error fetching products:", error);

      // If API fails, try to use cached data
      const cachedProducts = localStorage.getItem("freshora_products");
      if (cachedProducts) {
        const parsedProducts = JSON.parse(cachedProducts);
        setProducts(parsedProducts);
        setFilteredProducts(parsedProducts);
        console.log("⚠️ Using cached products due to API error");
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply search filter (searches name, category, brand)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.brand && product.brand.toLowerCase().includes(query)) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    // Apply brand filter
    if (selectedBrand && selectedBrand !== "All") {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
        break;
      case "delivery":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      case "name-a-z":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-z-a":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedBrand("");
    setSearchQuery("");
    setSearchParams({});
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
    setSelectedCategory("All");
    setSearchQuery("");
    if (brand && brand !== "All") {
      setSearchParams({ brand });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
  };

  const handleClearAllFilters = () => {
    setSearchQuery("");
    setSelectedBrand("");
    setSelectedCategory("All");
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    // Prevent sellers from adding to cart
    if (isSeller) {
      alert("Sellers cannot add products to cart. Please use your seller dashboard to manage products.");
      return;
    }
    addToCart(product);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await API.delete(`/seller/products/${productId}`);
      alert("Product deleted successfully!");
      fetchProducts(); // Refresh products
    } catch (error) {
      alert("Error deleting product: " + (error.response?.data?.message || "Please try again"));
    }
  };

  const handleEditProduct = (product) => {
    // Navigate to seller products page with edit mode
    navigate(`/seller/products?edit=${product._id}`);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        allProducts={products}
        onClose={handleCloseDetail}
        onAddToCart={handleAddToCart}
      />
    );
  }

  const hasActiveFilters = searchQuery || selectedBrand || selectedCategory !== "All";

  return (
    <div className="products-container">
      <h1 className="products-title">Our Products</h1>

      {/* Search Results Banner */}
      {searchQuery && (
        <div className="search-results-banner">
          <span className="search-results-text">
            Search results for: <strong>"{searchQuery}"</strong>
          </span>
          <button className="clear-search-banner-btn" onClick={handleClearSearch}>
            Clear Search ✕
          </button>
        </div>
      )}

      {/* Brand Filter Banner */}
      {selectedBrand && selectedBrand !== "All" && (
        <div className="brand-filter-banner">
          <span className="brand-filter-text">
            🏷️ Showing products from: <strong>{selectedBrand}</strong>
          </span>
          <button className="clear-brand-banner-btn" onClick={() => handleBrandChange("All")}>
            Clear Brand ✕
          </button>
        </div>
      )}

      {/* Filter and Sort Controls */}
      <div className="filter-sort-bar">
        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Brand Filter Dropdown */}
        <div className="brand-filter-section">
          <label htmlFor="brand-select" className="brand-label">
            <span className="brand-icon">🏷️</span> Filter by Brand:
          </label>
          <select
            id="brand-select"
            value={selectedBrand || "All"}
            onChange={(e) => handleBrandChange(e.target.value)}
            className="brand-select"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="sort-controls">
          <label htmlFor="sort-select" className="sort-label">
            <span className="sort-icon">⚡</span> Sort By:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="default">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Rating: Highest First</option>
            <option value="delivery">Delivery: Fastest First</option>
            <option value="name-a-z">Name: A to Z</option>
            <option value="name-z-a">Name: Z to A</option>
          </select>
        </div>

        {/* Clear All Filters */}
        {hasActiveFilters && (
          <button className="clear-all-filters-btn" onClick={handleClearAllFilters}>
            Clear All Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <>
          <p className="products-count">
            <span className="count-number">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""} found
          </p>
          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-wrapper" onClick={() => handleProductClick(product)}>
                    <img src={product.image} alt={product.name} className="product-image" />
                    {product.stock < 20 && (
                      <span className="stock-badge">Limited Stock</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name" onClick={() => handleProductClick(product)}>
                      {product.name}
                    </h3>
                    <p className="product-category">{product.category}</p>
                    {product.brand && (
                      <p
                        className="product-brand clickable-brand"
                        onClick={() => handleBrandChange(product.brand)}
                      >
                        🏷️ {product.brand}
                      </p>
                    )}
                    <div className="product-rating-small">
                      ⭐ {product.rating || 4.5} ({product.reviewCount || Math.floor(Math.random() * 1000 + 100)})
                    </div>
                    <div className="product-footer">
                      <span className="product-price">₹{product.price}/{product.unit}</span>

                      {/* Conditional rendering based on role */}
                      {isSeller ? (
                        // Seller sees Edit/Delete buttons
                        <div className="seller-product-actions">
                          <button
                            className="edit-product-btn"
                            onClick={() => handleEditProduct(product)}
                            title="Edit Product"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="delete-product-btn"
                            onClick={() => handleDeleteProduct(product._id)}
                            title="Delete Product"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      ) : (
                        // Customers see Add to Cart button
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products-found">
              <div className="no-products-icon">📦</div>
              <h3>No products found</h3>
              <p>
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : selectedBrand
                    ? `No products found for brand "${selectedBrand}".`
                    : "Try selecting a different category or adjusting your filters"
                }
              </p>
              {hasActiveFilters && (
                <button className="clear-search-btn-large" onClick={handleClearAllFilters}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
