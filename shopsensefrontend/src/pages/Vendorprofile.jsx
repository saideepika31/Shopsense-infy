import React, { useState } from "react";
import "./Vendorprofile.css";
import { useNavigate } from "react-router-dom";

function Vendorprofile() {

    const navigate = useNavigate();

    const [businessName, setBusinessName] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const [email, setEmail] = useState(
        localStorage.getItem("email") || ""
    );
    const [phone, setPhone] = useState("");
    const [gstNumber, setGstNumber] = useState("");
    const [address, setAddress] = useState("");

    const handleSubmit = (e) => {

        e.preventDefault();

        alert("Vendor profile updated successfully!");

        console.log({
            businessName,
            ownerName,
            email,
            phone,
            gstNumber,
            address
        });
    };

    return (

        <div className="vendor-profile-page">

            {/* ================= HEADER ================= */}

            <header className="profile-header">

                <div
                    className="profile-logo"
                    onClick={() => navigate("/Vendordashboard")}
                >
                    ShopSense
                </div>

                <div className="profile-header-right">

                    <span>🔔 Notifications</span>

                    <span>
                        👤 Vendor :{" "}
                        {localStorage.getItem("email") || "Vendor"}
                    </span>

                </div>

            </header>


            {/* ================= MAIN ================= */}

            <main className="profile-main">

                {/* BACK BUTTON */}

                <button
                    className="back-button"
                    onClick={() => navigate("/Vendordashboard")}
                >
                    ← Back to Dashboard
                </button>


                {/* PROFILE CARD */}

                <div className="profile-card">

                    <div className="profile-title">

                        <div className="profile-icon">
                            👤
                        </div>

                        <div>
                            <h1>Vendor Profile</h1>

                            <p>
                                Manage your business information
                            </p>
                        </div>

                    </div>


                    {/* FORM */}

                    <form
                        className="vendor-profile-form"
                        onSubmit={handleSubmit}
                    >

                        {/* BUSINESS NAME */}

                        <div className="form-group">

                            <label>
                                Business Name
                            </label>

                            <input
                                type="text"
                                value={businessName}
                                onChange={(e) =>
                                    setBusinessName(e.target.value)
                                }
                                placeholder="Enter business name"
                            />

                        </div>


                        {/* OWNER NAME */}

                        <div className="form-group">

                            <label>
                                Owner Name
                            </label>

                            <input
                                type="text"
                                value={ownerName}
                                onChange={(e) =>
                                    setOwnerName(e.target.value)
                                }
                                placeholder="Enter owner name"
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter email"
                            />

                        </div>


                        {/* PHONE */}

                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                placeholder="Enter phone number"
                            />

                        </div>


                        {/* GST */}

                        <div className="form-group">

                            <label>
                                GST Number
                            </label>

                            <input
                                type="text"
                                value={gstNumber}
                                onChange={(e) =>
                                    setGstNumber(e.target.value)
                                }
                                placeholder="Enter GST number"
                            />

                        </div>


                        {/* ADDRESS */}

                        <div className="form-group full-width">

                            <label>
                                Business Address
                            </label>

                            <textarea
                                value={address}
                                onChange={(e) =>
                                    setAddress(e.target.value)
                                }
                                placeholder="Enter business address"
                                rows="4"
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="profile-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    navigate("/Vendordashboard")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="update-button"
                            >
                                Update Profile
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default Vendorprofile;