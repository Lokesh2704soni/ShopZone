import { useEffect, useState } from "react";

import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

function Navbar() {
  const {
    cartCount,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [search, setSearch] =
    useState("");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [user, setUser] =
    useState(null);


  // Check logged-in user
  useEffect(() => {
    const storedUser =
      localStorage.getItem(
        "shopzoneUser"
      );

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error(
          "User data error:",
          error
        );

        setUser(null);
      }
    }
  }, []);


  // Logout
  const handleLogout = async () => {
    localStorage.removeItem(
      "shopzoneUser"
    );

    localStorage.removeItem(
      "shopzoneToken"
    );

    await clearCart();

    setUser(null);
    setMenuOpen(false);

    navigate("/");
  };


  // Search
  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(
        `/?search=${encodeURIComponent(
          search
        )}`
      );

      setMenuOpen(false);
    }
  };


  return (
    <>
      {/* =========================
          MAIN NAVBAR
      ========================= */}

      <header className="navbar">

        {/* MOBILE MENU */}

        <button
          className="mobile-menu-btn"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? (
            <X size={25} />
          ) : (
            <Menu size={25} />
          )}
        </button>


        {/* LOGO */}

        <Link
          to="/"
          className="logo"
          onClick={() =>
            setMenuOpen(false)
          }
        >
          Shop<span>Zone</span>
        </Link>


        {/* LOCATION */}

        <div className="location">

          <MapPin size={18} />

          <div>
            <small>
              Deliver to
            </small>

            <strong>
              Jaipur 302001
            </strong>
          </div>

        </div>


        {/* SEARCH */}

        <form
          className="search-container"
          onSubmit={handleSearch}
        >

          <select>
            <option>All</option>

            <option>
              Electronics
            </option>

            <option>
              Fashion
            </option>

            <option>
              Home
            </option>

            <option>
              Gaming
            </option>
          </select>


          <input
            type="text"
            placeholder="Search ShopZone"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <button type="submit">
            <Search size={22} />
          </button>

        </form>


        {/* =========================
            ACCOUNT
        ========================= */}

        {user ? (

          <div className="logged-account">

            <div className="user-avatar">
              <User size={17} />
            </div>

            <div className="user-details">

              <small>
                Hello, {user.name}
              </small>

              <strong>
                Account & Lists
              </strong>

            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>

          </div>

        ) : (

          <Link
            to="/login"
            className="nav-account"
          >

            <small>
              Hello, Sign in
            </small>

            <strong>
              Account & Lists
            </strong>

          </Link>

        )}


        {/* ORDERS */}

        <Link
          to="/orders"
          className="nav-orders"
        >

          <small>
            Returns
          </small>

          <strong>
            & Orders
          </strong>

        </Link>


        {/* CART */}

        <Link
          to="/cart"
          className="cart"
        >

          <div className="cart-icon">

            <ShoppingCart size={30} />

            <span>
              {cartCount}
            </span>

          </div>

          <strong>
            Cart
          </strong>

        </Link>

      </header>


      {/* =========================
          DESKTOP SECOND NAVBAR
      ========================= */}

      <nav className="sub-navbar">

        <span>
          ☰ All
        </span>

        <span>
          Today's Deals
        </span>

        <span>
          Customer Service
        </span>

        <span>
          Registry
        </span>

        <span>
          Gift Cards
        </span>

        <span>
          Sell
        </span>

        <span>
          Best Sellers
        </span>

      </nav>


      {/* =========================
          MOBILE MENU
      ========================= */}

      {menuOpen && (

        <div className="mobile-menu">

          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            🏠 Home
          </Link>


          {user ? (

            <>
              <div className="mobile-user">

                <div className="mobile-user-avatar">
                  <User size={18} />
                </div>

                <div>
                  <small>
                    Hello,
                  </small>

                  <strong>
                    {user.name}
                  </strong>
                </div>

              </div>

              <button
                className="mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>

          ) : (

            <Link
              to="/login"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              👤 Account
            </Link>

          )}


          <Link
            to="/orders"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            📦 Your Orders
          </Link>


          <Link
            to="/cart"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            🛒 Cart ({cartCount})
          </Link>


          <span>
            🔥 Today's Deals
          </span>

          <span>
            🎁 Gift Cards
          </span>

          <span>
            💼 Sell on ShopZone
          </span>

        </div>

      )}

    </>
  );
}

export default Navbar;