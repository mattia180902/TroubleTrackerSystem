package com.ticketing.api.repository;

import com.ticketing.api.entity.Ticket;
import com.ticketing.api.enums.Priority;
import com.ticketing.api.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {
    
    // Basic filtering
    List<Ticket> findByStatus(Status status);
    
    List<Ticket> findByPriority(Priority priority);
    
    List<Ticket> findByCategoryId(Long categoryId);
    
    List<Ticket> findByCreatedById(Long userId);
    
    List<Ticket> findByAssignedToId(Long userId);
    
    // Combined filtering
    List<Ticket> findByStatusAndPriority(Status status, Priority priority);
    
    List<Ticket> findByStatusInAndPriorityInAndCategoryIdAndCreatedById(
            List<Status> statuses, 
            List<Priority> priorities, 
            Long categoryId, 
            Long createdById);
    
    // Pagination with filtering
    Page<Ticket> findByStatus(Status status, Pageable pageable);
    
    Page<Ticket> findByCategoryId(Long categoryId, Pageable pageable);
    
    // Stats queries
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = :status")
    Long countByStatus(Status status);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.priority = :priority")
    Long countByPriority(Priority priority);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.createdAt BETWEEN :startDate AND :endDate")
    Long countByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT t.status as status, COUNT(t) as count FROM Ticket t GROUP BY t.status")
    List<Object[]> countByStatusGroup();
    
    @Query("SELECT t.priority as priority, COUNT(t) as count FROM Ticket t GROUP BY t.priority")
    List<Object[]> countByPriorityGroup();
    
    @Query("SELECT FUNCTION('YEAR', t.createdAt) as year, " +
           "FUNCTION('MONTH', t.createdAt) as month, " +
           "COUNT(t) as count " +
           "FROM Ticket t " +
           "GROUP BY FUNCTION('YEAR', t.createdAt), FUNCTION('MONTH', t.createdAt) " +
           "ORDER BY year, month")
    List<Object[]> countByMonth();
    
    // Average metrics
    @Query("SELECT AVG(FUNCTION('TIMESTAMPDIFF', SECOND, t.createdAt, " +
           "(SELECT MIN(c.createdAt) FROM Comment c WHERE c.ticket = t))) " +
           "FROM Ticket t WHERE t.status IN ('RESOLVED', 'CLOSED')")
    Double averageFirstResponseTime();
    
    @Query("SELECT AVG(FUNCTION('TIMESTAMPDIFF', SECOND, t.createdAt, t.resolvedAt)) " +
           "FROM Ticket t WHERE t.status IN ('RESOLVED', 'CLOSED') AND t.resolvedAt IS NOT NULL")
    Double averageResolutionTime();
}