package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.*;
import com.SAMURAI.HU_FDS.repo.DisputeRepository;
import com.SAMURAI.HU_FDS.repo.OrderRepository;
import com.SAMURAI.HU_FDS.repo.ReviewRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public Dispute createOrderDispute(String username, Long orderId, String reason) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Order order = orderRepository.findById(orderId).orElseThrow();

        Dispute dispute = new Dispute();
        dispute.setType("ORDER");
        dispute.setOrder(order);
        dispute.setReason(reason);
        dispute.setRaisedBy(user);
        dispute.setCreatedAt(LocalDateTime.now());

        return disputeRepository.save(dispute);
    }

    public Dispute createReviewDispute(String username, Long reviewId, String reason) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Review review = reviewRepository.findById(reviewId).orElseThrow();

        Dispute dispute = new Dispute();
        dispute.setType("REVIEW");
        dispute.setReview(review);
        dispute.setReason(reason);
        dispute.setRaisedBy(user);
        dispute.setCreatedAt(LocalDateTime.now());

        return disputeRepository.save(dispute);
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    public List<Dispute> getDisputesByUser(String username) {
        return disputeRepository.findByRaisedBy_Username(username);
    }

    public List<Dispute> getReviewDisputesForRestaurant(String restaurantOwnerUsername) {
        return disputeRepository.findByTypeAndReview_MenuItem_Restaurant_OwnerUsername("REVIEW", restaurantOwnerUsername);
    }

    public void deleteDispute(Long id) {
        disputeRepository.deleteById(id);
    }
}