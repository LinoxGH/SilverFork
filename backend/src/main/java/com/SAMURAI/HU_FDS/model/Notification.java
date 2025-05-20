package com.SAMURAI.HU_FDS.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    private String message;


    @Enumerated(EnumType.STRING)
    private Status status = Status.UNREAD;

    private LocalDateTime createdAt;

    public enum Status {
        READ,
        UNREAD
    }

}
