package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import java.util.List;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record NovaOcorrenciaRequest(
        @NotBlank(message = "Foto é obrigatória") String fotoUrl,
        @NotNull @DecimalMin("-90") @DecimalMax("90") Double latitude,
        @NotNull @DecimalMin("-180") @DecimalMax("180") Double longitude,
        @NotNull(message = "Tipo é obrigatório") TipoOcorrencia tipo,
        Boolean impactaAcessibilidade,
        List<PerfilAfetado> perfisAfetados,
        @NotNull(message = "Gravidade é obrigatória") Gravidade gravidade,
        @Size(max = 1000) String descricao,
        Boolean autorPublico,
        String cidade) {
}