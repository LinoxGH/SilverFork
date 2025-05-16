package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMenuItemId(Long menuItemId);
    List<Review> findByUser_Username(String username);
}
