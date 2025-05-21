import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Restaurant.module.css";
import ProductCard from "../../modules/product/ProductCard.jsx";
import ProductFilters from "../../modules/product/ProductFilter.jsx";
import Button from "../../modules/general/Button.jsx";

const Restaurant = () => {
  const { restaurantId } = useParams();

  const [restaurantInfo, setRestaurantInfo] = useState({
    name: "Sample Restaurant",
    location: "123 Sample Street",
    picture: null,
    productCount: 3,
    averageRating: 4.5,
    minCartPrice: 20.0
  });

  // Sorting and Filtering
  const [sortOption, setSortOption] = useState("none");
  const [minPriceInput, setMinPriceInput] = useState(restaurantInfo.minCartPrice);
  const [minFilter, setMinFilter] = useState("");
  const [maxFilter, setMaxFilter] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");

  // Products List
  const [products, setProducts] = useState([]);
  const [rawProducts, setRawProducts] = useState([]);

  // Misc.
  const [rank, setRank] = useState(localStorage.getItem("rank"));
  const [registered, setRegistered] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/restaurant/menu/items/${restaurantId}`, null)
      .then(res => {
        setRawProducts(res.data);
        setProducts(res.data);
      })
      .catch(err => console.error("Failed to fetch products:", err));

    axios.get(`http://localhost:8080/restaurant/menu/info/${restaurantId}`, null)
      .then(res => {
        restaurantInfo.name = res.data.name;
        restaurantInfo.minCartPrice = res.data.minimumCart;
        restaurantInfo.picture = res.data.picture;
        restaurantInfo.averageRating = res.data.rating ? res.data.rating : 0;

        setMinPriceInput(restaurantInfo.minCartPrice);
      })
      .catch(err => console.error("Failed to fetch restaurant info:", err));

    axios.get(`http://localhost:8080/restaurant/menu/address/${restaurantId}`, null)
      .then(res => {
        restaurantInfo.location = res.data.details;
      })
      .catch(err => console.error("Failed to fetch restaurant address:", err));

    if (rank === "COURIER") {
      axios.get(`http://localhost:8080/courier/registered-restaurants`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].id === Number(restaurantId)) setRegistered(true);
          }
        })
        .catch(err => console.error("Failed to fetch restaurant address:", err));
    }
  }, []);

  const handleRegisterButton = () => {
    if (registered) {
      axios.delete("http://localhost:8080/courier/unregister", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          restaurantId: restaurantId
        }
      }).then((res) => {
        setRegistered(false);
      }).catch((err) => console.error(err));
    } else {
      axios.post("http://localhost:8080/courier/register", null, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          restaurantId: restaurantId
        }
      }).then((res) => {
        setRegistered(true);
      }).catch((err) => console.error(err));
    }
  }

  const registerButton = (
    <Button
      id={"register-button"}
      label={"Register as employee"}
      onClick={handleRegisterButton}
      width={"100%"}
      borderRadius={"10px"}
      useLighter={true}
    />);

  const unregisterButton = (
    <Button
      id={"register-button"}
      label={"Unregister as employee"}
      onClick={handleRegisterButton}
      width={"100%"}
      borderRadius={"10px"}
      useLighter={true}
    />);

  const sortProducts = (option) => {
    setSortOption(option);
    let sorted = [...rawProducts];
    if (option === "lowest") sorted.sort((a, b) => a.price - b.price);
    if (option === "highest") sorted.sort((a, b) => b.price - a.price);
    if (option === "popular") sorted.sort((a, b) => b.popularity - a.popularity);
    if (option === "new") sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (option === "rated") sorted.sort((a, b) => b.rating - a.rating);
    setProducts(sorted);
  };

  const filterProducts = (cuisine = selectedCuisine) => {
    const min = minFilter === "" ? 0 : Number(minFilter);
    const max = maxFilter === "" ? Infinity : Number(maxFilter);
    const filtered = rawProducts.filter(p =>
      p.price >= min &&
      p.price <= max
    );
    setProducts(filtered);
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.restaurantHeader}>
        <div className={styles.restaurantMain}>
          <div className={styles.restaurantLogo}>
            <img src={"data:image/jpeg;base64," + restaurantInfo.picture} alt={"Restaurant Logo"} className={styles.restaurantLogoImg}/>
          </div>
          <div className={styles.restaurantInfo}>
            <p>{restaurantInfo.name}</p>
            <p>{restaurantInfo.location}</p>
            <p>Product Count: {products.length}</p>
            <p>Average Rating: {restaurantInfo.averageRating}⭐️</p>
            <p>Minimum Cart Price: {restaurantInfo.minCartPrice}$</p>
          </div>
        </div>
        {rank === "COURIER" ? (
          <div className={styles.buttonContainer} id={"registerButtonContainer"}>
            {registered ? unregisterButton : registerButton}
          </div>
        ) : (<></>)}
      </div>

      <hr className={styles.divider} />

      <div className={styles.dashboardBody}>
        <div className={styles.filter}>
          <ProductFilters
            sortProducts={sortProducts}
            setSelectedCuisine={setSelectedCuisine}
            filterProducts={filterProducts}
            minFilter={minFilter}
            maxFilter={maxFilter}
            setMinFilter={setMinFilter}
            setMaxFilter={setMaxFilter}
          />
        </div>
        <div className={styles.rightPanel}>
          <h3 className={styles.productLabel}>Products</h3>
          <div className={styles.products}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                restaurantName={restaurantInfo.name}
                handleEdit={null}
                isFavoritable={rank === "CUSTOMER"}
                isOrderable={rank === "CUSTOMER"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
