package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.Cart;
import com.SAMURAI.HU_FDS.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);

    void deleteByUser(Optional<User> user);
}