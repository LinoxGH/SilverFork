package com.SAMURAI.HU_FDS.controller;


import com.SAMURAI.HU_FDS.model.Address;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.AddressRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import com.SAMURAI.HU_FDS.service.CartService;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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


    @Autowired
    private UserRepository userRepository;


    @Autowired
    private AddressRepository addressRepository;



    private boolean isTokenValid(String token) {
        String pureToken = token.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jwtService.validateToken(pureToken, userDetails);
    }

    // Get all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Get single user
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username,
                                     @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Change status
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{username}/status")
    public ResponseEntity<?> changeStatus(@PathVariable String username,
                                          @RequestParam String status,
                                          @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            user.get().setStatus(status);
            userRepository.save(user.get());
            return ResponseEntity.ok("Status updated");
        }
        return ResponseEntity.notFound().build();
    }

    // Change rank
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{username}/rank")
    public ResponseEntity<?> changeRank(@PathVariable String username,
                                        @RequestParam String rank,
                                        @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            user.get().setRank(rank);
            userRepository.save(user.get());
            return ResponseEntity.ok("Rank updated");
        }
        return ResponseEntity.notFound().build();
    }

    // Delete user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username,
                                        @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok("User deleted");
        }
        return ResponseEntity.notFound().build();
    }

    // View addresses
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{username}/addresses")
    public ResponseEntity<?> getUserAddresses(@PathVariable String username,
                                              @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        List<Address> addresses = addressRepository.findByUsername(username);
        return ResponseEntity.ok(addresses);
    }

}
