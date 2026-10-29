package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

/**
 * Uma opcao de classificacao que a tela usa para montar os botoes.
 *
 * <p>O codigo e o que trafega na API e vai para o banco. O rotulo e o texto
 * que aparece no botao.
 */
public record Opcao(String codigo, String rotulo) {
}
