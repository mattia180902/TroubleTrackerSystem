package com.ticketing.api.repository;

import com.ticketing.api.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    Optional<Category> findByName(String name);
    
    @Query("SELECT c FROM Category c ORDER BY c.name ASC")
    List<Category> findAllOrderByName();
    
    @Query("SELECT c.id as id, c.name as name, COUNT(t.id) as ticketCount " + 
           "FROM Category c LEFT JOIN c.tickets t " + 
           "GROUP BY c.id, c.name " +
           "ORDER BY c.name ASC")
    List<Object[]> findAllWithTicketCount();
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.category.id = :categoryId")
    Long countTicketsByCategoryId(Long categoryId);
}