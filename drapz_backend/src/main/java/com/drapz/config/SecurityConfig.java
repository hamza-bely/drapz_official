package com.drapz.security.config;

import com.drapz.security.JwtAuthenticationEntryPoint;
import com.drapz.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    // Définition des chemins publics pour l'API et Swagger.
    private static final String[] PUBLIC_URLS = {
            // NOTE IMPORTANTE: Les routes /api/v1/auth/** ont été retirées d'ici
            // et gérées de manière plus spécifique ci-dessous (POST pour inscription/connexion).

            // Routes d'API publiques restantes
            "/api/v1/produits/**",
            "/api/v1/paiement/webhook",

            // Chemins Swagger/OpenAPI (avec le context-path /api)
            "/api/v1/api-docs/**",
            "/api/v3/api-docs/**",
            "/api/v1/swagger-ui.html",
            "/api/swagger-ui/**",
            "/api/webjars/**",
            "/api/swagger-resources/**",

            // Chemins statiques de base (pour le cas où le context-path n'est pas appliqué)
            "/v1/api-docs/**",
            "/v1/swagger-ui.html",
            "/v1/swagger-ui/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui.html",
            "/webjars/**"
    };

    /**
     * Configure la chaîne de filtres de sécurité.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 1. Désactiver le CSRF (car nous utilisons des tokens JWT)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Gérer les exceptions d'authentification
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )

                // 3. Définir la politique de session à STATELESS (sans état)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 4. Configurer les règles d'autorisation HTTP
                .authorizeHttpRequests(authorize -> authorize

                        .requestMatchers(HttpMethod.POST, "/v1/api/auth/inscription").permitAll()
                        .requestMatchers(HttpMethod.POST, "/v1/api/auth/connexion").permitAll()

                        .requestMatchers(PUBLIC_URLS).permitAll()

                        // Autorisation basée sur les rôles (ADMIN)
                        .requestMatchers(HttpMethod.POST, "/api/v1/produits").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/produits/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/produits/**").hasRole("ADMIN")

                        // Autorisation basée sur les rôles (USER)
                        .requestMatchers("/api/v1/commandes/**").hasRole("USER")
                        .requestMatchers("/api/v1/paiement/creer-session").hasRole("USER")

                        // Toutes les autres requêtes nécessitent une authentification
                        .anyRequest().authenticated()
                )

                // 5. Ajouter le filtre JWT avant le filtre d'authentification standard
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    /**
     * Bean pour l'encodage des mots de passe.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean pour la gestion de l'authentification.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}