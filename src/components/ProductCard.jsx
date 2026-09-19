import {
  Star,
  ShoppingCart,
  Heart,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import { Link, useNavigate } from "react-router-dom";

function ProductCard({ product }) {

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const navigate = useNavigate();

  const isWishlisted =
    isInWishlist(product.id);


  // ===============================
  // WISHLIST TOGGLE
  // ===============================

  const handleWishlist = async () => {

    const token =
      localStorage.getItem("shopzoneToken");

    // Login required
    if (!token) {
      navigate("/login");
      return;
    }

    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };


  return (
    <div className="product-card">

      {/* =========================
          PRODUCT IMAGE
      ========================= */}

      <div className="product-image">

        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
          />
        </Link>


        {/* WISHLIST BUTTON */}

        <button
          className={`wishlist-btn ${
            isWishlisted
              ? "wishlist-active"
              : ""
          }`}
          onClick={handleWishlist}
          title={
            isWishlisted
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
        >

          <Heart
            size={21}
            fill={
              isWishlisted
                ? "currentColor"
                : "none"
            }
          />

        </button>

      </div>


      {/* =========================
          PRODUCT INFO
      ========================= */}

      <div className="product-info">

        <p className="product-category">
          {product.category}
        </p>


        <h3 className="product-title">

          <Link
            to={`/product/${product.id}`}
          >
            {product.title}
          </Link>

        </h3>


        {/* RATING */}

        <div className="rating">

          <span className="rating-number">
            {product.rating}
          </span>

          <div className="stars">

            {[1, 2, 3, 4, 5].map(
              (star) => (

                <Star
                  key={star}
                  size={15}
                  fill={
                    star <=
                    Math.round(
                      product.rating
                    )
                      ? "currentColor"
                      : "none"
                  }
                />

              )
            )}

          </div>

          <span className="review-count">
            ({product.reviews})
          </span>

        </div>


        {/* PRICE */}

        <div className="price-container">

          <span className="price">
            ₹
            {product.price.toLocaleString(
              "en-IN"
            )}
          </span>

          <del>
            ₹
            {product.oldPrice.toLocaleString(
              "en-IN"
            )}
          </del>

          <span className="discount">
            {product.discount}
          </span>

        </div>


        {/* DELIVERY */}

        <p className="delivery">
          FREE Delivery Tomorrow
        </p>


        {/* ADD TO CART */}

        <button
          className="add-cart"
          onClick={() =>
            addToCart(product)
          }
        >

          <ShoppingCart size={17} />

          Add to Cart

        </button>

      </div>

    </div>
  );
}

export default ProductCard;