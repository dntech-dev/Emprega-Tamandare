// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizarTexto(valor) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// ==========================================
// ESCAPAR HTML
// ==========================================

function escaparHTML(valor) {
  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================
// FORMATAR TELEFONE
// ==========================================

function formatarTelefone(telefone) {
  if (!telefone) {
    return "Não informado";
  }

  let numero = String(telefone).replace(/\D/g, "");

  if (numero.length === 13 && numero.startsWith("55")) {
    numero = numero.substring(2);
  }

  if (numero.length === 11) {
    return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  if (numero.length === 10) {
    return numero.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return telefone;
}
