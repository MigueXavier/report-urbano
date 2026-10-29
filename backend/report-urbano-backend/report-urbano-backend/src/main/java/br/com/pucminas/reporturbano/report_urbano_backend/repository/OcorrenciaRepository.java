package br.com.pucminas.reporturbano.report_urbano_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import br.com.pucminas.reporturbano.report_urbano_backend.model.Ocorrencia;

public interface OcorrenciaRepository extends MongoRepository<Ocorrencia, String> {

    List<Ocorrencia> findByAutorIdOrderByDataCriacaoDesc(String autorId);
}
