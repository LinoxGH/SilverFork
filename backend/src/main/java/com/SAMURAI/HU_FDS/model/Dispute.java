package com.SAMURAI.HU_FDS.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String reason;

    private LocalDateTime createdAt;

    @ManyToOne
    private User raisedBy;

    @ManyToOne
    private Order order;

    @ManyToOne
    private Review review; 
}