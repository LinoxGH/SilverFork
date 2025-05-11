package com.SAMURAI.HU_FDS.service;

import com.SAMURAI.HU_FDS.model.Restaurant;
import com.SAMURAI.HU_FDS.model.RestaurantEmployee;
import com.SAMURAI.HU_FDS.model.User;
import com.SAMURAI.HU_FDS.repo.RestaurantEmployeeRepository;
import com.SAMURAI.HU_FDS.repo.RestaurantRepository;
import com.SAMURAI.HU_FDS.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RestaurantEmployeeService {

    @Autowired
    private RestaurantEmployeeRepository restaurantEmployeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public void updateCourierStatus(String courierUsername, Long restaurantId, String status) {
        User courier = userRepository.findByUsername(courierUsername)
                .orElseThrow(() -> new RuntimeException("Courier not found"));

        RestaurantEmployee employee = restaurantEmployeeRepository
                .findByRestaurantIdAndCourierId(restaurantId, courier.getId())
                .orElseThrow(() -> new RuntimeException("Courier is not registered to this restaurant"));

        employee.setStatus(status);
        restaurantEmployeeRepository.save(employee);
    }

    public void registerCourierToRestaurant(String courierUsername, Long restaurantId) {
        User courier = userRepository.findByUsername(courierUsername)
                .orElseThrow(() -> new RuntimeException("Courier not found"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (restaurantEmployeeRepository.existsByRestaurantAndCourier(restaurant, courier)) {
            throw new RuntimeException("Already registered");
        }

        RestaurantEmployee employee = new RestaurantEmployee();
        employee.setCourier(courier);
        employee.setRestaurant(restaurant);
        employee.setStatus("AVAILABLE");
        restaurantEmployeeRepository.save(employee);
    }

    public void unregisterCourierFromRestaurant(String courierUsername, Long restaurantId) {
        User courier = userRepository.findByUsername(courierUsername)
                .orElseThrow(() -> new RuntimeException("Courier not found"));
        RestaurantEmployee employee = restaurantEmployeeRepository
                .findByRestaurantIdAndCourierId(restaurantId, courier.getId())
                .orElseThrow(() -> new RuntimeException("Not registered"));

        restaurantEmployeeRepository.delete(employee);
    }
}
