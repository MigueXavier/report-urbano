package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import java.util.List;


public record NovaOcorrenciaRequest(
        String fotoUrl,
        Double latitude,
        Double longitude,
        String tipo,
        Boolean impactaAcessibilidade,
        List<String> perfisAfetados,
        String gravidade,
        String descricao,
        Boolean autorPublico) {
}
