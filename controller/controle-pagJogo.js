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

  if (container){
    if(curso["cor-fundo"]){
      container.style.backgroundColor = curso["cor-fundo"];
    }
    if(curso["cor-borda"]){
      container.style.border = `4px solid ${curso["cor-borda"]}`;
      if (btnJogo){
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
const personagensOrdem = ['Lara','Ayla','Sofia','Kaori','Nia','Maya'];
const jogos = [`jogoFP_1.html`,`jogoIA.html`, `jogoCD.html`,`jogohardware.html`,`jogoSC.html`,`jogoWD.html`];
const index = personagensOrdem.indexOf(personagem);

if (btnQuizz && cursoId) {
    btnQuizz.addEventListener('click', () => {
        window.location.href = `cd.html?curso=${cursoId}&personagem=${personagem}`; 
    });
} else {
    if(btnQuizz) btnQuizz.disabled = true;
}
if (cursoId) {
        document.body.classList.add(`curso-${cursoId}`);
    }

const btnJogo = document.getElementById("btn-jogo");
if(btnJogo){
  btnJogo.addEventListener('click', () => {
      window.location.href = jogos[index]; 
    });
  } else {
      if(btnJogo) btnJogo.disabled = true;
  } 