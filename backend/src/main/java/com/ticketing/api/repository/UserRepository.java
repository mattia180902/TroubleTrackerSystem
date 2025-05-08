package com.ticketing.api.repository;

import com.ticketing.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByKeycloakId(String keycloakId);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByKeycloakId(String keycloakId);
}