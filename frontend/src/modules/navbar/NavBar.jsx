import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername("");
  };
  return (
    <nav className={styles.navbar}>
      <h2>SilverFork</h2>
      <div className={styles.links}>
        {username ? (
          <>
            <span className={styles.username}>Hello, {username}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
            <Link to="/manage-user">Manage User</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
