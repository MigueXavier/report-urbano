package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

/**
 * Regras da classificacao que dependem de mais de um campo ao mesmo tempo,
 * ou seja, a ligacao entre o impacto em acessibilidade (RF08) e os perfis
 * afetados (RF09). As validacoes de um campo so ficam nas anotacoes do record.
 */
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

        // Desligo a mensagem padrao porque cada erro abaixo tem a sua propria
        contexto.disableDefaultConstraintViolation();
        boolean valido = true;

        // RF09: se disse que impacta a acessibilidade, precisa dizer quem e afetado
        if (Boolean.TRUE.equals(impacta) && perfis.isEmpty()) {
            adicionarErro(contexto,
                    "Informe pelo menos um perfil afetado quando a ocorrência impacta a acessibilidade.");
            valido = false;
        }

        // RF08: se disse que nao impacta, perfil afetado nao faz sentido e atrapalharia a medicao
        if (Boolean.FALSE.equals(impacta) && !perfis.isEmpty()) {
            adicionarErro(contexto,
                    "Não informe perfis afetados quando a ocorrência não impacta a acessibilidade.");
            valido = false;
        }

        if (temPerfilRepetido(perfis)) {
            adicionarErro(contexto, "Não repita perfis afetados.");
            valido = false;
        }

        return valido;
    }

    /** Percorre a lista guardando os perfis que ja apareceram para achar repetido. */
    private boolean temPerfilRepetido(List<PerfilAfetado> perfis) {
        List<PerfilAfetado> jaApareceram = new ArrayList<>();

        for (PerfilAfetado perfil : perfis) {
            // Perfil nulo ja e reclamado pelo @NotNull da lista, aqui so ignoro
            if (perfil == null) {
                continue;
            }

            if (jaApareceram.contains(perfil)) {
                return true;
            }

            jaApareceram.add(perfil);
        }

        return false;
    }

    /** Liga a mensagem de erro ao campo perfisAfetados, para a tela destacar ele. */
    private void adicionarErro(ConstraintValidatorContext contexto, String mensagem) {
        contexto.buildConstraintViolationWithTemplate(mensagem)
                .addPropertyNode(CAMPO)
                .addConstraintViolation();
    }
}
