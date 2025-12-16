package com.drapz.config;

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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    /**
     * Configure la chaîne de filtres de sécurité.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/auth/inscription").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/connexion").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/auth/logout").authenticated()
                        
                        // Produits - publics en lecture
                        .requestMatchers(HttpMethod.GET, "/api/produits").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/produits/**").permitAll()

                        // Pays - publics en lecture
                        .requestMatchers(HttpMethod.GET, "/api/pays").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/pays/**").permitAll()
                        
                        // Paiement
                        .requestMatchers(HttpMethod.POST, "/api/paiement/creer-session").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/v1/paiement/webhook").permitAll()
                        
                        // Commandes
                        .requestMatchers(HttpMethod.GET, "/api/commandes").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/commandes/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/commandes").hasRole("USER")
                        
                        // Swagger
                        .requestMatchers("/api/v1/api-docs/**").permitAll()
                        .requestMatchers("/api/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/v1/swagger-ui.html").permitAll()
                        .requestMatchers("/api/swagger-ui/**").permitAll()
                        .requestMatchers("/api/webjars/**").permitAll()
                        .requestMatchers("/api/swagger-resources/**").permitAll()

                        .anyRequest().authenticated()
                )

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


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4000", "http://localhost:3000", "http://drapz-frontend-gfvt0r-67670e-204-216-210-142.traefik.me")); // ✅ Ajoute ton front
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Set-Cookie")); // ✅ Expose les Set-Cookie
        configuration.setAllowCredentials(true); // ✅ IMPORTANT pour les cookies
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}