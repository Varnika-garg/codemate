import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to CodeMate 👋</h1>

           <div style={{ marginTop: "30px" }}>
    
    <button onClick={() => navigate("/practice")}>
        Practice
    </button>

    <button
        onClick={() => navigate("/rooms")}
        style={{ marginLeft: "20px" }}
    >
        Rooms
    </button>

    <button
        onClick={handleLogout}
        style={{ marginLeft: "20px", backgroundColor: "red", color: "white" }}
    >
        Logout
    </button>

</div>
        </div>
    );
}

export default Dashboard;