package com.SAMURAI.HU_FDS.repo;

import com.SAMURAI.HU_FDS.model.Address;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    @EntityGraph(attributePaths = {"id", "username", "name", "details"})
    Optional<Address> findByUsernameAndName(String username, String name);

    List<Address> findByUsername(String username);

}
