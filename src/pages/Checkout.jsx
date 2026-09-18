import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState("Cash on Delivery");

  const [loading, setLoading] = useState(false);

  const deliveryCharge =
    cartTotal >= 499 ? 0 : 40;

  const finalTotal =
    cartTotal + deliveryCharge;


  // Place Order
  const handlePlaceOrder = async () => {
    const token =
      localStorage.getItem("shopzoneToken");

    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your delivery address.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            total: finalTotal,

            paymentMethod,

            address,

            items: cart.map((item) => ({
              productId: item.id,
              title: item.title,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to place order"
        );
        return;
      }

      // MongoDB order created successfully
      await clearCart();

      alert(
        `Order placed successfully! 🎉\nOrder ID: ${data.order.orderId}`
      );

      navigate("/orders");
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      alert(
        "Unable to connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };


  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart is Empty</h1>

        <p>
          Add products before proceeding
          to checkout.
        </p>

        <button
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    );
  }


  return (
    <div className="checkout-page">

      <h1>Checkout</h1>


      <div className="checkout-layout">

        {/* LEFT SIDE */}
        <div className="checkout-left">

          {/* Delivery Address */}
          <div className="checkout-section">

            <h2>1. Delivery Address</h2>

            <textarea
              placeholder="Enter your complete delivery address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              rows="5"
            />

          </div>


          {/* Payment */}
          <div className="checkout-section">

            <h2>2. Payment Method</h2>

            <label className="payment-option">

              <input
                type="radio"
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

              Cash on Delivery

            </label>


            <label className="payment-option">

              <input
                type="radio"
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

              UPI

            </label>


            <label className="payment-option">

              <input
                type="radio"
                value="Credit/Debit Card"
                checked={
                  paymentMethod ===
                  "Credit/Debit Card"
                }
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
              />

              Credit / Debit Card

            </label>

          </div>


          {/* Review Items */}
          <div className="checkout-section">

            <h2>3. Review Items</h2>

            {cart.map((item) => (

              <div
                className="checkout-item"
                key={item.id}
              >

                <img
                  src={item.image}
                  alt={item.title}
                />

                <div>

                  <h3>{item.title}</h3>

                  <p>
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                  <strong>
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="checkout-summary">

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

            <strong>Order Total</strong>

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
            disabled={loading}
          >

            {loading
              ? "Placing Order..."
              : "Place Your Order"}

          </button>


          <p className="secure-payment">
            🔒 Secure checkout
          </p>

        </div>

      </div>

    </div>
  );
}

export default Checkout;