package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Address;
import com.SAMURAI.HU_FDS.repo.AddressRepository;
import com.SAMURAI.HU_FDS.utils.UserAuthenticator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@CrossOrigin
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @GetMapping("/customer/address-add")
    public ResponseEntity<String> addAddress(@RequestHeader("Authorization") String authHeader, @RequestBody Address address) {
        if (UserAuthenticator.getInstance().authenticate(authHeader)) {
            // If address already exists.
            if (addressRepository.findByUsernameAndName(address.getUsername(), address.getName()).isPresent()) {
                return ResponseEntity.badRequest().body("An address with this name already exists.");
            }
            addressRepository.save(address);
            return ResponseEntity.ok("Added address "+ address.getName());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }
}
