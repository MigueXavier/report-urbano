package br.com.pucminas.reporturbano.report_urbano_backend.config;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Component;

import br.com.pucminas.reporturbano.report_urbano_backend.model.Ocorrencia;
import br.com.pucminas.reporturbano.report_urbano_backend.repository.OcorrenciaRepository;

@Component
@Profile("teste-local")
public class DadosTeste implements CommandLineRunner {

    private final OcorrenciaRepository repository;

    public DadosTeste(OcorrenciaRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }

        repository.save(criar("BURACO", "ALTA", false, List.of(), -43.9378, -19.9208, 12, 3));
        repository.save(criar("CALCADA_DANIFICADA", "MEDIA", true, List.of("CADEIRANTE", "IDOSO"), -43.9345, -19.9191, 5, 1));
        repository.save(criar("RAMPA_INEXISTENTE", "ALTA", true, List.of("CADEIRANTE"), -43.9402, -19.9233, 30, 7));
        repository.save(criar("ILUMINACAO", "BAIXA", false, List.of(), -43.9361, -19.9175, 1, 0));
    }

    private Ocorrencia criar(String tipo, String gravidade, boolean acessibilidade, List<String> perfis,
            double longitude, double latitude, int diasAtras, int confirmacoes) {
        Ocorrencia o = new Ocorrencia();
        o.setAutorId(UsuarioTeste.ID);
        o.setTipo(tipo);
        o.setGravidade(gravidade);
        o.setImpactoAcessibilidade(acessibilidade);
        o.setPerfisAfetados(perfis);
        o.setDescricao("Ocorrência de teste");
        o.setLocalizacao(new GeoJsonPoint(longitude, latitude));
        o.setCidade("Belo Horizonte");
        o.setDataCriacao(LocalDateTime.now().minusDays(diasAtras));
        for (int i = 0; i < confirmacoes; i++) {
            o.getConfirmacoes().add("usuario-" + i);
        }
        return o;
    }
}
