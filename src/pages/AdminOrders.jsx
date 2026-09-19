import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("shopzoneToken");

  const fetchOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://shopzone-wn90.onrender.com/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to load orders"
        );
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Admin orders error:",
        error
      );

      alert(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch(
        `https://shopzone-wn90.onrender.com/api/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
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
                status: newStatus,
              }
            : order
        )
      );

      alert(
        `Order status changed to ${newStatus}`
      );
    } catch (error) {
      console.error(
        "Update status error:",
        error
      );

      alert(
        "Unable to connect to server."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (!token) {
    return (
      <div className="admin-access-denied">
        <div className="admin-denied-card">
          <div className="admin-denied-icon">
            🔒
          </div>

          <h1>
            Admin Login Required
          </h1>

          <p>
            Please login with an admin
            account to view orders.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <h2>
          Loading Orders...
        </h2>

        <p>
          Fetching customer orders from
          ShopZone.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      <div className="admin-orders-header">

        <div>
          <span className="admin-label">
            SHOPZONE ADMIN
          </span>

          <h1>
            Manage Orders
          </h1>

          <p>
            View and manage all customer
            orders.
          </p>
        </div>

        <button
          className="admin-back-btn"
          onClick={() =>
            navigate("/admin")
          }
        >
          ← Dashboard
        </button>

      </div>

      <div className="admin-orders-summary">

        <div>
          <strong>
            {orders.length}
          </strong>

          <span>
            Total Orders
          </span>
        </div>

        <div>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.status ===
                  "Ordered"
              ).length
            }
          </strong>

          <span>
            Ordered
          </span>
        </div>

        <div>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.status ===
                  "Delivered"
              ).length
            }
          </strong>

          <span>
            Delivered
          </span>
        </div>

        <div>
          <strong>
            {
              orders.filter(
                (order) =>
                  order.status ===
                  "Cancelled"
              ).length
            }
          </strong>

          <span>
            Cancelled
          </span>
        </div>

      </div>

      {orders.length === 0 ? (
        <div className="admin-no-orders">

          <div>
            📦
          </div>

          <h2>
            No orders found
          </h2>

          <p>
            Customer orders will appear
            here.
          </p>

        </div>
      ) : (
        <div className="admin-orders-list">

          {orders.map((order) => {

            const isCancelled =
              order.status ===
              "Cancelled";

            const isDelivered =
              order.status ===
              "Delivered";

            return (
              <div
                className="admin-order-card"
                key={order._id}
              >

                <div className="admin-order-top">

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
                      {Number(
                        order.total
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <span
                    className={`admin-order-status ${
                      isCancelled
                        ? "admin-status-cancelled"
                        : isDelivered
                        ? "admin-status-delivered"
                        : "admin-status-ordered"
                    }`}
                  >
                    {order.status}
                  </span>

                </div>

                <div className="admin-order-body">

                  <div className="admin-order-products">

                    <h3>
                      Products
                    </h3>

                    {order.items.map(
                      (item) => (
                        <div
                          className="admin-order-product"
                          key={
                            item.productId
                          }
                        >

                          <img
                            src={item.image}
                            alt={item.title}
                          />

                          <div>
                            <strong>
                              {item.title}
                            </strong>

                            <p>
                              Quantity:{" "}
                              {item.quantity}
                            </p>

                            <span>
                              ₹
                              {(
                                item.price *
                                item.quantity
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </div>

                        </div>
                      )
                    )}

                  </div>

                  <div className="admin-order-details">

                    <h3>
                      Order Details
                    </h3>

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {order.paymentMethod}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Address
                      </span>

                      <p>
                        {order.address}
                      </p>
                    </div>

                    {order.returnStatus &&
                      order.returnStatus !==
                        "Not Requested" && (
                        <div className="admin-return-info">

                          <span>
                            Return Status
                          </span>

                          <strong>
                            {
                              order.returnStatus
                            }
                          </strong>

                          {order.returnReason && (
                            <p>
                              Reason:{" "}
                              {
                                order.returnReason
                              }
                            </p>
                          )}

                        </div>
                      )}

                  </div>

                </div>

                <div className="admin-order-actions">

                  <div>
                    <span>
                      Update Status
                    </span>

                    <select
                      value={order.status}
                      disabled={
                        updatingId ===
                          order.orderId ||
                        isCancelled
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order.orderId,
                          e.target.value
                        )
                      }
                    >
                      <option value="Ordered">
                        Ordered
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                  {updatingId ===
                    order.orderId && (
                    <span>
                      Updating...
                    </span>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;