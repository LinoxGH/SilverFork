package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Address;
import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.repo.AddressRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantRepository;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;


//Restorant için manage menu
@RestController
@RequestMapping()
@CrossOrigin
public class MenuController {
    @Autowired
    private MenuService menuService;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;


    @GetMapping("/restaurant/menu")
    public ResponseEntity<List<MenuItem>> getMenu(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<MenuItem> menuItems = menuService.getRestaurantMenu(username);
            // Resimleri Base64 formatına çeviriyoruz
            menuItems.forEach(menuItem -> {
                menuItem.getBase64Image(); // Resmi Base64 formatında elde ediyoruz
            });
            return ResponseEntity.ok(menuItems);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    //Add Product
    @PostMapping("/restaurant/menu/add")
    public ResponseEntity<MenuItem> addMenuItem(@RequestHeader("Authorization") String authHeader,
                                                @RequestBody MenuItem menuItem,
                                                @RequestParam(required = false) MultipartFile image
    ) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            try {
                if (image == null) {
                    menuItem.setPicture(null);
                } else {
                    byte[] imageBytes = image.getBytes();
                    menuItem.setPicture(imageBytes);
                }

                String username = userDetails.getUsername();
                return ResponseEntity.ok(menuService.addMenuItem(username, menuItem));
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    //Product update
    @PutMapping("/restaurant/menu/update/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@RequestHeader("Authorization") String authHeader,
                                                   @PathVariable Long id,
                                                   @RequestBody MenuItem updatedItem,
                                                   @RequestParam(required = false) MultipartFile image
    ) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            try {
                if (image == null) {
                    updatedItem.setPicture(null);
                } else {
                    byte[] imageBytes = image.getBytes();
                    updatedItem.setPicture(imageBytes);
                }

                String username = userDetails.getUsername();
                return ResponseEntity.ok(menuService.updateMenuItem(username, id, updatedItem));
            }catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
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

    @PutMapping("/restaurant/menu/min-cart/{minCartPrice}")
    public ResponseEntity<String> updateMinimumCartPrice(@RequestHeader("Authorization") String authHeader,
                                                         @PathVariable Double minCartPrice) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            Optional<Restaurant> restaurantOpt = restaurantRepository.findByOwnerUsername(username);
            if (restaurantOpt.isPresent()) {
                Restaurant restaurant = restaurantOpt.get();
                restaurant.setMinimumCart(minCartPrice);
                restaurantRepository.save(restaurant);
                return ResponseEntity.ok("Minimum cart price updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid restaurant");
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or expired token");
        }
    }


    @GetMapping("/restaurant/menu/info")
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

    @GetMapping("/restaurant/menu/address")
    public ResponseEntity<Address> getOwnRestaurantAddress(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<Address> address = addressRepository.findByUsername(username);
            if (address.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
            return ResponseEntity.ok(address.get(0));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @GetMapping("/restaurant/menu/info/{restaurantName}")
    public ResponseEntity<Restaurant> getRestaurantInfo(@PathVariable String restaurantName) {
        return ResponseEntity.ok(menuService.getRestaurantByName(restaurantName));
    }

    @GetMapping("/restaurant/menu/items/{restaurantName}")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurantName(@PathVariable String restaurantName) {
        List<MenuItem> menuItems = menuService.getRestaurantMenuByName(restaurantName);
        menuItems.forEach(MenuItem::getBase64Image);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/menu/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        MenuItem item = menuService.getMenuItemById(id);
        if (item != null) {
            item.getBase64Image(); // to populate image
            return ResponseEntity.ok(item);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

}
