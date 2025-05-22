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
import java.util.LinkedHashSet;
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
                .filter(item -> Boolean.FALSE.equals(item.getHidden()))
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
                .filter(item -> Boolean.FALSE.equals(item.getHidden()))
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

        Set<MenuItem> recommended = new LinkedHashSet<>();
        Set<Long> favoriteIds = favorites.stream()
                .map(f -> f.getMenuItem().getId())
                .collect(Collectors.toSet());

        for (Favorite favorite : favorites) {
            MenuItem item = favorite.getMenuItem();
            if (!Boolean.TRUE.equals(item.getHidden())) {
                recommended.add(item);
            }
        }

        List<MenuItem> others = menuItemRepository.findAll().stream()
                .filter(item -> Boolean.FALSE.equals(item.getHidden()))
                .filter(item -> !favoriteIds.contains(item.getId()))
                .sorted(Comparator.comparingInt(MenuItem::getPopularity).reversed())
                .limit(10)
                .toList();

        recommended.addAll(others);

        return recommended.stream().limit(10).toList();
    }


    public List<MenuItem> recommendFoodToUserFromRestaurant(String username, Long restaurantId) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return List.of();

        List<Favorite> favorites = favoriteRepository.findAllByUser(user);
        if (favorites.isEmpty()) {
            return recommendFoodFromRestaurant(restaurantId); // fallback
        }

        Set<MenuItem> recommended = new LinkedHashSet<>();
        Set<Long> favoriteIds = favorites.stream()
                .map(f -> f.getMenuItem().getId())
                .collect(Collectors.toSet());

        for (Favorite favorite : favorites) {
            MenuItem item = favorite.getMenuItem();
            if (item.getRestaurant().getId() == (restaurantId) && !Boolean.TRUE.equals(item.getHidden())) {
                recommended.add(item);
            }
        }

        List<MenuItem> others = menuItemRepository.findByRestaurantId(restaurantId).stream()
                .filter(item -> item.getPopularity() != null)
                .filter(item -> Boolean.FALSE.equals(item.getHidden()))
                .filter(item -> !favoriteIds.contains(item.getId()))
                .sorted(Comparator.comparingInt(MenuItem::getPopularity).reversed())
                .limit(5)
                .toList();

        recommended.addAll(others);

        return recommended.stream().limit(5).toList();
    }

    public List<Restaurant> recommendRestaurantToUser(String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return List.of();

        List<Favorite> favorites = favoriteRepository.findAllByUser(user);
        if (favorites.isEmpty()) {
            return recommendRestaurantGeneral();
        }

        Set<Restaurant> recommended = new LinkedHashSet<>();
        Set<Long> favoriteRestaurantIds = favorites.stream()
                .map(f -> f.getMenuItem().getRestaurant())
                .map(Restaurant::getId)
                .collect(Collectors.toSet());

        for (Favorite favorite : favorites) {
            Restaurant restaurant = favorite.getMenuItem().getRestaurant();
            recommended.add(restaurant);
        }

        List<Restaurant> others = restaurantRepository.findAll().stream()
                .filter(r -> !favoriteRestaurantIds.contains(r.getId()))
                .sorted(Comparator.comparingDouble(Restaurant::getRating).reversed())
                .limit(10)
                .toList();

        recommended.addAll(others);

        return recommended.stream().limit(10).toList();
    }
}
