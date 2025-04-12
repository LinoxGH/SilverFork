package com.SAMURAI.HU_FDS.controller;


import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.service.CartService;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CartService cartService;

    @Autowired
    private MenuService menuService;

    @GetMapping("/view/cart/{username}")
    public ResponseEntity<?> getCartByUsername(@RequestHeader("Authorization") String authHeader,
                                               @PathVariable String username) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.ok(cartService.getCart(username));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }
    @GetMapping("/view/{restaurantId}")
    public ResponseEntity<?> getMenuByRestaurantId(@RequestHeader("Authorization") String authHeader,
                                                   @PathVariable Long restaurantId) {

        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.ok(menuService.getRestaurantMenuById(restaurantId));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }
}
