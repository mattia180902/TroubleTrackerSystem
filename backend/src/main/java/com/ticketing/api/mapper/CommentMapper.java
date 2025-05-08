package com.ticketing.api.mapper;

import com.ticketing.api.dto.CommentDTO;
import com.ticketing.api.entity.Comment;
import com.ticketing.api.entity.Ticket;
import com.ticketing.api.entity.User;
import com.ticketing.api.repository.TicketRepository;
import com.ticketing.api.repository.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public abstract class CommentMapper {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Mapping(target = "ticketId", source = "ticket.id")
    @Mapping(target = "userId", source = "user.id")
    public abstract CommentDTO toDTO(Comment comment);
    
    @Mapping(target = "ticket", source = "ticketId", qualifiedByName = "ticketIdToTicket")
    @Mapping(target = "user", source = "userId", qualifiedByName = "userIdToUser")
    public abstract Comment toEntity(CommentDTO commentDTO);
    
    @Named("userIdToUser")
    protected User userIdToUser(Long userId) {
        if (userId == null) {
            return null;
        }
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.orElse(null);
    }
    
    @Named("ticketIdToTicket")
    protected Ticket ticketIdToTicket(Long ticketId) {
        if (ticketId == null) {
            return null;
        }
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        return ticketOpt.orElse(null);
    }
}