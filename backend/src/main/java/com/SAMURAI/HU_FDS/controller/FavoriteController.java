package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Favorite;
import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.service.FavoriteService;
import com.SAMURAI.HU_FDS.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/favourites")
@CrossOrigin
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/add/{menuItemId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long menuItemId,
                                         @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            favoriteService.addFavorite(username, menuItemId);
            return ResponseEntity.ok("Item added to favorites");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @DeleteMapping("/remove/{menuItemId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long menuItemId,
                                            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            favoriteService.removeFavorite(username, menuItemId);
            return ResponseEntity.ok("Item removed from favorites");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @GetMapping
    public ResponseEntity<?> getFavorites(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<Favorite> favorites = favoriteService.getUserFavorites(username);
            List<MenuItem> menuItems = favorites.stream()
                    .map(Favorite::getMenuItem)
                    .peek(menuItem -> {
                        menuItem.getBase64Image();
                    })
                    .toList();

            return ResponseEntity.ok(menuItems);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getProductFavorite(@PathVariable Long id,
                                                @RequestHeader("Authorization") String authHeader)
    {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();

            Optional<Favorite> favorite = favoriteService.getFavorite(username, id);
            if (favorite.isPresent()) {
                return ResponseEntity.ok(favorite.get());
            } else {
                return ResponseEntity.ok(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }
}
