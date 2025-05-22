import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./NavBar.module.css"
import Button from "../general/Button.jsx";

function NavBar() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [rank, setRank] = useState(localStorage.getItem("rank"));
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event) => {
      setUsername(localStorage.getItem("username"));
      setRank(localStorage.getItem("rank"));
      setTheme(localStorage.getItem("theme"));
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const heart = document.getElementById("heart-img");
    if (heart != null) heart.src = theme === "dark" ? "/heart.png" : "/heart-black.png";

    const shoppingCart = document.getElementById("shopping-cart-img");
    if (shoppingCart != null) shoppingCart.src = theme === "dark" ? "/shopping-cart.png" : "/shopping-cart-black.png";

    const alert = document.getElementById("alert-img");
    if (alert != null) alert.src = theme === "dark" ? "/alert.png" : "/alert-black.png";
  }, [theme]);

  const fetchNotifications = () => {
    const token = localStorage.getItem("token");
    if (!token || !username) return;

    fetch("http://localhost:8080/notifications/list?status=both", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Sort: unread first
        const sorted = data.sort((a, b) => a.status === "UNREAD" ? -1 : 1);
        setNotifications(sorted);
      })
      .catch(err => console.error("Fetch error", err));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // every 60s
    return () => clearInterval(interval);
  }, [username]);

  const toggleDropdown = () => {
    const newState = !showDropdown;
    setShowDropdown(newState);

    if (!newState) {
      markAllAsRead();
    }
  };

  const markAllAsRead = () => {
    const token = localStorage.getItem("token");
    notifications.forEach(n => {
      if (n.status === "UNREAD") {
        fetch(`http://localhost:8080/notifications/mark/${n.id}`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }).catch(err => console.error("Failed to mark as read", err));
      }
    });

    // Optimistically update UI
    setNotifications(prev =>
      prev.map(n => ({ ...n, status: "READ" }))
    );
  };

  const handleDeleteNotification = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/notifications/delete/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }
      })
      .catch(err => console.error("Delete failed", err));
  };

  function handleLogoutButton() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("rank");
    setUsername("");
    navigate("/");
  }

  function handleLoginButton() {
    navigate("/login");
  }

  function handleCartButton() {
    navigate("/cart");
  }

  function handleFavoriteButton() {
    navigate("/favourites");
  }

  function handleManageUserButton() {
    navigate("/manage-user");
  }

  function handleRestaurantButton() {
    navigate("/restaurant-dashboard");
  }

  function handleCourierButton() {
    navigate("/courier-dashboard");
  }

  function handleAdminButton() {
    navigate("/admin-dashboard");
  }

  function handleToggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setTheme(isDark ? "dark" : "light");
    window.dispatchEvent(new Event("storage"));
  }

  const rankButtons = (rank) => {
    switch (rank) {
      case "CUSTOMER":
        return (
          <>
            <Button
              label={(<img id="heart-img" src={theme === "dark" ? "/heart.png" : "/heart-black.png"} alt={"cart"} width="55%"/>)}
              onClick={handleFavoriteButton}
              width={"3%"}
              borderRadius={"20px"}/>
            <Button
              label={(<img id="shopping-cart-img" src={theme === "dark" ? "/shopping-cart.png" : "/shopping-cart-black.png"} alt={"cart"} width="55%"/>)}
              onClick={handleCartButton}
              width={"3%"}
              borderRadius={"20px"}/>
          </>
        );
      case "RESTAURANT":
        return (
          <>
            <Button
              label={"Dashboard"}
              onClick={handleRestaurantButton}
              width={"16%"}
              borderRadius={"10px"}/>
          </>
        );
      case "COURIER":
        return (
          <>
            <Button
              label={"Dashboard"}
              onClick={handleCourierButton}
              width={"16%"}
              borderRadius={"10px"}/>
          </>
        );
      case "ADMIN":
        return (
          <>
            <Button
              label={"Dashboard"}
              onClick={handleAdminButton}
              width={"16%"}
              borderRadius={"10px"}/>
          </>
        );
    }
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.silverforkheader}>
        <a href={"/"}>
          <img src="/logo-noname.png" width="46px"/>
        </a>
        <a href={"/"}>
          <p className={styles.silverforktext}>SilverFork</p>
        </a>
      </div>
      <div className={styles.links}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Search for a product..."
          onChange={(event) => {
            setSearch(event.target.value)
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              navigate(`/search-result/${encodeURIComponent(search)}`);
            }
          }}/>
        <Button
          label={"Change Theme"}
          onClick={handleToggleTheme}
          width={"17%"}
          borderRadius={"10px"}
        />
        {username ? ( // If user is logged in.
          <>
            {rankButtons(rank)}
            <div className={styles.notificationContainer}>
              <div style={{ position: "relative" }}>
                <Button
                  label={(
                    <img id="alert-img" src={theme === "dark" ? "/alert.png" : "/alert-black.png"} alt={"🔔"} width="20.8px"/>
                  )}
                  onClick={toggleDropdown}
                  borderRadius={"10px"}
                />
                {notifications.some(n => n.status === "UNREAD") && (
                  <div className={styles.notificationBadge}>
                    {notifications.filter(n => n.status === "UNREAD").length}
                  </div>
                )}
              </div>

              {showDropdown && (
                <div ref={dropdownRef} className={styles.notificationDropdown}>
                  {notifications.length === 0 ? (
                    <p>No notifications.</p>
                  ) : (
                    notifications.map((n, index) => (
                      <div
                        key={index}
                        className={`${styles.notificationItem} ${n.status === "UNREAD" ? styles.notificationUnread : ""}`}
                      >
                        <div className={styles.notificationMessage}>{n.message}</div>
                        <span
                          className={styles.notificationDelete}
                          onClick={() => handleDeleteNotification(n.id)}
                        >
                          ❌
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <Button
              label={username}
              onClick={handleManageUserButton}
              width={"14%"}
              borderRadius={"10px"}/>
            <Button
              label={"Logout"}
              onClick={handleLogoutButton}
              width={"10%"}
              borderRadius={"10px"}/>
          </>
        ) : ( // If not logged in.
          <>
            <Button
              label={"Login"}
              onClick={handleLoginButton}
              width={"10%"}
              borderRadius={"10px"}/>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
