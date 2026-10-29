package br.com.pucminas.reporturbano.report_urbano_backend.upload;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class TipoImagemTests {

    @Test
    void detectaPelosPrimeirosBytes() {
        byte[] jpeg = { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xDB };
        byte[] png = { (byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A };
        byte[] webp = { 'R', 'I', 'F', 'F', 0, 0, 0, 0, 'W', 'E', 'B', 'P' };

        assertThat(TipoImagem.detectar(jpeg)).contains(TipoImagem.JPEG);
        assertThat(TipoImagem.detectar(png)).contains(TipoImagem.PNG);
        assertThat(TipoImagem.detectar(webp)).contains(TipoImagem.WEBP);
    }

    @Test
    void recusaOutrosFormatos() {
        assertThat(TipoImagem.detectar("GIF89a".getBytes())).isEmpty();
        assertThat(TipoImagem.detectar(new byte[0])).isEmpty();
        assertThat(TipoImagem.detectar(null)).isEmpty();
    }
}
