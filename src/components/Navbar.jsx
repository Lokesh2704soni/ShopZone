import { useEffect, useState } from "react";

import {
  Search,
  ShoppingCart,
  MapPin,
  Menu,
  X,
  LogOut,
  User,
  Heart,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const {
    cartCount,
    clearCart,
  } = useCart();

  const {
    wishlistCount,
  } = useWishlist();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // =========================
  // LOCATION STATES
  // =========================

  const [location, setLocation] = useState(null);
  const [locationOpen, setLocationOpen] = useState(false);

  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  // =========================
  // LOAD USER + LOCATION
  // =========================

  useEffect(() => {
    // Logged-in user
    const storedUser = localStorage.getItem("shopzoneUser");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User data error:", error);
        setUser(null);
      }
    }

    // Saved location
    const storedLocation =
      localStorage.getItem("shopzoneLocation");

    if (storedLocation) {
      try {
        const parsedLocation =
          JSON.parse(storedLocation);

        setLocation(parsedLocation);
      } catch (error) {
        console.error(
          "Location data error:",
          error
        );

        setLocation(null);
      }
    }
  }, []);

  // =========================
  // OPEN LOCATION MODAL
  // =========================

  const openLocation = () => {
    if (location) {
      setCity(location.city || "");
      setPincode(location.pincode || "");
    }

    setLocationOpen(true);
    setMenuOpen(false);
  };

  // =========================
  // SAVE LOCATION
  // =========================

  const handleSaveLocation = (e) => {
    e.preventDefault();

    const cleanCity = city.trim();
    const cleanPincode = pincode.trim();

    if (!cleanCity) {
      alert("Please enter your city.");
      return;
    }

    if (!cleanPincode) {
      alert("Please enter your PIN code.");
      return;
    }

    if (!/^\d{6}$/.test(cleanPincode)) {
      alert("Please enter a valid 6-digit PIN code.");
      return;
    }

    const newLocation = {
      city: cleanCity,
      pincode: cleanPincode,
    };

    localStorage.setItem(
      "shopzoneLocation",
      JSON.stringify(newLocation)
    );

    setLocation(newLocation);
    setLocationOpen(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    localStorage.removeItem("shopzoneUser");
    localStorage.removeItem("shopzoneToken");

    await clearCart();

    setUser(null);
    setMenuOpen(false);

    navigate("/");
  };

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    if (search.trim()) {
      navigate(
        `/?search=${encodeURIComponent(search)}`
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

        {/* =========================
            LOCATION
        ========================= */}

        <button
          className="location"
          onClick={openLocation}
          type="button"
        >
          <MapPin size={18} />

          <div>
            <small>
              Deliver to
            </small>

            <strong>
              {location
                ? `${location.city} ${location.pincode}`
                : "Set your location"}
            </strong>
          </div>
        </button>

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

        {/* WISHLIST */}

        <Link
          to="/wishlist"
          className="nav-wishlist"
        >
          <div className="wishlist-nav-icon">

            <Heart
              size={25}
              fill="currentColor"
            />

            {wishlistCount > 0 && (
              <span>
                {wishlistCount}
              </span>
            )}

          </div>

          <strong>
            Wishlist
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

          {/* MOBILE LOCATION */}

          <button
            className="mobile-location-btn"
            onClick={openLocation}
          >
            📍{" "}
            {location
              ? `Deliver to ${location.city} ${location.pincode}`
              : "Set your location"}
          </button>

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

          <Link
            to="/wishlist"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            ❤️ Wishlist ({wishlistCount})
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

      {/* =========================
          LOCATION MODAL
      ========================= */}

      {locationOpen && (
        <div
          className="location-overlay"
          onClick={() =>
            setLocationOpen(false)
          }
        >
          <div
            className="location-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="location-modal-header">

              <div>
                <h2>
                  Choose your location
                </h2>

                <p>
                  Enter your city and PIN code
                  to set your delivery location.
                </p>
              </div>

              <button
                className="location-close"
                onClick={() =>
                  setLocationOpen(false)
                }
              >
                <X size={22} />
              </button>

            </div>

            {/* LOCATION FORM */}

            <form
              onSubmit={handleSaveLocation}
              className="location-form"
            >

              <label>
                City
              </label>

              <input
                type="text"
                placeholder="e.g. Jaipur"
                value={city}
                onChange={(e) =>
                  setCity(e.target.value)
                }
              />

              <label>
                PIN Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="e.g. 302001"
                value={pincode}
                onChange={(e) =>
                  setPincode(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

              <button
                type="submit"
                className="save-location-btn"
              >
                Save Location
              </button>

            </form>

            {/* CURRENT LOCATION INFO */}

            {location && (
              <div className="current-location-info">

                <MapPin size={18} />

                <div>
                  <small>
                    Current saved location
                  </small>

                  <strong>
                    {location.city},{" "}
                    {location.pincode}
                  </strong>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;