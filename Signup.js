import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseClient";
import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError(null);
    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert("Signup successful! Please check your email for verification.");
      navigate("/");
    } catch (error) {
      setError(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignup}>Sign Up</button>
      <p onClick={() => navigate("/")} className="login-link">
        Already have an account? Log in
      </p>
    </div>
  );
}

export default Signup;
