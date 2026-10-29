package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Gravidade {
    LEVE("Leve"),
    MODERADA("Moderada"),
    GRAVE("Grave");

    private final String rotulo;

    Gravidade(String rotulo) { this.rotulo = rotulo; }

    @JsonValue
    public String getRotulo() { return rotulo; }

    // Aceita o rótulo ("Buraco na via") ou o nome da constante ("BURACO_NA_VIA").
    @JsonCreator
    public static Gravidade de(String valor) {
        for (Gravidade v : values()) {
            if (v.rotulo.equalsIgnoreCase(valor) || v.name().equalsIgnoreCase(valor)) return v;
        }
        throw new IllegalArgumentException("Valor inválido: " + valor);
    }
}
