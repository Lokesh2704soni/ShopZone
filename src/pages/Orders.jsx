import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const token = localStorage.getItem("shopzoneToken");

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://shopzone-wn90.onrender.com/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to load orders");
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch orders error:", error);
      alert("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancellingId(orderId);

      const response = await fetch(
        `https://shopzone-wn90.onrender.com/api/orders/cancel/${orderId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to cancel order");
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.orderId === orderId
            ? {
                ...order,
                status: "Cancelled",
              }
            : order
        )
      );

      alert("Order cancelled successfully.");
    } catch (error) {
      console.error("Cancel order error:", error);
      alert("Unable to connect to server.");
    } finally {
      setCancellingId(null);
    }
  };

  if (!token) {
    return (
      <div className="empty-cart">
        <h1>Please Sign In</h1>

        <p>
          Sign in to view your orders.
        </p>

        <button
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="empty-cart">
        <h1>Loading Orders...</h1>
        <p>Please wait.</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-cart">
        <h1>No Orders Yet</h1>

        <p>
          You haven't placed any orders yet.
        </p>

        <Link to="/">
          <button>Start Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>

      <p className="orders-count">
        {orders.length}{" "}
        {orders.length === 1
          ? "order"
          : "orders"}
      </p>

      <div className="orders-list">
        {orders.map((order) => (
          <div
            className="order-card"
            key={order._id}
          >
            {/* ORDER HEADER */}
            <div className="order-header">
              <div>
                <span>ORDER PLACED</span>

                <strong>
                  {new Date(
                    order.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </strong>
              </div>

              <div>
                <span>ORDER ID</span>

                <strong>
                  {order.orderId}
                </strong>
              </div>

              <div>
                <span>TOTAL</span>

                <strong>
                  ₹
                  {order.total.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>

            {/* STATUS */}
            <div className="order-status">
              <span
                className={`status-badge ${
                  order.status === "Cancelled"
                    ? "cancelled"
                    : ""
                }`}
              >
                {order.status === "Cancelled"
                  ? "✕ Cancelled"
                  : "✓ Ordered"}
              </span>

              <span>
                Payment:{" "}
                {order.paymentMethod}
              </span>
            </div>

            {/* ITEMS */}
            <div className="order-items">
              {order.items.map((item) => (
                <div
                  className="order-item"
                  key={item.productId}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <div className="order-item-info">
                    <h3>
                      {item.title}
                    </h3>

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

            {/* ADDRESS */}
            <div className="order-address">
              <strong>
                Delivery Address
              </strong>

              <p>
                {order.address}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="order-actions">
              {order.status !==
                "Cancelled" && (
                <button
                  className="cancel-order-btn"
                  onClick={() =>
                    handleCancelOrder(
                      order.orderId
                    )
                  }
                  disabled={
                    cancellingId ===
                    order.orderId
                  }
                >
                  {cancellingId ===
                  order.orderId
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}

              {order.status ===
                "Cancelled" && (
                <span className="cancelled-message">
                  This order has been cancelled.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;