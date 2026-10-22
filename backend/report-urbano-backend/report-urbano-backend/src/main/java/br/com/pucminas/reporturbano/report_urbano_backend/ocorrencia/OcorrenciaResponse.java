package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import java.time.Instant;
import java.util.List;

public record OcorrenciaResponse(
        String id,
        String fotoUrl,
        double latitude,
        double longitude,
        String tipo,
        boolean impactaAcessibilidade,
        List<String> perfisAfetados,
        String gravidade,
        String descricao,
        String autorId, 
        StatusOcorrencia status,
        String cidade,
        Instant criadoEm,
        int totalConfirmacoes) {

    public static OcorrenciaResponse de(Ocorrencia o) {
        return new OcorrenciaResponse(
                o.getId(),
                o.getFotoUrl(),
                o.getLocalizacao().getY(),
                o.getLocalizacao().getX(),
                o.getTipo(),
                o.isImpactaAcessibilidade(),
                o.getPerfisAfetados(),
                o.getGravidade(),
                o.getDescricao(),
                o.isAutorPublico() ? o.getAutorId() : null,
                o.getStatus(),
                o.getCidade(),
                o.getCriadoEm(),
                o.getConfirmacoes().size());
    }
}
