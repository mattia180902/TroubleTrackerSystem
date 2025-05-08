package com.ticketing.api.dto;

import com.ticketing.api.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot be longer than 50 characters")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot be longer than 50 characters")
    private String lastName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotNull(message = "Role is required")
    private Role role;
    
    private String department;
    
    private String avatarUrl;
    
    private boolean active = true;
    
    // Password field is only used for creating/updating users
    private String password;
    
    // For response DTOs, we might want to include some statistics
    private Integer assignedTicketsCount;
    private Integer createdTicketsCount;
}