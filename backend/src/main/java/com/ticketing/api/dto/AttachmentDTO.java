package com.ticketing.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AttachmentDTO {
    
    private Long id;
    private String filename;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private String filePath;
    private String downloadUrl;
    private LocalDateTime uploadedAt;
    
    // Relationships
    private Long ticketId;
    private Long uploadedById;
    
    // Denormalized fields for display
    private String uploadedByName;
}