import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import Alert from "../components/Alert";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      await signup(formData.name, formData.email, formData.password);
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to create account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <h1>Create your account</h1>
      <p className="auth-sub">Start tracking your glucose levels with Sweety.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <Alert type="error">{error}</Alert>}

        <div className="field">
          <label htmlFor="name">Full name</label>
          <div className="input-wrap">
            <User className="input-icon" size={18} aria-hidden="true" />
            <input
              id="name"
              className="input with-icon"
              name="name"
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

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
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              minLength={8}
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
          <span className="field-hint">Use at least 8 characters.</span>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthShell>
  );
}
