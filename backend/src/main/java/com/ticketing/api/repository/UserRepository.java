package com.ticketing.api.repository;

import com.ticketing.api.entity.User;
import com.ticketing.api.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    List<User> findByRole(Role role);
    
    List<User> findByDepartment(String department);
    
    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findAllActiveUsers();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.assignedTo.id = :userId")
    Long countAssignedTickets(Long userId);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.createdBy.id = :userId")
    Long countCreatedTickets(Long userId);
}