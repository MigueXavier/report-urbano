const CHAVE = 'reportUrbano.consentimentoCaptura.v2';

export function jaConsentiu() {
  try {
    return window.localStorage.getItem(CHAVE) === 'sim';
  } catch {
    return false;
  }
}

export function registrarConsentimento() {
  try {
    window.localStorage.setItem(CHAVE, 'sim');
  } catch {
  }
}
