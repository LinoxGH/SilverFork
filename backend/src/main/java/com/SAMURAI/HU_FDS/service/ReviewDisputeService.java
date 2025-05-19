package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.Review;
import com.SAMURAI.HU_FDS.model.ReviewDispute;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.ReviewDisputeRepository;
import com.SAMURAI.HU_FDS.repo.ReviewRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewDisputeService {

    @Autowired
    private ReviewDisputeRepository repository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public ReviewDispute create(String username, Long reviewId, String reason) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Review review = reviewRepository.findById(reviewId).orElseThrow();

        ReviewDispute dispute = new ReviewDispute();
        dispute.setRaisedBy(user);
        dispute.setReview(review);
        dispute.setReason(reason);
        dispute.setCreatedAt(LocalDateTime.now());

        return repository.save(dispute);
    }

    public List<ReviewDispute> getAll() {
        return repository.findAll();
    }

    public List<ReviewDispute> getByUser(String username) {
        return repository.findByRaisedBy_Username(username);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}