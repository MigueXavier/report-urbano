package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Perfil de pessoa afetada pela ocorrência (RF09). */
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

    @JsonCreator
    public static PerfilAfetado ler(String valor) {
        return Opcoes.ler(PerfilAfetado.class, "Perfil afetado", valor);
    }
}
