import axios from "axios";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import Button from "./Button.jsx";

const ProductCard = ({ product, restaurantName, handleEdit, isFavoritable, isOrderable, onRefresh }) => {
  const [favorite, setFavorite] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleStorageChange = (event) => {
      setTheme(localStorage.getItem("theme"));
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const elementsHE = document.getElementsByClassName("heart-empty-img");
    for (let i = 0; i < elementsHE.length; i++) {
      const element = elementsHE.item(i);
      console.log(element);
      element.src = theme === "dark" ? "/heart-empty.png" : "/heart-empty-black.png";
    }

    const elementsH = document.getElementsByClassName("heart-img");
    for (let i = 0; i < elementsH.length; i++) {
      const element = elementsH.item(i);
      element.src = theme === "dark" ? "/heart.png" : "/heart-black.png";
    }

    const elementsPen = document.getElementsByClassName("pen-img");
    for (let i = 0; i < elementsPen.length; i++) {
      const element = elementsPen.item(i);
      element.src = theme === "dark" ? "/pen.png" : "/pen-black.png";
    }

    const elementsPlus = document.getElementsByClassName("plus-img");
    for (let i = 0; i < elementsPlus.length; i++) {
      const element = elementsPlus.item(i);
      element.src = theme === "dark" ? "/plus.png" : "/plus-black.png";
    }
  }, [theme]);

  const goToProductPage = () => {
    navigate(`/product?id=${product.id}`);
  };

  if (isFavoritable) {
    useEffect(() => {
      axios.get(
        `http://localhost:8080/favourites/get/${product.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
        .then((res) => {
          if (res.data) setFavorite(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }, []);
  }

  const toggleHeart = async () => {
    try {
      if (!favorite) {
        await axios.post(
          `http://localhost:8080/favourites/add/${product.id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `http://localhost:8080/favourites/remove/${product.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
    setFavorite(!favorite);
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/customer/cart/add",
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            menuItemId: product.id,
            quantity: 1
          }
        }
      );
      console.log("Added product to cart:", response.data);
    } catch (error) {
      console.error("Could not add product to cart:", error);
    }
  };

  return (
    <div className="product-card">
      <div className="product-img" onClick={goToProductPage} style={{ cursor: "pointer" }}>
        Food Img
      </div>

      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-place">{restaurantName}</p>
        <p className="product-rating">{product.description}</p>
        <p className="product-price">
          {product.price}$
          {isOrderable ? (
            <>
              <Button
                classname="push-btn"
                label={(<img className="plus-img" src="/plus.png" alt={"+"} width={"60%"}/>)}
                onClick={addToCart}
                width={"25%"}
                borderRadius={"20px"}
                background={"#000000"}
              />
            </>
          ) : (handleEdit ? (
            <>
              <Button
                classname="push-btn"
                label={(<img className="pen-img" src="/pen.png" alt={"+"} width={"60%"}/>)}
                onClick={() => handleEdit(product)}
                width={"25%"}
                borderRadius={"20px"}
                background={"#000000"}
              />
            </>
          ) : null)}
          {isFavoritable && (
            <Button
              classname="heart-btn"
              label={favorite ? (
                <img className="heart-img" src="/heart.png" alt="❤️" width={"70%"}/>
              ) : (
                <img className="heart-empty-img" src="/heart-empty.png" alt="🤍" width={"70%"}/>
              )}
              onClick={toggleHeart}
              width={"25%"}
              borderRadius={"20px"}
              background={"#000000"}
            />
          )}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;