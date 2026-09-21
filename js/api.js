// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbwVhVffJTmi6ax7nGhY-fwOoaNTygnyaRVKP-Y73WXA2XmHPnH5zlX6xOVuHQNigbkn/exec";

// ==========================================
// BUSCAR CANDIDATOS
// ==========================================

function carregarCandidatos(callback) {
  const nomeCallback = "receberCandidatos";

  window[nomeCallback] = function (dados) {
    callback(dados || []);

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
