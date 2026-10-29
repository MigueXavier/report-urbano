package br.com.pucminas.reporturbano.report_urbano_backend.upload;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalStorageService implements StorageService {

    private final Path pasta;

    public LocalStorageService(@Value("${app.storage.pasta:uploads/fotos}") String pasta) {
        this.pasta = Path.of(pasta).toAbsolutePath().normalize();
    }

    public Path getPasta() {
        return pasta;
    }

    @Override
    public String salvar(MultipartFile arquivo, TipoImagem tipo) {
        String nome = UUID.randomUUID() + "." + tipo.getExtensao();
        try (InputStream entrada = arquivo.getInputStream()) {
            Files.createDirectories(pasta);
            Files.copy(entrada, pasta.resolve(nome));
            return nome;
        } catch (IOException e) {
            throw new UncheckedIOException("Não foi possível salvar a foto", e);
        }
    }
}
