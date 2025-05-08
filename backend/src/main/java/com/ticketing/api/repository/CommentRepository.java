package com.ticketing.api.repository;

import com.ticketing.api.entity.Comment;
import com.ticketing.api.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketOrderByCreatedAtAsc(Ticket ticket);
    List<Comment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}