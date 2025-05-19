package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.Courier;
import com.SAMURAI.HU_FDS.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourierRepository extends JpaRepository<Courier, Long> {
    boolean existsByUser(User user);
    Optional<Courier> findByUser(User user);

    Optional<Courier> findByUserUsername(String courierUsername);
}
