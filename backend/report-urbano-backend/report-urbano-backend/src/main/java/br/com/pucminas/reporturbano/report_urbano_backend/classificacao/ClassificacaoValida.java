package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

/**
 * Validação que depende de mais de um campo da classificação: o acoplamento entre o impacto em
 * acessibilidade (RF08) e os perfis afetados (RF09).
 */
@Documented
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ClassificacaoValidator.class)
public @interface ClassificacaoValida {

    String message() default "Classificação inconsistente.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
