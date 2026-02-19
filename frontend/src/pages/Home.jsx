import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Try to load from localStorage first
      const cachedProducts = localStorage.getItem("freshora_products");
      if (cachedProducts) {
        const products = JSON.parse(cachedProducts);

        // Get featured products (first 8)
        setFeaturedProducts(products.slice(0, 8));

        // Get unique categories with sample products
        const categoryMap = {};
        products.forEach(product => {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = [];
          }
          if (categoryMap[product.category].length < 4) {
            categoryMap[product.category].push(product);
          }
        });
        setCategories(Object.entries(categoryMap));
        console.log("✅ Loaded products from localStorage for Home page");
      }

      // Fetch from API
      const response = await API.get("/products");
      const products = response.data;
      console.log("✅ Fetched products from API for Home:", products.length);

      // Get featured products (first 8)
      setFeaturedProducts(products.slice(0, 8));

      // Get unique categories with sample products
      const categoryMap = {};
      products.forEach(product => {
        if (!categoryMap[product.category]) {
          categoryMap[product.category] = [];
        }
        if (categoryMap[product.category].length < 4) {
          categoryMap[product.category].push(product);
        }
      });
      setCategories(Object.entries(categoryMap));

      // Save to localStorage
      localStorage.setItem("freshora_products", JSON.stringify(products));
      console.log("💾 Saved products to localStorage from Home");

    } catch (error) {
      console.error("Error fetching products:", error);

      // If API fails, try to use cached data
      const cachedProducts = localStorage.getItem("freshora_products");
      if (cachedProducts) {
        const products = JSON.parse(cachedProducts);
        setFeaturedProducts(products.slice(0, 8));

        const categoryMap = {};
        products.forEach(product => {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = [];
          }
          if (categoryMap[product.category].length < 4) {
            categoryMap[product.category].push(product);
          }
        });
        setCategories(Object.entries(categoryMap));
        console.log("⚠️ Using cached products for Home due to API error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate("/products");
  };

  return (
    <div className="home-container">
      {/* Hero Section - No Shop Now button */}
      <div className="hero-section">
        <h1>Welcome to Freshora 🛒</h1>
        <p className="tagline">Your one-stop shop for fresh groceries delivered to your door</p>
      </div>

      {/* Featured Products Section */}
      <section className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product._id} className="product-card" onClick={() => handleProductClick(product._id)}>
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} className="product-image" />
                  {product.stock < 20 && (
                    <span className="stock-badge">Limited Stock</span>
                  )}
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  {product.brand && <p className="product-brand">🏷️ {product.brand}</p>}
                  <div className="product-footer">
                    <span className="product-price">₹{product.price}/{product.unit}</span>
                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-container">
          {categories.map(([categoryName, products]) => (
            <div key={categoryName} className="category-section">
              <div className="category-header">
                <h3>{categoryName}</h3>
                <button onClick={() => navigate("/products")} className="view-all-btn">
                  View All →
                </button>
              </div>
              <div className="category-products">
                {products.map((product) => (
                  <div key={product._id} className="mini-product-card">
                    <img src={product.image} alt={product.name} />
                    <div className="mini-product-info">
                      <p className="mini-product-name">{product.name}</p>
                      {product.brand && <p className="mini-product-brand">{product.brand}</p>}
                      <p className="mini-product-price">₹{product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Moved below products */}
      <section className="features-bottom">
        <h2 className="section-title">Why Choose Freshora?</h2>
        <div className="features">
          <div className="feature-card">
            <span className="feature-icon">🥬</span>
            <h3>Fresh Products</h3>
            <p>Farm-fresh vegetables and fruits delivered daily</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">🚚</span>
            <h3>Fast Delivery</h3>
            <p>Get your groceries delivered within 24 hours</p>
          </div>

          <div className="feature-card">
            <span className="feature-icon">💰</span>
            <h3>Best Prices</h3>
            <p>Competitive prices with regular discounts</p>
          </div>
        </div>
      </section>

      {/* About, Contact, Brands Section */}
      <section className="info-section">
        <div className="info-container">
          {/* About */}
          <div className="info-card">
            <h3>📖 About Freshora</h3>
            <p>Freshora is India's leading online grocery platform, bringing fresh produce and quality products directly to your doorstep. We partner with trusted Indian brands to ensure authenticity and quality.</p>
          </div>

          {/* Contact */}
          <div className="info-card">
            <h3>📞 Contact Us</h3>
            <p><strong>Email:</strong> support@freshora.com</p>
            <p><strong>Phone:</strong> +91 1800-123-4567</p>
            <p><strong>Address:</strong> 123 MG Road, Bangalore, Karnataka 560001</p>
          </div>

          {/* Indian Brands */}
          <div className="info-card">
            <h3>🇮🇳 Trusted Indian Brands</h3>
            <div className="brands-grid">
              <div className="brand-badge">Amul</div>
              <div className="brand-badge">Mother Dairy</div>
              <div className="brand-badge">Britannia</div>
              <div className="brand-badge">Parle</div>
              <div className="brand-badge">Haldiram's</div>
              <div className="brand-badge">ITC</div>
              <div className="brand-badge">Nestle India</div>
              <div className="brand-badge">Patanjali</div>
              <div className="brand-badge">Dabur</div>
              <div className="brand-badge">Tata Consumer</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
