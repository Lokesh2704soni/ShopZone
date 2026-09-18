import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";

import { products } from "../data/products";
import { useCart } from "../context/CartContext";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );


  if (!product) {

    return (
      <div className="not-found">

        <h1>Product Not Found</h1>

        <Link to="/">
          Go back to Home
        </Link>

      </div>
    );

  }


  return (
    <div className="product-details-page">

      {/* Back */}

      <Link to="/" className="back-link">

        <ArrowLeft size={18} />

        Back to Shopping

      </Link>


      <div className="product-details">

        {/* IMAGE */}

        <div className="details-image">

          <img
            src={product.image}
            alt={product.title}
          />

        </div>


        {/* INFORMATION */}

        <div className="details-info">

          <p className="details-category">
            {product.category}
          </p>


          <h1>
            {product.title}
          </h1>


          {/* Rating */}

          <div className="details-rating">

            <span>
              {product.rating}
            </span>

            <div className="stars">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <Star
                    key={star}
                    size={18}
                    fill={
                      star <= Math.round(
                        product.rating
                      )
                        ? "currentColor"
                        : "none"
                    }
                  />

                )
              )}

            </div>

            <span className="reviews">
              {product.reviews} ratings
            </span>

          </div>


          <hr />


          {/* PRICE */}

          <div className="details-price">

            <span className="big-price">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            <del>
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </del>

            <span className="details-discount">
              {product.discount}
            </span>

          </div>


          <p className="tax">
            Inclusive of all taxes
          </p>


          {/* DELIVERY */}

          <div className="delivery-box">

            <strong>
              FREE Delivery
            </strong>

            <p>
              Tomorrow
            </p>

            <p>
              Deliver to Jaipur 302001
            </p>

          </div>


          {/* DESCRIPTION */}

          <div className="description">

            <h3>About this item</h3>

            <ul>

              <li>
                Premium quality product
              </li>

              <li>
                Designed for everyday use
              </li>

              <li>
                Fast and reliable delivery
              </li>

              <li>
                Easy returns and replacement
              </li>

            </ul>

          </div>


          {/* ACTIONS */}

          <div className="details-actions">

            <button
              className="details-cart"
              onClick={() =>
                addToCart(product)
              }
            >

              <ShoppingCart size={19} />

              Add to Cart

            </button>


            <button
  className="buy-now"
  onClick={() => {
    addToCart(product);
    navigate("/checkout");
  }}
>
  Buy Now
</button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;