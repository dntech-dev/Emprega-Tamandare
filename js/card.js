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

    if (texto.scrollHeight > texto.clientHeight + 1) {
      botao.style.display = "inline-block";
    } else {
      botao.style.display = "none";
    }
  });
}

// ==========================================
// CRIAR CARD
// ==========================================

function criarCard(candidato) {
  const inicial = candidato.nome ? candidato.nome.charAt(0).toUpperCase() : "?";

  const cursos = candidato.cursos || "Não informado";

  return `

        <article class="candidato-card">

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

            <div class="informacoes">

                <div class="informacao">

                    <span class="rotulo">
                        Experiência
                    </span>

                    <strong>
                        ${escaparHTML(candidato.experiencia) || "Não informado"}
                    </strong>

                </div>

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

            <div class="card-footer">

                <span>
                    Telefone
                </span>

                <a
                    href="https://wa.me/55${String(candidato.telefone).replace(/\D/g, "")}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${formatarTelefone(candidato.telefone)}
                </a>

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
    texto.classList.remove("expandido");

    texto.classList.add("limitado");

    botao.textContent = "Mostrar mais ↓";
  } else {
    texto.classList.remove("limitado");

    texto.classList.add("expandido");

    botao.textContent = "Mostrar menos ↑";
  }
});
