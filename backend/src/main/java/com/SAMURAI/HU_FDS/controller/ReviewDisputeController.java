package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.ReviewDispute;
import com.SAMURAI.HU_FDS.service.JwtService;
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

    @Autowired
    private JwtService jwtService;

    private String getUsername() {
        return ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
    }

    private boolean isTokenValid(String token) {
        String pureToken = token.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jwtService.validateToken(pureToken, userDetails);
    }

    @PostMapping
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> create(@RequestParam Long reviewId,
                                    @RequestParam String reason,
                                    @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        return ResponseEntity.ok(service.create(getUsername(), reviewId, reason));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<?> getMyDisputes(@RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        return ResponseEntity.ok(service.getByUser(getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        service.delete(id);
        return ResponseEntity.ok("Review dispute deleted");
    }
}
