import { useState, useEffect } from "react";
import "./ProductInfo.css";

const ProductInfo = ({ product }) => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Category-based subcategories mapping
    const categorySubcategories = {
        Vegetables: ["Root Vegetables", "Leafy Greens", "Local Vegetables", "Exotic Vegetables", "Organic Vegetables"],
        Fruits: ["Seasonal Fruits", "Tropical Fruits", "Citrus Fruits", "Berries", "Dry Fruits"],
        Dairy: ["Milk Products", "Cheese & Butter", "Yogurt & Curd", "Paneer & Tofu", "Cream & Ghee"],
        Bakery: ["Bread & Buns", "Cakes & Pastries", "Cookies & Biscuits", "Rusks & Toast", "Puffs & Rolls"],
        Beverages: ["Tea & Coffee", "Juices", "Soft Drinks", "Energy Drinks", "Health Drinks"],
        Snacks: ["Chips & Namkeen", "Biscuits & Cookies", "Chocolates", "Sweets", "Dry Fruits"],
        Meat: ["Chicken", "Mutton", "Fish", "Prawns", "Eggs"],
        Seafood: ["Fresh Fish", "Frozen Seafood", "Prawns & Shrimps", "Crab & Lobster", "Dried Seafood"],
        Frozen: ["Frozen Vegetables", "Frozen Snacks", "Ice Cream", "Frozen Meat", "Ready to Cook"],
        Other: ["Spices & Masalas", "Rice & Grains", "Oils & Ghee", "Cleaning Supplies", "Personal Care"]
    };

    // Get subcategories for current product
    const getSubcategories = () => {
        return categorySubcategories[product?.category] || [];
    };

    // Generate related search tags
    const getRelatedSearchTags = () => {
        const tags = [];

        // Add category
        if (product?.category) {
            tags.push(product.category);
        }

        // Add brand
        if (product?.brand) {
            tags.push(product.brand);
        }

        // Add product-specific tags
        const productTags = product?.tags || [];
        tags.push(...productTags);

        // Add generic related terms based on category
        const categoryTags = {
            Vegetables: ["Fresh Vegetables", "Organic", "Farm Fresh"],
            Fruits: ["Fresh Fruits", "Seasonal", "Imported"],
            Dairy: ["Fresh Dairy", "Low Fat", "Organic Dairy"],
            Bakery: ["Fresh Baked", "Whole Wheat", "Multigrain"],
            Beverages: ["Refreshing", "Cold Drinks", "Hot Beverages"],
            Snacks: ["Tasty Snacks", "Healthy Snacks", "Party Snacks"],
        };

        if (product?.category && categoryTags[product.category]) {
            tags.push(...categoryTags[product.category]);
        }

        return [...new Set(tags)]; // Remove duplicates
    };

    return (
        <div className="product-info-section">
            {/* Accordion 1: About the Product */}
            <div className="accordion-item">
                <div
                    className="accordion-header"
                    onClick={() => toggleSection("about")}
                >
                    <h3>About the Product</h3>
                    <span className="accordion-icon">
                        {openSection === "about" ? "−" : "+"}
                    </span>
                </div>
                {openSection === "about" && (
                    <div className="accordion-content">
                        <p className="product-description">
                            {product?.description || "High-quality product sourced from trusted suppliers. Perfect for your daily needs."}
                        </p>
                        {product?.features && product.features.length > 0 && (
                            <ul className="product-features">
                                {product.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Accordion 2: Other Product Info */}
            <div className="accordion-item">
                <div
                    className="accordion-header"
                    onClick={() => toggleSection("info")}
                >
                    <h3>Other Product Info</h3>
                    <span className="accordion-icon">
                        {openSection === "info" ? "−" : "+"}
                    </span>
                </div>
                {openSection === "info" && (
                    <div className="accordion-content">
                        <div className="info-grid">
                            <div className="info-row">
                                <span className="info-label">EAN Code:</span>
                                <span className="info-value">{product?.eanCode || "N/A"}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Brand:</span>
                                <span className="info-value">{product?.brand || "Generic"}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Category:</span>
                                <span className="info-value">{product?.category || "Other"}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Unit:</span>
                                <span className="info-value">{product?.unit || "1 piece"}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Shelf Life:</span>
                                <span className="info-value">{product?.shelfLife || "As per package"}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Manufacturer:</span>
                                <span className="info-value">{product?.manufacturer || product?.brand || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Accordion 3: More Information */}
            <div className="accordion-item">
                <div
                    className="accordion-header"
                    onClick={() => toggleSection("more")}
                >
                    <h3>More Information</h3>
                    <span className="accordion-icon">
                        {openSection === "more" ? "−" : "+"}
                    </span>
                </div>
                {openSection === "more" && (
                    <div className="accordion-content">
                        <div className="more-info-section">
                            <h4>Explore {product?.category || "Related"} Categories</h4>
                            <div className="category-links">
                                {getSubcategories().map((subcategory, index) => (
                                    <a
                                        key={index}
                                        href={`/products?category=${encodeURIComponent(subcategory)}`}
                                        className="category-link"
                                    >
                                        {subcategory}
                                    </a>
                                ))}
                            </div>

                            <div className="storage-info">
                                <h4>Storage & Usage</h4>
                                <p>{product?.storageInfo || "Store in a cool, dry place. Keep away from direct sunlight."}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Related Search */}
            <div className="related-search-section">
                <h4>Related Search</h4>
                <div className="related-tags">
                    {getRelatedSearchTags().map((tag, index) => (
                        <a
                            key={index}
                            href={`/products?search=${encodeURIComponent(tag)}`}
                            className="related-tag"
                        >
                            {tag}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
