import { Link } from "react-router-dom";

function Orders() {
  const savedOrders =
    JSON.parse(localStorage.getItem("shopzoneOrders")) || [];

  return (
    <div className="orders-page">

      <div className="orders-header">
        <h1>Your Orders</h1>

        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>

      {savedOrders.length === 0 ? (
        <div className="no-orders">
          <h2>You haven't placed any orders yet.</h2>

          <p>
            Browse our products and place your first order.
          </p>

          <Link to="/" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">

          {savedOrders.map((order) => (
            <div className="order-card" key={order.id}>

              <div className="order-top">

                <div>
                  <p>ORDER PLACED</p>
                  <strong>{order.date}</strong>
                </div>

                <div>
                  <p>ORDER ID</p>
                  <strong>{order.id}</strong>
                </div>

                <div>
                  <p>TOTAL</p>
                  <strong>
                    ₹{order.total.toLocaleString("en-IN")}
                  </strong>
                </div>

                <span className="order-status">
                  {order.status}
                </span>

              </div>

              <div className="order-items">

                {order.items.map((item) => (
                  <div
                    className="order-item"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.title}
                    />

                    <div className="order-item-info">

                      <h3>{item.title}</h3>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <strong>
                        ₹{item.price.toLocaleString("en-IN")}
                      </strong>

                    </div>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Orders;