package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import jakarta.validation.Validation;
import jakarta.validation.Validator;

class NovaOcorrenciaRequestTest {

    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void exigeFotoTipoGravidadeELocalizacaoValida() {
        var semNada = new NovaOcorrenciaRequest(null, 200.0, null, null, null, null, null, null, null, null);
        assertThat(validator.validate(semNada)).hasSize(5);
    }

    @Test
    void aceitaRotuloDoFront() {
        assertThat(TipoOcorrencia.de("Vaga de idoso/PCD inexistente")).isEqualTo(TipoOcorrencia.VAGA_IDOSO_PCD_INEXISTENTE);
        assertThat(Gravidade.de("Moderada")).isEqualTo(Gravidade.MODERADA);
    }
}
