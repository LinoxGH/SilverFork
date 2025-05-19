package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Dispute;
import com.SAMURAI.HU_FDS.service.DisputeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disputes")
@CrossOrigin
public class DisputeController {

    @Autowired
    private DisputeService disputeService;

    private String getUsername() {
        return ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
    }

    @PostMapping("/order")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Dispute> createOrderDispute(@RequestParam Long orderId,
                                                      @RequestParam String reason) {
        String username = getUsername();
        return ResponseEntity.ok(disputeService.createOrderDispute(username, orderId, reason));
    }

    @PostMapping("/review")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<Dispute> createReviewDispute(@RequestParam Long reviewId,
                                                       @RequestParam String reason) {
        String username = getUsername();
        return ResponseEntity.ok(disputeService.createReviewDispute(username, reviewId, reason));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        return ResponseEntity.ok(disputeService.getAllDisputes());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<Dispute>> getMyDisputes() {
        String username = getUsername();
        return ResponseEntity.ok(disputeService.getDisputesByUser(username));
    }

    @GetMapping("/review/restaurant")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<List<Dispute>> getReviewDisputesForRestaurant() {
        String username = getUsername();
        return ResponseEntity.ok(disputeService.getReviewDisputesForRestaurant(username));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteDispute(@PathVariable Long id) {
        disputeService.deleteDispute(id);
        return ResponseEntity.ok("Dispute deleted");
    }
}