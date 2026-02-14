import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const aboutLinks = [
        { name: "About Us", path: "/about" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms & Conditions", path: "/terms" },
        { name: "Careers", path: "/careers" },
    ];

    const helpLinks = [
        { name: "FAQs", path: "/faq" },
        { name: "Contact Us", path: "/contact" },
        { name: "Shipping Info", path: "/shipping" },
        { name: "Returns", path: "/returns" },
    ];

    const popularBrands = [
        "Amul",
        "Britannia",
        "Tata Sampann",
        "Aashirvaad",
        "Mother Dairy",
        "Nestle",
        "ITC",
        "Parle",
        "Haldiram's",
        "MTR",
        "Everest",
        "MDH",
    ];

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Column 1: About Freshora */}
                <div className="footer-column">
                    <h3 className="footer-heading">Freshora</h3>
                    <ul className="footer-links">
                        {aboutLinks.map((link, index) => (
                            <li key={index}>
                                <Link to={link.path} className="footer-link">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 2: Help */}
                <div className="footer-column">
                    <h3 className="footer-heading">Help</h3>
                    <ul className="footer-links">
                        {helpLinks.map((link, index) => (
                            <li key={index}>
                                <Link to={link.path} className="footer-link">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Popular Brands */}
                <div className="footer-column brands-column">
                    <h3 className="footer-heading">Popular Brands</h3>
                    <div className="brands-grid">
                        {popularBrands.map((brand, index) => (
                            <div key={index} className="brand-item">
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="footer-divider"></div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p className="footer-copyright">
                        © {currentYear} Freshora. All rights reserved.
                    </p>
                    <div className="footer-social">
                        <a href="#" className="social-link" aria-label="Facebook">
                            📘
                        </a>
                        <a href="#" className="social-link" aria-label="Twitter">
                            🐦
                        </a>
                        <a href="#" className="social-link" aria-label="Instagram">
                            📷
                        </a>
                        <a href="#" className="social-link" aria-label="LinkedIn">
                            💼
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
