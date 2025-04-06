import { useState } from 'react';
import styles from './Login.module.css';
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';

// Navbar Bileşeni
function NavBar() {
  return <div className={styles.navbar}></div>;
}

// Login Başlık Bileşeni
function LoginTitle() {
  return (
    <div className={styles.titleContainer}>
      <h2 className={styles.title}>Login</h2>
      <hr className={styles.line} />
    </div>
  );
}

// Login Form Bileşeni
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      alert("Login successful!");
      navigate("/manageuser"); 
      return;
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
        required
      />
      <BottomSection />
    </form>
  );
}

// Forgot Password ve Login Butonu Bölümü
function BottomSection() {
  return (
    <div className={styles.bottomSection}>
      <a href="#" className={styles.forgot}>Forgot my password</a>
      <button type="submit" className={styles.button}>Login</button>
    </div>
  );
}

// Don't Have an Account & Signup Bölümü
function AccountSection() {
  const navigate = useNavigate();
  return (
    <div className={styles.accountSection}>
      <hr className={styles.bottomLine} />
      <p className={styles.accountText}>Don't you have an account?</p>
      <button className={styles.signupButton} onClick={() => navigate("/signup")}>
        Signup
      </button>
    </div>
  );
}

// Ana Login Bileşeni
function Login() {
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.loginContainer}>
        <LoginTitle />
        <LoginForm />
        <AccountSection />
      </div>
    </div>
  );
}

export default Login;
    