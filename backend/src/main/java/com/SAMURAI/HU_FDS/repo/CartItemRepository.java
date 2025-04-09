package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

}
