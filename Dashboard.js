import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./supabaseClient";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        navigate("/"); 
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      alert("You have successfully logged out.");
      navigate("/");
    } catch (error) {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard {user?.email}</h1>
      <button onClick={() => navigate("/upload")} className="dashboard-button">
        Upload Project
      </button>
      <button onClick={() => navigate("/view-projects")} className="dashboard-button">
        View Projects
      </button>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
