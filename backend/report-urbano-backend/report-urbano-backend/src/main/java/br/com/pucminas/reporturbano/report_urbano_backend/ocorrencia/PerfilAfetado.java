package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum PerfilAfetado {
    CADEIRANTE("Cadeirante"),
    MOBILIDADE_REDUZIDA("Mobilidade reduzida"),
    BAIXA_VISAO("Baixa visão"),
    IDOSO("Idoso");

    private final String rotulo;

    PerfilAfetado(String rotulo) { this.rotulo = rotulo; }

    @JsonValue
    public String getRotulo() { return rotulo; }

    // Aceita o rótulo ("Buraco na via") ou o nome da constante ("BURACO_NA_VIA").
    @JsonCreator
    public static PerfilAfetado de(String valor) {
        for (PerfilAfetado v : values()) {
            if (v.rotulo.equalsIgnoreCase(valor) || v.name().equalsIgnoreCase(valor)) return v;
        }
        throw new IllegalArgumentException("Valor inválido: " + valor);
    }
}
