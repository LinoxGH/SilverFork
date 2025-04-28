package com.SAMURAI.HU_FDS.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String ownerUsername;

    private byte[] picture;

    @Column(nullable = true)
    private String category;

    @Column(nullable = true)
    private String cuisine;

    @Column(nullable = true)
    private Double rating;


    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<MenuItem> Menu = new ArrayList<MenuItem>();
}
