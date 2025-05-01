package com.SAMURAI.HU_FDS.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Base64;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double price;

    private String description;

    @Lob
    @JsonIgnore
    private byte[] picture;

    @Column(nullable = true)
    private String category;

    @Column(nullable = true)
    private String cuisine;

    @Column(nullable = true)
    private Integer popularity;

    @Column(nullable = true)
    private Double rating = 0.0; // Ortalama kullanıcı puanı

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;




    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    //@JsonIgnoreProperties({"menuItems", "id"})
    @JsonIgnore
    private Restaurant restaurant;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    public String getBase64Image() {
        if (picture != null) {
            return Base64.getEncoder().encodeToString(picture);
        }
        return null;
    }

}
