package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Perfil de pessoa afetada pela ocorrencia (RF09). */
public enum PerfilAfetado implements Classificavel {

    CADEIRANTE("Cadeirante"),
    MOBILIDADE_REDUZIDA("Mobilidade reduzida"),
    BAIXA_VISAO("Baixa visão"),
    IDOSO("Idoso");

    private final String rotulo;

    PerfilAfetado(String rotulo) {
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

    /** Aceita o codigo ("CADEIRANTE") ou o rotulo ("Cadeirante"). */
    @JsonCreator
    public static PerfilAfetado ler(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        String procurado = valor.trim();

        for (PerfilAfetado opcao : values()) {
            if (opcao.getCodigo().equalsIgnoreCase(procurado)) {
                return opcao;
            }
            if (opcao.getRotulo().equalsIgnoreCase(procurado)) {
                return opcao;
            }
        }

        throw new IllegalArgumentException(
                "Perfil afetado inválido: '" + valor + "'. Valores aceitos: " + codigosAceitos() + ".");
    }

    public static List<Opcao> opcoes() {
        List<Opcao> lista = new ArrayList<>();

        for (PerfilAfetado opcao : values()) {
            lista.add(new Opcao(opcao.getCodigo(), opcao.getRotulo()));
        }

        return lista;
    }

    private static String codigosAceitos() {
        List<String> codigos = new ArrayList<>();

        for (PerfilAfetado opcao : values()) {
            codigos.add(opcao.getCodigo());
        }

        return String.join(", ", codigos);
    }
}
