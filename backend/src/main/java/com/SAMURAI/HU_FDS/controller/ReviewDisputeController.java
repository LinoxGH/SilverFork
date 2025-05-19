package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.ReviewDispute;
import com.SAMURAI.HU_FDS.service.ReviewDisputeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review-disputes")
@CrossOrigin
public class ReviewDisputeController {

    @Autowired
    private ReviewDisputeService service;

    private String getUsername() {
        return ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<ReviewDispute> create(@RequestParam Long reviewId, @RequestParam String reason) {
        return ResponseEntity.ok(service.create(getUsername(), reviewId, reason));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDispute>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<List<ReviewDispute>> getMyDisputes() {
        return ResponseEntity.ok(service.getByUser(getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Review dispute deleted");
    }
}