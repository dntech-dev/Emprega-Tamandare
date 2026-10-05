// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbwVhVffJTmi6ax7nGhY-fwOoaNTygnyaRVKP-Y73WXA2XmHPnH5zlX6xOVuHQNigbkn/exec";

const CACHE_CHAVE = "emprega_tamandare_candidatos";

const CACHE_DURACAO = 10 * 60 * 1000;

// ==========================================
// BUSCAR CANDIDATOS
// ==========================================

function carregarCandidatos(callback) {
  const cacheSalvo = localStorage.getItem(CACHE_CHAVE);

  if (cacheSalvo) {
    try {
      const cache = JSON.parse(cacheSalvo);

      const agora = Date.now();

      const cacheValido = agora - cache.timestamp < CACHE_DURACAO;

      if (cacheValido) {
        callback(cache.dados);

        return;
      }

      localStorage.removeItem(CACHE_CHAVE);
    } catch (erro) {
      localStorage.removeItem(CACHE_CHAVE);
    }
  }

  // ========================================
  // CONSULTAR API
  // ========================================

  const nomeCallback = "receberCandidatos";

  window[nomeCallback] = function (dados) {
    const candidatos = dados || [];

    localStorage.setItem(
      CACHE_CHAVE,
      JSON.stringify({
        timestamp: Date.now(),
        dados: candidatos,
      }),
    );

    callback(candidatos);

    delete window[nomeCallback];
  };

  const script = document.createElement("script");

  script.src = API_URL + "?callback=" + nomeCallback;

  script.onerror = function () {
    callback(null);

    script.remove();

    delete window[nomeCallback];
  };

  document.body.appendChild(script);
}
