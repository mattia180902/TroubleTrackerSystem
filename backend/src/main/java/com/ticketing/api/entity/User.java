package com.ticketing.api.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ticketing.api.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    private String department;
    
    private String avatarUrl;
    
    @Column(nullable = false)
    private boolean active = true;
    
    @OneToMany(mappedBy = "createdBy")
    @JsonManagedReference
    private List<Ticket> createdTickets = new ArrayList<>();
    
    @OneToMany(mappedBy = "assignedTo")
    @JsonManagedReference
    private List<Ticket> assignedTickets = new ArrayList<>();
    
    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<Comment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<TicketHistory> ticketHistory = new ArrayList<>();
    
    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<Notification> notifications = new ArrayList<>();
    
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}