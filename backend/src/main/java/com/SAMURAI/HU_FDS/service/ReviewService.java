package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.*;
import com.SAMURAI.HU_FDS.repo.MenuItemRepository;
import com.SAMURAI.HU_FDS.repo.ReviewRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    public Review createReview(String username, Long menuItemId, String content, int rating) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        MenuItem item = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        Review review = new Review();
        review.setUser(user);
        review.setMenuItem(item);
        review.setContent(content);
        review.setRating(rating);
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public Review updateReview(Long reviewId, String username, String content, int rating, String userRank) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getUsername().equals(username) && !userRank.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to update this review");
        }

        review.setContent(content);
        review.setRating(rating);
        return reviewRepository.save(review);
    }

    public void deleteReview(Long reviewId, String username, String userRank) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getUsername().equals(username) && !userRank.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to delete this review");
        }

        reviewRepository.delete(review);
    }

    public List<Review> getReviewsByMenuItem(Long menuItemId) {
        return reviewRepository.findByMenuItemId(menuItemId);
    }


    public Review respondToReview(Long reviewId, String response, String restaurantUsername) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        String ownerUsername = review.getMenuItem().getRestaurant().getOwnerUsername();
        if (!ownerUsername.equals(restaurantUsername)) {
            throw new RuntimeException("Unauthorized to respond to this review");
        }

        review.setRestaurantResponse(response);
        return reviewRepository.save(review);
    }
}
