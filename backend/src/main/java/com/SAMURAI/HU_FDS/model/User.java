package com.SAMURAI.HU_FDS.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;
import java.util.List;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;


    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;


    @Column(unique = true, nullable = false)
    private String email;

    @Lob
    @JsonIgnore
    private byte[] picture;

    @Column(nullable = false)
    private String rank;

    private String status;

    private String courierStatus;

    @OneToMany(mappedBy = "courier")
    private List<RestaurantEmployee> restaurantEmployees;

    public String getBase64Image() {
        if (picture != null) {
            System.out.println("denebakim");
            return Base64.getEncoder().encodeToString(picture);
        }
        return null;
    }
}
