import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import AnimatedBackground from "../Components/AnimatedBackground";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("Vendor");

    const handleLogin = async () => {

        if (!email || !password) {
            alert("Please enter Email and Password");
            return;
        }

        try {

            const response = await fetch("http://127.0.0.1:8000/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });

            const data = await response.json();

            if (response.ok) {

                alert("Login Successful!");

                localStorage.setItem("token", data.access_token);
                localStorage.setItem("role", data.role);

                if (data.role === "Vendor") {

                    navigate("/vendor");

                } else {

                    navigate("/admin");

                }

            } else {

                alert(data.detail);

            }

        } catch (error) {

            console.error(error);
            alert("Server Error");

        }

    };

    return (
        <>
            <AnimatedBackground />

            <div className="login-cont">

                <h1>ShopSense</h1>

                <div className="loginp">

                    <h4>Welcome Back</h4>

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <a href="/forgotpassword">
                        Forgot Password?
                    </a>

                    <label>Login As:</label>

                    <div className="radios">

                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="Admin"
                                checked={role === "Admin"}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            Admin
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="Vendor"
                                checked={role === "Vendor"}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            Vendor
                        </label>

                    </div>

                    <button
                        className="loginbtn"
                        onClick={handleLogin}
                    >
                        Login
                    </button>

                    <a href="/register">
                        Register as Vendor
                    </a>

                </div>

            </div>
        </>
    );
}

export default Login;