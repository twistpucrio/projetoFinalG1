import { carregarDados, cursoURL } from "../model/js/logica-pagJogo.js";
import { randomizarPerguntas } from "../model/js/logica-randomPerguntas.js";

const DATA_URL = "../../model/json/perguntas.json";

function organizarPerguntas(situacao){ // Renderiza na página o enunciado e as questoes
    const descricao = document.getElementById(".questao-descricao");
    if (descricao) descricao.textContent = situacao.descricao || "";

    const enunciados = document.querySelectorAll(".questao-enunciado");
    enunciados.forEach((elemento, index) => {
        if (elemento) {
            elemento.textContent = situacao.perguntas[index].texto || "";
            const opcoes = document.querySelectorAll(".questao-opcao");
            opcoes.forEach((el, i) => {
                el.textContent = situacao.perguntas[index].opcoes[i];
            });
        };
    });
}

async function init() {
  try {
    const curso = cursoURL();
    if (!curso) throw new Error("Parâmetro ?curso não encontrado na URL.");

    const data = await carregarDados(DATA_URL);
    const lista = Array.isArray(data) ? data : (data.perguntas || []);
    const curso_selec = lista.find(c => c["curso"] === curso);

    const perguntas = randomizarPerguntas(DATA_URL, curso_selec);
    organizarPerguntas(perguntas);
  }
   catch (err) {
    const box = document.getElementById("quiz-container");
    if (box) box.innerHTML = "<p>Não foi possível carregar o quiz.</p>";
  }
}

document.addEventListener("DOMContentLoaded", init);
