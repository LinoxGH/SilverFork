package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.*;
import com.SAMURAI.HU_FDS.repo.*;
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
            OrderItem orderItem = new OrderItem();
            orderItem.setMenuItem(cartItem.getMenuItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtOrder(cartItem.getMenuItem().getPrice());
            orderItem.setOrder(order);

            order.getItems().add(orderItem);
            total += cartItem.getMenuItem().getPrice() * cartItem.getQuantity();
        }

        order.setTotalPrice(total);
        orderRepository.save(order);

        cartService.clearCart(username);

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

        if ("AVAILABLE".equals(restaurantEmployee.getStatus())) {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            order.setStatus("On the Road");
            order.setCourier(restaurantEmployee.getCourier());
            restaurantEmployee.setStatus("BUSY");
            restaurantEmployeeRepository.save(restaurantEmployee);

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
            User courierUser = employee.getCourier();
            courierUser.setCourierStatus(employee.getStatus());
            couriers.add(courierUser);
        }
        return couriers;
    }
}





