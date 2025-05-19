package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.OrderDispute;
import com.SAMURAI.HU_FDS.service.OrderDisputeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order-disputes")
@CrossOrigin
public class OrderDisputeController {

    @Autowired
    private OrderDisputeService service;

    private String getUsername() {
        return ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderDispute> create(@RequestParam Long orderId, @RequestParam String reason) {
        return ResponseEntity.ok(service.create(getUsername(), orderId, reason));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDispute>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderDispute>> getMyDisputes() {
        return ResponseEntity.ok(service.getByUser(getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Order dispute deleted");
    }
}