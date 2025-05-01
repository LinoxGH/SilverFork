package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.dto.LoginDto;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;


    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    private boolean isAuthorized(String token, String username) {
        String extractedUsername = jwtService.extractUserName(token);
        return extractedUsername.equals(username);
    }


    //signup endpointi
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        try {
            userService.signup(user.getUsername(), user.getEmail(), user.getPassword(),
                    user.getPicture(), user.getRank());
            return ResponseEntity.ok("User Registered Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User Registration failed");
        }
    }


    //login endpointi
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            LoginDto loginDto = userService.login(user.getUsername(), user.getPassword());
            return ResponseEntity.ok(loginDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/get-picture")
    public ResponseEntity<?> getPicture(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();

            Optional<User> user = userRepository.findByUsername(username);

            if (user.isPresent()) {
                byte[] pictureBytes = user.get().getPicture();

                if (pictureBytes != null) {
                    String base64Image = Base64.getEncoder().encodeToString(pictureBytes);
                    return ResponseEntity.ok(base64Image);
                } else {
                    return ResponseEntity.ok(null);
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }


    @PutMapping("/update-email")
    public ResponseEntity<String> updateEmail(@RequestHeader("Authorization") String authHeader,
                                              @RequestParam String username,
                                              @RequestParam String newEmail) {
        String token = authHeader.replace("Bearer ", "");
        if (!isAuthorized(token, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized action");
        }

        try {
            userService.updateUserEmail(username, newEmail);
            return ResponseEntity.ok("Email updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email update failed: " + e.getMessage());
        }
    }

    @PutMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestHeader("Authorization") String authHeader,
                                                 @RequestParam String username,
                                                 @RequestParam String newPassword) {
        String token = authHeader.replace("Bearer ", "");
        if (!isAuthorized(token, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized action");
        }

        try {
            userService.updateUserPassword(username, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Password update failed: " + e.getMessage());
        }
    }

    @PutMapping("/update-picture")
    public ResponseEntity<?> updatePicture(@RequestPart MultipartFile newPicture,
                                           @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            try {
                byte[] pictureBytes = newPicture.getBytes();
                userService.updateUserPicture(username, pictureBytes);
                return ResponseEntity.ok("Picture updated successfully");
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Picture update failed: " + e.getMessage());
            }
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @PutMapping("/update-user")
    public ResponseEntity<String> updateUser(@RequestHeader("Authorization") String authHeader,
                                             @RequestParam String username,
                                             @RequestParam String email,
                                             @RequestParam String password) {
        String token = authHeader.replace("Bearer ", "");
        if (!isAuthorized(token, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized action");
        }

        try {
            userService.updateUser(username, email, password);
            return ResponseEntity.ok("User updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("User update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            userService.deleteUser(userDetails.getUsername());
            return ResponseEntity.ok("Account deleted successfully");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized action");
        }
    }
}
