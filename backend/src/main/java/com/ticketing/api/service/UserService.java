package com.ticketing.api.service;

import com.ticketing.api.dto.UserDTO;
import com.ticketing.api.entity.Role;
import com.ticketing.api.entity.User;
import com.ticketing.api.exception.ResourceNotFoundException;
import com.ticketing.api.mapper.UserMapper;
import com.ticketing.api.repository.RoleRepository;
import com.ticketing.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.ws.rs.core.Response;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final Keycloak keycloak;
    
    @Value("${keycloak.realm}")
    private String realm;
    
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return userMapper.toDTO(user);
    }
    
    public UserDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        return userMapper.toDTO(user);
    }
    
    @Transactional
    public UserDTO createUser(UserDTO userDTO, String password) {
        // Check if username already exists
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        
        // Create user in Keycloak
        String keycloakId = createKeycloakUser(userDTO, password);
        
        // Create user in our database
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setAvatarUrl(userDTO.getAvatarUrl());
        user.setKeycloakId(keycloakId);
        user.setActive(true);
        
        // Set roles
        Set<Role> roles = new HashSet<>();
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            userDTO.getRoles().forEach(roleName -> {
                Role.ERole eRole;
                switch (roleName) {
                    case "ROLE_ADMIN":
                        eRole = Role.ERole.ROLE_ADMIN;
                        break;
                    case "ROLE_AGENT":
                        eRole = Role.ERole.ROLE_AGENT;
                        break;
                    default:
                        eRole = Role.ERole.ROLE_USER;
                }
                
                Role role = roleRepository.findByName(eRole)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(role);
            });
        } else {
            // Default role
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        }
        
        user.setRoles(roles);
        
        User savedUser = userRepository.save(user);
        return userMapper.toDTO(savedUser);
    }
    
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        // Check if username already exists (for another user)
        if (!user.getUsername().equals(userDTO.getUsername()) && 
                userRepository.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("Username is already taken");
        }
        
        // Check if email already exists (for another user)
        if (!user.getEmail().equals(userDTO.getEmail()) && 
                userRepository.existsByEmail(userDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already in use");
        }
        
        // Update user in Keycloak
        updateKeycloakUser(user.getKeycloakId(), userDTO);
        
        // Update user in our database
        user.setUsername(userDTO.getUsername());
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setAvatarUrl(userDTO.getAvatarUrl());
        user.setActive(userDTO.isActive());
        
        // Update roles if provided
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            userDTO.getRoles().forEach(roleName -> {
                Role.ERole eRole;
                switch (roleName) {
                    case "ROLE_ADMIN":
                        eRole = Role.ERole.ROLE_ADMIN;
                        break;
                    case "ROLE_AGENT":
                        eRole = Role.ERole.ROLE_AGENT;
                        break;
                    default:
                        eRole = Role.ERole.ROLE_USER;
                }
                
                Role role = roleRepository.findByName(eRole)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(role);
            });
            
            // Update Keycloak roles
            updateKeycloakUserRoles(user.getKeycloakId(), userDTO.getRoles());
            
            user.setRoles(roles);
        }
        
        User updatedUser = userRepository.save(user);
        return userMapper.toDTO(updatedUser);
    }
    
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        
        // Delete user from Keycloak
        deleteKeycloakUser(user.getKeycloakId());
        
        // Delete user from our database
        userRepository.delete(user);
    }
    
    private String createKeycloakUser(UserDTO userDTO, String password) {
        UsersResource usersResource = keycloak.realm(realm).users();
        
        // Create user representation
        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(userDTO.getUsername());
        userRepresentation.setEmail(userDTO.getEmail());
        userRepresentation.setFirstName(userDTO.getName().split(" ")[0]);
        userRepresentation.setLastName(userDTO.getName().contains(" ") 
                ? userDTO.getName().substring(userDTO.getName().indexOf(" ") + 1) 
                : "");
        userRepresentation.setEnabled(true);
        userRepresentation.setEmailVerified(true);
        
        // Create user
        Response response = usersResource.create(userRepresentation);
        
        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user in Keycloak. Status: " + response.getStatus());
        }
        
        // Get user ID from response
        String locationHeader = response.getHeaderString("Location");
        String userId = locationHeader.substring(locationHeader.lastIndexOf("/") + 1);
        
        // Set password
        UserResource userResource = usersResource.get(userId);
        CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
        credentialRepresentation.setValue(password);
        credentialRepresentation.setTemporary(false);
        userResource.resetPassword(credentialRepresentation);
        
        // Set roles
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            setKeycloakUserRoles(userResource, userDTO.getRoles());
        } else {
            // Default role
            setKeycloakUserRoles(userResource, Collections.singleton("ROLE_USER"));
        }
        
        return userId;
    }
    
    private void updateKeycloakUser(String keycloakId, UserDTO userDTO) {
        UserResource userResource = keycloak.realm(realm).users().get(keycloakId);
        
        UserRepresentation userRepresentation = userResource.toRepresentation();
        userRepresentation.setUsername(userDTO.getUsername());
        userRepresentation.setEmail(userDTO.getEmail());
        userRepresentation.setFirstName(userDTO.getName().split(" ")[0]);
        userRepresentation.setLastName(userDTO.getName().contains(" ") 
                ? userDTO.getName().substring(userDTO.getName().indexOf(" ") + 1) 
                : "");
        userRepresentation.setEnabled(userDTO.isActive());
        
        userResource.update(userRepresentation);
    }
    
    private void updateKeycloakUserRoles(String keycloakId, Set<String> roles) {
        UserResource userResource = keycloak.realm(realm).users().get(keycloakId);
        setKeycloakUserRoles(userResource, roles);
    }
    
    private void setKeycloakUserRoles(UserResource userResource, Set<String> roles) {
        // Get all available realm roles
        List<RoleRepresentation> availableRoles = keycloak.realm(realm).roles().list();
        
        // Map role names to role representations
        List<RoleRepresentation> rolesToAdd = availableRoles.stream()
                .filter(role -> roles.contains(role.getName()))
                .collect(Collectors.toList());
        
        // Assign roles to user
        userResource.roles().realmLevel().add(rolesToAdd);
    }
    
    private void deleteKeycloakUser(String keycloakId) {
        keycloak.realm(realm).users().delete(keycloakId);
    }
}