package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/** Tipo da ocorrência registrada (RF07). */
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

    @JsonCreator
    public static TipoOcorrencia ler(String valor) {
        return Opcoes.ler(TipoOcorrencia.class, "Tipo", valor);
    }
}
