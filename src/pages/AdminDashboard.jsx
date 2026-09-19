import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("shopzoneToken");

    useEffect(() => {
        const loadAdminData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const [adminResponse, ordersResponse, usersResponse] =
                    await Promise.all([
                        fetch(
                            "https://shopzone-wn90.onrender.com/api/admin/test",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        ),

                        fetch(
                            "https://shopzone-wn90.onrender.com/api/admin/orders",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        ),

                        fetch(
                            "https://shopzone-wn90.onrender.com/api/admin/users",
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        ),
                    ]);

                const adminData = await adminResponse.json();
                const ordersData = await ordersResponse.json();
                const usersData = await usersResponse.json();

                if (
                    !adminResponse.ok ||
                    !ordersResponse.ok ||
                    !usersResponse.ok
                ) {
                    console.error(
                        adminData.message ||
                        ordersData.message ||
                        usersData.message
                    );

                    return;
                }

                setAdmin(adminData.admin);
                setOrders(ordersData.orders || []);
                setUsers(usersData.users || []);
            } catch (error) {
                console.error(
                    "Admin dashboard error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, [token]);

    const totalSales = orders
        .filter(
            (order) => order.status !== "Cancelled"
        )
        .reduce(
            (total, order) =>
                total + Number(order.total || 0),
            0
        );

    const totalReturns = orders.filter(
        (order) =>
            order.returnStatus &&
            order.returnStatus !== "Not Requested"
    ).length;

    if (loading) {
        return (
            <div className="admin-loading">
                <h2>Loading Admin Dashboard...</h2>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="admin-access-denied">
                <div className="admin-denied-card">
                    <div className="admin-denied-icon">
                        🔒
                    </div>

                    <h1>Access Denied</h1>

                    <p>
                        You do not have permission to
                        access the admin dashboard.
                    </p>

                    <button
                        onClick={() =>
                            (window.location.href = "/")
                        }
                    >
                        Go to ShopZone
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            <div className="admin-header">
                <div>
                    <span className="admin-label">
                        SHOPZONE ADMIN
                    </span>

                    <h1>Admin Dashboard</h1>

                    <p>
                        Welcome back, {admin.name}
                    </p>
                </div>

                <div className="admin-badge">
                    🛡️ ADMIN
                </div>
            </div>

            <div className="admin-stats">

                <div className="admin-stat-card">
                    <span className="admin-stat-icon">
                        📦
                    </span>

                    <div>
                        <strong>
                            {orders.length}
                        </strong>

                        <span>
                            Total Orders
                        </span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <span className="admin-stat-icon">
                        👥
                    </span>

                    <div>
                        <strong>
                            {users.length}
                        </strong>

                        <span>
                            Total Users
                        </span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <span className="admin-stat-icon">
                        💰
                    </span>

                    <div>
                        <strong>
                            ₹
                            {totalSales.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                        <span>
                            Total Sales
                        </span>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <span className="admin-stat-icon">
                        ↩️
                    </span>

                    <div>
                        <strong>
                            {totalReturns}
                        </strong>

                        <span>
                            Returns
                        </span>
                    </div>
                </div>

            </div>

            <div className="admin-content">

                <div className="admin-section">

                    <div className="admin-section-header">
                        <div>
                            <span>
                                MANAGEMENT
                            </span>

                            <h2>
                                Admin Controls
                            </h2>
                        </div>
                    </div>

                    <div className="admin-control-grid">

                        <div className="admin-control-card">
                            <div className="control-icon">
                                📦
                            </div>

                            <h3>
                                Manage Orders
                            </h3>

                            <p>
                                View and update customer
                                orders.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/admin/orders")
                                }
                            >
                                View Orders
                            </button>
                        </div>

                        <div className="admin-control-card">
                            <div className="control-icon">
                                👥
                            </div>

                            <h3>
                                Manage Users
                            </h3>

                            <p>
                                View registered ShopZone
                                customers.
                            </p>

                            <button>
                                View Users
                            </button>
                        </div>

                        <div className="admin-control-card">
                            <div className="control-icon">
                                ↩️
                            </div>

                            <h3>
                                Returns & Refunds
                            </h3>

                            <p>
                                Review return requests
                                and refunds.
                            </p>

                            <button>
                                Manage Returns
                            </button>
                        </div>

                        <div className="admin-control-card">
                            <div className="control-icon">
                                📊
                            </div>

                            <h3>
                                Sales Overview
                            </h3>

                            <p>
                                Monitor ShopZone sales
                                performance.
                            </p>

                            <button>
                                View Reports
                            </button>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;