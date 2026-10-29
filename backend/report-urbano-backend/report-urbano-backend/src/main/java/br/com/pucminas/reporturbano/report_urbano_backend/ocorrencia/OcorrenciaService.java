package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OcorrenciaService {

    private final OcorrenciaRepository repository;

    public Ocorrencia criar(NovaOcorrenciaRequest req, String autorId) {
        boolean impacta = Boolean.TRUE.equals(req.impactaAcessibilidade());
        Instant agora = Instant.now();

        Ocorrencia o = new Ocorrencia();
        o.setFotoUrl(req.fotoUrl());
        o.setLocalizacao(new GeoJsonPoint(req.longitude(), req.latitude()));
        o.setTipo(req.tipo());
        o.setImpactaAcessibilidade(impacta);
        
        o.setPerfisAfetados(impacta && req.perfisAfetados() != null ? req.perfisAfetados() : List.of());
        o.setGravidade(req.gravidade());
        o.setDescricao(req.descricao() == null || req.descricao().isBlank() ? null : req.descricao().trim());
        o.setAutorId(autorId);
        o.setAutorPublico(Boolean.TRUE.equals(req.autorPublico()));
        o.setCidade(req.cidade() == null || req.cidade().isBlank() ? Ocorrencia.CIDADE_PADRAO : req.cidade());
        o.setCriadoEm(agora);
        o.setStatusAtualizadoEm(agora);

        return repository.save(o);
    }
}