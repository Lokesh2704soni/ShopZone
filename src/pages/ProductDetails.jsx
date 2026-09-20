import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Heart,
  Send,
  Trash2,
  ImagePlus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

const API_URL =
  "https://shopzone-wn90.onrender.com";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] =
    useState(true);

  const [selectedRating, setSelectedRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [submittingReview, setSubmittingReview] =
    useState(false);

  // REVIEW IMAGES
  const [selectedImages, setSelectedImages] =
    useState([]);

  // FULL SCREEN GALLERY
  const [fullImageIndex, setFullImageIndex] =
    useState(null);

  const [fullImages, setFullImages] =
    useState([]);

  const touchStartX = useRef(null);

  const product = products.find(
    (item) => item.id === Number(id)
  );

  // ===============================
  // FETCH REVIEWS
  // ===============================

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);

      const response = await fetch(
        `${API_URL}/api/reviews/${id}`
      );

      const data = await response.json();

      if (
        response.ok &&
        data.success
      ) {
        setReviews(
          data.reviews || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch reviews error:",
        error
      );
    } finally {
      setReviewLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // ===============================
  // FULL SCREEN GALLERY KEYBOARD
  // ===============================

  useEffect(() => {
    if (fullImageIndex === null) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFullImageIndex(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setFullImageIndex((prev) => {
          if (fullImages.length === 0) {
            return null;
          }

          return prev === fullImages.length - 1
            ? 0
            : prev + 1;
        });
      }

      if (event.key === "ArrowLeft") {
        setFullImageIndex((prev) => {
          if (fullImages.length === 0) {
            return null;
          }

          return prev === 0
            ? fullImages.length - 1
            : prev - 1;
        });
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    const oldOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        oldOverflow;
    };
  }, [
    fullImageIndex,
    fullImages.length,
  ]);

  // ===============================
  // PRODUCT NOT FOUND
  // ===============================

  if (!product) {
    return (
      <div className="not-found">
        <h1>
          Product Not Found
        </h1>

        <Link to="/">
          Go back to Home
        </Link>
      </div>
    );
  }

  // ===============================
  // WISHLIST
  // ===============================

  const wishlisted =
    isInWishlist(product.id);

  const handleWishlist =
    async () => {
      const token =
        localStorage.getItem(
          "shopzoneToken"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      if (wishlisted) {
        await removeFromWishlist(
          product.id
        );
      } else {
        await addToWishlist(
          product
        );
      }
    };

  // ===============================
  // SELECT REVIEW IMAGES
  // ===============================

  const handleImageSelect =
    (e) => {
      const files =
        Array.from(
          e.target.files || []
        );

      if (files.length === 0) {
        return;
      }

      if (
        selectedImages.length +
          files.length >
        5
      ) {
        alert(
          "You can upload maximum 5 photos."
        );

        return;
      }

      const validFiles =
        files.filter((file) => {
          if (
            !file.type.startsWith(
              "image/"
            )
          ) {
            alert(
              `${file.name} is not an image.`
            );

            return false;
          }

          if (
            file.size >
            5 * 1024 * 1024
          ) {
            alert(
              `${file.name} is larger than 5MB.`
            );

            return false;
          }

          return true;
        });

      const newImages =
        validFiles.map(
          (file) => ({
            file,
            preview:
              URL.createObjectURL(
                file
              ),
          })
        );

      setSelectedImages(
        (prev) => [
          ...prev,
          ...newImages,
        ]
      );

      e.target.value = "";
    };

  // ===============================
  // REMOVE SELECTED IMAGE
  // ===============================

  const removeSelectedImage =
    (index) => {
      setSelectedImages(
        (prev) =>
          prev.filter(
            (_, i) =>
              i !== index
          )
      );
    };

  // ===============================
  // UPLOAD IMAGE TO CLOUDINARY
  // ===============================

  const uploadImages =
    async () => {
      const cloudName =
        import.meta.env
          .VITE_CLOUDINARY_CLOUD_NAME;

      const uploadPreset =
        import.meta.env
          .VITE_CLOUDINARY_UPLOAD_PRESET;

      if (
        !cloudName ||
        !uploadPreset
      ) {
        throw new Error(
          "Cloudinary is not configured. Please add Cloudinary settings in .env"
        );
      }

      const uploadedUrls = [];

      for (
        const image of selectedImages
      ) {
        const formData =
          new FormData();

        formData.append(
          "file",
          image.file
        );

        formData.append(
          "upload_preset",
          uploadPreset
        );

        formData.append(
          "folder",
          "shopzone_reviews"
        );

        const response =
          await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.secure_url
        ) {
          throw new Error(
            data.error?.message ||
              "Image upload failed"
          );
        }

        uploadedUrls.push(
          data.secure_url
        );
      }

      return uploadedUrls;
    };

  // ===============================
  // ADD REVIEW
  // ===============================

  const handleSubmitReview =
    async (e) => {
      e.preventDefault();

      const token =
        localStorage.getItem(
          "shopzoneToken"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      if (!comment.trim()) {
        alert(
          "Please write a review."
        );

        return;
      }

      try {
        setSubmittingReview(true);

        let imageUrls = [];

        if (
          selectedImages.length >
          0
        ) {
          imageUrls =
            await uploadImages();
        }

        const response =
          await fetch(
            `${API_URL}/api/reviews`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                productId:
                  product.id,

                rating:
                  selectedRating,

                comment:
                  comment.trim(),

                images:
                  imageUrls,
              }),
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {
          setReviews(
            (prev) => [
              data.review,
              ...prev,
            ]
          );

          setComment("");
          setSelectedRating(5);
          setSelectedImages([]);

          alert(
            "Review added successfully!"
          );
        } else {
          alert(
            data.message ||
              "Unable to add review."
          );
        }
      } catch (error) {
        console.error(
          "Submit review error:",
          error
        );

        alert(
          error.message ||
            "Something went wrong while submitting review."
        );
      } finally {
        setSubmittingReview(false);
      }
    };

  // ===============================
  // DELETE REVIEW
  // ===============================

  const handleDeleteReview =
    async (reviewId) => {
      const token =
        localStorage.getItem(
          "shopzoneToken"
        );

      if (!token) {
        return;
      }

      const confirmDelete =
        window.confirm(
          "Delete this review?"
        );

      if (!confirmDelete) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/api/reviews/${reviewId}`,
            {
              method: "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {
          setReviews(
            (prev) =>
              prev.filter(
                (review) =>
                  review._id !==
                  reviewId
              )
          );
        } else {
          alert(
            data.message ||
              "Unable to delete review."
          );
        }
      } catch (error) {
        console.error(
          "Delete review error:",
          error
        );

        alert(
          error.message ||
            "Something went wrong."
        );
      }
    };

  // ===============================
  // OPEN FULL SCREEN GALLERY
  // ===============================

  const openGallery =
    (images, index) => {
      if (
        !images ||
        images.length === 0
      ) {
        return;
      }

      setFullImages(images);
      setFullImageIndex(index);
    };

  // ===============================
  // CLOSE GALLERY
  // ===============================

  const closeGallery = () => {
    setFullImageIndex(null);
  };

  // ===============================
  // NEXT IMAGE
  // ===============================

  const showNextImage = () => {
    if (
      fullImages.length === 0
    ) {
      return;
    }

    setFullImageIndex(
      (prev) =>
        prev ===
        fullImages.length - 1
          ? 0
          : prev + 1
    );
  };

  // ===============================
  // PREVIOUS IMAGE
  // ===============================

  const showPreviousImage = () => {
    if (
      fullImages.length === 0
    ) {
      return;
    }

    setFullImageIndex(
      (prev) =>
        prev === 0
          ? fullImages.length - 1
          : prev - 1
    );
  };

  // ===============================
  // MOBILE SWIPE START
  // ===============================

  const handleTouchStart =
    (e) => {
      touchStartX.current =
        e.touches[0].clientX;
    };

  // ===============================
  // MOBILE SWIPE END
  // ===============================

  const handleTouchEnd =
    (e) => {
      if (
        touchStartX.current ===
        null
      ) {
        return;
      }

      const touchEndX =
        e.changedTouches[0]
          .clientX;

      const difference =
        touchStartX.current -
        touchEndX;

      const swipeThreshold = 50;

      if (
        Math.abs(difference) >
        swipeThreshold
      ) {
        if (difference > 0) {
          // Swipe left = next
          showNextImage();
        } else {
          // Swipe right = previous
          showPreviousImage();
        }
      }

      touchStartX.current = null;
    };

  return (
    <div className="product-details-page">

      {/* BACK */}

      <Link
        to="/"
        className="back-link"
      >
        <ArrowLeft size={18} />

        Back to Shopping
      </Link>

      {/* PRODUCT */}

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

          {/* RATING */}

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

            <span className="reviews">
              {product.reviews} ratings
            </span>

          </div>

          <hr />

          {/* PRICE */}

          <div className="details-price">

            <span className="big-price">
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

            <h3>
              About this item
            </h3>

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
              <ShoppingCart
                size={19}
              />

              Add to Cart
            </button>

            <button
              className="buy-now"
              onClick={() => {
                addToCart(product);

                navigate(
                  "/checkout"
                );
              }}
            >
              Buy Now
            </button>

            <button
              className={`details-wishlist ${
                wishlisted
                  ? "details-wishlist-active"
                  : ""
              }`}
              onClick={
                handleWishlist
              }
            >
              <Heart
                size={19}
                fill={
                  wishlisted
                    ? "currentColor"
                    : "none"
                }
              />

              {wishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>

          </div>

        </div>

      </div>

      {/* REVIEWS */}

      <section className="reviews-section">

        <div className="reviews-header">

          <h2>
            Customer Reviews
          </h2>

          <span>
            {reviews.length}{" "}
            {reviews.length === 1
              ? "Review"
              : "Reviews"}
          </span>

        </div>

        {/* ADD REVIEW */}

        <div className="review-form-card">

          <h3>
            Write a Review
          </h3>

          <p>
            Share your experience with
            this product.
          </p>

          {/* STAR SELECTOR */}

          <div className="review-rating-selector">

            <span>
              Your Rating:
            </span>

            <div>

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <button
                    key={star}
                    type="button"
                    className={
                      star <=
                      selectedRating
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSelectedRating(
                        star
                      )
                    }
                  >
                    <Star
                      size={25}
                      fill={
                        star <=
                        selectedRating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                )
              )}

            </div>

          </div>

          <form
            onSubmit={
              handleSubmitReview
            }
          >

            {/* COMMENT */}

            <textarea
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              placeholder="Write your review..."
              maxLength={500}
              rows={4}
            />

            {/* PHOTO UPLOAD */}

            <div className="review-image-upload">

              <label
                htmlFor="review-images"
                className="review-image-button"
              >
                <ImagePlus
                  size={18}
                />

                Add Photos
              </label>

              <input
                id="review-images"
                type="file"
                accept="image/*"
                multiple
                onChange={
                  handleImageSelect
                }
                hidden
              />

              <span>
                Maximum 5 photos
              </span>

            </div>

            {/* IMAGE PREVIEW */}

            {selectedImages.length >
              0 && (
                <div className="review-image-preview">

                  {selectedImages.map(
                    (image, index) => (
                      <div
                        className="review-preview-item"
                        key={index}
                      >

                        <img
                          src={
                            image.preview
                          }
                          alt={`Review ${
                            index + 1
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeSelectedImage(
                              index
                            )
                          }
                        >
                          <X
                            size={16}
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

            <div className="review-form-footer">

              <small>
                {comment.length}/500
              </small>

              <button
                type="submit"
                disabled={
                  submittingReview
                }
              >
                <Send size={17} />

                {submittingReview
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </div>

          </form>

        </div>

        {/* REVIEWS LIST */}

        <div className="reviews-list">

          {reviewLoading ? (

            <div className="reviews-loading">
              Loading reviews...
            </div>

          ) : reviews.length === 0 ? (

            <div className="no-reviews">

              <Heart size={35} />

              <h3>
                No reviews yet
              </h3>

              <p>
                Be the first customer to
                review this product.
              </p>

            </div>

          ) : (

            reviews.map(
              (review) => (

                <div
                  className="review-card"
                  key={review._id}
                >

                  <div className="review-card-header">

                    <div className="review-user">

                      <div className="review-avatar">

                        {review.userName
                          ?.charAt(0)
                          .toUpperCase()}

                      </div>

                      <div>

                        <strong>
                          {review.userName}
                        </strong>

                        <small>
                          Verified Customer
                        </small>

                      </div>

                    </div>

                    <div className="review-stars">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={16}
                            fill={
                              star <=
                              review.rating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        )
                      )}

                    </div>

                  </div>

                  <p className="review-comment">
                    {review.comment}
                  </p>

                  {/* REVIEW PHOTOS */}

                  {review.images &&
                    review.images.length >
                      0 && (

                      <div className="review-images">

                        {review.images.map(
                          (
                            image,
                            index
                          ) => (

                            <img
                              key={index}
                              src={image}
                              alt={`Review photo ${
                                index + 1
                              }`}
                              onClick={() =>
                                openGallery(
                                  review.images,
                                  index
                                )
                              }
                              style={{
                                cursor:
                                  "pointer",
                              }}
                            />

                          )
                        )}

                      </div>

                    )}

                  <div className="review-card-footer">

                    <small>
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </small>

                    {(() => {

                      const user =
                        JSON.parse(
                          localStorage.getItem(
                            "shopzoneUser"
                          ) ||
                            "null"
                        );

                      if (
                        user &&
                        String(
                          review.userId
                        ) ===
                          String(
                            user.id
                          )
                      ) {

                        return (
                          <button
                            className="delete-review-btn"
                            onClick={() =>
                              handleDeleteReview(
                                review._id
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />

                            Delete
                          </button>
                        );

                      }

                      return null;

                    })()}

                  </div>

                </div>

              )
            )

          )}

        </div>

      </section>

      {/* =====================================
          FULL SCREEN REVIEW IMAGE GALLERY
          ===================================== */}

      {fullImageIndex !== null &&
        fullImages.length > 0 && (

          <div
            onClick={closeGallery}
            onTouchStart={
              handleTouchStart
            }
            onTouchEnd={
              handleTouchEnd
            }
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999999,
              background:
                "rgba(0, 0, 0, 0.96)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "pan-y",
            }}
          >

            {/* TOP BAR */}

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "70px",
                display: "flex",
                alignItems: "center",
                justifyContent:
                  "space-between",
                padding:
                  "0 22px",
                zIndex: 5,
              }}
            >

              {/* COUNTER */}

              <div
                style={{
                  color: "#fff",
                  fontSize:
                    "16px",
                  fontWeight: 600,
                  background:
                    "rgba(0,0,0,0.5)",
                  padding:
                    "8px 14px",
                  borderRadius:
                    "20px",
                }}
              >
                {fullImageIndex + 1}
                {" / "}
                {fullImages.length}
              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeGallery();
                }}
                aria-label="Close gallery"
                style={{
                  width: "46px",
                  height: "46px",
                  border: "none",
                  borderRadius:
                    "50%",
                  background:
                    "rgba(255,255,255,0.12)",
                  color: "#fff",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  cursor: "pointer",
                }}
              >
                <X size={28} />
              </button>

            </div>

            {/* PREVIOUS BUTTON */}

            {fullImages.length >
              1 && (

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPreviousImage();
                }}
                aria-label="Previous image"
                style={{
                  position:
                    "absolute",
                  left:
                    "20px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  width: "52px",
                  height: "52px",
                  border: "none",
                  borderRadius:
                    "50%",
                  background:
                    "rgba(255,255,255,0.15)",
                  color: "#fff",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  cursor:
                    "pointer",
                  zIndex: 5,
                }}
              >
                <ChevronLeft
                  size={34}
                />
              </button>

            )}

            {/* IMAGE */}

            <img
              src={
                fullImages[
                  fullImageIndex
                ]
              }
              alt={`Review photo ${
                fullImageIndex + 1
              }`}
              onClick={(e) =>
                e.stopPropagation()
              }
              draggable={false}
              style={{
                maxWidth:
                  "calc(100vw - 140px)",
                maxHeight:
                  "calc(100vh - 120px)",
                width: "auto",
                height: "auto",
                objectFit:
                  "contain",
                userSelect:
                  "none",
                WebkitUserSelect:
                  "none",
                borderRadius:
                  "4px",
                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.5)",
              }}
            />

            {/* NEXT BUTTON */}

            {fullImages.length >
              1 && (

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNextImage();
                }}
                aria-label="Next image"
                style={{
                  position:
                    "absolute",
                  right:
                    "20px",
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                  width: "52px",
                  height: "52px",
                  border: "none",
                  borderRadius:
                    "50%",
                  background:
                    "rgba(255,255,255,0.15)",
                  color: "#fff",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  cursor:
                    "pointer",
                  zIndex: 5,
                }}
              >
                <ChevronRight
                  size={34}
                />
              </button>

            )}

            {/* BOTTOM HINT */}

            <div
              style={{
                position:
                  "absolute",
                bottom:
                  "20px",
                left: "50%",
                transform:
                  "translateX(-50%)",
                color:
                  "rgba(255,255,255,0.7)",
                fontSize:
                  "13px",
                textAlign:
                  "center",
                pointerEvents:
                  "none",
              }}
            >
              <span
                style={{
                  display:
                    "block",
                }}
              >
                ← → Navigate
                &nbsp;&nbsp; • &nbsp;&nbsp;
                Esc Close
              </span>

              <span
                style={{
                  display:
                    "none",
                }}
              >
                Swipe left/right
              </span>
            </div>

          </div>

        )}

    </div>
  );
}

export default ProductDetails;