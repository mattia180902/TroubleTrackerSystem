package com.ticketing.api.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ticket_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String action;
    
    @Column(columnDefinition = "TEXT")
    private String oldValue;
    
    @Column(columnDefinition = "TEXT")
    private String newValue;
    
    @Column(nullable = false)
    private String field;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    @JsonBackReference
    private Ticket ticket;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}