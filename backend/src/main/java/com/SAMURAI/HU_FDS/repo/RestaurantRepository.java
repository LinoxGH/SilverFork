package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByOwnerUsername(String username);

    Optional<Restaurant> findById(Long id);

    Optional<Restaurant> findByName(String name);

    List<Restaurant> findByNameContainingIgnoreCase(String name);
    List<Restaurant> findByCategoryIgnoreCase(String category);
    List<Restaurant> findByCuisineIgnoreCase(String cuisine);
    List<Restaurant> findByRatingGreaterThanEqual(Double rating);
    List<Restaurant> findByCategoryIgnoreCaseAndCuisineIgnoreCase(String category, String cuisine);
    List<Restaurant> findByCategoryIgnoreCaseAndRatingGreaterThanEqual(String category, Double rating);
    List<Restaurant> findByCuisineIgnoreCaseAndRatingGreaterThanEqual(String cuisine, Double rating);

    List<Restaurant> findByCategoryIgnoreCaseAndCuisineIgnoreCaseAndRatingGreaterThanEqual(String category, String cuisine, Double rating);
}
