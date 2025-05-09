package com.SAMURAI.HU_FDS.controller;


import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/search")
public class SearchController {
    @Autowired
    private SearchService searchService;

    @Autowired
    private JwtService jwtService;

    // Ürün adına göre arama
    @GetMapping("/product")
    public ResponseEntity<?> searchMenuItems(@RequestParam String name) {
        return ResponseEntity.ok(searchService.searchMenuItems(name));
    }

    // Restoran adına göre arama
    @GetMapping("/restaurants")
    public ResponseEntity<?> searchRestaurants(@RequestHeader("Authorization") String authHeader,
                                               @RequestParam String name) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.ok(searchService.searchRestaurants(name));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    // Menü öğelerini filtreleme
    @GetMapping("/product/filter")
    public ResponseEntity<?> filterMenuItems(@RequestHeader("Authorization") String authHeader,
                                             @RequestParam(required = false) String category,
                                             @RequestParam(required = false) String cuisine,
                                             @RequestParam(required = false) Integer popularity) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.ok(searchService.filterMenuItems(category, cuisine, popularity));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    // Restoranları filtreleme
    @GetMapping("/restaurants/filter")
    public ResponseEntity<?> filterRestaurants(@RequestHeader("Authorization") String authHeader,
                                               @RequestParam(required = false) Double rating) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.ok(searchService.filterRestaurants(rating));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }
}
