package com.SAMURAI.HU_FDS.service;


import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.repo.MenuItemRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MenuService {
    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;


    //Menüyü gösterir
    public List<MenuItem> getRestaurantMenu(String username) {
        Restaurant restaurant = restaurantRepository.findByOwnerUsername(username)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        return menuItemRepository.findByRestaurant(restaurant).stream().filter(item -> !item.getHidden()).toList();
    }

    public List<MenuItem> getRestaurantMenuById(Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        return menuItemRepository.findByRestaurant(restaurant).stream().filter(item -> !item.getHidden()).toList();
    }


    //Menüye ekleme
    public MenuItem addMenuItem(String username, MenuItem menuItem) {
        Restaurant restaurant = restaurantRepository.findByOwnerUsername(username)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        menuItem.setRestaurant(restaurant);
        menuItem.setCreatedAt(LocalDateTime.now());
        return menuItemRepository.save(menuItem);
    }

    //Menüdeki ürünü güncelleme
    public MenuItem updateMenuItem(String username, Long itemId, MenuItem updatedItem) {
        MenuItem existingItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!existingItem.getRestaurant().getOwnerUsername().equals(username)) {
            throw new RuntimeException("Unauthorized: You can only update your own menu items");
        }

        if (updatedItem.getName() != null) {
            existingItem.setName(updatedItem.getName());
        }
        if (updatedItem.getPrice() > 0) {
            existingItem.setPrice(updatedItem.getPrice());
        }
        if (updatedItem.getDescription() != null) {
            existingItem.setDescription(updatedItem.getDescription());
        }

        existingItem.setCreatedAt(LocalDateTime.now());
        return menuItemRepository.save(existingItem);
    }

    //Menüdeki öğeyi sil
    public void deleteMenuItem(String username, Long itemId) {
        MenuItem existingItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!existingItem.getRestaurant().getOwnerUsername().equals(username)) {
            throw new RuntimeException("Unauthorized: You can only delete your own menu items");
        }

        existingItem.setHidden(true);
        menuItemRepository.save(existingItem);
    }

    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public Restaurant getRestaurantByUsername(String username) {
        return restaurantRepository.findByOwnerUsername(username)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public Restaurant getRestaurantByName(String restaurantName) {
        return restaurantRepository.findByName(restaurantName)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    public List<MenuItem> getRestaurantMenuByName(String restaurantName) {
        Restaurant restaurant = restaurantRepository.findByName(restaurantName)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        return menuItemRepository.findByRestaurant(restaurant).stream().filter(item -> !item.getHidden()).toList();
    }

}
