package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.*;
import com.SAMURAI.HU_FDS.repo.MenuItemRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantRepository;
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

    @Autowired
    private RestaurantRepository restaurantRepository;

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
        updateMenuItemAverageRating(item);

        Review savedReview = reviewRepository.save(review);
        updateMenuItemAverageRating(item);

        return savedReview;
    }

    public Review updateReview(Long reviewId, String username, String content, int rating, String userRank) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getUsername().equals(username) && !userRank.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to update this review");
        }

        review.setContent(content);
        review.setRating(rating);
        Review updatedReview = reviewRepository.save(review);
        updateMenuItemAverageRating(review.getMenuItem());
        return updatedReview;
    }

    public void deleteReview(Long reviewId, String username, String userRank) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getUsername().equals(username) && !userRank.equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to delete this review");
        }

        reviewRepository.delete(review);
        updateMenuItemAverageRating(review.getMenuItem());
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

    private void updateMenuItemAverageRating(MenuItem item) {
        List<Review> reviews = reviewRepository.findByMenuItemId(item.getId())
                .stream()
                .filter(r -> !r.getMenuItem().getHidden())
                .toList();

        if (reviews.isEmpty()) {
            item.setRating(5.0);
        } else {
            double sum = 0;
            for (Review r : reviews) {
                sum += r.getRating();
            }
            double average = sum / reviews.size();
            item.setRating(average);
        }

        menuItemRepository.save(item);

        Restaurant restaurant = item.getRestaurant();
        updateRestaurantAverageRating(restaurant);
    }

    private void updateRestaurantAverageRating(Restaurant restaurant) {
        List<MenuItem> visibleItems = menuItemRepository.findByRestaurantId(restaurant.getId()).stream()
                .filter(item -> !Boolean.TRUE.equals(item.getHidden()))
                .filter(item -> item.getRating() != null)
                .toList();

        if (visibleItems.isEmpty()){
            restaurant.setRating(5.0);
        }

        double sum = 0.0;
        for (MenuItem item : visibleItems) {
            sum += item.getRating();
        }
        double average = sum / visibleItems.size();
        restaurant.setRating(average);
        restaurantRepository.save(restaurant);
    }
}
