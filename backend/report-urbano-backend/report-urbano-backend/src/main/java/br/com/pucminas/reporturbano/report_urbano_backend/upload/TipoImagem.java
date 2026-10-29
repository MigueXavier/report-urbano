package br.com.pucminas.reporturbano.report_urbano_backend.upload;

import java.util.Arrays;
import java.util.Optional;

public enum TipoImagem {

    JPEG("jpg"),
    PNG("png"),
    WEBP("webp");

    private final String extensao;

    TipoImagem(String extensao) {
        this.extensao = extensao;
    }

    public String getExtensao() {
        return extensao;
    }

    public static Optional<TipoImagem> detectar(byte[] inicio) {
        if (inicio == null) {
            return Optional.empty();
        }
        return Arrays.stream(values()).filter(tipo -> tipo.confere(inicio)).findFirst();
    }

    private boolean confere(byte[] b) {
        return switch (this) {
            case JPEG -> b.length >= 3
                    && (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF;
            case PNG -> b.length >= 8
                    && (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G'
                    && b[4] == 0x0D && b[5] == 0x0A && b[6] == 0x1A && b[7] == 0x0A;
            case WEBP -> b.length >= 12
                    && b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                    && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
        };
    }
}
