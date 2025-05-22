package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Review;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private JwtService jwtService;

    private String getUsername() {
        return ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
    }

    private String getRank() {
        return ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
    }

    private boolean isTokenValid(String token) {
        String pureToken = token.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jwtService.validateToken(pureToken, userDetails);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> createReview(@RequestHeader("Authorization") String authHeader,
                                          @RequestParam Long menuItemId,
                                          @RequestParam String content,
                                          @RequestParam int rating) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        String username = getUsername();
        Review created = reviewService.createReview(username, menuItemId, content, rating);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/edit/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> editReview(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long id,
                                        @RequestParam String content,
                                        @RequestParam int rating) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        String username = getUsername();
        String rank = getRank();
        Review updated = reviewService.updateReview(id, username, content, rating, rank);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> deleteReview(@RequestHeader("Authorization") String authHeader,
                                          @PathVariable Long id) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        String username = getUsername();
        String rank = getRank();
        reviewService.deleteReview(id, username, rank);
        return ResponseEntity.ok("Review deleted successfully");
    }

    @GetMapping("/menu/{menuItemId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long menuItemId) {
        return ResponseEntity.ok(reviewService.getReviewsByMenuItem(menuItemId));
    }

    @PutMapping("/respond/{id}")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> respondToReview(@RequestHeader("Authorization") String authHeader,
                                             @PathVariable Long id,
                                             @RequestParam String response) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        String restaurantUsername = getUsername();
        Review updated = reviewService.respondToReview(id, response, restaurantUsername);
        return ResponseEntity.ok(updated);
    }
}
