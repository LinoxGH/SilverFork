package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.Dispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByRaisedBy_Username(String username);
    List<Dispute> findByTypeAndReview_MenuItem_Restaurant_OwnerUsername(String type, String restaurantOwner);
}