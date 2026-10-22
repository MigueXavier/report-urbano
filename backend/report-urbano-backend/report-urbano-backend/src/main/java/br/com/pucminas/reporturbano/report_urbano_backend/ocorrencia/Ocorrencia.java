package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "ocorrencias")
public class Ocorrencia {

    @Id
    private String id;

   
    private String fotoUrl;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint localizacao; 

    
    private String tipo;
    private boolean impactaAcessibilidade;
    private List<String> perfisAfetados = new ArrayList<>();
    private String gravidade;
    private String descricao;

  
    private String autorId;
    private boolean autorPublico = false;
    private Instant criadoEm;

    private StatusOcorrencia status = StatusOcorrencia.ABERTA;
    private Instant statusAtualizadoEm;
    private String cidade = "Belo Horizonte";

  
    private List<String> confirmacoes = new ArrayList<>();
}
