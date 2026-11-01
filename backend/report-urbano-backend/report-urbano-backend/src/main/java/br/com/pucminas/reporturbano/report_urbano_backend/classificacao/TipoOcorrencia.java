package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Tipo da ocorrencia registrada (RF07). */
public enum TipoOcorrencia implements Classificavel {

    BURACO_NA_VIA("Buraco na via"),
    CALCADA_DANIFICADA("Calçada danificada"),
    AUSENCIA_DE_RAMPA("Ausência de rampa"),
    DEGRAU("Degrau"),
    PISO_TATIL_AUSENTE("Piso tátil ausente"),
    VAGA_IDOSO_PCD_INEXISTENTE("Vaga de idoso/PCD inexistente"),
    OBSTACULO_EM_PASSEIO("Obstáculo em passeio"),
    LIXO_OU_ENTULHO("Lixo ou entulho"),
    ILUMINACAO("Iluminação"),
    ALAGAMENTO_RECORRENTE("Alagamento recorrente");

    private final String rotulo;

    TipoOcorrencia(String rotulo) {
        this.rotulo = rotulo;
    }

    @JsonValue
    @Override
    public String getCodigo() {
        return name();
    }

    @Override
    public String getRotulo() {
        return rotulo;
    }

    /**
     * Transforma o texto que chega na API em uma constante do enum.
     * Aceita o codigo ("DEGRAU") ou o rotulo ("Degrau"), sem diferenciar
     * maiuscula de minuscula e ignorando espacos nas pontas.
     */
    @JsonCreator
    public static TipoOcorrencia ler(String valor) {
        // Texto vazio devolve nulo e quem reclama e a validacao do @NotNull
        if (valor == null || valor.isBlank()) {
            return null;
        }

        String procurado = valor.trim();

        for (TipoOcorrencia opcao : values()) {
            if (opcao.getCodigo().equalsIgnoreCase(procurado)) {
                return opcao;
            }
            if (opcao.getRotulo().equalsIgnoreCase(procurado)) {
                return opcao;
            }
        }

        throw new IllegalArgumentException(
                "Tipo inválido: '" + valor + "'. Valores aceitos: " + codigosAceitos() + ".");
    }

    /** Lista as opcoes na ordem em que foram declaradas, para a tela montar os botoes. */
    public static List<Opcao> opcoes() {
        List<Opcao> lista = new ArrayList<>();

        for (TipoOcorrencia opcao : values()) {
            lista.add(new Opcao(opcao.getCodigo(), opcao.getRotulo()));
        }

        return lista;
    }

    /** Monta o texto com os codigos aceitos, usado na mensagem de erro. */
    private static String codigosAceitos() {
        List<String> codigos = new ArrayList<>();

        for (TipoOcorrencia opcao : values()) {
            codigos.add(opcao.getCodigo());
        }

        return String.join(", ", codigos);
    }
}
