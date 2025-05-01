import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Signup.module.css';
import axios from "axios";

function SignupTitle() {
  return (
    <div className={styles.titleContainer}>
      <h2 className={styles.title}>Signup</h2>
      <hr className={styles.line} />
    </div>
  );
}

function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    axios({
      method: 'POST',
      url: 'http://localhost:8080/signup',
      headers: {},
      data: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        rank: "CUSTOMER"
      }
    }).then((res) => {
      navigate("/login");
    })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className={styles.input}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className={styles.input}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className={styles.input}
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className={styles.input}
        required
      />
      <button type="submit" className={styles.createButton}>Create</button>
    </form>
  );
}

function BottomLine() {
  return <hr className={styles.bottomLine} />;
}

function Signup() {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <div className={styles.signupContainer}>
        <SignupTitle />
        <SignupForm />
        <BottomLine />
        <p className={styles.haveAccountText}>You already have an account?</p>
        <button className={styles.loginBackButton} onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Signup;
