package br.com.pucminas.reporturbano.report_urbano_backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.pucminas.reporturbano.report_urbano_backend.dto.OcorrenciaDetalheDTO;
import br.com.pucminas.reporturbano.report_urbano_backend.dto.OcorrenciaResumoDTO;
import br.com.pucminas.reporturbano.report_urbano_backend.model.Ocorrencia;
import br.com.pucminas.reporturbano.report_urbano_backend.repository.OcorrenciaRepository;

@Service
public class OcorrenciaConsultaService {

    private final OcorrenciaRepository repository;

    public OcorrenciaConsultaService(OcorrenciaRepository repository) {
        this.repository = repository;
    }

    public OcorrenciaDetalheDTO buscarPorId(String id) {
        Ocorrencia o = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ocorrência não encontrada"));

        double longitude = o.getLocalizacao() != null ? o.getLocalizacao().getX() : 0;
        double latitude = o.getLocalizacao() != null ? o.getLocalizacao().getY() : 0;
        String autor = o.isAutorPublico() ? o.getAutorId() : null;

        return new OcorrenciaDetalheDTO(
                o.getId(),
                o.getTipo(),
                o.isImpactoAcessibilidade(),
                o.getPerfisAfetados(),
                o.getGravidade(),
                o.getDescricao(),
                o.getFotoUrl(),
                latitude,
                longitude,
                o.getStatus(),
                o.getCidade(),
                o.getDataCriacao(),
                calcularDiasEmAberto(o),
                contarConfirmacoes(o),
                autor);
    }

    public List<OcorrenciaResumoDTO> listarDoUsuario(String usuarioId) {
        return repository.findByAutorIdOrderByDataCriacaoDesc(usuarioId)
                .stream()
                .map(o -> new OcorrenciaResumoDTO(
                        o.getId(),
                        o.getTipo(),
                        o.getGravidade(),
                        o.getStatus(),
                        o.getFotoUrl(),
                        o.getDataCriacao(),
                        calcularDiasEmAberto(o),
                        contarConfirmacoes(o)))
                .toList();
    }

    private long calcularDiasEmAberto(Ocorrencia o) {
        if (o.getDataCriacao() == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(o.getDataCriacao().toLocalDate(), LocalDate.now());
    }

    private int contarConfirmacoes(Ocorrencia o) {
        return o.getConfirmacoes() == null ? 0 : o.getConfirmacoes().size();
    }
}
