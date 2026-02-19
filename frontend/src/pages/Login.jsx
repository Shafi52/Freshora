import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [storeName, setStoreName] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let result;
    if (isRegister) {
      result = await register(name, email, password, role, adminSecret, storeName);
    } else {
      result = await login(email, password);
    }

    setLoading(false);

    if (result.success) {
      // Role-based redirection
      const userRole = result.user?.role || user?.role;

      if (userRole === "seller") {
        navigate("/seller/dashboard");
      } else if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/"); // Customers stay on home page
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
        <p className="subtitle">
          {isRegister
            ? "Join Freshora and start shopping or selling!"
            : "Login to access your account"}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              {/* Role Selection */}
              <div className="role-selection">
                <label className="role-label">I want to:</label>
                <div className="role-buttons">
                  <button
                    type="button"
                    className={`role-btn ${role === "user" ? "active" : ""}`}
                    onClick={() => setRole("user")}
                  >
                    <span className="role-icon">🛒</span>
                    <span className="role-title">Shop as Customer</span>
                    <span className="role-desc">Browse and buy products</span>
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === "seller" ? "active" : ""}`}
                    onClick={() => setRole("seller")}
                  >
                    <span className="role-icon">🏪</span>
                    <span className="role-title">Sell Products</span>
                    <span className="role-desc">Manage your store</span>
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === "admin" ? "active" : ""}`}
                    onClick={() => setRole("admin")}
                  >
                    <span className="role-icon">🛡️</span>
                    <span className="role-title">Admin</span>
                    <span className="role-desc">System administrator</span>
                  </button>
                </div>
              </div>

              {/* Shop Name — only shown for Seller */}
              {role === "seller" && (
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="🏪 Shop / Store Name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Admin Secret Key — only shown when Admin is selected */}
              {role === "admin" && (
                <div className="form-group">
                  <input
                    type="password"
                    placeholder="🛡️ Admin Secret Key"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    required
                  />
                </div>
              )}

              {/* Name Field */}
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* Email Field */}
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p className="toggle-text">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <span onClick={() => {
            setIsRegister(!isRegister);
            setError("");
            setRole("user");
            setStoreName("");
            setAdminSecret("");
          }}>
            {isRegister ? "Login here" : "Register here"}
          </span>
        </p>

        {/* Demo Credentials */}
        {!isRegister && (
          <div className="demo-credentials">
            <p className="demo-title">Demo Accounts:</p>
            <div className="demo-accounts">
              <div className="demo-account">
                <strong>👤 Customer:</strong>
                <p>user@test.com / password123</p>
              </div>
              <div className="demo-account">
                <strong>🏪 Seller:</strong>
                <p>seller@test.com / password123</p>
              </div>
              <div className="demo-account">
                <strong>👨‍💼 Admin:</strong>
                <p>admin@test.com / password123</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
