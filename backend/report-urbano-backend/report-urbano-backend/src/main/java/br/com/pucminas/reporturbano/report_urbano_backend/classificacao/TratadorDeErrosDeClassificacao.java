package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.core.NestedExceptionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Converte as falhas de validação da classificação em respostas 400 com mensagem por campo, para a
 * interface poder destacar o campo errado em vez de exibir um erro genérico.
 */
@RestControllerAdvice(basePackageClasses = ClassificacaoController.class)
public class TratadorDeErrosDeClassificacao {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroDeValidacao camposInvalidos(MethodArgumentNotValidException excecao) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : excecao.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(erro.getField(), erro.getDefaultMessage());
        }
        for (ObjectError erro : excecao.getBindingResult().getGlobalErrors()) {
            campos.putIfAbsent(erro.getObjectName(), erro.getDefaultMessage());
        }
        return new ErroDeValidacao("Classificação inválida.", campos);
    }

    /** Valor fora do enum chega como corpo ilegível; a causa raiz traz os valores aceitos. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErroDeValidacao corpoIlegivel(HttpMessageNotReadableException excecao) {
        Throwable causa = NestedExceptionUtils.getMostSpecificCause(excecao);
        String mensagem = causa instanceof IllegalArgumentException && causa.getMessage() != null
                ? causa.getMessage()
                : "Não foi possível ler os dados enviados.";
        return new ErroDeValidacao(mensagem, Map.of());
    }

    public record ErroDeValidacao(String erro, Map<String, String> campos) {
    }
}
