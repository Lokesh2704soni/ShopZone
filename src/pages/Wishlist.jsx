import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

function Wishlist() {

  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();


  // ===============================
  // EMPTY WISHLIST
  // ===============================

  if (wishlist.length === 0) {

    return (
      <div className="wishlist-page">

        <div className="wishlist-empty">

          <div className="wishlist-empty-icon">
            <Heart size={55} />
          </div>

          <h1>
            Your Wishlist is Empty
          </h1>

          <p>
            Save products you love and
            find them here later.
          </p>

          <Link
            to="/"
            className="wishlist-shop-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }


  return (
    <div className="wishlist-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="wishlist-header">

        <div>

          <h1>
            My Wishlist
          </h1>

          <p>
            {wishlist.length}{" "}
            {wishlist.length === 1
              ? "item"
              : "items"}{" "}
            saved
          </p>

        </div>


        <button
          className="clear-wishlist-btn"
          onClick={clearWishlist}
        >
          <Trash2 size={17} />
          Clear Wishlist
        </button>

      </div>


      {/* =========================
          PRODUCTS
      ========================= */}

      <div className="wishlist-grid">

        {wishlist.map((product) => (

          <div
            className="wishlist-card"
            key={product.productId}
          >

            {/* IMAGE */}

            <Link
              to={`/product/${product.productId}`}
              className="wishlist-image"
            >

              <img
                src={product.image}
                alt={product.title}
              />

            </Link>


            {/* INFO */}

            <div className="wishlist-info">

              <p className="wishlist-category">
                {product.category}
              </p>


              <Link
                to={`/product/${product.productId}`}
                className="wishlist-title"
              >
                {product.title}
              </Link>


              {/* RATING */}

              <div className="wishlist-rating">

                <span>
                  {product.rating}
                </span>

                <span className="wishlist-stars">
                  ★★★★★
                </span>

                <span>
                  ({product.reviews})
                </span>

              </div>


              {/* PRICE */}

              <div className="wishlist-price">

                <strong>
                  ₹
                  {product.price.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                <del>
                  ₹
                  {product.oldPrice.toLocaleString(
                    "en-IN"
                  )}
                </del>

                <span>
                  {product.discount}
                </span>

              </div>


              <p className="wishlist-delivery">
                FREE Delivery Tomorrow
              </p>


              {/* ACTIONS */}

              <div className="wishlist-actions">

                <button
                  className="wishlist-cart-btn"
                  onClick={() =>
                    addToCart({
                      id: product.productId,
                      title: product.title,
                      price: product.price,
                      oldPrice: product.oldPrice,
                      image: product.image,
                      category: product.category,
                      rating: product.rating,
                      reviews: product.reviews,
                      discount: product.discount,
                    })
                  }
                >

                  <ShoppingCart size={17} />

                  Add to Cart

                </button>


                <button
                  className="wishlist-remove-btn"
                  onClick={() =>
                    removeFromWishlist(
                      product.productId
                    )
                  }
                >

                  <Trash2 size={17} />

                  Remove

                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Wishlist;