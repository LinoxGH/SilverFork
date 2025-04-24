package com.SAMURAI.HU_FDS.repo;


import com.SAMURAI.HU_FDS.model.Favorite;
import com.SAMURAI.HU_FDS.model.MenuItem;
import com.SAMURAI.HU_FDS.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite,Long> {
    List<Favorite> findAllByUser(User user);
    Optional<Favorite> findByUser_UsernameAndMenuItem_Id(String username, Long menuItemId);

    boolean existsByUserAndMenuItem(User user, MenuItem menuItem);
}
