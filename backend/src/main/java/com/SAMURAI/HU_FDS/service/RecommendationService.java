package com.SAMURAI.HU_FDS.service;


import com.SAMURAI.HU_FDS.model.Favorite;
import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.FavoriteRepository;
import com.SAMURAI.HU_FDS.repo.MenuItemRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {


    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;



    public List<MenuItem> recommendFoodGeneral() {
        return menuItemRepository.findAll()
                .stream()
                .filter(item -> item.getPopularity() != null)
                .sorted(Comparator.comparingInt(MenuItem::getPopularity).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<Restaurant> recommendRestaurantGeneral() {
        return restaurantRepository.findAll()
                .stream()
                .filter(r -> r.getRating() != null)
                .sorted(Comparator.comparingDouble(Restaurant::getRating).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    public List<MenuItem> recommendFoodFromRestaurant(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId)
                .stream()
                .filter(item -> item.getPopularity() != null)
                .sorted(Comparator.comparingInt(MenuItem::getPopularity).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }


    public List<MenuItem> recommendFoodToUser(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return List.of();
        List<Favorite> favorites = favoriteRepository.findAllByUser(user);


        if (favorites.isEmpty()) {
            return recommendFoodGeneral(); // fallback
        }

        Set<String> preferredCategories = favorites.stream()
                .map(fav -> fav.getMenuItem().getCategory())
                .collect(Collectors.toSet());

        Set<String> preferredCuisines = favorites.stream()
                .map(fav -> fav.getMenuItem().getCuisine())
                .collect(Collectors.toSet());

        return menuItemRepository.findAll().stream()
                .filter(item -> item.getPopularity() != null)
                .filter(item -> preferredCategories.contains(item.getCategory())
                        || preferredCuisines.contains(item.getCuisine()))
                .sorted(Comparator.comparingInt(MenuItem::getPopularity).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }


    public List<MenuItem> recommendFoodToUserFromRestaurant(String username, Long restaurantId) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return List.of();

        List<Favorite> favorites = favoriteRepository.findAllByUser(user);
        if (favorites.isEmpty()) {
            return recommendFoodFromRestaurant(restaurantId); // fallback
        }

        Set<String> preferredCategories = favorites.stream()
                .map(fav -> fav.getMenuItem().getCategory())
                .collect(Collectors.toSet());

        Set<String> preferredCuisines = favorites.stream()
                .map(fav -> fav.getMenuItem().getCuisine())
                .collect(Collectors.toSet());

        return menuItemRepository.findByRestaurantId(restaurantId)
                .stream()
                .filter(item -> item.getPopularity() != null)
                .filter(item -> preferredCategories.contains(item.getCategory()) ||
                        preferredCuisines.contains(item.getCuisine()))
                .sorted(Comparator.comparingInt(MenuItem::getPopularity).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    public List<Restaurant> recommendRestaurantToUser(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return List.of();

        List<Favorite> favorites = favoriteRepository.findAllByUser(user);
        if (favorites.isEmpty()) {
            return recommendRestaurantGeneral();
        }

        Set<String> preferredCategories = favorites.stream()
                .map(fav -> fav.getMenuItem().getCategory())
                .collect(Collectors.toSet());

        Set<String> preferredCuisines = favorites.stream()
                .map(fav -> fav.getMenuItem().getCuisine())
                .collect(Collectors.toSet());


        return restaurantRepository.findAll().stream()
                .filter(restaurant -> {
                    List<MenuItem> items = menuItemRepository.findByRestaurantId(restaurant.getId());
                    return items.stream().anyMatch(item ->
                            preferredCategories.contains(item.getCategory()) ||
                                    preferredCuisines.contains(item.getCuisine()));
                })
                .sorted(Comparator.comparingDouble(Restaurant::getRating).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }
}
