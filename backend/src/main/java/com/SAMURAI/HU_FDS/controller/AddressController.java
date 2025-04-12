package com.SAMURAI.HU_FDS.controller;

import com.SAMURAI.HU_FDS.model.Address;
import com.SAMURAI.HU_FDS.repo.AddressRepository;
import com.SAMURAI.HU_FDS.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/address")
@CrossOrigin
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping("/list")
    public ResponseEntity<List<Address>> getAddresses(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            return ResponseEntity.ok(addressRepository.findByUsername(userDetails.getUsername()));
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addAddress(@RequestHeader("Authorization") String authHeader,
                                             @RequestBody Address address) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            // If address already exists.
            if (addressRepository.findByUsernameAndName(address.getUsername(), address.getName()).isPresent()) {
                return ResponseEntity.badRequest().body("An address with this name already exists.");
            }
            addressRepository.save(address);
            return ResponseEntity.ok("Added address " + address.getName());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateAddress(@RequestHeader("Authorization") String authHeader,
                                                @PathVariable Long id,
                                                @RequestBody Address address) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            Optional<Address> existing = addressRepository.findById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid address id");
            }
            Address existingAddress = existing.get();

            if (address.getName() != null) existingAddress.setName(address.getName());
            if (address.getDetails() != null) existingAddress.setDetails(address.getDetails());

            addressRepository.save(existingAddress);
            return ResponseEntity.ok("Updated address " + address.getName());
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAddress(@RequestHeader("Authorization") String authHeader,
                                                @PathVariable Long id) {
        String token = authHeader.replace("Bearer ", "");
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (jwtService.validateToken(token, userDetails)) {
            addressRepository.deleteById(id);
            return ResponseEntity.ok("Deleted address " + id);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
        }
    }
}
