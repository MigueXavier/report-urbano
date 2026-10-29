package br.com.pucminas.reporturbano.report_urbano_backend.upload;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/uploads/fotos")
public class UploadController {

    private final StorageService storage;

    public UploadController(StorageService storage) {
        this.storage = storage;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponse> enviar(@RequestParam("foto") MultipartFile foto) throws IOException {
        if (foto == null || foto.isEmpty()) {
            throw new FotoInvalidaException("Envie uma foto da ocorrência.");
        }

        TipoImagem tipo;
        try (InputStream entrada = foto.getInputStream()) {
            tipo = TipoImagem.detectar(entrada.readNBytes(12))
                    .orElseThrow(() -> new FotoInvalidaException("Formato não aceito. Use JPG, PNG ou WEBP."));
        }

        String nome = storage.salvar(foto, tipo);
        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/fotos/{nome}")
                .buildAndExpand(nome)
                .toUriString();

        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadResponse(url));
    }
}
