// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbwJdudzR1Y1TPq4KLrHLVD6PwOucQABI6hIL0cPIEJCIZGbvH_o9FTqqLzuPZlWNuA/exec";

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
