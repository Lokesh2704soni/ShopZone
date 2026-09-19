import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://shopzone-wn90.onrender.com/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Registration failed"
        );
        return;
      }

      alert(
        "Account created successfully! 🎉"
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

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

        <Link
          to="/"
          className="modern-logo"
        >
          Shop<span>Zone</span>
        </Link>

        <div className="showcase-content">

          <p className="showcase-small">
            JOIN THE COMMUNITY
          </p>

          <h1>
            Shop.
            <br />
            <span>Save.</span>
            <br />
            Smile.
          </h1>

          <p className="showcase-description">
            Create your account and
            <br />
            start your journey.
          </p>

          <div className="shopping-visual">

            <div className="visual-circle circle-one"></div>
            <div className="visual-circle circle-two"></div>

            <div className="shopping-bag">
              <div className="bag-handle"></div>

              <div className="bag-body">
                <span>🛒</span>
              </div>
            </div>

            <div className="floating-card card-one">
              <span>🎁</span>

              <div>
                <strong>Exclusive Offers</strong>
                <small>For members</small>
              </div>
            </div>

            <div className="floating-card card-two">
              <span>❤️</span>

              <div>
                <strong>Your Wishlist</strong>
                <small>Save your favorites</small>
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

        <div className="modern-auth-card register-card">

          <div className="mobile-logo">
            <Link
              to="/"
              className="modern-logo"
            >
              Shop<span>Zone</span>
            </Link>
          </div>

          <div className="form-heading">

            <span className="welcome-icon">
              ✨
            </span>

            <h2>Create your account</h2>

            <p>
              Join ShopZone and start shopping smarter.
            </p>

          </div>

          <form
            className="modern-auth-form"
            onSubmit={handleRegister}
          >

            {/* NAME */}
            <div className="modern-field">

              <label htmlFor="register-name">
                Your name
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ◉
                </span>

                <input
                  id="register-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  autoComplete="name"
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className="modern-field">

              <label htmlFor="register-email">
                Email address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  id="register-email"
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

              <label htmlFor="register-password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  •••
                </span>

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="modern-field">

              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✓
                </span>

                <input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  autoComplete="new-password"
                />

              </div>

            </div>

            {/* BUTTON */}
            <button
              className="modern-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create ShopZone account"}

              {!loading && (
                <span className="submit-arrow">
                  →
                </span>
              )}
            </button>

          </form>

          <div className="modern-divider">
            <span>
              Already have an account?
            </span>
          </div>

          <Link
            to="/login"
            className="modern-create"
          >
            Sign in
            <span>→</span>
          </Link>

          <p className="modern-terms">
            By creating an account, you agree to
            ShopZone's{" "}
            <span>Terms of Use</span> and{" "}
            <span>Privacy Policy</span>.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;