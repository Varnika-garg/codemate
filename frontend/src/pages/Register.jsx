import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
    color: "#fff",
    background:
      "linear-gradient(-45deg, #020617, #0a1a3a, #000)",
    backgroundSize: "400% 400%",
    animation: "gradientMove 10s ease infinite",
    overflow: "hidden",
    position: "relative",
  },

  stars: {
    position: "absolute",
  },
  stars2: {
    position: "absolute",
  },
  stars3: {
    position: "absolute",
  },

  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(124,156,255,0.25)",
    animation: "cardFloat 6s ease-in-out infinite",
    backdropFilter: "blur(25px)",
    boxShadow:
      "0 0 50px rgba(124,156,255,0.15), 0 20px 80px rgba(0,0,0,0.6)",
    textAlign: "center",
  },

  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  subtitle: {
    fontSize: "13px",
    color: "#9aa4b2",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(124,156,255,0.2)",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    outline: "none",
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(90deg,#4adede,#7c9cff,#a855f7)",
    backgroundSize: "200% 200%",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  link: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#7c9cff",
    cursor: "pointer",
  },
};
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [text, setText] = useState("");
  const fullText = "Create Your CodeMate Account";

  // typing animation (same as login)
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://codemate-backend-rhj8.onrender.com/api/users/register",
        form
      );

      alert("Registered Successfully ✅");
      navigate("/login");
    } catch (err) {
      alert("Registration Failed ❌");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.stars} />
      <div style={styles.stars2} />
      <div style={styles.stars3} />

      <div style={styles.card}>
        <h2 style={styles.title}>{text}</h2>

        <p style={styles.subtitle}>
          Join CodeMate and start your coding journey
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p
          onClick={() => navigate("/login")}
          style={styles.link}
        >
          Already have an account? Login
        </p>
      </div>

      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes cardFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}

export default Register;