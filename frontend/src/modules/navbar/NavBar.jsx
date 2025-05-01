import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./NavBar.module.css"
import Button from "../general/Button.jsx";
import axios from "axios";

function NavBar() {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [rank, setRank] = useState(localStorage.getItem("rank"));
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    function handleEnter(event) {
      if (event.key === "Enter") {
        axios({
          method: "GET",
          url: "http://localhost:8080/search/product",
          params: {
            name: search
          }
        }).then((res) => {
          sessionStorage.setItem("search-results", JSON.stringify(res.data));
        }).catch((err) => {
          console.error(err);
        });
        navigate("/search-result");
      }
    }

    window.addEventListener('keypress', handleEnter);
    return () => window.removeEventListener('keypress', handleEnter);
  }, []);

  useEffect(() => {
    function handleInput(event) {
      if (event.target.className === styles.searchBar) {
        setSearch(event.target.value);
      }
    }

    window.addEventListener('input', handleInput);
    return () => window.removeEventListener('input', handleInput);
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
              onClick={handleCartButton}
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

  return (
    <div className={styles.navbar}>
      <div className={styles.silverforkheader}>
        <a href={"/"}>
          <p className={styles.silverforktext}>SilverFork</p>
        </a>
      </div>
      <div className={styles.links}>
        <input className={styles.searchBar} type="text" placeholder="Search for a product..."/>
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
