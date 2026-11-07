import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import Alert from "../components/Alert";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1>Welcome back</h1>
      <p className="auth-sub">Log in to your Sweety glucose tracker.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {location.state?.registered && !error && (
          <Alert type="success">
            Account created successfully. Please log in.
          </Alert>
        )}
        {error && <Alert type="error">{error}</Alert>}

        <div className="field">
          <label htmlFor="email">Email address</label>
          <div className="input-wrap">
            <Mail className="input-icon" size={18} aria-hidden="true" />
            <input
              id="email"
              className="input with-icon"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="input-wrap">
            <Lock className="input-icon" size={18} aria-hidden="true" />
            <input
              id="password"
              className="input with-icon with-action"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="input-action"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </AuthShell>
  );
}
