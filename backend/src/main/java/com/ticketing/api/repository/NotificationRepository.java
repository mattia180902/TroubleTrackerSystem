package com.ticketing.api.repository;

import com.ticketing.api.entity.Notification;
import com.ticketing.api.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserAndReadOrderByCreatedAtDesc(User user, boolean read);
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    Long countByUserAndRead(User user, boolean read);
    
    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user.id = :userId")
    void markAllAsRead(Long userId);
}