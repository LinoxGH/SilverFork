package com.SAMURAI.HU_FDS.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Arrays;



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
    private String password;



    @Column(unique = true,nullable = false)
    private String email;

    @Lob
    private byte[] picture;

    @Column(nullable = false)
    private String rank;


}
