package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Order;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.NotificationRepository;
import com.SAMURAI.HU_FDS.service.*;
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

    @Autowired
    private RestaurantEmployeeService restaurantEmployeeService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/orders")
    @PreAuthorize("hasRole('COURIER')")
    public ResponseEntity<List<Order>> getAssignedOrders(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<Order> orders = orderService.getOrdersAssignedToCourier(username);
            orders.forEach(order -> order.getItems().forEach(item -> item.getBase64Image()));
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
                Order order = orderService.getOrderById(orderId);
                notificationService.sendNotificationToUser(
                        order.getUser().getUsername(), "Siparişiniz teslim edildi. Sipariş ID: " + order.getId());
                return ResponseEntity.ok("Order marked as delivered");
            } else {
                return ResponseEntity.status(403).body("Unauthorized or invalid order");
            }
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('COURIER')")
    public ResponseEntity<String> registerToRestaurant(@RequestHeader("Authorization") String authHeader,
                                                       @RequestParam Long restaurantId) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            restaurantEmployeeService.registerCourierToRestaurant(username, restaurantId);
            return ResponseEntity.ok("Courier registered to restaurant");
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

    @DeleteMapping("/unregister")
    @PreAuthorize("hasRole('COURIER')")
    public ResponseEntity<String> unregisterFromRestaurant(@RequestHeader("Authorization") String authHeader,
                                                           @RequestParam Long restaurantId) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            restaurantEmployeeService.unregisterCourierFromRestaurant(username, restaurantId);
            return ResponseEntity.ok("Courier unregistered from restaurant");
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('COURIER')")
    public ResponseEntity<String> getStatus(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            return ResponseEntity.ok(restaurantEmployeeService.getCourierStatus(username));
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

    @PutMapping("/update-status")
    @PreAuthorize("hasRole('COURIER')")
    public ResponseEntity<String> updateStatus(@RequestHeader("Authorization") String authHeader,
                                               @RequestParam String status) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            restaurantEmployeeService.updateCourierStatus(username, status);
            return ResponseEntity.ok("Courier status updated");
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

    @GetMapping("/registered-restaurants")
    @PreAuthorize("hasRole('COURIER')")
    public ResponseEntity<?> getRegisteredRestaurants(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            String username = userDetails.getUsername();
            List<Restaurant> registeredRestaurants = restaurantEmployeeService.getRegisteredRestaurants(username);
            return ResponseEntity.ok(registeredRestaurants);
        } else {
            return ResponseEntity.status(403).body("Invalid token");
        }
    }

}
