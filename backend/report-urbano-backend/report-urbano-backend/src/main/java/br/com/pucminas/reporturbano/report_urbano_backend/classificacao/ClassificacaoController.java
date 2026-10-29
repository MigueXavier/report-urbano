package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

/** Metadados e conferência da classificação da ocorrência (RF07 a RF11). */
@RestController
@RequestMapping("/classificacao")
public class ClassificacaoController {

    /**
     * Opções que a interface usa para montar os botões de tipo, perfil e gravidade. Existe para que
     * os rótulos tenham uma origem única e não precisem ser repetidos no código do front-end.
     */
    @GetMapping("/opcoes")
    public OpcoesDeClassificacao opcoes() {
        return new OpcoesDeClassificacao(
                TipoOcorrencia.opcoes(),
                PerfilAfetado.opcoes(),
                Gravidade.opcoes(),
                ClassificacaoOcorrencia.DESCRICAO_MAX);
    }

    /**
     * Confere uma classificação sem gravar nada: responde 204 quando está válida e 400 com a lista
     * de campos quando não está.
     */
    @PostMapping("/validacao")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void validar(@Valid @RequestBody ClassificacaoOcorrencia classificacao) {
        // Sem corpo: a validação acontece nas anotações de ClassificacaoOcorrencia.
    }

    public record OpcoesDeClassificacao(
            List<Opcao> tipos,
            List<Opcao> perfis,
            List<Opcao> gravidades,
            int descricaoMax) {
    }
}
