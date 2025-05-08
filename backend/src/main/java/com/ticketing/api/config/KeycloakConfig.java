package com.ticketing.api.config;

import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class KeycloakConfig {
    
    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;
    
    @Value("${keycloak.realm}")
    private String realm;
    
    @Value("${keycloak.resource}")
    private String clientId;
    
    @Value("${keycloak.credentials.secret:#{null}}")
    private String clientSecret;
    
    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .serverUrl(authServerUrl)
                .realm("master")
                .clientId("admin-cli")
                .username("admin")  // Should be stored securely and injected
                .password("admin")  // Should be stored securely and injected
                .build();
    }
}