(function () {
  console.log("Status: cursos.js carregado!");
  const DATA_URL = "cursos.json";

  function personagemURL() {
    const sp = new URLSearchParams(window.location.search);
    const personagemNome = sp.get("personagem");
    return personagemNome;
  }

  async function carregarCursos() {
    const resp = await fetch(DATA_URL);
    if (!resp.ok) throw new Error("Não foi possível carregar os cursos do JSON.");
    const json = await resp.json();
    return json;
  }

  function preencherCampos(curso) {
    const tituloCurso = document.getElementById("curso-titulo"); // id no HTML
    const nomePersonagem = document.getElementById("personagem-nome");
    const imgPersonagem = document.getElementById("personagem-img");
    const descricaoCurso = document.getElementById("curso-descricao");
    const instrucoesCurso = document.getElementById("curso-instrucoes");
    const container = document.getElementById("curso-container");

    if (tituloCurso) tituloCurso.textContent = curso.titulo || "";
    if (nomePersonagem) nomePersonagem.textContent = curso["personagem-nome"] || "";
    if (imgPersonagem) {
      imgPersonagem.src = curso["personagem-img"] || "";
      imgPersonagem.alt = curso["personagem-nome"] || "";
    }
    if (descricaoCurso) descricaoCurso.textContent = curso.descricao || "";
    if (instrucoesCurso) instrucoesCurso.textContent = curso.instrucoes || "";

    console.log("Cor de fundo:", curso["cor-fundo"]);
    console.log("Cor da borda:", curso["cor-borda"]);

    if (container && curso["cor-fundo"]) {
      container.style.backgroundColor = curso["cor-fundo"];
    }
    if (container && curso["cor-borda"]) {
      container.style.border = `4px solid ${curso["cor-borda"]}`;
    }

  }

  function prepararBotoes(curso) {
    const btnJogo = document.getElementById("btn-jogar");

    if (btnJogo && curso && curso.link) {
          btnJogo.addEventListener("click", () => {
            window.location.href = curso.link;
          });
    }
  }

  async function init() {
    try {
      const personagem = personagemURL();
      if (!personagem) throw new Error("Parâmetro ?personagem não encontrado na URL.");

      const data = await carregarCursos();
      const lista = Array.isArray(data) ? data : (data.cursos || []);
      const personagemLower = personagem.toString().toLowerCase();
      const curso = lista.find(c => c["personagem-nome"] === personagem); // Procura o curso cujo personagem obtido da URL corresponde ao personagem do JSON
      if (!curso) throw new Error("Curso não encontrado para: " + personagem);

      preencherCampos(curso);
      prepararBotoes(curso);
    } catch (err) {
      const box = document.getElementById("curso-container");
      if (box) box.innerHTML = "<p>Não foi possível carregar o curso.</p>";
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();