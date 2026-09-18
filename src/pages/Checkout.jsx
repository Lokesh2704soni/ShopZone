import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const [address, setAddress] = useState({
    name: "",
    mobile: "",
    house: "",
    area: "",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const deliveryCharge = cartTotal >= 499 ? 0 : 40;

  const finalTotal = cartTotal + deliveryCharge;

  const handlePlaceOrder = () => {
    if (
      !address.name ||
      !address.mobile ||
      !address.house ||
      !address.area ||
      !address.pincode
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/");
      return;
    }

    const newOrder = {
      id: `SZ-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN"),
      total: finalTotal,
      status: "Ordered",
      paymentMethod: paymentMethod,
      address: address,
      items: cart,
    };

    const existingOrders =
      JSON.parse(
        localStorage.getItem("shopzoneOrders")
      ) || [];

    localStorage.setItem(
      "shopzoneOrders",
      JSON.stringify([
        newOrder,
        ...existingOrders,
      ])
    );

    clearCart();

    alert("Order placed successfully! 🎉");

    navigate("/orders");
  };

  if (cart.length === 0) {
    return (
      <div className="empty-checkout">
        <h1>Your cart is empty</h1>

        <p>
          Add some products before proceeding to checkout.
        </p>

        <button onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your order securely</p>
      </div>

      <div className="checkout-container">

        {/* DELIVERY ADDRESS */}

        <div className="checkout-left">

          <section className="checkout-box">

            <h2>1. Delivery Address</h2>

            <div className="address-grid">

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={address.name}
                onChange={handleChange}
              />

              <input
                type="tel"
                name="mobile"
                placeholder="Mobile Number"
                value={address.mobile}
                onChange={handleChange}
              />

              <input
                type="text"
                name="house"
                placeholder="House No. / Building"
                value={address.house}
                onChange={handleChange}
              />

              <input
                type="text"
                name="area"
                placeholder="Area / Street"
                value={address.area}
                onChange={handleChange}
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
              />

              <input
                type="text"
                name="pincode"
                placeholder="PIN Code"
                value={address.pincode}
                onChange={handleChange}
              />

            </div>

          </section>

          {/* PAYMENT METHOD */}

          <section className="checkout-box">

            <h2>2. Payment Method</h2>

            <div className="payment-options">

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={
                    paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <div>
                  <strong>
                    Cash on Delivery
                  </strong>

                  <p>
                    Pay when your order arrives.
                  </p>
                </div>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={
                    paymentMethod === "UPI"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <div>
                  <strong>UPI</strong>

                  <p>
                    Pay using Google Pay,
                    PhonePe or Paytm.
                  </p>
                </div>

              </label>

              <label className="payment-option">

                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  checked={
                    paymentMethod === "Card"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                />

                <div>
                  <strong>
                    Credit / Debit Card
                  </strong>

                  <p>
                    Secure card payment.
                  </p>
                </div>

              </label>

            </div>

          </section>

          {/* REVIEW ITEMS */}

          <section className="checkout-box">

            <h2>3. Review Your Items</h2>

            {cart.map((item) => (
              <div
                className="checkout-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div className="checkout-item-info">

                  <h3>{item.title}</h3>

                  <p className="checkout-price">
                    ₹
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <div className="checkout-quantity">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="checkout-remove"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))}

          </section>

        </div>

        {/* ORDER SUMMARY */}

        <aside className="checkout-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">

            <span>Items</span>

            <span>
              ₹
              {cartTotal.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>

          <div className="summary-row">

            <span>Delivery</span>

            <span>
              {deliveryCharge === 0
                ? "FREE"
                : `₹${deliveryCharge}`}
            </span>

          </div>

          <hr />

          <div className="summary-total">

            <span>Order Total</span>

            <strong>
              ₹
              {finalTotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
          >
            Place Your Order
          </button>

          <p className="secure-text">
            🔒 Safe and secure checkout
          </p>

        </aside>

      </div>

    </div>
  );
}

export default Checkout;