package br.com.pucminas.reporturbano.report_urbano_backend.dto;

import java.time.LocalDateTime;

public record OcorrenciaResumoDTO(
        String id,
        String tipo,
        String gravidade,
        String status,
        String fotoUrl,
        LocalDateTime dataCriacao,
        long diasEmAberto,
        int numeroConfirmacoes) {
}
