import { carregarDados, cursoURL } from "../model/js/logica-pagJogo.js";
import { randomizarPerguntas, validarRespostas } from "../model/js/logica-randomPerguntas.js";

const DATA_URL = "../../model/json/perguntas.json";

function organizarPerguntas(situacao, cursoSelec){ // Renderiza na página o enunciado e as questoes
  const descricao = document.getElementById("questao-descricao");
  const tabela = document.getElementById("cd-tabela");
    if(cursoSelec === 'cd'){
      if (tabela) renderizarTabela(situacao.descricao);
    }
    else{
      if(tabela) tabela.textContent = "";
      if (descricao) descricao.textContent = situacao.descricao || "";
    }

    situacao.perguntas.forEach((pergunta, i) => {
    const enunciado = document.getElementById(`enunciado-${i + 1}`);
    if (enunciado) enunciado.textContent = pergunta.texto;

    pergunta.opcoes.forEach((opcao, j) => {
      const opcaoSpan = document.getElementById(`p${i + 1}-op${j + 1}`);
      if (opcaoSpan) opcaoSpan.textContent = opcao;
    });
  });
}

function renderizarTabela(dados){
  const tabela = document.getElementById("cd-tabela");
  if (!tabela) return;

  const cabecalhos = Object.keys(dados[0]); // Object.keys() retorna um array com o nome das chaves desse objeto
  // Retorno: ["Dia", "Temperatura (°C)", "Tempo"]

  let html = "<thead><tr>";
  cabecalhos.forEach(ch => html += `<th>${ch}</th>`);
  html += "</tr></thead><tbody>";

  dados.forEach(item => {
    html += "<tr>";
    cabecalhos.forEach(ch => html += `<td>${item[ch]}</td>`);
    html += "</tr>";
  });

  html += "</tbody>";
  tabela.innerHTML = html;
}



async function init() {
  try {
    const curso = cursoURL();
    if (!curso) throw new Error("Parâmetro ?curso não encontrado na URL.");

    const data = await carregarDados(DATA_URL);
    const cursos = data.cursos;
    console.log(cursos);
    const cursoSelec = curso;

    const perguntas = await randomizarPerguntas(cursos, cursoSelec);
    organizarPerguntas(perguntas, cursoSelec);

    const botaoFinalizar = document.getElementById("finalizar-btn");
    botaoFinalizar.addEventListener("click", () => {
      const acertos = validarRespostas(perguntas);
      alert(`Você acertou ${acertos} de ${perguntas.length} perguntas!`);
    });
  }
   catch (err) {
    const box = document.getElementById("quiz-container");
    if (box) box.innerHTML = "<p>Não foi possível carregar o quiz.</p>";
  }
}

document.addEventListener("DOMContentLoaded", init);
