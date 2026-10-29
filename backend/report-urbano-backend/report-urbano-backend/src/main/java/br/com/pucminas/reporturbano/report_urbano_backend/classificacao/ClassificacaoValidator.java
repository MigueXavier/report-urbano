package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.List;
import java.util.Objects;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/** Regras da classificação que envolvem mais de um campo (RF08 e RF09). */
public class ClassificacaoValidator
        implements ConstraintValidator<ClassificacaoValida, ClassificacaoOcorrencia> {

    private static final String CAMPO = "perfisAfetados";

    @Override
    public boolean isValid(ClassificacaoOcorrencia classificacao, ConstraintValidatorContext contexto) {
        if (classificacao == null) {
            return true;
        }

        Boolean impacta = classificacao.impactaAcessibilidade();
        List<PerfilAfetado> perfis = classificacao.perfisAfetados();
        contexto.disableDefaultConstraintViolation();
        boolean valido = true;

        // RF09: declarar impacto em acessibilidade obriga a indicar quem é afetado.
        if (Boolean.TRUE.equals(impacta) && perfis.isEmpty()) {
            erro(contexto, "Informe pelo menos um perfil afetado quando a ocorrência impacta a acessibilidade.");
            valido = false;
        }

        // RF08: sem impacto declarado, perfis afetados não fazem sentido e distorceriam a medição.
        if (Boolean.FALSE.equals(impacta) && !perfis.isEmpty()) {
            erro(contexto, "Não informe perfis afetados quando a ocorrência não impacta a acessibilidade.");
            valido = false;
        }

        long preenchidos = perfis.stream().filter(Objects::nonNull).count();
        if (perfis.stream().filter(Objects::nonNull).distinct().count() != preenchidos) {
            erro(contexto, "Não repita perfis afetados.");
            valido = false;
        }

        return valido;
    }

    private void erro(ConstraintValidatorContext contexto, String mensagem) {
        contexto.buildConstraintViolationWithTemplate(mensagem)
                .addPropertyNode(CAMPO)
                .addConstraintViolation();
    }
}
