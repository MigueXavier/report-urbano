package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository repository;

    public Ocorrencia criar(NovaOcorrenciaRequest req, String autorId) {
        if (req.fotoUrl() == null || req.fotoUrl().isBlank()) erro("Foto é obrigatória");
        if (req.latitude() == null || req.longitude() == null) erro("Localização é obrigatória");
        if (req.tipo() == null) erro("Tipo é obrigatório");
        if (req.gravidade() == null) erro("Gravidade é obrigatória");

        Instant agora = Instant.now();

        Ocorrencia o = new Ocorrencia();
        o.setFotoUrl(req.fotoUrl());
        o.setLocalizacao(new GeoJsonPoint(req.longitude(), req.latitude()));
        o.setTipo(req.tipo());
        o.setImpactaAcessibilidade(Boolean.TRUE.equals(req.impactaAcessibilidade()));
        o.setPerfisAfetados(req.perfisAfetados() != null ? req.perfisAfetados() : List.of());
        o.setGravidade(req.gravidade());
        o.setDescricao(req.descricao());
        o.setAutorId(autorId);
        o.setAutorPublico(Boolean.TRUE.equals(req.autorPublico()));
        o.setCriadoEm(agora);
        o.setStatusAtualizadoEm(agora);

        return repository.save(o);
    }

    private static void erro(String msg) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }
}
