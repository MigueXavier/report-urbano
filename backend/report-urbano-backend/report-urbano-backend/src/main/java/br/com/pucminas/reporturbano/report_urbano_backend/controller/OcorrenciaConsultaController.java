package br.com.pucminas.reporturbano.report_urbano_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.pucminas.reporturbano.report_urbano_backend.dto.OcorrenciaDetalheDTO;
import br.com.pucminas.reporturbano.report_urbano_backend.service.OcorrenciaConsultaService;

@RestController
@RequestMapping("/ocorrencias")
public class OcorrenciaConsultaController {

    private final OcorrenciaConsultaService service;

    public OcorrenciaConsultaController(OcorrenciaConsultaService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public OcorrenciaDetalheDTO detalhar(@PathVariable String id) {
        return service.buscarPorId(id);
    }
}
