package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.dto.LoginDto;
import com.SAMURAI.HU_FDS.model.Cart;
import com.SAMURAI.HU_FDS.model.Favorite;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.CartRepository;
import com.SAMURAI.HU_FDS.repo.FavoriteRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private FavoriteRepository favoriteRepository;


    @Transactional
    public LoginDto login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String status= user.getStatus();
        if ("BANNED".equalsIgnoreCase(status)){
            throw new RuntimeException("User is banned!");
        }

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Password is incorrect");
        } else {
            if (user.getRank().equals("RESTAURANT") &&
                    restaurantRepository.findByOwnerUsername(user.getUsername()).isEmpty()) {
                createRestaurantForUser(user.getUsername(), user.getUsername());
            }
            String token = jwtService.generateToken(user.getUsername(), user.getRank());
            return new LoginDto(token, user.getUsername(), user.getEmail(), user.getRank(), user.getPicture());
        }
    }


    public void signup(String username, String email, String password, byte[] picture, String rank) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setPicture(picture);
        user.setRank(rank);
        user.setStatus("none");

        userRepository.save(user);

        if (user.getRank().equals("RESTAURANT")) {
            createRestaurantForUser(user.getUsername(), user.getUsername());
        }

    }


    //User Restorantsa otomatik restorant yarat
    public void createRestaurantForUser(String username, String restaurantName) {

        User user = findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRank().equals("RESTAURANT")) {
            throw new RuntimeException("Unauthorized: User is not a restaurant owner");
        }

        Restaurant restaurant = new Restaurant();
        restaurant.setName(restaurantName);
        restaurant.setOwnerUsername(username);
        restaurant.setPicture(user.getPicture());
        restaurant.setRating(0.0);


        restaurantRepository.save(restaurant);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void updateUserEmail(String username, String newEmail) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(newEmail);
        userRepository.save(user);
    }

    public void updateUserPassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(encoder.encode(newPassword));
        userRepository.save(user);
    }

    public void updateUserPicture(String username, byte[] newPicture) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPicture(newPicture);
        userRepository.save(user);

        if (user.getRank().equalsIgnoreCase("RESTAURANT")) {
            Restaurant restaurant = restaurantRepository.findByOwnerUsername(username)
                    .orElseThrow(() -> new RuntimeException("Restaurant not found"));
            restaurant.setPicture(newPicture);
            restaurantRepository.save(restaurant);
        }
    }

    public void updateUser(String username, String email, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        userRepository.save(user);
    }

    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}