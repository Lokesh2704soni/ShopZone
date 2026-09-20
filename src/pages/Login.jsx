import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://shopzone-wn90.onrender.com";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [otpMode, setOtpMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/login`,
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

      // EMAIL NOT VERIFIED
      if (response.status === 403 && data.requiresVerification) {
        setOtpMode(true);
        setOtp("");
        alert(
          "Your email is not verified. OTP has been sent to your email."
        );
        return;
      }

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

  // =========================
  // SEND OTP
  // =========================
  const handleSendOTP = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }

    try {
      setOtpLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to send OTP");
        return;
      }

      setOtpMode(true);
      alert("OTP has been sent to your email 📧");
    } catch (error) {
      console.error("Send OTP error:", error);

      alert(
        "Unable to connect to server. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setOtpLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid OTP");
        return;
      }

      alert(
        "Email verified successfully! 🎉 Please login now."
      );

      setOtp("");
      setOtpMode(false);
    } catch (error) {
      console.error("Verify OTP error:", error);

      alert(
        "Unable to verify OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
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

            <span className="welcome-icon">
              {otpMode ? "🔐" : "👋"}
            </span>

            <h2>
              {otpMode
                ? "Verify your email"
                : "Welcome back"}
            </h2>

            <p>
              {otpMode
                ? "Enter the OTP sent to your email."
                : "Sign in to continue your shopping journey."}
            </p>

          </div>

          {/* =========================
              OTP SCREEN
          ========================= */}

          {otpMode ? (

            <div className="modern-auth-form">

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

              {/* OTP */}
              <div className="modern-field">

                <label htmlFor="login-otp">
                  Enter OTP
                </label>

                <div className="input-wrapper">

                  <span className="input-icon">
                    #
                  </span>

                  <input
                    id="login-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                  />

                </div>

              </div>

              {/* VERIFY */}
              <button
                type="button"
                className="modern-submit"
                onClick={handleVerifyOTP}
                disabled={otpLoading}
              >
                {otpLoading
                  ? "Verifying..."
                  : "Verify Email"}

                {!otpLoading && (
                  <span className="submit-arrow">
                    →
                  </span>
                )}
              </button>

              {/* RESEND */}
              <button
                type="button"
                className="modern-create"
                onClick={handleSendOTP}
                disabled={otpLoading}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                {otpLoading
                  ? "Sending..."
                  : "Resend OTP"}

                <span>↻</span>
              </button>

              {/* BACK */}
              <button
                type="button"
                onClick={() => {
                  setOtpMode(false);
                  setOtp("");
                }}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                ← Back to Login
              </button>

            </div>

          ) : (

            /* =========================
               LOGIN SCREEN
               ========================= */

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
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}
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

              {/* VERIFY EMAIL MANUALLY */}
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={otpLoading}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                {otpLoading
                  ? "Sending OTP..."
                  : "Verify Email with OTP"}
              </button>

            </form>
          )}

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