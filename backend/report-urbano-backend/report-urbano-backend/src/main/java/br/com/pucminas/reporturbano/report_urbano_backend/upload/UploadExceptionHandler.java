package br.com.pucminas.reporturbano.report_urbano_backend.upload;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

@RestControllerAdvice
public class UploadExceptionHandler {

    @ExceptionHandler(FotoInvalidaException.class)
    public ResponseEntity<Map<String, String>> fotoInvalida(FotoInvalidaException e) {
        return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<Map<String, String>> semFoto(MissingServletRequestPartException e) {
        return ResponseEntity.badRequest().body(Map.of("erro", "Envie uma foto da ocorrência."));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> fotoGrande(MaxUploadSizeExceededException e) {
        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE)
                .body(Map.of("erro", "A foto é grande demais. O limite é 10 MB."));
    }
}
