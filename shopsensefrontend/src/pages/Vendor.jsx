import React, { useEffect, useState } from "react";
import "./Vendor.css";
import AnimatedBackground from "../Components/AnimatedBackground";
import { Link } from "react-router-dom";

function Vendor() {

    const [analytics, setAnalytics] = useState({
        total_products: 0,
        revenue: 0
    });

    useEffect(() => {

        fetchAnalytics();

    }, []);

    const fetchAnalytics = async () => {

        try {

            // Change vendor id later after JWT
            const vendorId = 1;

            const response = await fetch(
                `http://127.0.0.1:8000/analytics/${vendorId}`
            );

            const data = await response.json();

            if (response.ok) {

                setAnalytics(data);

            }

        }

        catch (error) {

            console.log(error);

        }

    };

    return (
        <>
            <AnimatedBackground />

            <div className="vendordashboard">

                <div className="vendordetail">

                    <header>

                        <h1>ShopSense</h1>

                        <h1>🔔 Notifications</h1>

                        <h1>👤 Vendor : Deepika</h1>

                    </header>

                </div>

                <div className="dashboard-main">

                    <div className="vlinks">

                        <aside>

                            <a href="#">Dashboard</a>

                            <a href="#">My Profile</a>

                            <a href="#">Products</a>

                            <a href="#">Logout</a>

                        </aside>

                    </div>

                    <div className="dashboard-content">

                        <h2>Welcome Back, Deepika 👋</h2>

                        <p>Here's your business overview today.</p>

                        <section>

                            <div className="Cards">

                                <div className="card1">

                                    <h4>Total Sales</h4>

                                    <h3>₹ {analytics.revenue}</h3>

                                </div>

                                <div className="card1">

                                    <h4>Revenue</h4>

                                    <h3>₹ {analytics.revenue}</h3>

                                </div>

                                <div className="card1">

                                    <h4>Products</h4>

                                    <h3>{analytics.total_products}</h3>

                                </div>

                            </div>

                            <div className="quick">

                                <h4>Quick Actions</h4>

                                <button onClick={() => navigate("/products")}>
                                    + Add Product
                                </button>

                                <button>My Profile</button>

                                <button>Analytics</button>

                            </div>

                            <div className="recentact">

                                <h4>Recent Activity</h4>

                                <h5>Product "Shoes" sold - ₹1200</h5>

                                <h5>Product "Watch" sold - ₹2500</h5>

                                <h5>Product "Headphones" sold - ₹1800</h5>

                            </div>

                        </section>

                    </div>

                </div>

            </div>

        </>
    );
}

export default Vendor;