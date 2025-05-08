package com.ticketing.api.mapper;

import com.ticketing.api.dto.TicketDTO;
import com.ticketing.api.entity.Category;
import com.ticketing.api.entity.Ticket;
import com.ticketing.api.entity.User;
import com.ticketing.api.repository.CategoryRepository;
import com.ticketing.api.repository.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

@Mapper(componentModel = "spring", uses = {UserMapper.class, CategoryMapper.class, CommentMapper.class, TicketHistoryMapper.class})
public abstract class TicketMapper {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "assignedToId", source = "assignedTo.id")
    @Mapping(target = "categoryId", source = "category.id")
    public abstract TicketDTO toDTO(Ticket ticket);
    
    @Mapping(target = "createdBy", source = "createdById", qualifiedByName = "userIdToUser")
    @Mapping(target = "assignedTo", source = "assignedToId", qualifiedByName = "userIdToUser")
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "history", ignore = true)
    public abstract Ticket toEntity(TicketDTO ticketDTO);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "history", ignore = true)
    @Mapping(target = "assignedTo", source = "assignedToId", qualifiedByName = "userIdToUser")
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "categoryIdToCategory")
    public abstract void updateTicketFromDTO(TicketDTO ticketDTO, @MappingTarget Ticket ticket);
    
    @Named("userIdToUser")
    protected User userIdToUser(Long userId) {
        if (userId == null) {
            return null;
        }
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.orElse(null);
    }
    
    @Named("categoryIdToCategory")
    protected Category categoryIdToCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        Optional<Category> categoryOpt = categoryRepository.findById(categoryId);
        return categoryOpt.orElse(null);
    }
}