package br.com.pucminas.reporturbano.report_urbano_backend.upload;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class UploadControllerTests {

    @TempDir
    static Path pasta;

    @DynamicPropertySource
    static void propriedades(DynamicPropertyRegistry registry) {
        registry.add("app.storage.pasta", () -> pasta.toString());
    }

    private static final byte[] JPEG = { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0, 0x10, 'J', 'F', 'I', 'F', 0, 1 };

    @Autowired
    private MockMvc mvc;

    @Test
    void salvaFotoValidaEDevolveUrlPublica() throws Exception {
        var foto = new MockMultipartFile("foto", "minha-rua.jpg", "image/jpeg", JPEG);

        String corpo = mvc.perform(multipart("/uploads/fotos").file(foto))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.fotoUrl").value(org.hamcrest.Matchers.matchesPattern(
                        "http://localhost/uploads/fotos/[0-9a-f-]{36}\\.jpg")))
                .andReturn().getResponse().getContentAsString();

        String nome = corpo.replaceAll(".*/uploads/fotos/([^\"]+)\".*", "$1");
        assertThat(Files.readAllBytes(pasta.resolve(nome))).isEqualTo(JPEG);

        mvc.perform(get("/uploads/fotos/" + nome))
                .andExpect(status().isOk())
                .andExpect(content().bytes(JPEG));
    }

    @Test
    void recusaArquivoQueNaoEImagemMesmoComContentTypeDeImagem() throws Exception {
        var falso = new MockMultipartFile("foto", "foto.jpg", "image/jpeg", "<script>".getBytes());

        mvc.perform(multipart("/uploads/fotos").file(falso))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Formato não aceito. Use JPG, PNG ou WEBP."));
    }

    @Test
    void recusaEnvioSemFoto() throws Exception {
        var vazio = new MockMultipartFile("foto", "foto.jpg", "image/jpeg", new byte[0]);

        mvc.perform(multipart("/uploads/fotos").file(vazio))
                .andExpect(status().isBadRequest());
        mvc.perform(multipart("/uploads/fotos"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erro").value("Envie uma foto da ocorrência."));
    }

    @Test
    void naoDeixaListarAPastaDeFotos() throws Exception {
        mvc.perform(get("/uploads/qualquer-coisa")).andExpect(status().isForbidden());
    }
}
