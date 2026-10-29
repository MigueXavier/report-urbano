package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Gravidade atribuída à ocorrência (RF10). */
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

    @JsonCreator
    public static Gravidade ler(String valor) {
        return Opcoes.ler(Gravidade.class, "Gravidade", valor);
    }
}
