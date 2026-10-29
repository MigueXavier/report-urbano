package br.com.pucminas.reporturbano.report_urbano_backend.upload;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String salvar(MultipartFile arquivo, TipoImagem tipo);
}
