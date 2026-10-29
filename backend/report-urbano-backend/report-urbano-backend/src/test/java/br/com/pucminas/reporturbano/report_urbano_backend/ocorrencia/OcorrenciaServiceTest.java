package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class OcorrenciaServiceTest {

    private final OcorrenciaRepository repo = mock(OcorrenciaRepository.class);
    private final OcorrenciaService service = new OcorrenciaService(repo);

    @BeforeEach
    void setup() {
        when(repo.save(any())).thenAnswer(i -> i.getArgument(0));
    }

    private NovaOcorrenciaRequest req(boolean impacta, Boolean autorPublico) {
        return new NovaOcorrenciaRequest("https://img/1.jpg", -19.92, -43.93,
                TipoOcorrencia.DEGRAU, impacta, List.of(PerfilAfetado.CADEIRANTE),
                Gravidade.GRAVE, "  ", autorPublico, null);
    }

    @Test
    void preencheAutorDataStatusECidade() {
        Ocorrencia o = service.criar(req(true, null), "user-1");

        assertThat(o.getAutorId()).isEqualTo("user-1");
        assertThat(o.getCriadoEm()).isNotNull();
        assertThat(o.getStatus()).isEqualTo(StatusOcorrencia.ABERTA);
        assertThat(o.getCidade()).isEqualTo("Belo Horizonte");
        assertThat(o.getDescricao()).isNull();
        assertThat(o.getLocalizacao().getX()).isEqualTo(-43.93); // GeoJSON: x = longitude
    }

    @Test
    void escondeAutorPorPadrao() {
        assertThat(OcorrenciaResponse.de(service.criar(req(true, null), "user-1")).autorId()).isNull();
        assertThat(OcorrenciaResponse.de(service.criar(req(true, true), "user-1")).autorId()).isEqualTo("user-1");
    }

    @Test
    void descartaPerfisSemImpactoEmAcessibilidade() {
        assertThat(service.criar(req(false, null), "user-1").getPerfisAfetados()).isEmpty();
    }
}
