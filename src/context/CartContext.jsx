import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

const API_URL = "https://shopzone-wn90.onrender.com";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get token
  const getToken = () => {
    return localStorage.getItem("shopzoneToken");
  };


  // Load cart from MongoDB
  const loadCart = async () => {
    const token = getToken();

    if (!token) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/cart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setCart(
        data.cart?.items?.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })) || []
      );
    } catch (error) {
      console.error(
        "Load cart error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // Load cart when application starts
  useEffect(() => {
    loadCart();
  }, []);


  // Add product
  const addToCart = async (product) => {
    const token = getToken();

    // User must login for database cart
    if (!token) {
      alert(
        "Please login first to add products to your cart."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart/add`,
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
            image: product.image,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to add product"
        );
        return;
      }

      setCart(
        data.cart.items.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      alert(
        "Unable to connect to server."
      );
    }
  };


  // Remove product
  const removeFromCart = async (id) => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to remove product"
        );
        return;
      }

      setCart(
        data.cart.items.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      console.error(
        "Remove cart error:",
        error
      );
    }
  };


  // Increase quantity
  const increaseQuantity = async (id) => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart/increase/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to increase quantity"
        );
        return;
      }

      setCart(
        data.cart.items.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        }))
      );
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );
    }
  };


  // Decrease quantity
  const decreaseQuantity = async (id) => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart/decrease/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to decrease quantity"
        );
        return;
      }

      setCart(
        data.cart?.items?.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })) || []
      );
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );
    }
  };


  // Clear cart
  const clearCart = async () => {
    const token = getToken();

    if (!token) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/cart/clear`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message);
        return;
      }

      setCart([]);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );

      setCart([]);
    }
  };


  // Total quantity
  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  // Total price
  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  return useContext(CartContext);
}