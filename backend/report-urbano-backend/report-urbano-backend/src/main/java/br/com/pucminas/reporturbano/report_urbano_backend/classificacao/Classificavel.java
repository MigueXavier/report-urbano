package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

/**
 * Contrato dos enums de classificação (RF07, RF09, RF10).
 *
 * <p>Cada constante tem um código estável, que é o que trafega na API e fica gravado no banco, e um
 * rótulo, que é o texto exibido na tela. A separação existe para que ajustar um texto de interface
 * não invalide os registros já gravados.
 */
public interface Classificavel {

    /** Código estável da constante. Igual a {@link Enum#name()}. */
    String getCodigo();

    /** Texto exibido na interface. */
    String getRotulo();
}
