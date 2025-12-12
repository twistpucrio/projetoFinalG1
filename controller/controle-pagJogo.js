import { carregarDados, personagemURL } from "../model/js/logica-pagJogo.js"; // Chama funções do model, que fornece os dados necessários para renderizar a página

const DATA_URL = "../../model/json/cursos.json";

function preencherCampos(curso) {
  const tituloCurso = document.getElementById("curso-titulo");
  const nomePersonagem = document.getElementById("personagem-nome");
  const imgPersonagem = document.getElementById("personagem-img");
  const descricaoCurso = document.getElementById("curso-descricao");
  const instrucoesCurso = document.getElementById("curso-instrucoes");
  const container = document.getElementById("curso-container");
  const btnJogo = document.getElementById("btn-jogar");

  if (tituloCurso) tituloCurso.textContent = curso.titulo || "";
  if (nomePersonagem) nomePersonagem.textContent = curso["personagem-nome"] || "";
  if (imgPersonagem) {
    imgPersonagem.src = curso["personagem-img"] || "";
    imgPersonagem.alt = curso["personagem-nome"] || "";
  }
  if (descricaoCurso) descricaoCurso.textContent = curso.descricao || "";
  if (instrucoesCurso) instrucoesCurso.textContent = curso.instrucoes || "";

  if (container) {
    if (curso["cor-fundo"]) {
      container.style.backgroundColor = curso["cor-fundo"];
    }
    if (curso["cor-borda"]) {
      container.style.border = `4px solid ${curso["cor-borda"]}`;
      if (btnJogo) {
        btnJogo.style.backgroundColor = curso["cor-borda"];
      }
    }
  }
}

function prepararBotoes(curso) { // Responde a uma interação do usuário
  const btnJogo = document.getElementById("btn-jogar");
  const personagem = curso["personagem-nome"]; // Pega 'Lara', 'Sofia', etc.

  if (btnJogo && personagem) {
    btnJogo.addEventListener("click", () => {
      // REDIRECIONA para a página de escolha, REPASSANDO o parâmetro 'personagem'
      window.location.href = `escolha.html?personagem=${personagem}`;
    });
  }
}

async function init() {
  try {
    const personagem = personagemURL();
    if (!personagem) throw new Error("Parâmetro ?personagem não encontrado na URL.");

    const data = await carregarDados(DATA_URL);
    const lista = Array.isArray(data) ? data : (data.cursos || []);
    const curso = lista.find(c => c["personagem-nome"] === personagem);
    console.log(curso);

    if (!curso) throw new Error("Curso não encontrado para: " + personagem);

    preencherCampos(curso);
    prepararBotoes(curso);
  } catch (err) {
    const box = document.getElementById("curso-container");
    if (box) box.innerHTML = "<p>Não foi possível carregar o curso.</p>";
  }
}

document.addEventListener("DOMContentLoaded", init);

// logica para transitar entre paginas
const btnQuizz = document.getElementById('btn-quizz');
const urlParams = new URLSearchParams(window.location.search);
const personagem = urlParams.get('personagem'); 
const img = document.getElementById("personagem-fala");
const interrogacao = document.getElementById("interrog");

// Mapeia o nome do personagem para o ID do curso (para o Quizz)
const mapaPersonagemCurso = {
  'Lara': 'fp',
  'Ayla': 'ia',
  'Sofia': 'cd',
  'Kaori': 'hd',
  'Nia': 'sc',
  'Maya': 'wd'
};
const cursoId = mapaPersonagemCurso[personagem];

const personagensOrdem = ['Lara', 'Ayla', 'Sofia', 'Kaori', 'Nia', 'Maya'];
const jogos = [`jogoFP_1.html`, `jogoIA.html`, `jogocdd.html`, `jogohardware.html`, `jogoSC.html`, `jogowebdev.html`];
const index = personagensOrdem.indexOf(personagem);
const tit = document.getElementById("titulo-escolha");

const data = await carregarDados(DATA_URL);
const lista = Array.isArray(data) ? data : (data.cursos || []);
const curso = lista.find(c => c["personagem-nome"] === personagem);

const modalCSS = document.getElementById("modal-content");

const conteudoModal = document.getElementById("conteudo-modal");
if (conteudoModal) conteudoModal.textContent = curso["instrucoes"] || "";

if(tit && curso["cor-fundo"]){
  tit.style.color = curso["cor-borda"];
  modalCSS.style.backgroundColor = curso["cor-borda"];

  if (personagem === "Lara") {
    img.src = "../img/lara_fala.png";
    interrogacao.src = "../img/interrog_fp.png"
  } else if (personagem === "Ayla"){
    img.src = "../img/ayla_fala.png";
    interrogacao.src = "../img/interrog_ia.png"
  } else if (personagem === "Nia") {
    img.src = "../img/nia_fala.png";
    interrogacao.src = "../img/interrog_sc.png"
  } else if (personagem === "Sofia"){
    img.src = "../img/sofia_fala.png";
    interrogacao.src = "../img/interrog_cd.png"
  } else if (personagem === "Kaori"){
    img.src = "../img/kaori_fala.png";
    interrogacao.src = "../img/interrog_hd.png"
  } else if (personagem === "Maya"){
    img.src = "../img/maya_fala.png";
    interrogacao.src = "../img/interrog_wd.png"
  }

  const modal = document.getElementById("modal-instrucoes");
  const btn = document.getElementById("btn-instrucoes");
  const span = document.querySelector(".close");

  // Abrir modal
  btn.onclick = () => {
      modal.style.display = "flex";
  };

  // Fechar modal clicando no X
  span.onclick = () => {
      modal.style.display = "none";
  };

  // Fechar modal clicando fora da caixa
  window.onclick = (event) => {
      if (event.target === modal) {
          modal.style.display = "none";
      }
  };

}

if (btnQuizz && cursoId) {
  btnQuizz.addEventListener('click', () => {
    window.location.href = `cd.html?curso=${cursoId}&personagem=${personagem}`;
  });
} else {
  if (btnQuizz) btnQuizz.disabled = true;
}
if (cursoId) {
  document.body.classList.add(`curso-${cursoId}`);
}

const btnJogo = document.getElementById("btn-jogo");
if (btnJogo) {
  btnJogo.addEventListener('click', () => {
      window.location.href = jogos[index]; 
    });
  } else {
      if(btnJogo) btnJogo.disabled = true;
  } 


const btnMat = document.getElementById("btn-mat");
if (btnMat) {
  btnMat.addEventListener('click', () => {
    window.location.href = `material_estudo.html?personagem=${personagem}`;
  });
} else {
  if (btnMat) btnMat.disabled = true;
}

const btnVoltar = document.getElementById("btn-voltar");
if (btnVoltar && curso) {
  if (curso["cor-fundo"]) {
    btnVoltar.style.backgroundColor = curso["cor-fundo"];
    btnVoltar.style.boxShadow =
      `0 6px 0 ${curso["cor-fundo"]}, 
       0 0 15px ${curso["cor-fundo"]}`;
  }
  if (curso["cor-borda"]) {
    btnVoltar.style.border = `4px solid ${curso["cor-borda"]}`;
    if (btnVoltar) {
      btnVoltar.style.backgroundColor = curso["cor-borda"];
    }
  }
}

const informacoes = document.getElementById("info");
if (informacoes && curso) {
  if (curso["cor-borda"]) {
    informacoes.style.backgroundColor = curso["cor-borda"];
  }
}