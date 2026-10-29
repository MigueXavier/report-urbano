package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Classificacao de uma ocorrencia (RF07 a RF11).
 *
 * <p>Tipo, impacto em acessibilidade e gravidade sao obrigatorios e preenchidos
 * por botoes na tela. A descricao e opcional, porque nenhum campo de texto pode
 * ser obrigatorio no registro (RNF12).
 */
@ClassificacaoValida
public record ClassificacaoOcorrencia(

        @NotNull(message = "Informe o tipo da ocorrência.")
        TipoOcorrencia tipo,

        @NotNull(message = "Informe se a ocorrência impacta a acessibilidade.")
        Boolean impactaAcessibilidade,

        List<@NotNull(message = "Perfil afetado inválido.") PerfilAfetado> perfisAfetados,

        @NotNull(message = "Informe a gravidade da ocorrência.")
        Gravidade gravidade,

        @Size(max = ClassificacaoOcorrencia.DESCRICAO_MAX,
                message = "A descrição deve ter no máximo {max} caracteres.")
        String descricao) {

    /** Limite da descricao opcional (RF11). A tela usa o mesmo numero no contador. */
    public static final int DESCRICAO_MAX = 1000;

    public ClassificacaoOcorrencia {
        // Lista nula e lista vazia significam a mesma coisa, entao deixo as duas
        // como lista vazia para a validacao nao precisar tratar dois casos.
        // Faco uma copia para nao ficar usando a lista de quem chamou.
        if (perfisAfetados == null) {
            perfisAfetados = new ArrayList<>();
        } else {
            perfisAfetados = new ArrayList<>(perfisAfetados);
        }

        // Descricao so com espaco vira nula, para nao gravar espaco em branco
        if (descricao != null) {
            if (descricao.isBlank()) {
                descricao = null;
            } else {
                descricao = descricao.trim();
            }
        }
    }
}
