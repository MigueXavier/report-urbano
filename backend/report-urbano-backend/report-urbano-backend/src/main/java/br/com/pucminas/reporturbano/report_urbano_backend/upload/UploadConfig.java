package br.com.pucminas.reporturbano.report_urbano_backend.upload;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadConfig implements WebMvcConfigurer {

    private final LocalStorageService localStorage;
    private final List<String> origensPermitidas;

    public UploadConfig(LocalStorageService localStorage,
            @Value("${app.cors.origens:http://localhost:3000}") List<String> origensPermitidas) {
        this.localStorage = localStorage;
        this.origensPermitidas = origensPermitidas;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/fotos/**")
                .addResourceLocations(localStorage.getPasta().toUri().toString());
    }

    @Bean
    @Order(1)
    SecurityFilterChain uploadSecurityFilterChain(HttpSecurity http) throws Exception {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(origensPermitidas);
        cors.setAllowedMethods(List.of("GET", "POST", "OPTIONS"));
        cors.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource corsSource = new UrlBasedCorsConfigurationSource();
        corsSource.registerCorsConfiguration("/uploads/**", cors);

        http.securityMatcher("/uploads/**")
                .cors(c -> c.configurationSource(corsSource))
                .csrf(c -> c.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/uploads/fotos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/uploads/fotos").permitAll()
                        .anyRequest().denyAll());
        return http.build();
    }
}
