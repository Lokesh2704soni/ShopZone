import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const [returnOrder, setReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returning, setReturning] = useState(false);

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

  // ================================
  // CANCEL ORDER
  // ================================

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

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

  // ================================
  // OPEN RETURN POPUP
  // ================================

  const openReturnPopup = (order) => {
    setReturnOrder(order);
    setReturnReason("");
  };

  // ================================
  // CLOSE RETURN POPUP
  // ================================

  const closeReturnPopup = () => {
    if (returning) return;

    setReturnOrder(null);
    setReturnReason("");
  };

  // ================================
  // REQUEST RETURN
  // ================================

  const handleReturnOrder = async () => {
    if (!returnOrder) return;

    if (!returnReason) {
      alert("Please select a return reason.");
      return;
    }

    try {
      setReturning(true);

      const response = await fetch(
        `https://shopzone-wn90.onrender.com/api/orders/return/${returnOrder.orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reason: returnReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Unable to request return"
        );
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.orderId === returnOrder.orderId
            ? {
              ...order,
              returnStatus: "Return Requested",
              returnReason,
            }
            : order
        )
      );

      setReturnOrder(null);
      setReturnReason("");

      alert(
        "Return request submitted successfully! 🎉"
      );
    } catch (error) {
      console.error(
        "Return order error:",
        error
      );

      alert(
        "Unable to connect to server."
      );
    } finally {
      setReturning(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const response = await fetch(
        `https://shopzone-wn90.onrender.com/api/orders/deliver/${orderId}`,
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
          "Unable to update order"
        );
        return;
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.orderId === orderId
            ? {
              ...order,
              status: "Delivered",
            }
            : order
        )
      );

      alert("Order marked as delivered! 🎉");
    } catch (error) {
      console.error(
        "Mark delivered error:",
        error
      );

      alert(
        "Unable to connect to server."
      );
    }
  };

  // ================================
  // LOGIN
  // ================================

  if (!token) {
    return (
      <div className="orders-auth-page">
        <div className="orders-empty-card">
          <div className="orders-empty-icon">
            🔐
          </div>

          <h1>
            Sign in to see your orders
          </h1>

          <p>
            Your orders, purchases and delivery
            information will appear here.
          </p>

          <button
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>

        <h2>
          Loading your orders...
        </h2>

        <p>
          Just a moment.
        </p>
      </div>
    );
  }

  // ================================
  // MAIN PAGE
  // ================================

  return (
    <>
      <div className="orders-page-modern">

        {/* HEADER */}

        <div className="orders-hero">

          <div>
            <span className="orders-label">
              SHOPZONE
            </span>

            <h1>
              My Orders
            </h1>

            <p>
              Track and manage your ShopZone
              purchases.
            </p>
          </div>

          <Link
            to="/"
            className="continue-shopping"
          >
            Continue Shopping →
          </Link>

        </div>

        {/* STATS */}

        <div className="orders-stats">

          <div className="order-stat">
            <span className="stat-icon">
              📦
            </span>

            <div>
              <strong>
                {orders.length}
              </strong>

              <small>
                Total Orders
              </small>
            </div>
          </div>

          <div className="order-stat">
            <span className="stat-icon">
              🚚
            </span>

            <div>
              <strong>
                {
                  orders.filter(
                    (order) =>
                      order.status !==
                      "Cancelled"
                  ).length
                }
              </strong>

              <small>
                Active Orders
              </small>
            </div>
          </div>

          <div className="order-stat">
            <span className="stat-icon">
              ↩
            </span>

            <div>
              <strong>
                {
                  orders.filter(
                    (order) =>
                      order.returnStatus &&
                      order.returnStatus !==
                      "Not Requested"
                  ).length
                }
              </strong>

              <small>
                Returns
              </small>
            </div>
          </div>

        </div>

        {/* ORDERS */}

        {orders.length === 0 ? (
          <div className="orders-filter-empty">

            <div>📦</div>

            <h2>
              No orders yet
            </h2>

            <p>
              Start shopping to see your
              orders here.
            </p>

            <Link
              to="/"
              className="continue-shopping"
            >
              Start Shopping →
            </Link>

          </div>
        ) : (
          <div className="modern-orders-list">

            {orders.map((order) => {

              const isCancelled =
                order.status ===
                "Cancelled";

              const isDelivered =
                order.status ===
                "Delivered";

              const hasReturn =
                order.returnStatus &&
                order.returnStatus !==
                "Not Requested";

              return (
                <div
                  className={`modern-order-card ${isCancelled
                      ? "order-cancelled"
                      : ""
                    }`}
                  key={order._id}
                >

                  {/* ORDER HEADER */}

                  <div className="modern-order-header">

                    <div>
                      <span>
                        ORDER ID
                      </span>

                      <strong>
                        {order.orderId}
                      </strong>
                    </div>

                    <div>
                      <span>
                        ORDER DATE
                      </span>

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
                      <span>
                        TOTAL
                      </span>

                      <strong>
                        ₹
                        {order.total.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    <span
                      className={`modern-status ${isCancelled
                          ? "status-cancelled"
                          : isDelivered
                            ? "status-delivered"
                            : "status-ordered"
                        }`}
                    >
                      {isCancelled
                        ? "✕ Cancelled"
                        : isDelivered
                          ? "✓ Delivered"
                          : "✓ Ordered"}
                    </span>

                  </div>

                  {/* PRODUCTS */}

                  <div className="modern-order-items">

                    {order.items.map(
                      (item) => (
                        <div
                          className="modern-order-item"
                          key={
                            item.productId
                          }
                        >

                          <div className="order-image-box">
                            <img
                              src={item.image}
                              alt={item.title}
                            />
                          </div>

                          <div className="modern-item-info">

                            <h3>
                              {item.title}
                            </h3>

                            <p>
                              Quantity:{" "}
                              <strong>
                                {item.quantity}
                              </strong>
                            </p>

                            <strong className="item-price">
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
                      )
                    )}

                  </div>

                  {/* STATUS */}

                  {!isCancelled && (
                    <div className="order-timeline">

                      <div className="timeline-step active">
                        <span>✓</span>
                        <small>
                          Ordered
                        </small>
                      </div>

                      <div className="timeline-line"></div>

                      <div
                        className={`timeline-step ${isDelivered
                            ? "active"
                            : ""
                          }`}
                      >
                        <span>
                          {isDelivered
                            ? "✓"
                            : "2"}
                        </span>

                        <small>
                          Delivered
                        </small>
                      </div>

                    </div>
                  )}

                  {/* RETURN STATUS */}

                  {hasReturn && (
                    <div className="return-status-box">

                      <div className="return-status-icon">
                        ↩
                      </div>

                      <div>
                        <span>
                          RETURN STATUS
                        </span>

                        <strong>
                          {order.returnStatus}
                        </strong>

                        {order.returnReason && (
                          <p>
                            Reason:{" "}
                            {order.returnReason}
                          </p>
                        )}
                      </div>

                    </div>
                  )}

                  {/* ADDRESS */}

                  <div className="modern-address">

                    <div className="address-icon">
                      📍
                    </div>

                    <div>
                      <span>
                        DELIVERY ADDRESS
                      </span>

                      <p>
                        {order.address}
                      </p>
                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="modern-order-footer">

                    <div>
                      <span>
                        PAYMENT
                      </span>

                      <strong>
                        {order.paymentMethod}
                      </strong>
                    </div>

                    <div className="order-action-buttons">

                      {!isCancelled && !isDelivered && (
                        <button
                          className="modern-deliver-btn"
                          onClick={() =>
                            handleMarkDelivered(order.orderId)
                          }
                        >
                          ✓ Mark as Delivered
                        </button>
                      )}

                      {/* CANCEL */}

                      {!isCancelled &&
                        !isDelivered && (
                          <button
                            className="modern-cancel-btn"
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

                      {/* RETURN */}

                      {isDelivered &&
                        !hasReturn && (
                          <button
                            className="modern-return-btn"
                            onClick={() =>
                              openReturnPopup(
                                order
                              )
                            }
                          >
                            ↩ Return Order
                          </button>
                        )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* =========================================
          RETURN POPUP
          ========================================= */}

      {returnOrder && (
        <div
          className="return-modal-overlay"
          onClick={closeReturnPopup}
        >

          <div
            className="return-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="return-modal-close"
              onClick={closeReturnPopup}
              disabled={returning}
            >
              ×
            </button>

            <div className="return-modal-icon">
              ↩
            </div>

            <h2>
              Return your order
            </h2>

            <p className="return-modal-description">
              Tell us why you want to return
              this order.
            </p>

            <div className="return-product">

              <div className="return-product-image">
                <img
                  src={
                    returnOrder.items[0]?.image
                  }
                  alt={
                    returnOrder.items[0]?.title
                  }
                />
              </div>

              <div>
                <strong>
                  {returnOrder.items[0]?.title}
                </strong>

                <span>
                  Order #{returnOrder.orderId}
                </span>
              </div>

            </div>

            <label className="return-reason-label">
              Select a reason
            </label>

            <select
              className="return-reason-select"
              value={returnReason}
              onChange={(e) =>
                setReturnReason(
                  e.target.value
                )
              }
            >
              <option value="">
                Choose a reason
              </option>

              <option value="Product damaged">
                Product damaged
              </option>

              <option value="Wrong product received">
                Wrong product received
              </option>

              <option value="Product not as described">
                Product not as described
              </option>

              <option value="Product quality issue">
                Product quality issue
              </option>

              <option value="Changed my mind">
                Changed my mind
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            <div className="return-modal-actions">

              <button
                className="return-back-btn"
                onClick={closeReturnPopup}
                disabled={returning}
              >
                Go Back
              </button>

              <button
                className="return-submit-btn"
                onClick={handleReturnOrder}
                disabled={returning}
              >
                {returning
                  ? "Submitting..."
                  : "Submit Return"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default Orders;