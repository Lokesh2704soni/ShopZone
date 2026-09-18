import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  const deliveryCharge =
    cartTotal >= 499 ? 0 : 40;

  const finalTotal =
    cartTotal + deliveryCharge;


  /* EMPTY CART */

  if (cart.length === 0) {
    return (
      <div className="empty-cart">

        <h1>
          Your Shopping Cart is Empty
        </h1>

        <p>
          Add some products to your cart
          and they will appear here.
        </p>

        <Link to="/">
          <button>
            Continue Shopping
          </button>
        </Link>

      </div>
    );
  }


  /* CART */

  return (
    <div className="cart-page">

      <h1>
        Shopping Cart
      </h1>


      <div className="cart-layout">

        {/* CART ITEMS */}

        <div className="cart-items">

          {cart.map((item) => (

            <div
              className="cart-item"
              key={item.id}
            >

              <img
                src={item.image}
                alt={item.title}
              />


              <div className="cart-item-info">

                <h3>
                  {item.title}
                </h3>

                <p className="cart-price">
                  ₹
                  {item.price.toLocaleString(
                    "en-IN"
                  )}
                </p>


                {/* QUANTITY */}

                <div className="quantity">

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


                {/* REMOVE */}

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(
                      item.id
                    )
                  }
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>


        {/* SUMMARY */}

        <div className="cart-summary">

          <p>
            Subtotal
          </p>

          <h2>
            ₹
            {cartTotal.toLocaleString(
              "en-IN"
            )}
          </h2>


          <p className="free-delivery">

            {deliveryCharge === 0
              ? "✓ Your order qualifies for FREE Delivery"
              : `Delivery charge: ₹${deliveryCharge}`}

          </p>


          <hr />


          <div className="cart-final-total">

            <strong>
              Order Total
            </strong>

            <strong>
              ₹
              {finalTotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/checkout")
            }
          >
            Proceed to Buy
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;