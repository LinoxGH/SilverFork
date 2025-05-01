package com.SAMURAI.HU_FDS.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonIgnore
    private String category;

    @Column(nullable = true)
    @JsonIgnore
    private String cuisine;

    @Column(nullable = true)
    @JsonIgnore
    private Integer popularity;

    @Column(nullable = true)
    @JsonIgnore
    private Double rating = 0.0; // Ortalama kullanıcı puanı

    @Column(nullable = false, updatable = false)
    @JsonIgnore
    private LocalDateTime createdAt;




    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
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
