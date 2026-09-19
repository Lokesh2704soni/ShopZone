import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://shopzone-wn90.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem(
        "shopzoneUser",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "shopzoneToken",
        data.token
      );

      alert("Login successful! 🎉");

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        "Unable to connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modern-page">

      {/* LEFT SIDE */}
      <div className="auth-showcase">

        <Link to="/" className="modern-logo">
          Shop<span>Zone</span>
        </Link>

        <div className="showcase-content">

          <p className="showcase-small">
            YOUR SHOPPING DESTINATION
          </p>

          <h1>
            Discover.
            <br />
            <span>Shop.</span>
            <br />
            Enjoy.
          </h1>

          <p className="showcase-description">
            Everything you need,
            <br />
            all in one place.
          </p>

          <div className="shopping-visual">

            <div className="visual-circle circle-one"></div>
            <div className="visual-circle circle-two"></div>

            <div className="shopping-bag">
              <div className="bag-handle"></div>
              <div className="bag-body">
                <span>🛍️</span>
              </div>
            </div>

            <div className="floating-card card-one">
              <span>✨</span>
              <div>
                <strong>Great Deals</strong>
                <small>Every day</small>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>🚚</span>
              <div>
                <strong>Fast Delivery</strong>
                <small>At your doorstep</small>
              </div>
            </div>

          </div>

        </div>

        <div className="showcase-bottom">
          <span>© 2026 ShopZone</span>
          <span>Made for better shopping</span>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form-side">

        <div className="modern-auth-card">

          <div className="mobile-logo">
            <Link to="/" className="modern-logo">
              Shop<span>Zone</span>
            </Link>
          </div>

          <div className="form-heading">
            <span className="welcome-icon">👋</span>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue your shopping journey.
            </p>
          </div>

          <form
            className="modern-auth-form"
            onSubmit={handleLogin}
          >

            {/* EMAIL */}
            <div className="modern-field">

              <label htmlFor="login-email">
                Email address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  @
                </span>

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />
              </div>

            </div>

            {/* PASSWORD */}
            <div className="modern-field">

              <div className="field-top">
                <label htmlFor="login-password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() =>
                    alert(
                      "Password reset feature coming soon."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-wrapper">

                <span className="input-icon">
                  •••
                </span>

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* BUTTON */}
            <button
              className="modern-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Continue to ShopZone"}

              {!loading && (
                <span className="submit-arrow">
                  →
                </span>
              )}
            </button>

          </form>

          <div className="modern-divider">
            <span>New to ShopZone?</span>
          </div>

          <Link
            to="/register"
            className="modern-create"
          >
            Create an account
            <span>→</span>
          </Link>

          <p className="modern-terms">
            By continuing, you agree to ShopZone's{" "}
            <span>Terms of Use</span> and{" "}
            <span>Privacy Policy</span>.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;