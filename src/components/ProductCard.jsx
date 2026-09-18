import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function ProductCard({ product }) {

    const { addToCart } = useCart();

    return (
        <div className="product-card">

            <div className="product-image">

                <Link to={`/product/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.title}
                    />
                </Link>

            </div>


            <div className="product-info">

                <p className="product-category">
                    {product.category}
                </p>


                <h3 className="product-title">

                    <Link to={`/product/${product.id}`}>
                        {product.title}
                    </Link>

                </h3>


                <div className="rating">

                    <span className="rating-number">
                        {product.rating}
                    </span>

                    <div className="stars">

                        {[1, 2, 3, 4, 5].map((star) => (

                            <Star
                                key={star}
                                size={15}
                                fill={
                                    star <= Math.round(product.rating)
                                        ? "currentColor"
                                        : "none"
                                }
                            />

                        ))}

                    </div>

                    <span className="review-count">
                        ({product.reviews})
                    </span>

                </div>


                <div className="price-container">

                    <span className="price">
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    <del>
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                    </del>

                    <span className="discount">
                        {product.discount}
                    </span>

                </div>


                <p className="delivery">
                    FREE Delivery Tomorrow
                </p>


                <button
                    className="add-cart"
                    onClick={() => addToCart(product)}
                >

                    <ShoppingCart size={17} />

                    Add to Cart

                </button>

            </div>

        </div>
    );
}

export default ProductCard;