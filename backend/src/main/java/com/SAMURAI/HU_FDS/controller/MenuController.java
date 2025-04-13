package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;


//Restorant için manage menu
@RestController
@RequestMapping()
@CrossOrigin
public class MenuController {
    @Autowired
    private MenuService menuService;

    @Autowired
    private JwtService jwtService;


    @GetMapping
    public ResponseEntity<List<MenuItem>> getMenu(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            return ResponseEntity.ok(menuService.getRestaurantMenu(username));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    //Add Product
    @PostMapping("/restaurant/menu/add")
    public ResponseEntity<MenuItem> addMenuItem(@RequestHeader("Authorization") String authHeader,
                                                @RequestBody MenuItem menuItem) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {

            String username = userDetails.getUsername();
            return ResponseEntity.ok(menuService.addMenuItem(username, menuItem));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    //Product update
    @PutMapping("/restaurant/menu/update/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@RequestHeader("Authorization") String authHeader,
                                                   @PathVariable Long id,
                                                   @RequestBody MenuItem updatedItem) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {

            String username = userDetails.getUsername();
            return ResponseEntity.ok(menuService.updateMenuItem(username, id, updatedItem));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    //Product delete
    @DeleteMapping("/restaurant/menu/delete/{id}")
    public ResponseEntity<String> deleteMenuItem(@RequestHeader("Authorization") String authHeader,
                                                 @PathVariable Long id) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {

            String username = userDetails.getUsername();
            menuService.deleteMenuItem(username, id);
            return ResponseEntity.ok("Menu item deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
    }


    @GetMapping("restaurant/menu/info")
    public ResponseEntity<Restaurant> getOwnRestaurantInfo(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            Restaurant restaurant = menuService.getRestaurantByUsername(username);
            return ResponseEntity.ok(restaurant);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> getRestaurantById(@PathVariable Long id) {
        Restaurant restaurant = menuService.getRestaurantById(id);
        return ResponseEntity.ok(restaurant);
    }

    @GetMapping("/{id}/items")
    public ResponseEntity<List<MenuItem>> getRestaurantItems(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getRestaurantMenuById(id));
    }

    @GetMapping("/customer/{restaurantName}")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurantName(@PathVariable String restaurantName) {
        return ResponseEntity.ok(menuService.getRestaurantMenuByName(restaurantName));
    }
}
