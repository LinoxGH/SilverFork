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

    @PostMapping("/create")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Review> createReview(@RequestParam Long menuItemId,
                                               @RequestParam String content,
                                               @RequestParam int rating) {
        String username = getUsername();
        Review created = reviewService.createReview(username, menuItemId, content, rating);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/edit/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<Review> editReview(@PathVariable Long id,
                                             @RequestParam String content,
                                             @RequestParam int rating) {
        String username = getUsername();
        String rank = getRank();
        Review updated = reviewService.updateReview(id, username, content, rating, rank);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        String username = getUsername();
        String rank = getRank();
        reviewService.deleteReview(id, username, rank);
        return ResponseEntity.ok("Review deleted successfully");
    }

    @GetMapping("/menu/{menuItemId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long menuItemId) {
        return ResponseEntity.ok(reviewService.getReviewsByMenuItem(menuItemId));
    }
}
