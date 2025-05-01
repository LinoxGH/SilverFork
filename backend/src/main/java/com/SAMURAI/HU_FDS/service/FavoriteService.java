package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.Favorite;
import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.FavoriteRepository;
import com.SAMURAI.HU_FDS.repo.MenuItemRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    public void addFavorite(String username, Long menuItemId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        MenuItem menuItem = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!favoriteRepository.existsByUserAndMenuItem(user, menuItem)) {
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setMenuItem(menuItem);
            favoriteRepository.save(favorite);
        }
    }

    public void removeFavorite(String username, Long menuItemId) {
        favoriteRepository.findByUser_UsernameAndMenuItem_Id(username, menuItemId)
                .ifPresent(favoriteRepository::delete);
    }

    public List<Favorite> getUserFavorites(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return favoriteRepository.findAllByUser(user).stream().filter(fav -> !fav.getMenuItem().getHidden()).toList();
    }

    public Optional<Favorite> getFavorite(String username, Long menuItemId) {
        Optional<Favorite> result = favoriteRepository.findByUser_UsernameAndMenuItem_Id(username, menuItemId);
        if (result.isPresent()) {
            if (result.get().getMenuItem().getHidden()) {
                return Optional.empty();
            }
        }
        return result;
    }
}

