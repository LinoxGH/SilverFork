package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @EntityGraph(attributePaths = {"id", "email", "picture", "rank"})
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);


}
