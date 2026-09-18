// ==========================================
// CONFIGURAÇÃO
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbwJdudzR1Y1TPq4KLrHLVD6PwOucQABI6hIL0cPIEJCIZGbvH_o9FTqqLzuPZlWNuA/exec";

// ==========================================
// VARIÁVEIS
// ==========================================

let candidatos = [];

let candidatosFiltrados = [];

let quantidadeVisivel = 15;

// ==========================================
// ELEMENTOS DA PÁGINA
// ==========================================

const listaCandidatos = document.getElementById("listaCandidatos");

const contador = document.getElementById("contador");

const busca = document.getElementById("busca");

const escolaridade = document.getElementById("escolaridade");

const limparFiltros = document.getElementById("limparFiltros");

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

  // Remove o código do Brasil 55

  if (numero.length === 13 && numero.startsWith("55")) {
    numero = numero.substring(2);
  }

  // Celular com DDD

  if (numero.length === 11) {
    return numero.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  // Telefone fixo com DDD

  if (numero.length === 10) {
    return numero.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return telefone;
}

// ==========================================
// CARREGAR CANDIDATOS
// ==========================================

function carregarCandidatos() {
  mostrarCarregando();

  const nomeCallback = "receberCandidatos";

  window[nomeCallback] = function (dados) {
    candidatos = dados || [];

    // Ordena alfabeticamente pelo nome

    candidatos.sort(function (a, b) {
      return normalizarTexto(a.nome).localeCompare(
        normalizarTexto(b.nome),
        "pt-BR",
      );
    });

    candidatosFiltrados = candidatos;

    quantidadeVisivel = 15;

    mostrarCandidatos();

    if (script.parentNode) {
      script.remove();
    }

    delete window[nomeCallback];
  };

  const script = document.createElement("script");

  script.src = API_URL + "?callback=" + nomeCallback;

  script.onerror = function () {
    mostrarErro();

    script.remove();

    delete window[nomeCallback];
  };

  document.body.appendChild(script);
}

// ==========================================
// CARREGANDO
// ==========================================

function mostrarCarregando() {
  listaCandidatos.innerHTML = `

        <div class="nenhum-resultado">

            <h3>
                Carregando candidatos...
            </h3>

            <p>
                Aguarde enquanto buscamos os dados.
            </p>

        </div>

    `;
}

// ==========================================
// VERIFICAR CURSOS LONGOS
// ==========================================

function verificarCursosLongos() {
  const blocos = listaCandidatos.querySelectorAll(".cursos-informacao");

  blocos.forEach(function (bloco) {
    const texto = bloco.querySelector(".cursos-conteudo");

    const botao = bloco.querySelector(".btn-mostrar-mais");

    if (!texto || !botao) {
      return;
    }

    // Verifica se o texto realmente
    // ultrapassa as 3 linhas

    if (texto.scrollHeight > texto.clientHeight + 1) {
      botao.style.display = "inline-block";
    } else {
      botao.style.display = "none";
    }
  });
}

// ==========================================
// MOSTRAR CANDIDATOS
// ==========================================

function mostrarCandidatos() {
  const total = candidatosFiltrados.length;

  const quantidadeParaMostrar = Math.min(quantidadeVisivel, total);

  // ==========================================
  // CONTADOR
  // ==========================================

  contador.textContent = total === 1 ? "1 candidato" : `${total} candidatos`;

  // ==========================================
  // NENHUM RESULTADO
  // ==========================================

  if (total === 0) {
    listaCandidatos.innerHTML = `

            <div class="nenhum-resultado">

                <h3>
                    Nenhum candidato encontrado
                </h3>

                <p>
                    Tente alterar os termos da busca
                    ou limpar os filtros.
                </p>

            </div>

        `;

    return;
  }

  // ==========================================
  // CANDIDATOS VISÍVEIS
  // ==========================================

  const candidatosParaMostrar = candidatosFiltrados.slice(
    0,
    quantidadeParaMostrar,
  );

  // ==========================================
  // CRIAR CARDS
  // ==========================================

  listaCandidatos.innerHTML = candidatosParaMostrar
    .map((candidato) => criarCard(candidato))
    .join("");

  // ==========================================
  // VERIFICAR CURSOS
  // ==========================================

  requestAnimationFrame(function () {
    verificarCursosLongos();
  });

  // ==========================================
  // BOTÃO VER MAIS CANDIDATOS
  // ==========================================

  if (quantidadeParaMostrar < total) {
    const containerBotao = document.createElement("div");

    containerBotao.className = "container-ver-mais";

    const botao = document.createElement("button");

    botao.type = "button";

    botao.className = "btn-ver-mais";

    botao.textContent = "Ver mais";

    botao.addEventListener("click", function () {
      quantidadeVisivel += 15;

      mostrarCandidatos();
    });

    containerBotao.appendChild(botao);

    listaCandidatos.appendChild(containerBotao);
  }
}

// ==========================================
// CRIAR CARD
// ==========================================

function criarCard(candidato) {
  const inicial = candidato.nome ? candidato.nome.charAt(0).toUpperCase() : "?";

  const cursos = candidato.cursos || "Não informado";

  return `

        <article class="candidato-card">

            <!-- TOPO -->

            <div class="card-topo">

                <div class="avatar">
                    ${escaparHTML(inicial)}
                </div>

                <div>

                    <h3>
                        ${escaparHTML(candidato.nome)}
                    </h3>

                   

                </div>

            </div>


            <!-- INFORMAÇÕES -->

            <div class="informacoes">


                <!-- EXPERIÊNCIA -->

                <div class="informacao">

                    <span class="rotulo">
                        Experiência
                    </span>

                    <strong>
                        ${escaparHTML(candidato.experiencia) || "Não informado"}
                    </strong>

                </div>


                <!-- CURSOS -->

                <div class="informacao cursos-informacao">

                    <span class="rotulo">
                        Cursos
                    </span>

                    <strong
                        class="cursos-conteudo limitado"
                    >
                        ${escaparHTML(cursos)}
                    </strong>


                    <button
                        type="button"
                        class="btn-mostrar-mais"
                        style="display: none;"
                    >
                        Mostrar mais ↓
                    </button>

                </div>


                <!-- ESCOLARIDADE -->

                <div class="informacao">

                    <span class="rotulo">
                        Escolaridade
                    </span>

                    <strong>
                        ${
                          escaparHTML(candidato.escolaridade) || "Não informado"
                        }
                    </strong>

                </div>

            </div>


            <!-- TELEFONE -->

            <div class="card-footer">

                <span>
                    Telefone
                </span>

                <strong>
                    ${formatarTelefone(candidato.telefone)}
                </strong>

            </div>

        </article>

    `;
}

// ==========================================
// MOSTRAR MAIS / MOSTRAR MENOS
// ==========================================

listaCandidatos.addEventListener("click", function (event) {
  const botao = event.target.closest(".btn-mostrar-mais");

  if (!botao) {
    return;
  }

  const bloco = botao.closest(".cursos-informacao");

  const texto = bloco.querySelector(".cursos-conteudo");

  const estaExpandido = texto.classList.contains("expandido");

  if (estaExpandido) {
    // VOLTAR PARA 3 LINHAS

    texto.classList.remove("expandido");

    texto.classList.add("limitado");

    botao.textContent = "Mostrar mais ↓";
  } else {
    // MOSTRAR TEXTO COMPLETO

    texto.classList.remove("limitado");

    texto.classList.add("expandido");

    botao.textContent = "Mostrar menos ↑";
  }
});

// ==========================================
// FILTRAR ESCOLARIDADE
// ==========================================

function correspondeEscolaridade(
  escolaridadeCandidato,
  escolaridadeSelecionada,
) {
  if (!escolaridadeSelecionada) {
    return true;
  }

  const candidato = normalizarTexto(escolaridadeCandidato);

  const selecionada = normalizarTexto(escolaridadeSelecionada);

  if (selecionada.includes("fundamental")) {
    return candidato.includes("fundamental");
  }

  if (selecionada.includes("medio")) {
    return candidato.includes("medio");
  }

  if (selecionada.includes("superior")) {
    return candidato.includes("superior");
  }

  return candidato === selecionada;
}

// ==========================================
// FILTRAR
// ==========================================

function aplicarFiltros() {
  const termo = normalizarTexto(busca.value);

  const escolaridadeSelecionada = normalizarTexto(escolaridade.value);

  candidatosFiltrados = candidatos.filter((candidato) => {
    const nome = normalizarTexto(candidato.nome);

    const experiencia = normalizarTexto(candidato.experiencia);

    const cursos = normalizarTexto(candidato.cursos);

    const correspondeBusca =
      !termo ||
      nome.includes(termo) ||
      experiencia.includes(termo) ||
      cursos.includes(termo);

    const correspondeEscolaridadeFiltro = correspondeEscolaridade(
      candidato.escolaridade,
      escolaridadeSelecionada,
    );

    return correspondeBusca && correspondeEscolaridadeFiltro;
  });

  // Volta para os primeiros 15

  quantidadeVisivel = 15;

  mostrarCandidatos();
}

// ==========================================
// EVENTOS DOS FILTROS
// ==========================================

busca.addEventListener("input", aplicarFiltros);

escolaridade.addEventListener("change", aplicarFiltros);

limparFiltros.addEventListener("click", function () {
  busca.value = "";

  escolaridade.value = "";

  aplicarFiltros();
});

// ==========================================
// ERRO
// ==========================================

function mostrarErro() {
  contador.textContent = "Erro";

  listaCandidatos.innerHTML = `

        <div class="nenhum-resultado">

            <h3>
                Não foi possível carregar
                os candidatos
            </h3>

            <p>
                Verifique sua conexão com a internet
                e tente novamente.
            </p>

        </div>

    `;
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

carregarCandidatos();
