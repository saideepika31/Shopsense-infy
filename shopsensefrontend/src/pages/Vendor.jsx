import React, { useEffect, useState } from "react";
import "./Vendor.css";
import AnimatedBackground from "../Components/AnimatedBackground";
import { useNavigate } from "react-router-dom";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from "recharts";


function Vendor() {

    const vendorId = localStorage.getItem("vendor_id");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [lowStock, setLowStock] = useState([]);
    const [monthlySales, setMonthlySales] = useState([]);
    const [topProductsData, setTopProductsData] = useState([]);
    const [benchmark, setBenchmark] = useState(null);
    const [customerSegmentsData, setCustomerSegmentsData] = useState([]);
    const [aiQuestion, setAiQuestion] = useState("");
    const [aiAnswer, setAiAnswer] = useState("");

    const askAIAnalyst = async () => {
    if (!aiQuestion.trim()) {
        return;
    }

    try {
        const response = await fetch(
            `http://127.0.0.1:8000/ai/analyst/${vendorId}?question=${encodeURIComponent(aiQuestion)}`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        setAiAnswer(data.answer);
    } catch (error) {
        console.error("AI Analyst Error:", error);
        setAiAnswer("Unable to get an answer. Please try again.");
    }
};

    /* =====================================================
   CUSTOMER SEGMENTATION DATA
   ===================================================== */

const customerSegments = customerSegmentsData;

    /* =====================================================
       DEMO TOP PRODUCTS
       ===================================================== */

    const topProducts = [
        {
            product_name: "Shoes",
            category: "Footwear",
            total_sold: 25
        },
        {
            product_name: "Headphones",
            category: "Electronics",
            total_sold: 18
        },
        {
            product_name: "Smart Watch",
            category: "Electronics",
            total_sold: 12
        },
        {
            product_name: "Backpack",
            category: "Accessories",
            total_sold: 9
        }
    ];


    /* =====================================================
       DEMO MONTHLY SALES
       ===================================================== */

    const salesTrend = [
        {
            month: "Mar",
            sales: 28,
            revenue: 21000
        },
        {
            month: "Apr",
            sales: 35,
            revenue: 26500
        },
        {
            month: "May",
            sales: 41,
            revenue: 31000
        },
        {
            month: "Jun",
            sales: 47,
            revenue: 36500
        },
        {
            month: "Jul",
            sales: 52,
            revenue: 39800
        },
        {
            month: "Aug",
            sales: 55,
            revenue: 42500
        }
    ];


    /* =====================================================
   CUSTOMER SEGMENT CHART DATA
   ===================================================== */

const segmentChartData = [
    {
        name: "Low Value",
        value: customerSegmentsData.filter(
            customer => customer.segment === "Low Value"
        ).length
    },
    {
        name: "Medium Value",
        value: customerSegmentsData.filter(
            customer => customer.segment === "Medium Value"
        ).length
    },
    {
        name: "High Value",
        value: customerSegmentsData.filter(
            customer => customer.segment === "High Value"
        ).length
    }
];

    /* =====================================================
       AI DEMAND FORECAST DEMO
       ===================================================== */

    const forecastData = [
        {
            month: "Aug",
            actual: 55,
            forecast: null
        },
        {
            month: "Sep",
            actual: null,
            forecast: 61
        },
        {
            month: "Oct",
            actual: null,
            forecast: 68
        },
        {
            month: "Nov",
            actual: null,
            forecast: 74
        }
    ];


    /* =====================================================
       HISTORICAL VALIDATION
       ===================================================== */

    const validation = {
        historical_sales: 52,
        current_sales: 55,
        historical_revenue: 39800,
        current_revenue: 42500,
        status: "Validated"
    };


    /* =====================================================
       FETCH ANALYTICS
       ===================================================== */

    useEffect(() => {

        if (!vendorId) {
            return;
        }

        fetch(
            `http://127.0.0.1:8000/analytics/${vendorId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        )
            .then(response => response.json())
            .then(data => {

                console.log("Analytics:", data);

                setAnalytics(data);

            })
            .catch(error => {

                console.error(
                    "Analytics Error:",
                    error
                );

            });

    }, [vendorId, token]);


    /* =====================================================
       FETCH INVENTORY
       ===================================================== */

    useEffect(() => {

        if (!vendorId) {
            return;
        }

        fetch(
            `http://127.0.0.1:8000/inventory/${vendorId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        )
            .then(response => response.json())
            .then(data => {

                console.log(
                    "Inventory:",
                    data
                );

                if (Array.isArray(data)) {

                    setInventory(data);

                }

            })
            .catch(error => {

                console.error(
                    "Inventory Error:",
                    error
                );

            });

    }, [vendorId, token]);


    /* =====================================================
       FETCH LOW STOCK
       ===================================================== */

    useEffect(() => {

        if (!vendorId) {
            return;
        }

        fetch(
            `http://127.0.0.1:8000/inventory/${vendorId}/low-stock`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        )
            .then(response => response.json())
            .then(data => {

                console.log(
                    "Low Stock:",
                    data
                );

                if (Array.isArray(data)) {

                    setLowStock(data);

                }

            })
            .catch(error => {

                console.error(
                    "Low Stock Error:",
                    error
                );

            });

    }, [vendorId, token]);


  /* =====================================================
   FETCH MONTHLY SALES REPORT
   ===================================================== */

useEffect(() => {

    if (!vendorId) {
        return;
    }

    fetch(
        `http://127.0.0.1:8000/reports/vendor/${vendorId}/monthly-sales`,
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(response => response.json())
        .then(data => {

            console.log("Monthly Sales:", data);

            if (Array.isArray(data)) {

                const monthNames = [
                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                ];

                const formattedData = data.map(item => ({
                    month: monthNames[item.month - 1],
                    sales: item.sales,
                    revenue: item.revenue
                }));

                setMonthlySales(formattedData);
            }

        })
        .catch(error => {

            console.error(
                "Monthly Sales Error:",
                error
            );

        });

}, [vendorId, token]);

/* =====================================================
   FETCH TOP PRODUCTS REPORT
   ===================================================== */

useEffect(() => {

    if (!vendorId) {
        return;
    }

    fetch(
        `http://127.0.0.1:8000/reports/vendor/${vendorId}/top-products`,
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(response => response.json())
        .then(data => {

            console.log("Top Products:", data);

            if (Array.isArray(data)) {
                setTopProductsData(data);
            }

        })
        .catch(error => {

            console.error(
                "Top Products Error:",
                error
            );

        });

}, [vendorId, token]);

/* =====================================================
   FETCH VENDOR BENCHMARK
   ===================================================== */

useEffect(() => {

    if (!vendorId) {
        return;
    }

    fetch(
        `http://127.0.0.1:8000/reports/vendor/${vendorId}/benchmark`,
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(response => response.json())
        .then(data => {

            console.log("Benchmark:", data);

            setBenchmark(data);

        })
        .catch(error => {

            console.error(
                "Benchmark Error:",
                error
            );

        });

}, [vendorId, token]);


/* =====================================================
   FETCH CUSTOMER SEGMENTS
   ===================================================== */

useEffect(() => {

    fetch(
        "http://127.0.0.1:8000/analytics/customer-segments",
        {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }
    )
        .then(response => response.json())
        .then(data => {

            console.log("Customer Segments:", data);

            if (Array.isArray(data)) {
                setCustomerSegmentsData(data);
            }

        })
        .catch(error => {

            console.error(
                "Customer Segments Error:",
                error
            );

        });

}, [token]);

    /* =====================================================
       REFRESH ANALYTICS
       ===================================================== */

    const refreshAnalytics = () => {

        if (!vendorId) {
            return;
        }

        fetch(
            `http://127.0.0.1:8000/analytics/${vendorId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        )
            .then(response => response.json())
            .then(data => {

                setAnalytics(data);

                alert(
                    "Analytics refreshed successfully!"
                );

            })
            .catch(error => {

                console.error(error);

                alert(
                    "Unable to refresh analytics."
                );

            });

    };


    /* =====================================================
   NAVIGATION
   ===================================================== */

const goToProducts = () => {

    window.location.href =
        "/products";

};

const goToProfile = () => {
    navigate("/Vendorprofile");
};

const downloadCSV = () => {

    if (!vendorId) {
        return;
    }

    window.open(
        `http://127.0.0.1:8000/reports/vendor/${vendorId}/csv`,
        "_blank"
    );

};


    /* =====================================================
       LOGOUT
       ===================================================== */

    const logout = () => {

        localStorage.clear();

        window.location.href =
            "/login";

    };


    /* =====================================================
       UI
       ===================================================== */

    return (

        <div className="vendordashboard">
            <AnimatedBackground />


            {/* =================================================
               HEADER
               ================================================= */}

            <header className="dashboard-header">

                <div className="brand-section">

                    <h1>
                        ShopSense
                    </h1>

                    <span>
                        Vendor Analytics
                    </span>

                </div>


                <div className="header-actions">

                    <button className="notification-btn">
                        🔔
                        <span className="notification-dot"></span>
                    </button>


                    <div className="vendor-profile">

                        <div className="vendor-avatar">
                            V
                        </div>

                        <div>

                            <strong>
                                Vendor
                            </strong>

                            <small>
                                Store Manager
                            </small>

                        </div>

                    </div>

                </div>

            </header>


            {/* =================================================
               DASHBOARD BODY
               ================================================= */}

            <div className="dashboard-main">


                {/* =================================================
                   SIDEBAR
                   ================================================= */}

                <aside className="sidebar">

                    <div className="sidebar-title">
                        MENU
                    </div>


                    <a
                        href="/Vendordashboard"
                        className="sidebar-link active"
                    >
                        <span>🏠</span>
                        Dashboard
                    </a>


                    <a
                        href="/profile"
                        className="sidebar-link"
                    >
                        <span>👤</span>
                        My Profile
                    </a>


                    <a
                        href="/products"
                        className="sidebar-link"
                    >
                        <span>📦</span>
                        Products
                    </a>


                    <a
                        href="/Vendordashboard"
                        className="sidebar-link"
                    >
                        <span>📊</span>
                        Analytics
                    </a>


                    <div className="sidebar-spacer"></div>


                    <button
                        className="sidebar-link logout-link"
                        onClick={logout}
                    >
                        <span>🚪</span>
                        Logout
                    </button>

                </aside>


                {/* =================================================
                   CONTENT
                   ================================================= */}

                <main className="dashboard-content">


                    {/* =================================================
                       WELCOME
                       ================================================= */}

                    <section className="welcome-section">

                        <div>

                            <p className="welcome-label">
                                OVERVIEW
                            </p>

                            <h1>
                                Welcome Back, Vendor! 👋
                            </h1>

                            <p>
                                Here's what's happening with
                                your store today.
                            </p>

                        </div>


                        <button
                            className="refresh-btn"
                            onClick={refreshAnalytics}
                        >
                            ↻ Refresh Data
                        </button>

                    </section>


                    {/* =================================================
                       SUMMARY CARDS
                       ================================================= */}

                    <section className="summary-cards">


                        <div className="summary-card">

                            <div className="summary-icon sales-icon">
                                ₹
                            </div>

                            <div>

                                <span>
                                    Total Sales
                                </span>

                                <h2>
                                    {analytics?.total_sales ?? 55}
                                </h2>

                                <small>
                                    ↑ 8.4% this month
                                </small>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon revenue-icon">
                                ₹
                            </div>

                            <div>

                                <span>
                                    Revenue
                                </span>

                                <h2>
                                    ₹{analytics?.total_revenue ?? "42,500"}
                                </h2>

                                <small>
                                    ↑ 6.8% this month
                                </small>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon product-icon">
                                📦
                            </div>

                            <div>

                                <span>
                                    Products
                                </span>

                                <h2>
                                    {analytics?.total_products ??
                                        (inventory.length || 2)}
                                </h2>

                                <small>
                                    Active products
                                </small>

                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon customer-icon">
                                👥
                            </div>

                            <div>

                                <span>
                                    Customers
                                </span>

                                <h2>
                                    {customerSegments.length}
                                </h2>

                                <small>
                                    Segmented customers
                                </small>

                            </div>

                        </div>

                    </section>

{/* =================================================
   VENDOR BENCHMARK
   ================================================= */}

<section className="dashboard-card">

    <div className="card-header">

        <div>

            <span className="card-label">
                BUSINESS INTELLIGENCE
            </span>

            <h2>
                📊 Marketplace Benchmark
            </h2>

        </div>
        <button
        className="small-action"
        onClick={downloadCSV}
    >
        Download CSV
    </button>

    </div>

    <div className="validation-grid">

        <div className="validation-item">

            <span>
                Your Revenue
            </span>

            <strong>
                ₹{benchmark?.vendor_revenue ?? 0}
            </strong>

        </div>

        <div className="validation-item">

            <span>
                Marketplace Average
            </span>

            <strong>
                ₹{benchmark?.marketplace_average ?? 0}
            </strong>

        </div>

        <div className="validation-item">

            <span>
                Performance Difference
            </span>

            <strong>
                {benchmark?.difference_percentage ?? 0}%
            </strong>

        </div>

    </div>

</section>

                    {/* =================================================
                       CHART ROW 1
                       ================================================= */}

                    <section className="charts-grid">


                        {/* SALES TREND */}

                        <div className="dashboard-card large-chart">

                            <div className="card-header">

                                <div>

                                    <span className="card-label">
                                        PERFORMANCE
                                    </span>

                                    <h2>
                                        Sales & Revenue Trend
                                    </h2>

                                </div>

                                <span className="chart-badge">
                                    6 Months
                                </span>

                            </div>


                            <ResponsiveContainer
                                width="100%"
                                height={280}
                            >

                                <LineChart
                                    data={monthlySales}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        opacity={0.2}
                                    />

                                    <XAxis
                                        dataKey="month"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        name="Sales"
                                        stroke="#505081"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        name="Revenue"
                                        stroke="#8686AC"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>


                        {/* CUSTOMER SEGMENT */}

                        <div className="dashboard-card">

                            <div className="card-header">

                                <div>

                                    <span className="card-label">
                                        CUSTOMER ANALYTICS
                                    </span>

                                    <h2>
                                        Customer Segmentation
                                    </h2>

                                </div>

                            </div>


                            <ResponsiveContainer
                                width="100%"
                                height={280}
                            >

                                <PieChart>

                                    <Pie
                                        data={segmentChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        label
                                    >

                                        <Cell fill="#505081" />

                                        <Cell fill="#68689A" />

                                        <Cell fill="#8686AC" />

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                    </section>


                    {/* =================================================
                       INVENTORY + LOW STOCK
                       ================================================= */}

                    <section className="two-column-grid">


                        {/* INVENTORY */}

                        <div className="dashboard-card">

                            <div className="card-header">

                                <div>

                                    <span className="card-label">
                                        INVENTORY
                                    </span>

                                    <h2>
                                        📦 Inventory Intelligence
                                    </h2>

                                </div>

                                <button
                                    onClick={goToProducts}
                                    className="small-action"
                                >
                                    Manage
                                </button>

                            </div>


                            <div className="table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Product
                                            </th>

                                            <th>
                                                Category
                                            </th>

                                            <th>
                                                Stock
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {inventory.length > 0 ?

                                            inventory.map(
                                                (item, index) => (

                                                    <tr key={index}>

                                                        <td>
                                                            {item.product_name}
                                                        </td>

                                                        <td>
                                                            {item.category}
                                                        </td>

                                                        <td>
                                                            {item.quantity}
                                                        </td>

                                                        <td>

                                                            <span className="status-badge">
                                                                {item.status ||
                                                                    "In Stock"}
                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                            :

                                            <tr>

                                                <td colSpan="4">
                                                    No inventory data available.
                                                </td>

                                            </tr>

                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* LOW STOCK */}

                        <div className="dashboard-card low-stock-card">

                            <div className="card-header">

                                <div>

                                    <span className="card-label">
                                        ALERTS
                                    </span>

                                    <h2>
                                        ⚠️ Low Stock Alerts
                                    </h2>

                                </div>

                                <span className="alert-count">
                                    {lowStock.length}
                                </span>

                            </div>


                            {lowStock.length > 0 ?

                                lowStock.map(
                                    (item, index) => (

                                        <div
                                            className="alert-item"
                                            key={index}
                                        >

                                            <div>

                                                <strong>
                                                    {item.product_name}
                                                </strong>

                                                <span>
                                                    Only {item.quantity}
                                                    {" "}units left
                                                </span>

                                            </div>

                                            <span className="warning-dot">
                                                !
                                            </span>

                                        </div>

                                    )
                                )

                                :

                                <div className="no-alert">

                                    <div>
                                        ✓
                                    </div>

                                    <p>
                                        All products are sufficiently stocked.
                                    </p>

                                </div>

                            }

                        </div>

                    </section>


                    {/* =================================================
                       TOP PRODUCTS + CUSTOMER TABLE
                       ================================================= */}

                    <section className="two-column-grid">


                        {/* TOP PRODUCTS */}

                        <div className="dashboard-card">

                            <div className="card-header">

                                <div>

                                    <span className="card-label">
                                        RECOMMENDATIONS
                                    </span>

                                    <h2>
                                        ⭐ Top Selling Products
                                    </h2>

                                </div>

                            </div>


                            <ResponsiveContainer
                                width="100%"
                                height={260}
                            >

                                <BarChart
                                    data={topProductsData}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        opacity={0.2}
                                    />

                                    <XAxis
                                        dataKey="product_name"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Bar
                                        dataKey="sales"
                                        name="Units Sold"
                                        fill="#505081"
                                        radius={[6, 6, 0, 0]}
                                    />

                                </BarChart>

                            </ResponsiveContainer>


                        </div>


                        {/* CUSTOMER TABLE */}

                        <div className="dashboard-card">

                            <div className="card-header">

                                <div>

                                    <span className="card-label">
                                        CUSTOMER INSIGHTS
                                    </span>

                                    <h2>
                                        👥 Customer Segments
                                    </h2>

                                </div>

                            </div>


                            <div className="table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Customer
                                            </th>

                                            <th>
                                                Total Spent
                                            </th>

                                            <th>
                                                Segment
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {customerSegments.map(
                                            (customer, index) => (

                                                <tr key={index}>

                                                    <td>
                                                        {customer.customer_name}
                                                    </td>

                                                    <td>
                                                        ₹{customer.total_spent}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={
                                                                customer.segment ===
                                                                    "High Value"

                                                                    ? "segment high"

                                                                    : customer.segment ===
                                                                        "Medium Value"

                                                                        ? "segment medium"

                                                                        : "segment low"
                                                            }
                                                        >
                                                            {customer.segment}
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                       AI FORECAST
                       ================================================= */}

                    <section className="dashboard-card ai-card">

                        <div className="ai-header">

                            <div className="ai-title">

                                <div className="ai-icon">
                                    ✨
                                </div>

                                <div>

                                    <span className="card-label">
                                        AI / ML
                                    </span>

                                    <h2>
                                        AI Demand Forecast — Demo
                                    </h2>

                                    <p>
                                        Predictive inventory planning based
                                        on historical sales trends.
                                    </p>

                                </div>

                            </div>


                            <div className="ai-status">
                                Demo Model
                            </div>

                        </div>


                        <div className="forecast-layout">


                            <div className="forecast-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={280}
                                >

                                    <LineChart
                                        data={forecastData}
                                    >

                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            opacity={0.2}
                                        />

                                        <XAxis
                                            dataKey="month"
                                        />

                                        <YAxis />

                                        <Tooltip />

                                        <Legend />

                                        <Line
                                            type="monotone"
                                            dataKey="actual"
                                            name="Actual Sales"
                                            stroke="#505081"
                                            strokeWidth={3}
                                            connectNulls
                                        />

                                        <Line
                                            type="monotone"
                                            dataKey="forecast"
                                            name="Predicted Demand"
                                            stroke="#8686AC"
                                            strokeWidth={3}
                                            strokeDasharray="8 5"
                                            connectNulls
                                        />

                                    </LineChart>

                                </ResponsiveContainer>

                            </div>


                            <div className="forecast-summary">

                                <div className="forecast-box">

                                    <span>
                                        Current Demand
                                    </span>

                                    <strong>
                                        55
                                    </strong>

                                    <small>
                                        units / month
                                    </small>

                                </div>


                                <div className="forecast-box">

                                    <span>
                                        Next Month
                                    </span>

                                    <strong>
                                        61
                                    </strong>

                                    <small>
                                        predicted units
                                    </small>

                                </div>


                                <div className="forecast-box recommendation">

                                    <span>
                                        Recommendation
                                    </span>

                                    <strong>
                                        Stock 68
                                    </strong>

                                    <small>
                                        units to avoid shortage
                                    </small>

                                </div>

                            </div>

                        </div>

                    </section>
                    {/* =================================================
   AI DATA ANALYST
   ================================================= */}

<section className="dashboard-card">

    <div className="card-header">

        <div>
            <span className="card-label">
                AI ANALYTICS
            </span>

            <h2>
                🤖 AI Data Analyst
            </h2>

            <p>
                Ask questions about your sales and revenue data.
            </p>
        </div>

    </div>

    <div style={{ marginTop: "20px" }}>

        <input
            type="text"
            placeholder="Ask something like: What is my total revenue?"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
                boxSizing: "border-box"
            }}
        />

        <button
            onClick={askAIAnalyst}
            style={{
                marginTop: "12px",
                padding: "12px 22px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "600"
            }}
        >
            Ask AI
        </button>

        {aiAnswer && (
            <div style={{
                marginTop: "20px",
                padding: "16px",
                borderRadius: "8px",
                background: "#f5f5f5"
            }}>
                <strong>AI Answer:</strong>
                <p>{aiAnswer}</p>
            </div>
        )}

    </div>

</section>

                    {/* =================================================
                       HISTORICAL VALIDATION
                       ================================================= */}

                    <section className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <span className="card-label">
                                    DATA QUALITY
                                </span>

                                <h2>
                                    📊 Historical Data Validation
                                </h2>

                            </div>

                            <span className="validated-badge">
                                ✓ Validated
                            </span>

                        </div>


                        <div className="validation-grid">


                            <div className="validation-item">

                                <span>
                                    Historical Sales
                                </span>

                                <strong>
                                    {validation.historical_sales}
                                </strong>

                            </div>


                            <div className="validation-item">

                                <span>
                                    Current Sales
                                </span>

                                <strong>
                                    {validation.current_sales}
                                </strong>

                            </div>


                            <div className="validation-item">

                                <span>
                                    Historical Revenue
                                </span>

                                <strong>
                                    ₹{validation.historical_revenue}
                                </strong>

                            </div>


                            <div className="validation-item">

                                <span>
                                    Current Revenue
                                </span>

                                <strong>
                                    ₹{validation.current_revenue}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                       RECENT ACTIVITY
                       ================================================= */}

                    <section className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <span className="card-label">
                                    ACTIVITY
                                </span>

                                <h2>
                                    🕒 Recent Activity
                                </h2>

                            </div>

                        </div>


                        <div className="activity-list">

                            <div className="activity-item">

                                <span className="activity-icon">
                                    📦
                                </span>

                                <div>

                                    <strong>
                                        Product inventory updated
                                    </strong>

                                    <small>
                                        Inventory intelligence refreshed
                                    </small>

                                </div>

                            </div>


                            <div className="activity-item">

                                <span className="activity-icon">
                                    👥
                                </span>

                                <div>

                                    <strong>
                                        Customer analytics generated
                                    </strong>

                                    <small>
                                        Customer segments updated
                                    </small>

                                </div>

                            </div>


                            <div className="activity-item">

                                <span className="activity-icon">
                                    📊
                                </span>

                                <div>

                                    <strong>
                                        Historical data validated
                                    </strong>

                                    <small>
                                        Sales and revenue records verified
                                    </small>

                                </div>

                            </div>


                            <div className="activity-item">

                                <span className="activity-icon">
                                    ✨
                                </span>

                                <div>

                                    <strong>
                                        Demand forecast generated
                                    </strong>

                                    <small>
                                        Predictive inventory recommendation created
                                    </small>

                                </div>

                            </div>

                        </div>

                    </section>


                </main>

            </div>

        </div>
    );
}

export default Vendor;