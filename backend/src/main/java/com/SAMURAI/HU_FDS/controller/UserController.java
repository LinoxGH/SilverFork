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



@RestController
@RequestMapping
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService ;


    @Autowired
    private JwtService jwtService;




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

    @GetMapping("/restaurant/hello")
    public ResponseEntity<String> helloRestaurant(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.ok("Hello restaurantowner, Token is working! Username: " + userDetails.getUsername());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }
}

