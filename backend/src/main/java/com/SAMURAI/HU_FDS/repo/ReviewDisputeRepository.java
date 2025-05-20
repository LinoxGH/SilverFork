package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.ReviewDispute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewDisputeRepository extends JpaRepository<ReviewDispute, Long> {
    List<ReviewDispute> findByRaisedBy_Username(String username);
}