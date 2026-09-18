import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  const handleRegister = (e) => {

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


    if (password !== confirmPassword) {

      alert("Passwords do not match");

      return;
    }


    alert("Account created successfully!");

    navigate("/login");
  };


  return (
    <div className="auth-page">

      <div className="auth-card">

        <Link
          to="/"
          className="auth-logo"
        >
          Shop<span>Zone</span>
        </Link>


        <h1>Create account</h1>


        <form onSubmit={handleRegister}>

          <label>Your name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />


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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />


          <label>Re-enter password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />


          <button type="submit">
            Create account
          </button>

        </form>


        <p className="auth-help">
          By creating an account, you agree to
          ShopZone's Conditions of Use and
          Privacy Notice.
        </p>


        <div className="existing-account">

          Already have an account?

          <Link to="/login">
            Sign in
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;