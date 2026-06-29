import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [text, setText] = useState("");

  const fullText = "Welcome Back to CodeMate";

  // typing animation
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
      const res = await axios.post(
        "https://codemate-backend-rhj8.onrender.com/api/users/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(true);
      setErrorMsg("Invalid email or password ❌");

      setTimeout(() => {
        setError(false);
        setErrorMsg("");
      }, 2000);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.stars} />
<div style={styles.stars2} />
<div style={styles.stars3} />

      <div
        style={{
          ...styles.card,
          ...(error ? styles.shakeStrong : {}),
        }}
      >
        <h2 style={styles.title}>{text}</h2>

        <p style={styles.subtitle}>
          Login to continue your coding journey
        </p>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div style={styles.errorBox}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
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
            Login
          </button>
        </form>
      </div>

      {/* ANIMATIONS */}
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
        @keyframes shakeStrong {
          0% { transform: translateX(0); }
          10% { transform: translateX(-12px); }
          20% { transform: translateX(12px); }
          30% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          50% { transform: translateX(-8px); }
          60% { transform: translateX(8px); }
          70% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
          .card:hover {
  transform: translateY(-12px) scale(1.02);
}
  @keyframes moveStars {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}
      `}</style>
    </div>
  );
}

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

orb1: {
  position: "absolute",
  width: "500px",
  height: "500px",
  background: "radial-gradient(circle, rgba(124,156,255,0.25), transparent 70%)",
  filter: "blur(80px)",
  top: "10%",
  left: "10%",
  animation: "float 6s ease-in-out infinite",
},

orb2: {
  position: "absolute",
  width: "450px",
  height: "450px",
  background: "radial-gradient(circle, rgba(74,222,222,0.2), transparent 70%)",
  filter: "blur(80px)",
  bottom: "10%",
  right: "10%",
  animation: "float 7s ease-in-out infinite",
},

  card: {
    width: "380px",
    padding: "40px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(124,156,255,0.25)",
animation: "cardFloat 6s ease-in-out infinite",
 transition: "0.3s ease",
backdropFilter: "blur(25px)",
boxShadow:
  "0 0 50px rgba(124,156,255,0.15), 0 20px 80px rgba(0,0,0,0.6)",
    textAlign: "center",
    zIndex: 2,
  },

  shakeStrong: {
    animation: "shakeStrong 0.6s",
  },

  errorBox: {
    background: "rgba(255, 80, 80, 0.15)",
    border: "1px solid rgba(255, 80, 80, 0.5)",
    color: "#ff6b6b",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "12px",
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
};

export default Login;