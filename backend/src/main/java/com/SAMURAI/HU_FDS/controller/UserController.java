package com.SAMURAI.HU_FDS.controller;


import com.SAMURAI.HU_FDS.dto.LoginDto;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService ;


    @Autowired
    private JwtService jwtService;

    private boolean isAuthorized(String token, String username) {
        String extractedUsername = jwtService.extractUserName(token);
        return extractedUsername.equals(username);
    }

    //signup endpointi
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user){
        try{
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
        try{
            LoginDto loginDto = userService.login(user.getUsername(), user.getPassword());
            return ResponseEntity.ok(loginDto);
        }catch(RuntimeException e){
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


    //Token çalışıyor mu örnek
    @GetMapping("/customer/hello")
    public ResponseEntity<String> hello(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (jwtService.validateToken(token , userDetails)){
            return ResponseEntity.ok("Hello Customer, Token is working!"+ userDetails.getUsername());
        }else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @GetMapping("/courier/hello")
    public ResponseEntity<String> helloCourier(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.ok("Hello Courier, Token is working! Username: " + userDetails.getUsername());
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
    public ResponseEntity<String> updatePicture(@RequestHeader("Authorization") String authHeader, 
                                                @RequestParam String username, 
                                                @RequestParam MultipartFile newPicture) {
        String token = authHeader.replace("Bearer ", "");
        if (!isAuthorized(token, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized action");
        }
        
        try {
            byte[] pictureBytes = newPicture.getBytes();
            userService.updateUserPicture(username, pictureBytes);
            return ResponseEntity.ok("Picture updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Picture update failed: " + e.getMessage());
        }
    }

    @PutMapping("/update-rank")
    public ResponseEntity<String> updateRank(@RequestHeader("Authorization") String authHeader, 
                                             @RequestParam String username, 
                                             @RequestParam String newRank) {
        String token = authHeader.replace("Bearer ", "");
        if (!isAuthorized(token, username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized action");
        }
        
        try {
            userService.updateUserRank(username, newRank);
            return ResponseEntity.ok("Rank updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Rank update failed: " + e.getMessage());
        }
    }
}

