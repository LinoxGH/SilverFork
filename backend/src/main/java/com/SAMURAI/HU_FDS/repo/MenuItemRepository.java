package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurant(Restaurant restaurant);

    List<MenuItem> findByNameContainingIgnoreCase(String name);
    List<MenuItem> findByCategoryIgnoreCase(String category);
    List<MenuItem> findByCuisineIgnoreCase(String cuisine);
    List<MenuItem> findByPopularityGreaterThanEqual(Integer popularity);
    List<MenuItem> findByCategoryIgnoreCaseAndCuisineIgnoreCase(String category, String cuisine);

    List<MenuItem> findByCategoryIgnoreCaseAndCuisineIgnoreCaseAndPopularityGreaterThanEqual(String category, String cuisine, Integer popularity);

    List<MenuItem> findByCategoryIgnoreCaseAndPopularityGreaterThanEqual(String category, Integer popularity);

    List<MenuItem> findByCuisineIgnoreCaseAndPopularityGreaterThanEqual(String cuisine, Integer popularity);
}
