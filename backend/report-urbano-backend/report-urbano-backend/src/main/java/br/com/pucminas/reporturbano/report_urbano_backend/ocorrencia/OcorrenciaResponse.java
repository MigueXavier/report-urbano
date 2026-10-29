package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import java.time.Instant;
import java.util.List;

public record OcorrenciaResponse(
        String id,
        String fotoUrl,
        double latitude,
        double longitude,
        TipoOcorrencia tipo,
        boolean impactaAcessibilidade,
        List<PerfilAfetado> perfisAfetados,
        Gravidade gravidade,
        String descricao,
        String autorId, // null quando o autor não quis se identificar
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