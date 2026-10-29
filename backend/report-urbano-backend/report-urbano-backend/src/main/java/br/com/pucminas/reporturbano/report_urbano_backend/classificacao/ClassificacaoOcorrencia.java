package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Classificação de uma ocorrência (RF07 a RF11).
 *
 * <p>Os quatro primeiros campos são obrigatórios e preenchidos por botões na interface. A descrição
 * é opcional, porque nenhum campo de texto pode ser obrigatório no registro (RNF12).
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

    /** Limite da descrição opcional (RF11). A interface usa o mesmo número no contador. */
    public static final int DESCRICAO_MAX = 1000;

    public ClassificacaoOcorrencia {
        // Lista nula e lista vazia significam a mesma coisa; normalizar evita ramo duplo na validação.
        // A cópia preserva eventuais nulos vindos do JSON para que @NotNull os reporte como erro.
        perfisAfetados = perfisAfetados == null
                ? List.of()
                : Collections.unmodifiableList(new ArrayList<>(perfisAfetados));
        descricao = descricao == null || descricao.isBlank() ? null : descricao.trim();
    }
}
