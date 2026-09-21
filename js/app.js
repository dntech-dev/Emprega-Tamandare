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
// CARREGAR CANDIDATOS
// ==========================================

function iniciarAplicacao() {
  mostrarCarregando();

  carregarCandidatos(function (dados) {
    if (!dados) {
      mostrarErro();

      return;
    }

    candidatos = dados;

    candidatos.sort(function (a, b) {
      return normalizarTexto(a.nome).localeCompare(
        normalizarTexto(b.nome),
        "pt-BR",
      );
    });

    candidatosFiltrados = candidatos;

    quantidadeVisivel = 15;

    mostrarCandidatos();
  });
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
// MOSTRAR CANDIDATOS
// ==========================================

function mostrarCandidatos() {
  const total = candidatosFiltrados.length;

  const quantidadeParaMostrar = Math.min(quantidadeVisivel, total);

  contador.textContent = total === 1 ? "1 candidato" : `${total} candidatos`;

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

  const candidatosParaMostrar = candidatosFiltrados.slice(
    0,
    quantidadeParaMostrar,
  );

  listaCandidatos.innerHTML = candidatosParaMostrar
    .map((candidato) => criarCard(candidato))
    .join("");

  requestAnimationFrame(function () {
    verificarCursosLongos();
  });

  // ==========================================
  // BOTÃO VER MAIS
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

iniciarAplicacao();
