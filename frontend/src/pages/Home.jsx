import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            
            <h1>Welcome to CodeMate 🚀</h1>
            <p>Your DSA Practice & Collaboration Platform</p>

            <div style={{ marginTop: "40px" }}>
                
                <button
                    onClick={() => navigate("/login")}
                    style={{ marginRight: "20px", padding: "10px 20px" }}
                >
                    Login
                </button>

                <button
                    onClick={() => navigate("/register")}
                    style={{ padding: "10px 20px" }}
                >
                    Register
                </button>

            </div>
        </div>
    );
}

export default Home;