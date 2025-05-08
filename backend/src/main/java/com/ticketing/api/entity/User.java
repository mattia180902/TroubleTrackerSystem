package com.ticketing.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "username", nullable = false)
    private String username;

    @NotBlank
    @Size(min = 3, max = 100)
    @Column(name = "name", nullable = false)
    private String name;

    @NotBlank
    @Size(max = 100)
    @Email
    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @NotBlank
    @Column(name = "keycloak_id", nullable = false, unique = true)
    private String keycloakId;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "assignedTo")
    private Set<Ticket> assignedTickets = new HashSet<>();

    @OneToMany(mappedBy = "createdBy")
    private Set<Ticket> createdTickets = new HashSet<>();
}