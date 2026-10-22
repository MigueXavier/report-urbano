package br.com.pucminas.reporturbano.report_urbano_backend.ocorrencia;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface OcorrenciaRepository extends MongoRepository<Ocorrencia, String> {
}
