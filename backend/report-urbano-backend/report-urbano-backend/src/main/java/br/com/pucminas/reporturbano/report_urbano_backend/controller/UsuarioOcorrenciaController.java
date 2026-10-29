package br.com.pucminas.reporturbano.report_urbano_backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.pucminas.reporturbano.report_urbano_backend.config.UsuarioTeste;
import br.com.pucminas.reporturbano.report_urbano_backend.dto.OcorrenciaResumoDTO;
import br.com.pucminas.reporturbano.report_urbano_backend.service.OcorrenciaConsultaService;

@RestController
@RequestMapping("/usuarios/me")
public class UsuarioOcorrenciaController {

    private final OcorrenciaConsultaService service;

    public UsuarioOcorrenciaController(OcorrenciaConsultaService service) {
        this.service = service;
    }

    @GetMapping("/ocorrencias")
    public List<OcorrenciaResumoDTO> minhasOcorrencias(Principal usuario) {
        String usuarioId = usuario != null ? usuario.getName() : UsuarioTeste.ID;
        return service.listarDoUsuario(usuarioId);
    }
}
