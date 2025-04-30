package com.SAMURAI.HU_FDS.controller;


import com.SAMURAI.HU_FDS.model.Cart;
import com.SAMURAI.HU_FDS.service.CartService;
import com.SAMURAI.HU_FDS.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/customer")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {
    @Autowired
    private CartService cartService;

    @Autowired
    private JwtService jwtService;


    @GetMapping("/cart")
    public ResponseEntity<?> getCart(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            Cart cart = cartService.getCart(username);

            cart.getItems().forEach(item -> {
                item.getMenuItem().getBase64Image();
            });

            return ResponseEntity.ok(cart);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @PostMapping("/cart/add")
    public ResponseEntity<?> addItem(@RequestHeader("Authorization") String authHeader,
                                     @RequestParam Long menuItemId,
                                     @RequestParam int quantity) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            return ResponseEntity.ok(cartService.addItemToCart(username, menuItemId, quantity));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }


    @PutMapping("/cart/update/{itemId}")
    public ResponseEntity<?> updateQuantity(@RequestHeader("Authorization") String authHeader,
                                            @PathVariable Long itemId,
                                            @RequestParam int quantity) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            return ResponseEntity.ok(cartService.updateItemQuantity(username, itemId, quantity));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }


    @DeleteMapping("/cart/remove/{itemId}")
    public ResponseEntity<?> removeItem(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long itemId) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            return ResponseEntity.ok(cartService.removeItem(username, itemId));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @DeleteMapping("/cart/clear")
    public ResponseEntity<String> clearCart(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            cartService.clearCart(username);
            return ResponseEntity.ok("Cart cleared");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

}
