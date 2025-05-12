import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./NavBar.module.css"
import Button from "../general/Button.jsx";

function NavBar() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [rank, setRank] = useState(localStorage.getItem("rank"));
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = (event) => {
      setUsername(localStorage.getItem("username"));
      setRank(localStorage.getItem("rank"));
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

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

  function handleAdminButton() {
    navigate("/admin-dashboard");
  }

  const rankButtons = (rank) => {
    switch (rank) {
      case "CUSTOMER":
        return (
          <>
            <Button
              label={(<img src="/heart.png" alt={"cart"} width="55%"/>)}
              onClick={handleFavoriteButton}
              width={"3%"}
              borderRadius={"20px"}
              background={"#000000"}/>
            <Button
              label={(<img src="/shopping-cart.png" alt={"cart"} width="55%"/>)}
              onClick={handleCartButton}
              width={"3%"}
              borderRadius={"20px"}
              background={"#000000"}/>
          </>
        );
      case "RESTAURANT":
        return (
          <>
            <Button
              label={"Restaurant Dashboard"}
              onClick={handleRestaurantButton}
              width={"20%"}
              borderRadius={"10px"}
              background={"#000000"}/>
          </>
        );
      case "COURIER":
        return (
          <>
          </>
        );
      case "ADMIN":
        return (
          <>
            <Button
              label={"Admin Dashboard"}
              onClick={handleAdminButton}
              width={"16%"}
              borderRadius={"10px"}
              background={"#000000"}/>
          </>
        );
    }
  }
  
  function handleToggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
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
          label="☀️ / 🌙"
          onClick={handleToggleTheme}
          width={"5%"}
          borderRadius={"10px"}
          background={"#000000"}
        />
        {username ? ( // If user is logged in.
          <>
            {rankButtons(rank)}
            <Button
              label={username}
              onClick={handleManageUserButton}
              width={"10%"}
              borderRadius={"10px"}
              background={"#000000"}/>
            <Button
              label={"Logout"}
              onClick={handleLogoutButton}
              width={"10%"}
              borderRadius={"10px"}
              background={"#000000"}/>
          </>
        ) : ( // If not logged in.
          <>
            <Button
              label={"Login"}
              onClick={handleLoginButton}
              width={"10%"}
              borderRadius={"10px"}
              background={"#000000"}/>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
