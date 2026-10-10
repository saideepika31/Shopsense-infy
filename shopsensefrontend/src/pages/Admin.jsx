import React, { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {

    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [activeSection, setActiveSection] = useState("Dashboard");

    const [loading, setLoading] = useState(true);

    // =========================
    // FETCH DATA
    // =========================

    useEffect(() => {

        const fetchData = async () => {

            try {

                const [
                    vendorsResponse,
                    productsResponse,
                    customersResponse,
                    transactionsResponse
                ] = await Promise.all([

                    fetch("http://127.0.0.1:8000/vendors/"),

                    fetch("http://127.0.0.1:8000/products/"),

                    fetch("http://127.0.0.1:8000/customers/"),

                    fetch("http://127.0.0.1:8000/transactions/")

                ]);

                if (vendorsResponse.ok) {
                    setVendors(await vendorsResponse.json());
                }

                if (productsResponse.ok) {
                    setProducts(await productsResponse.json());
                }

                if (customersResponse.ok) {
                    setCustomers(await customersResponse.json());
                }

                if (transactionsResponse.ok) {
                    setTransactions(await transactionsResponse.json());
                }

            } catch (error) {

                console.error(
                    "Admin data error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchData();

    }, []);


    // =========================
    // CALCULATIONS
    // =========================

    const totalRevenue = transactions.reduce(
        (sum, transaction) =>
            sum + Number(transaction.total_amount || 0),
        0
    );


    const totalUnitsSold = transactions.reduce(
        (sum, transaction) =>
            sum + Number(transaction.quantity || 0),
        0
    );


    const lowStockProducts = products.filter(
        product =>
            Number(product.quantity || 0) <= 5
    );


    // =========================
    // TOP PRODUCTS
    // =========================

    const productSales = {};

    transactions.forEach(transaction => {

        if (!productSales[transaction.product_id]) {

            productSales[transaction.product_id] = 0;

        }

        productSales[transaction.product_id] +=
            Number(transaction.quantity || 0);

    });


    const topProducts = products
        .map(product => ({
            ...product,
            sold:
                productSales[product.product_id] || 0
        }))
        .sort(
            (a, b) => b.sold - a.sold
        )
        .slice(0, 5);


    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("vendor_id");

        window.location.href = "/";

    };


    // =========================
    // DASHBOARD
    // =========================

    const renderDashboard = () => {

        return (

            <div className="admin-dashboard-content">

                <div className="admin-welcome">

                    <div>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Monitor and manage the ShopSense platform.
                        </p>

                    </div>

                    <div className="admin-status">
                        ● System Active
                    </div>

                </div>


                {/* =========================
                    OVERVIEW CARDS
                ========================= */}

                <div className="admin-cards">

                    <div className="admin-card">

                        <div className="admin-card-icon">
                            🏪
                        </div>

                        <div>
                            <p>Total Vendors</p>
                            <h2>{vendors.length}</h2>
                        </div>

                    </div>


                    <div className="admin-card">

                        <div className="admin-card-icon">
                            📦
                        </div>

                        <div>
                            <p>Total Products</p>
                            <h2>{products.length}</h2>
                        </div>

                    </div>


                    <div className="admin-card">

                        <div className="admin-card-icon">
                            👥
                        </div>

                        <div>
                            <p>Total Customers</p>
                            <h2>{customers.length}</h2>
                        </div>

                    </div>


                    <div className="admin-card">

                        <div className="admin-card-icon">
                            💰
                        </div>

                        <div>
                            <p>Platform Revenue</p>
                            <h2>
                                ₹{totalRevenue.toLocaleString()}
                            </h2>
                        </div>

                    </div>

                </div>


                {/* =========================
                    ANALYTICS
                ========================= */}

                <div className="admin-grid">

                    <div className="admin-panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Platform Overview
                                </h2>

                                <p>
                                    Current ShopSense activity
                                </p>

                            </div>

                        </div>


                        <div className="overview-list">

                            <div>
                                <span>
                                    Total Transactions
                                </span>

                                <strong>
                                    {transactions.length}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Units Sold
                                </span>

                                <strong>
                                    {totalUnitsSold}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Available Products
                                </span>

                                <strong>
                                    {products.length - lowStockProducts.length}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    Low Stock Products
                                </span>

                                <strong className="warning-number">
                                    {lowStockProducts.length}
                                </strong>
                            </div>

                        </div>

                    </div>


                    {/* TOP PRODUCTS */}

                    <div className="admin-panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Top Products
                                </h2>

                                <p>
                                    Best performing products
                                </p>

                            </div>

                        </div>


                        {topProducts.length === 0 ? (

                            <div className="empty-admin">
                                No sales data available yet.
                            </div>

                        ) : (

                            <div className="top-products">

                                {topProducts.map(
                                    (product, index) => (

                                        <div
                                            className="top-product"
                                            key={product.product_id}
                                        >

                                            <div className="product-rank">
                                                {index + 1}
                                            </div>

                                            <div className="product-info">

                                                <strong>
                                                    {product.product_name}
                                                </strong>

                                                <span>
                                                    {product.category}
                                                </span>

                                            </div>

                                            <div className="product-sales">
                                                {product.sold} sold
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* =========================
                    LOW STOCK
                ========================= */}

                <div className="admin-panel full-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Inventory Alerts
                            </h2>

                            <p>
                                Products requiring attention
                            </p>

                        </div>

                        <span className="alert-badge">
                            {lowStockProducts.length} Alerts
                        </span>

                    </div>


                    {lowStockProducts.length === 0 ? (

                        <div className="healthy-inventory">

                            <span>✓</span>

                            <div>
                                <strong>
                                    Inventory looks healthy
                                </strong>

                                <p>
                                    No products are currently below the
                                    low-stock threshold.
                                </p>
                            </div>

                        </div>

                    ) : (

                        <div className="inventory-alerts">

                            {lowStockProducts
                                .slice(0, 6)
                                .map(product => (

                                    <div
                                        className="inventory-item"
                                        key={product.product_id}
                                    >

                                        <div>

                                            <strong>
                                                {product.product_name}
                                            </strong>

                                            <span>
                                                {product.category}
                                            </span>

                                        </div>

                                        <strong className="stock-danger">
                                            {product.quantity} left
                                        </strong>

                                    </div>

                                ))}

                        </div>

                    )}

                </div>

            </div>

        );

    };


    // =========================
    // VENDORS
    // =========================

    const renderVendors = () => (

        <div className="admin-dashboard-content">

            <div className="section-title">

                <h1>Vendors</h1>

                <p>
                    Manage all registered ShopSense vendors.
                </p>

            </div>


            <div className="admin-panel">

                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Business</th>
                                <th>Owner</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>

                        </thead>

                        <tbody>

                            {vendors.map(vendor => (

                                <tr key={vendor.vendor_id}>

                                    <td>
                                        #{vendor.vendor_id}
                                    </td>

                                    <td>
                                        <strong>
                                            {vendor.business_name}
                                        </strong>
                                    </td>

                                    <td>
                                        {vendor.owner_name}
                                    </td>

                                    <td>
                                        {vendor.phone || "—"}
                                    </td>

                                    <td>
                                        {vendor.address || "—"}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {vendors.length === 0 && (
                        <div className="empty-admin">
                            No vendors found.
                        </div>
                    )}

                </div>

            </div>

        </div>

    );


    // =========================
    // PRODUCTS
    // =========================

    const renderProducts = () => (

        <div className="admin-dashboard-content">

            <div className="section-title">

                <h1>Products</h1>

                <p>
                    View products across all vendors.
                </p>

            </div>


            <div className="admin-panel">

                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Vendor ID</th>
                                <th>Price</th>
                                <th>Stock</th>
                            </tr>

                        </thead>

                        <tbody>

                            {products.map(product => (

                                <tr key={product.product_id}>

                                    <td>
                                        <strong>
                                            {product.product_name}
                                        </strong>
                                    </td>

                                    <td>
                                        {product.category}
                                    </td>

                                    <td>
                                        #{product.vendor_id}
                                    </td>

                                    <td>
                                        ₹{product.price}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                product.quantity <= 5
                                                    ? "stock-danger"
                                                    : "stock-good"
                                            }
                                        >
                                            {product.quantity}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );


    // =========================
    // CUSTOMERS
    // =========================

    const renderCustomers = () => (

        <div className="admin-dashboard-content">

            <div className="section-title">

                <h1>Customers</h1>

                <p>
                    View customers registered on ShopSense.
                </p>

            </div>


            <div className="admin-panel">

                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                            </tr>

                        </thead>

                        <tbody>

                            {customers.map(customer => (

                                <tr key={customer.customer_id}>

                                    <td>
                                        #{customer.customer_id}
                                    </td>

                                    <td>
                                        <strong>
                                            {customer.name}
                                        </strong>
                                    </td>

                                    <td>
                                        {customer.email}
                                    </td>

                                    <td>
                                        {customer.phone || "—"}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );


    // =========================
    // TRANSACTIONS
    // =========================

    const renderTransactions = () => (

        <div className="admin-dashboard-content">

            <div className="section-title">

                <h1>Transactions</h1>

                <p>
                    Monitor all platform transactions.
                </p>

            </div>


            <div className="admin-panel">

                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Vendor</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>

                        </thead>

                        <tbody>

                            {transactions.map(transaction => (

                                <tr
                                    key={transaction.transaction_id}
                                >

                                    <td>
                                        #{transaction.transaction_id}
                                    </td>

                                    <td>
                                        #{transaction.customer_id}
                                    </td>

                                    <td>
                                        #{transaction.product_id}
                                    </td>

                                    <td>
                                        #{transaction.vendor_id}
                                    </td>

                                    <td>
                                        {transaction.quantity}
                                    </td>

                                    <td>
                                        ₹{transaction.total_amount}
                                    </td>

                                    <td>
                                        {transaction.transaction_date
                                            ? new Date(
                                                transaction.transaction_date
                                            ).toLocaleDateString()
                                            : "—"}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );


    // =========================
    // SECTION SELECTOR
    // =========================

    const renderSection = () => {

        switch (activeSection) {

            case "Vendors":
                return renderVendors();

            case "Products":
                return renderProducts();

            case "Customers":
                return renderCustomers();

            case "Transactions":
                return renderTransactions();

            default:
                return renderDashboard();

        }

    };


    return (

        <div className="admin-page">

            {/* =========================
                SIDEBAR
            ========================= */}

            <aside className="admin-sidebar">

                <div className="admin-logo">

                    <h1>
                        ShopSense
                    </h1>

                    <span>
                        ADMIN PANEL
                    </span>

                </div>


                <nav>

                    <button
                        className={
                            activeSection === "Dashboard"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveSection("Dashboard")
                        }
                    >
                        📊 Dashboard
                    </button>


                    <button
                        className={
                            activeSection === "Vendors"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveSection("Vendors")
                        }
                    >
                        🏪 Vendors
                    </button>


                    <button
                        className={
                            activeSection === "Products"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveSection("Products")
                        }
                    >
                        📦 Products
                    </button>


                    <button
                        className={
                            activeSection === "Customers"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveSection("Customers")
                        }
                    >
                        👥 Customers
                    </button>


                    <button
                        className={
                            activeSection === "Transactions"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveSection("Transactions")
                        }
                    >
                        💳 Transactions
                    </button>

                </nav>


                <div className="admin-sidebar-bottom">

                    <div className="admin-user">

                        <div className="admin-avatar">
                            A
                        </div>

                        <div>
                            <strong>Administrator</strong>
                            <span>Platform Admin</span>
                        </div>

                    </div>


                    <button
                        className="logout-admin"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>


            {/* =========================
                MAIN
            ========================= */}

            <main className="admin-main">

                {loading ? (

                    <div className="admin-loading">
                        Loading ShopSense data...
                    </div>

                ) : (

                    renderSection()

                )}

            </main>

        </div>

    );

}


export default Admin;