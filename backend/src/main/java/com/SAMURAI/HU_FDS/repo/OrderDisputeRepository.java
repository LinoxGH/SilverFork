package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.OrderDispute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDisputeRepository extends JpaRepository<OrderDispute, Long> {
    List<OrderDispute> findByRaisedBy_Username(String username);
}