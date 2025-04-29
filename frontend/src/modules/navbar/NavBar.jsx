import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import styles from "./NavBar.module.css"

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
    <div className={styles.navbar}>
      <div className={styles.silverforkheader}>
        <p className={styles.silverforktext}>SilverFork</p>
      </div>
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
            <div>
              <Link to="/login">Login</Link>
            </div>
            <div>            
              <Link to="/signup">Signup</Link>
            </div>
            <div>            
              <Link to="/manage-user">Manage User</Link>
            </div>
            <div>            
              <Link to="/cart">Cart</Link>
            </div>
            <div>            
              <Link to="/restaurant-dashboard">Restaurant Dashboard</Link>
            </div>
            <div>            
              <Link to="/favourites">Favourites</Link>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
