import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Vendor");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        if (!email || !password) {
            alert("Please enter Email and Password");
            return;
        }

        try {

            setLoading(true);

            const response = await fetch(
                "http://127.0.0.1:8000/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();

            console.log("LOGIN RESPONSE:", data);


            // =========================
            // LOGIN FAILED
            // =========================

            if (!response.ok) {

                alert(
                    data.detail ||
                    "Invalid Email or Password"
                );

                return;
            }


            // =========================
            // GET VENDOR ID
            // =========================

            const vendorId = data.vendor_id;


            console.log(
                "Logged in Vendor ID:",
                vendorId
            );


            // =========================
            // SAVE LOGIN INFORMATION
            // =========================

            localStorage.setItem(
                "token",
                data.access_token
            );

            localStorage.setItem(
                "role",
                data.role
            );

            localStorage.setItem(
                "email",
                data.email
            );


            // =========================
            // SAVE VENDOR ID
            // =========================

            if (
                vendorId !== undefined &&
                vendorId !== null
            ) {

                localStorage.setItem(
                    "vendor_id",
                    String(vendorId)
                );

            }


            console.log(
                "STORED VENDOR ID:",
                localStorage.getItem("vendor_id")
            );


            // =========================
            // LOGIN SUCCESS
            // =========================

            alert("Login Successful!");


            // =========================
            // REDIRECT
            // =========================

            if (
                data.role &&
                data.role.toLowerCase() === "vendor"
            ) {

                navigate("/Vendordashboard");

            } else {

                navigate("/admin");

            }

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-container">

                <h1>ShopSense</h1>

                <h2>Welcome Back</h2>


                <form onSubmit={handleLogin}>


                    {/* EMAIL */}

                    <div className="input-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="input-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                        />

                    </div>


                    {/* FORGOT PASSWORD */}

                    <div className="forgot-password">

                        <a
                            href="/forgotpwd"
                            onClick={(e) => {

                                e.preventDefault();

                                navigate("/forgot-password");

                            }}
                        >
                            Forgot Password?
                        </a>

                    </div>


                    {/* LOGIN AS */}

                    <div className="login-as">

                        <p>
                            Login As:
                        </p>


                        <label>

                            <input
                                type="radio"
                                name="role"
                                value="Admin"
                                checked={role === "Admin"}
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
                            />

                            Admin

                        </label>


                        <label>

                            <input
                                type="radio"
                                name="role"
                                value="Vendor"
                                checked={role === "Vendor"}
                                onChange={(e) =>
                                    setRole(e.target.value)
                                }
                            />

                            Vendor

                        </label>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>


                </form>


                {/* REGISTER */}

                <div className="register-link">

                    <a
                        href="/register"
                        onClick={(e) => {

                            e.preventDefault();

                            navigate("/register");

                        }}
                    >
                        Register as Vendor
                    </a>

                </div>


            </div>

        </div>

    );

}


export default Login;