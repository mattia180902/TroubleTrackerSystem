package com.ticketing.api.mapper;

import com.ticketing.api.dto.NotificationDTO;
import com.ticketing.api.entity.Notification;
import com.ticketing.api.entity.Ticket;
import com.ticketing.api.entity.User;
import com.ticketing.api.repository.TicketRepository;
import com.ticketing.api.repository.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

@Mapper(componentModel = "spring", uses = {UserMapper.class, TicketMapper.class})
public abstract class NotificationMapper {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "ticketId", source = "ticket.id")
    public abstract NotificationDTO toDTO(Notification notification);
    
    @Mapping(target = "user", source = "userId", qualifiedByName = "userIdToUser")
    @Mapping(target = "ticket", source = "ticketId", qualifiedByName = "ticketIdToTicket")
    public abstract Notification toEntity(NotificationDTO notificationDTO);
    
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