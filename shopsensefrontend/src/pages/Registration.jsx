import React, { useState } from "react";
import "./Registration.css";
import AnimatedBackground from "../Components/AnimatedBackground";

function Registration() {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (
      !businessName ||
      !ownerName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: businessName,
          owner_name: ownerName,
          phone: phone,
          address: "Not Provided",
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        alert("Registration Successful!");

        // Clear the form
        setBusinessName("");
        setOwnerName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const error = await response.json();
        alert(error.detail || "Registration Failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Server not responding.");
    }
  };

  return (
    <>
      <AnimatedBackground />

      <div className="register">
        <h1>ShopSense</h1>
        <h3>Create Vendor Account</h3>

        <div className="register1">
          <label>Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <label>Owner Name</label>
          <input
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button onClick={handleRegister}>Register</button>

          <a href="#">Already have an account?</a>

          <button>Login</button>
        </div>
      </div>
    </>
  );
}

export default Registration;