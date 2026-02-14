import { useState, useEffect } from "react";
import "./ProductDetail.css";
import ProductInfo from "./ProductInfo";

const ProductDetail = ({ product, allProducts, onClose, onAddToCart }) => {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        // Get related products from the same category
        const related = allProducts
            .filter(p => p.category === product.category && p._id !== product._id)
            .slice(0, 3);
        setRelatedProducts(related);
    }, [product, allProducts]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            onAddToCart(product);
        }
    };

    // Calculate discount (mock 24% off)
    const originalPrice = Math.round(product.price * 1.32);
    const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

    return (
        <div className="pdp-overlay" onClick={onClose}>
            <div className="pdp-container" onClick={(e) => e.stopPropagation()}>
                <button className="pdp-close-btn" onClick={onClose}>✕</button>

                {/* Delivery Badge */}
                <div className="delivery-badge">
                    <span className="delivery-icon">⚡</span>
                    <span className="delivery-text">10 MINS</span>
                </div>

                {/* Main Product Section */}
                <div className="pdp-main-section">
                    {/* Left: Large Product Image */}
                    <div className="pdp-image-section">
                        <img src={product.image} alt={product.name} className="pdp-main-image" />
                        {discount > 0 && (
                            <div className="discount-badge">{discount}% OFF</div>
                        )}
                        {product.stock < 20 && (
                            <span className="pdp-stock-badge">Only {product.stock} left!</span>
                        )}
                    </div>

                    {/* Right: Product Details */}
                    <div className="pdp-details-section">
                        <div className="pdp-header">
                            <div className="pdp-category-tag">{product.category}</div>
                            {product.brand && (
                                <div className="pdp-brand-badge">
                                    <span className="brand-icon">🏷️</span> {product.brand}
                                </div>
                            )}
                        </div>

                        <h1 className="pdp-title">{product.name}</h1>

                        {/* Star Rating */}
                        <div className="pdp-rating-section">
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const rating = product.rating || 4.5;
                                    return (
                                        <span
                                            key={star}
                                            className={`star ${star <= Math.floor(rating) ? 'filled' : star - rating < 1 ? 'half-filled' : 'empty'}`}
                                        >
                                            ★
                                        </span>
                                    );
                                })}
                            </div>
                            <span className="rating-text">
                                {product.rating || 4.5} ({product.reviewCount || Math.floor(Math.random() * 2000 + 500)} reviews)
                            </span>
                        </div>

                        <div className="pdp-price-section">
                            <div className="price-row">
                                <span className="pdp-price">₹{product.price}</span>
                                {discount > 0 && (
                                    <span className="pdp-original-price">₹{originalPrice}</span>
                                )}
                            </div>
                            <span className="pdp-unit">per {product.unit}</span>
                        </div>

                        <p className="pdp-description">{product.description}</p>

                        <div className="pdp-stock-info">
                            <span className={product.stock > 50 ? "in-stock" : "low-stock"}>
                                {product.stock > 50 ? "✓ In Stock" : "⚠ Limited Stock"}
                            </span>
                            <span className="stock-count">{product.stock} available</span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="pdp-quantity-section">
                            <label>Quantity:</label>
                            <div className="quantity-controls">
                                <button
                                    className="qty-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    −
                                </button>
                                <span className="qty-display">{quantity}</span>
                                <button
                                    className="qty-btn"
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Basket Button */}
                        <button className="pdp-add-to-basket-btn" onClick={handleAddToCart}>
                            <span className="basket-icon">🛒</span>
                            Add to Basket
                        </button>

                        {/* Product Features */}
                        <div className="pdp-features">
                            <div className="feature-item">
                                <div className="feature-icon-circle">
                                    <span>🚚</span>
                                </div>
                                <div className="feature-text">
                                    <strong>Free Delivery</strong>
                                    <span>On orders above ₹199</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon-circle">
                                    <span>✓</span>
                                </div>
                                <div className="feature-text">
                                    <strong>Quality Assured</strong>
                                    <span>100% Fresh Guarantee</span>
                                </div>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon-circle">
                                    <span>↻</span>
                                </div>
                                <div className="feature-text">
                                    <strong>Return Policy</strong>
                                    <span>Easy returns within 24hrs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="pdp-related-section">
                        <h2 className="related-title">
                            <span className="title-icon">🛍️</span>
                            Frequently Bought Together
                        </h2>
                        <div className="related-products-scroll">
                            {relatedProducts.map((relatedProduct) => {
                                const relatedDiscount = Math.round(Math.random() * 30 + 10); // Mock discount
                                return (
                                    <div key={relatedProduct._id} className="related-product-card">
                                        {relatedDiscount > 15 && (
                                            <div className="related-discount-tag">{relatedDiscount}% OFF</div>
                                        )}
                                        <img
                                            src={relatedProduct.image}
                                            alt={relatedProduct.name}
                                            className="related-product-image"
                                        />
                                        <div className="related-product-info">
                                            <h4 className="related-product-name">{relatedProduct.name}</h4>
                                            {relatedProduct.brand && (
                                                <p className="related-product-brand">
                                                    <span className="brand-tag">{relatedProduct.brand}</span>
                                                </p>
                                            )}
                                            <div className="related-product-footer">
                                                <div className="related-price-section">
                                                    <span className="related-product-price">₹{relatedProduct.price}</span>
                                                    {relatedDiscount > 15 && (
                                                        <span className="related-original-price">
                                                            ₹{Math.round(relatedProduct.price * 1.3)}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    className="related-add-btn"
                                                    onClick={() => onAddToCart(relatedProduct)}
                                                >
                                                    + Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Product Information Accordion */}
                <ProductInfo product={product} />
            </div>
        </div>
    );
};

export default ProductDetail;
