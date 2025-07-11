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
                                                @RequestBody MenuItem menuItem
    ) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            try {
                menuItem.setPicture(null);
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
                                                   @RequestBody MenuItem updatedItem
    ) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            try {
                updatedItem.setPicture(null);
                String username = userDetails.getUsername();
                return ResponseEntity.ok(menuService.updateMenuItem(username, id, updatedItem));
            }catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    //Product update
    @PutMapping("/restaurant/menu/picture/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@RequestHeader("Authorization") String authHeader,
                                                   @PathVariable Long id,
                                                   @RequestPart MultipartFile newPicture
    ) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            try {
                byte[] pictureBytes = newPicture.getBytes();
                String username = userDetails.getUsername();
                return ResponseEntity.ok(menuService.updateMenuItemPicture(username, id, pictureBytes));
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

    @GetMapping("/restaurant/menu/info/{id}")
    public ResponseEntity<Restaurant> getRestaurantInfo(@PathVariable Long id) {
        return ResponseEntity.ok(menuService.getRestaurantById(id));
    }

    @GetMapping("/restaurant/menu/items/{restaurantId}")
    public ResponseEntity<List<MenuItem>> getMenuByRestaurantId(@PathVariable Long restaurantId) {
        List<MenuItem> menuItems = menuService.getRestaurantMenuById(restaurantId);
        menuItems.forEach(MenuItem::getBase64Image);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/restaurant/menu/address/{restaurantId}")
    public ResponseEntity<Address> getRestaurantAddress(@PathVariable Long restaurantId) {
        Restaurant restaurant = menuService.getRestaurantById(restaurantId);
        if (restaurant == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);

        List<Address> address = addressRepository.findByUsername(restaurant.getOwnerUsername());
        if (address.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        return ResponseEntity.ok(address.get(0));
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
