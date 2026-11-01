package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Acesso aos endpoints de classificação (RF07 a RF11).
 *
 * <p>Sem esta configuração, o Spring Security aplica o padrão do Spring Boot e responde 401 em
 * {@code /classificacao/**}, o que impede a interface de montar os botões antes do login.
 */
@Configuration
public class SegurancaDaClassificacao {

    /**
     * Libera apenas {@code /classificacao/**}. Os dois endpoints devolvem metadados dos enums e
     * conferem uma classificação sem gravar nada, então não há dado de usuário a proteger.
     *
     * <p>CSRF fica desligado porque a conferência é sem estado e não usa cookie de sessão: o
     * {@code CsrfFilter} roda antes da autenticação e recusaria todo POST vindo do React.
     *
     * <p>O {@code securityMatcher} restringe a cadeia a este caminho, de modo que a configuração de
     * login (RF01 a RF03) possa acrescentar a dela sem precisar alterar este arquivo.
     */
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    SecurityFilterChain filtroDaClassificacao(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/classificacao/**")
                .authorizeHttpRequests(requisicoes -> requisicoes.anyRequest().permitAll())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sessao -> sessao.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
                .build();
    }

    /**
     * Mantém o restante da aplicação exigindo autenticação, como era antes desta classe existir.
     *
     * <p>Declarar uma {@link SecurityFilterChain} desativa a cadeia padrão do Spring Boot, que
     * protegia todos os caminhos. Sem este complemento, liberar a classificação deixaria os demais
     * endpoints sem nenhum filtro. Substituir pela configuração definitiva de login (RF01 a RF03).
     */
    @Bean
    @Order(Ordered.LOWEST_PRECEDENCE)
    SecurityFilterChain filtroPadrao(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(requisicoes -> requisicoes.anyRequest().authenticated())
                .httpBasic(basic -> {
                })
                .build();
    }
}
