package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.Courier;
import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.model.RestaurantEmployee;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.CourierRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantEmployeeRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RestaurantEmployeeService {

    @Autowired
    private RestaurantEmployeeRepository restaurantEmployeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private CourierRepository courierRepository;

    public void updateCourierStatus(String courierUsername,String status) {
        Courier courier = courierRepository.findByUserUsername(courierUsername)
                .orElseThrow(() -> new RuntimeException("Courier not found"));

        courier.setStatus(status);
        courierRepository.save(courier);
    }

    public void registerCourierToRestaurant(String courierUsername, Long restaurantId) {
        Courier courier = courierRepository.findByUserUsername(courierUsername)
                .orElseThrow(() -> new RuntimeException("Courier not found"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (restaurantEmployeeRepository.existsByRestaurantAndCourier(restaurant, courier)) {
            throw new RuntimeException("Already registered");
        }

        RestaurantEmployee employee = new RestaurantEmployee();
        employee.setCourier(courier);
        employee.setRestaurant(restaurant);
        restaurantEmployeeRepository.save(employee);
    }


    public void unregisterCourierFromRestaurant(String courierUsername, Long restaurantId) {
        Courier courier = courierRepository.findByUserUsername(courierUsername)
                .orElseThrow(() -> new RuntimeException("Courier not found"));

        RestaurantEmployee employee = restaurantEmployeeRepository
                .findByRestaurantIdAndCourierId(restaurantId, courier.getId())
                .orElseThrow(() -> new RuntimeException("Not registered"));

        restaurantEmployeeRepository.delete(employee);
    }

    public List<Restaurant> getRegisteredRestaurants(String username) {
        Courier courier = courierRepository.findByUserUsername(username)
                .orElseThrow(() -> new RuntimeException("Courier not found"));

        List<RestaurantEmployee> assignments = restaurantEmployeeRepository.findByCourierId(courier.getId());
        return assignments.stream()
                .map(RestaurantEmployee::getRestaurant)
                .distinct()
                .collect(Collectors.toList());
    }

    public void createCouriersFromExistingUsers() {
        List<User> courierUsers = userRepository.findByRank("COURIER");

        for (User user : courierUsers) {
            // Daha önce eklenmişse tekrar ekleme
            if (!courierRepository.existsByUser(user)) {
                Courier courier = new Courier();
                courier.setUser(user);
                courierRepository.save(courier);
            }
        }
    }

    @PostConstruct
    public void initCouriers() {
        createCouriersFromExistingUsers();
    }
}
