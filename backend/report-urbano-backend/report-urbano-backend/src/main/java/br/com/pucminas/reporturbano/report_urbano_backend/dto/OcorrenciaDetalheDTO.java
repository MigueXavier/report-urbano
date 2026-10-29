package br.com.pucminas.reporturbano.report_urbano_backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OcorrenciaDetalheDTO(
        String id,
        String tipo,
        boolean impactoAcessibilidade,
        List<String> perfisAfetados,
        String gravidade,
        String descricao,
        String fotoUrl,
        double latitude,
        double longitude,
        String status,
        String cidade,
        LocalDateTime dataCriacao,
        long diasEmAberto,
        int numeroConfirmacoes,
        String autorId) {
}
