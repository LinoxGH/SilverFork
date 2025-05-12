package com.SAMURAI.HU_FDS.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;

    @Lob
    private byte[] picture;

    private String category;
    private String cuisine;
    private int quantity;

    @ManyToOne
    @JsonIgnore
    private Order order;


    public String getBase64Image() {
        if (picture != null) {
            return Base64.getEncoder().encodeToString(picture);
        }
        return null;
    }
}

