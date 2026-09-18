import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    alert("Login successful!");

    navigate("/");
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link to="/" className="auth-logo">
          Shop<span>Zone</span>
        </Link>

        <h1>Sign in</h1>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />


          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <button type="submit">
            Sign in
          </button>

        </form>


        <p className="auth-help">
          By continuing, you agree to ShopZone's
          Conditions of Use and Privacy Notice.
        </p>


        <div className="auth-divider">
          New to ShopZone?
        </div>


        <Link
          to="/register"
          className="create-account"
        >
          Create your ShopZone account
        </Link>

      </div>

    </div>
  );
}

export default Login;