package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.RestaurantEmployee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantEmployeeRepository extends JpaRepository<RestaurantEmployee, Long> {

    List<RestaurantEmployee> findByRestaurantId(Long restaurantId);

    Optional<RestaurantEmployee> findByRestaurantIdAndCourierId(Long restaurantId, Long courierId);

    List<RestaurantEmployee> findByCourierId(Long courierId);
}