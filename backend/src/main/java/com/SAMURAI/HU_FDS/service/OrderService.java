package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.*;
import com.SAMURAI.HU_FDS.repo.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private RestaurantEmployeeRepository restaurantEmployeeRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private CourierRepository courierRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Order createOrderFromCart(String username ,Long addressId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        Cart cart = cartService.getCart(username);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Restaurant restaurant = cart.getItems().get(0).getMenuItem().getRestaurant();

        for (CartItem item : cart.getItems()) {
            if (!item.getMenuItem().getRestaurant().equals(restaurant)) {
                throw new RuntimeException("All items must be from the same restaurant");
            }
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setRestaurant(restaurant);

        double total = 0.0;

        for (CartItem cartItem : cart.getItems()) {

            MenuItem menuItem = cartItem.getMenuItem();

            OrderItem orderItem = new OrderItem();
            orderItem.setName(cartItem.getMenuItem().getName());
            orderItem.setDescription(cartItem.getMenuItem().getDescription());
            orderItem.setPrice(cartItem.getMenuItem().getPrice());
            orderItem.setCategory(cartItem.getMenuItem().getCategory());
            orderItem.setCuisine(cartItem.getMenuItem().getCuisine());
            orderItem.setPrice(cartItem.getMenuItem().getPrice());
            orderItem.setPicture(cartItem.getMenuItem().getPicture());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);

            order.getItems().add(orderItem);
            total += cartItem.getMenuItem().getPrice() * cartItem.getQuantity();

            menuItem.setPopularity(menuItem.getPopularity() + cartItem.getQuantity());
            menuItemRepository.save(menuItem);
        }

        order.setTotalPrice(total);
        orderRepository.save(order);

        cartService.clearCart(username);

        String restaurantOwner = restaurant.getOwnerUsername(); // Owner tanımı varsa
        notificationService.sendNotificationToUser(
                restaurantOwner, "Yeni bir sipariş aldınız. Sipariş ID: " + order.getId()
        );

        return order;
    }

    public List<Order> getUserOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order updateOrderStatus(Long orderId, String status , String username) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getRestaurant().getOwnerUsername().equals(username)) {
            throw new AccessDeniedException("Not authorized to update this order");
        }
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getOrdersByOwnerUsername(String ownerUsername) {
        return orderRepository.findByRestaurantOwnerUsername(ownerUsername);
    }

    public Order assignCourierToOrder(Long orderId, Long courierId, String username) {
        Restaurant restaurant = restaurantRepository.findByOwnerUsername(username)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        RestaurantEmployee restaurantEmployee = restaurantEmployeeRepository
                .findByRestaurantIdAndCourierId(restaurant.getId(), courierId)
                .orElseThrow(() -> new RuntimeException("Courier is not an employee of this restaurant"));

        Courier courier = restaurantEmployee.getCourier();

        if ("AVAILABLE".equals(courier.getStatus())) {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            order.setStatus("On the Road");
            order.setCourier(courier);;
            restaurantEmployeeRepository.save(restaurantEmployee);

            notificationService.sendNotificationToUser(
                    courier.getUser().getUsername(), "Yeni bir sipariş size atandı! Sipariş ID: " + order.getId()
            );

            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Courier is not available");
        }
    }

    public List<User> getCouriersForRestaurant(String username) {
        Restaurant restaurant = restaurantRepository.findByOwnerUsername(username)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        List<RestaurantEmployee> restaurantEmployees = restaurantEmployeeRepository.findByRestaurantId(restaurant.getId());


        List<User> couriers = new ArrayList<>();
        for (RestaurantEmployee employee : restaurantEmployees) {
            User courierUser = employee.getCourier().getUser();
            couriers.add(courierUser);
        }
        return couriers;
    }

    public List<Order> getOrdersAssignedToCourier(String courierUsername) {
        return orderRepository.findByCourierUserUsername(courierUsername);
    }
    
    @Transactional
    public boolean deliverOrder(Long orderId, String courierUsername) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    
        if (order.getCourier() != null && order.getCourier().getUser().getUsername().equals(courierUsername)) {
            order.setStatus("DELIVERED");
            orderRepository.save(order);
            return true;
        }
        return false;
    }
}





