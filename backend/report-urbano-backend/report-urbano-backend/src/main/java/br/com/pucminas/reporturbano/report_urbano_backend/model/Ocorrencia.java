package br.com.pucminas.reporturbano.report_urbano_backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Document(collection = "ocorrencias")
public class Ocorrencia {

    @Id
    private String id;
    private String autorId;
    private boolean autorPublico = false;
    private String tipo;
    private boolean impactoAcessibilidade;
    private List<String> perfisAfetados = new ArrayList<>();
    private String gravidade;
    private String descricao;
    private String fotoUrl;
    private GeoJsonPoint localizacao;
    private String status = "ABERTA";
    private String cidade;
    private LocalDateTime dataCriacao;
    private List<String> confirmacoes = new ArrayList<>();
}
