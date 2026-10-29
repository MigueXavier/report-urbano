package br.com.pucminas.reporturbano.report_urbano_backend.classificacao;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/** Leitura e listagem das opções dos enums de classificação. */
final class Opcoes {

    private Opcoes() {
    }

    /**
     * Converte o texto recebido na API em constante do enum. Aceita o código
     * ("AUSENCIA_DE_RAMPA") ou o rótulo ("Ausência de rampa"), ignorando caixa e espaços nas pontas.
     *
     * @return a constante correspondente, ou {@code null} se o texto for nulo ou vazio, deixando a
     *         obrigatoriedade para as anotações de validação.
     * @throws IllegalArgumentException se o texto não corresponder a nenhuma constante.
     */
    static <E extends Enum<E> & Classificavel> E ler(Class<E> tipo, String campo, String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        String procurado = valor.trim();
        for (E constante : tipo.getEnumConstants()) {
            if (constante.getCodigo().equalsIgnoreCase(procurado)
                    || constante.getRotulo().equalsIgnoreCase(procurado)) {
                return constante;
            }
        }
        throw new IllegalArgumentException(
                campo + " inválido: '" + valor + "'. Valores aceitos: " + codigos(tipo) + ".");
    }

    /** Lista as opções do enum na ordem de declaração, para a interface montar os botões. */
    static <E extends Enum<E> & Classificavel> List<Opcao> listar(Class<E> tipo) {
        return Arrays.stream(tipo.getEnumConstants()).map(Opcao::de).toList();
    }

    private static <E extends Enum<E> & Classificavel> String codigos(Class<E> tipo) {
        return Arrays.stream(tipo.getEnumConstants())
                .map(Classificavel::getCodigo)
                .collect(Collectors.joining(", "));
    }
}
