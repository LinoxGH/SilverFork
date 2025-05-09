package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Order;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courier")
@CrossOrigin
public class CourierController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/orders")
    @PreAuthorize("hasRole('COURIER')")
    public ResponseEntity<List<Order>> getAssignedOrders(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<Order> orders = orderService.getOrdersAssignedToCourier(username);
            orders.forEach(order -> order.getItems().forEach(item -> item.getMenuItem().getBase64Image()));
            return ResponseEntity.ok(orders);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PutMapping("/orders/{orderId}/deliver")
    @PreAuthorize("hasRole('COURIER')")
    public ResponseEntity<String> markOrderAsDelivered(@PathVariable Long orderId,
                                                       @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            boolean success = orderService.deliverOrder(orderId, username);

            if (success) {
                return ResponseEntity.ok("Order marked as delivered");
            } else {
                return ResponseEntity.status(403).body("Unauthorized or invalid order");
            }
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }
}
