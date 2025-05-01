package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Order;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.model.RestaurantEmployee;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/order")
@CrossOrigin
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtService jwtService;


    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestHeader("Authorization") String authHeader, @RequestParam Long addressId) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            Order order = orderService.createOrderFromCart(username, addressId);
            order.getItems().forEach(item -> item.getMenuItem().getBase64Image()); // Base64 resimleri alıyoruz
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<Order> orders = orderService.getUserOrders(username);
            // Her siparişin öğelerindeki menü resimlerini Base64 formatında alıyoruz
            orders.forEach(order -> order.getItems().forEach(item -> item.getMenuItem().getBase64Image()));
            return ResponseEntity.ok(orders);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status, username));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @GetMapping("/restaurant")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<List<Order>> getOrdersByOwner(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<Order> orders = orderService.getOrdersByOwnerUsername(username);
            orders.forEach(order -> order.getItems().forEach(item -> item.getMenuItem().getBase64Image()));
            return ResponseEntity.ok(orders);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }



    @PutMapping("/{orderId}/assignCourier")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<Order> assignCourier(
            @PathVariable Long orderId,
            @RequestParam Long courierId,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            Order order = orderService.assignCourierToOrder(orderId, courierId, username);
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }


    @GetMapping("/restaurant/couriers")
    @PreAuthorize("hasRole('RESTAURANT')")
    public ResponseEntity<List<User>> getRestaurantCouriers(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<User> couriers = orderService.getCouriersForRestaurant(username);
            return ResponseEntity.ok(couriers);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

}
