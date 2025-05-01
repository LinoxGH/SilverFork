package com.SAMURAI.HU_FDS.service;


import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.repo.MenuItemRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {
    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;


    public List<MenuItem> searchMenuItems(String keyword) {
        return menuItemRepository.findByNameContainingIgnoreCase(keyword).stream().filter(item -> !item.getHidden()).toList();
    }


    public List<Restaurant> searchRestaurants(String keyword) {
        return restaurantRepository.findByNameContainingIgnoreCase(keyword);
    }



    public List<MenuItem> filterMenuItems(String category, String cuisine, Integer popularity) {
        List<MenuItem> result = new ArrayList<>();
        if (category != null && cuisine != null && popularity != null) {
            result = menuItemRepository.findByCategoryIgnoreCaseAndCuisineIgnoreCaseAndPopularityGreaterThanEqual(category, cuisine, popularity);
        } else if (category != null && cuisine != null) {
            result = menuItemRepository.findByCategoryIgnoreCaseAndCuisineIgnoreCase(category, cuisine);
        } else if (category != null && popularity != null) {
            result = menuItemRepository.findByCategoryIgnoreCaseAndPopularityGreaterThanEqual(category,popularity);
        } else if (cuisine != null && popularity != null) {
            result = menuItemRepository.findByCuisineIgnoreCaseAndPopularityGreaterThanEqual(cuisine, popularity);
        } else if (category != null) {
            result = menuItemRepository.findByCategoryIgnoreCase(category);
        } else if (cuisine != null) {
            result = menuItemRepository.findByCuisineIgnoreCase(cuisine);
        } else if (popularity != null) {
            result = menuItemRepository.findByPopularityGreaterThanEqual(popularity);
        } else {
            result = menuItemRepository.findAll();
        }
        return result.stream().filter(item -> !item.getHidden()).toList();
    }

    public List<Restaurant> filterRestaurants(String category, String cuisine, Double rating) {
        if (category != null && cuisine != null && rating != null) {
            return restaurantRepository.findByCategoryIgnoreCaseAndCuisineIgnoreCaseAndRatingGreaterThanEqual(category, cuisine, rating);
        } else if (category != null && cuisine != null) {
            return restaurantRepository.findByCategoryIgnoreCaseAndCuisineIgnoreCase(category, cuisine);
        } else if (category != null && rating != null) {
            return restaurantRepository.findByCategoryIgnoreCaseAndRatingGreaterThanEqual(category, rating);
        } else if (cuisine != null && rating != null) {
            return restaurantRepository.findByCuisineIgnoreCaseAndRatingGreaterThanEqual(cuisine, rating);
        } else if (category != null) {
            return restaurantRepository.findByCategoryIgnoreCase(category);
        } else if (cuisine != null) {
            return restaurantRepository.findByCuisineIgnoreCase(cuisine);
        } else if (rating != null) {
            return restaurantRepository.findByRatingGreaterThanEqual(rating);
        } else {
            return restaurantRepository.findAll();
        }
    }
}

