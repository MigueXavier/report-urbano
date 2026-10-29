package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

/** Uma opção de classificação exposta para a interface montar os botões. */
public record Opcao(String codigo, String rotulo) {

    public static Opcao de(Classificavel valor) {
        return new Opcao(valor.getCodigo(), valor.getRotulo());
    }
}
