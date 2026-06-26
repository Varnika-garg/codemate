import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5000/api/users/register", form);

            alert("Registered Successfully ✅");

            navigate("/login");

        } catch (err) {
            console.log(err);
            alert("Registration Failed ❌");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "80px" }}>
            <h2>Register Page</h2>

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={form.name}
                />
                <br /><br />

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={form.email}
                />
                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={form.password}
                />
                <br /><br />

                <button type="submit">Register</button>
            </form>

            <p onClick={() => navigate("/login")} style={{ cursor: "pointer", marginTop: "10px" }}>
                Already have an account? Login
            </p>
        </div>
    );
}

export default Register;