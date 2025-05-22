package com.SAMURAI.HU_FDS.controller;


import com.SAMURAI.HU_FDS.model.*;
import com.SAMURAI.HU_FDS.repo.*;
import com.SAMURAI.HU_FDS.service.CartService;
import com.SAMURAI.HU_FDS.service.JwtService;
import com.SAMURAI.HU_FDS.service.MenuService;
import com.SAMURAI.HU_FDS.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CartService cartService;

    @Autowired
    private MenuService menuService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private CourierRepository courierRepository;

    @Autowired
    private RestaurantEmployeeRepository restaurantEmployeeRepository;

    @Autowired
    private ReviewRepository reviewRepository;





    private boolean isTokenValid(String token) {
        String pureToken = token.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jwtService.validateToken(pureToken, userDetails);
    }

    // Get all users
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    // Get single user
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username,
                                     @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Change status

    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{username}/status")
    public ResponseEntity<?> changeStatus(@PathVariable String username,
                                          @RequestParam String status,
                                          @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            user.get().setStatus(status);
            userRepository.save(user.get());

            if ("RESTRICTED".equalsIgnoreCase(status) || "BANNED".equalsIgnoreCase(status)) {
                reviewRepository.deleteAllByUser(user);
            }
            return ResponseEntity.ok("Status updated");
        }
        return ResponseEntity.notFound().build();
    }

    // Change rank
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{username}/rank")
    public ResponseEntity<?> changeRank(@PathVariable String username,
                                        @RequestParam String rank,
                                        @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isPresent()) {
            User realUser = optionalUser.get();

            realUser.setRank(rank);
            userRepository.save(realUser);

            if ("COURIER".equalsIgnoreCase(rank)) {
                if (!courierRepository.existsByUser(realUser)) {
                    Courier courier = new Courier();
                    courier.setUser(realUser);
                    courier.setStatus("AVAILABLE");
                    courierRepository.save(courier);
                }
            }

            return ResponseEntity.ok("Rank updated");
        }

        return ResponseEntity.notFound().build();
    }

    // Delete user
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/delete/{username}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable String username,
                                        @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> user = userRepository.findByUsername(username);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Courier> courierOpt = courierRepository.findByUser(user.get());

        courierOpt.ifPresent(courier -> {
            restaurantEmployeeRepository.deleteAllByCourier(courier);

            List<Order> ordersWithCourier = orderRepository.findAllByCourier(courier);
            for (Order order : ordersWithCourier) {
                order.setCourier(null); // bağlantıyı koparıyoruz
            }
            courierRepository.delete(courier);
        });
        reviewRepository.deleteAllByUser(user);
        cartRepository.deleteByUser(user);
        favoriteRepository.deleteAllByUser(user);
        orderRepository.deleteAllByUser(user);
        addressRepository.deleteAllByUsername(username);
        userRepository.delete(user.get());

        return ResponseEntity.ok("User deleted");
    }


    // View addresses
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users/{username}/addresses")
    public ResponseEntity<?> getUserAddresses(@PathVariable String username,
                                              @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        List<Address> addresses = addressRepository.findByUsername(username);
        return ResponseEntity.ok(addresses);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/orders/{username}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable String username,
                                             @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) return ResponseEntity.status(404).body("User not found");

        return ResponseEntity.ok(orderRepository.findByUser(user.get()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user/orders/update/{orderId}")
    @Transactional
    public ResponseEntity<?> updateOrder(@PathVariable Long orderId,
                                         @RequestBody Order updatedOrder,
                                         @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");

        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) return ResponseEntity.status(404).body("Order not found");

        Order order = optionalOrder.get();
        order.setStatus(updatedOrder.getStatus());
        order.setTotalPrice(updatedOrder.getTotalPrice());
        order.setAddress(updatedOrder.getAddress());
        order.setRestaurant(updatedOrder.getRestaurant());
        order.setCourier(updatedOrder.getCourier());

        order.getItems().clear();
        for (OrderItem item : updatedOrder.getItems()) {
            item.setOrder(order);
            order.getItems().add(item);
        }

        return ResponseEntity.ok(orderRepository.save(order));
    }


    //UNNECESSARY
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/user/orders/assign-courier/{orderId}")
    @Transactional
    public ResponseEntity<?> assignCourier(@PathVariable Long orderId,
                                         @RequestParam Long courierId,
                                         @RequestParam String restaurantName,
                                         @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");

        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) return ResponseEntity.status(404).body("Order not found");

        Order order = orderService.assignCourierToOrder(orderId, courierId, restaurantName);
        return ResponseEntity.ok(orderRepository.save(order));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/user/orders/delete/{orderId}")
    @Transactional
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId,
                                         @RequestHeader("Authorization") String authHeader) {
        if (!isTokenValid(authHeader)) return ResponseEntity.status(403).body("Invalid token");

        if (!orderRepository.existsById(orderId)) return ResponseEntity.status(404).body("Order not found");

        orderRepository.deleteById(orderId);
        return ResponseEntity.ok("Order deleted successfully");
    }

}
