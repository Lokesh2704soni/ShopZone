import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext();

const API_URL =
  "https://shopzone-wn90.onrender.com";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // GET WISHLIST
  // ===============================

  const fetchWishlist = async () => {
    const token =
      localStorage.getItem("shopzoneToken");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/wishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setWishlist(data.wishlist || []);
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error(
        "Fetch wishlist error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // ===============================
  // ADD TO WISHLIST
  // ===============================

  const addToWishlist = async (product) => {
    const token =
      localStorage.getItem("shopzoneToken");

    if (!token) {
      return {
        success: false,
        message: "Please login first",
      };
    }

    try {
      const response = await fetch(
        `${API_URL}/api/wishlist/add`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            productId: product.id,
            title: product.title,
            price: product.price,
            oldPrice: product.oldPrice,
            image: product.image,
            category: product.category,
            rating: product.rating,
            reviews: product.reviews,
            discount: product.discount,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setWishlist(data.wishlist || []);

        return {
          success: true,
          message: data.message,
        };
      }

      return {
        success: false,
        message:
          data.message ||
          "Unable to add to wishlist",
      };
    } catch (error) {
      console.error(
        "Add wishlist error:",
        error
      );

      return {
        success: false,
        message: "Something went wrong",
      };
    }
  };


  // ===============================
  // REMOVE FROM WISHLIST
  // ===============================

  const removeFromWishlist = async (
    productId
  ) => {
    const token =
      localStorage.getItem("shopzoneToken");

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/wishlist/remove/${productId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setWishlist(data.wishlist || []);
      }
    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );
    }
  };


  // ===============================
  // CLEAR WISHLIST
  // ===============================

  const clearWishlist = async () => {
    const token =
      localStorage.getItem("shopzoneToken");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/wishlist/clear`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setWishlist([]);
      }
    } catch (error) {
      console.error(
        "Clear wishlist error:",
        error
      );
    }
  };


  // ===============================
  // CHECK PRODUCT
  // ===============================

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) =>
        item.productId === Number(productId)
    );
  };


  // ===============================
  // WISHLIST COUNT
  // ===============================

  const wishlistCount =
    wishlist.length;


  // ===============================
  // LOAD WHEN LOGIN EXISTS
  // ===============================

  useEffect(() => {
    fetchWishlist();
  }, []);


  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        loading,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}


// ===============================
// CUSTOM HOOK
// ===============================

export function useWishlist() {
  return useContext(WishlistContext);
}