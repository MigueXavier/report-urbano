package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoOcorrencia {
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

    TipoOcorrencia(String rotulo) { this.rotulo = rotulo; }

    @JsonValue
    public String getRotulo() { return rotulo; }

    // Aceita o rótulo ("Buraco na via") ou o nome da constante ("BURACO_NA_VIA").
    @JsonCreator
    public static TipoOcorrencia de(String valor) {
        for (TipoOcorrencia v : values()) {
            if (v.rotulo.equalsIgnoreCase(valor) || v.name().equalsIgnoreCase(valor)) return v;
        }
        throw new IllegalArgumentException("Valor inválido: " + valor);
    }
}
