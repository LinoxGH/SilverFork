package com.SAMURAI.HU_FDS.controller;


import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommends")
@CrossOrigin
public class RecommendationController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/food/general")
    public ResponseEntity<List<MenuItem>> recommendFoodGeneral() {
        List<MenuItem> items = recommendationService.recommendFoodGeneral();
        return ResponseEntity.ok(items);
    }

    @GetMapping("/restaurant/general")
    public ResponseEntity<List<Restaurant>> recommendRestaurantGeneral() {
        List<Restaurant> restaurants = recommendationService.recommendRestaurantGeneral();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/restaurant/food")
    public ResponseEntity<List<MenuItem>> recommendFoodFromRestaurant(@RequestParam Long restaurantId) {
        List<MenuItem> items = recommendationService.recommendFoodFromRestaurant(restaurantId);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/food/personal")
    public ResponseEntity<?> recommendFoodToUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<MenuItem> items = recommendationService.recommendFoodToUser(username);
            return ResponseEntity.ok(items);
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

    @GetMapping("/restaurant/food/personal/")
    public ResponseEntity<?> recommendFoodToUserFromRestaurant(@RequestParam Long restaurantId,
                                                               @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<MenuItem> items = recommendationService.recommendFoodToUserFromRestaurant(username, restaurantId);
            return ResponseEntity.ok(items);
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

    @GetMapping("/restaurant/personal")
    public ResponseEntity<?> recommendRestaurantToUser(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<Restaurant> restaurants = recommendationService.recommendRestaurantToUser(username);
            return ResponseEntity.ok(restaurants);
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

}
