package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.Order;
import com.SAMURAI.HU_FDS.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByRestaurantOwnerUsername(String ownerUsername);

    void deleteAllByUser(Optional<User> user);
}