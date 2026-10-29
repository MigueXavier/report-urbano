package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Gravidade atribuida a ocorrencia (RF10). */
public enum Gravidade implements Classificavel {

    LEVE("Leve"),
    MODERADA("Moderada"),
    GRAVE("Grave");

    private final String rotulo;

    Gravidade(String rotulo) {
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

    /** Aceita o codigo ("GRAVE") ou o rotulo ("Grave"). */
    @JsonCreator
    public static Gravidade ler(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        String procurado = valor.trim();

        for (Gravidade opcao : values()) {
            if (opcao.getCodigo().equalsIgnoreCase(procurado)) {
                return opcao;
            }
            if (opcao.getRotulo().equalsIgnoreCase(procurado)) {
                return opcao;
            }
        }

        throw new IllegalArgumentException(
                "Gravidade inválida: '" + valor + "'. Valores aceitos: " + codigosAceitos() + ".");
    }

    public static List<Opcao> opcoes() {
        List<Opcao> lista = new ArrayList<>();

        for (Gravidade opcao : values()) {
            lista.add(new Opcao(opcao.getCodigo(), opcao.getRotulo()));
        }

        return lista;
    }

    private static String codigosAceitos() {
        List<String> codigos = new ArrayList<>();

        for (Gravidade opcao : values()) {
            codigos.add(opcao.getCodigo());
        }

        return String.join(", ", codigos);
    }
}
