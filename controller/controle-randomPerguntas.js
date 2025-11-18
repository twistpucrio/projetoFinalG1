import { carregarDados, cursoURL } from "../model/js/logica-pagJogo.js";
import { randomizarPerguntas, validarRespostas } from "../model/js/logica-randomPerguntas.js";

const DATA_PERGUNTAS = "../../model/json/perguntas.json";
const DATA_CURSOS = "../../model/json/cursos.json";

function organizarPerguntas(situacao, cursoSelec){ // Renderiza na página o enunciado e as questoes
  const descricao = document.getElementById("questao-descricao");
  const tabela = document.getElementById("cd-tabela");
  console.log(cursoSelec);
  if(cursoSelec === 'cd'){
    console.log("sim");
    if (tabela) renderizarTabela(situacao.descricao);
  }
  else{
    if(tabela) {
      tabela.textContent = "";
      tabela.style.display = "none";
    }
    if (descricao) descricao.textContent = situacao.descricao || "";
  }

  situacao.perguntas.forEach((pergunta, i) => {
    const enunciado = document.getElementById(`enunciado-${i + 1}`);
    if (enunciado) enunciado.textContent = pergunta.texto;

    for (let j = 0; j < 4; j++) {
    const label = document.querySelector(
      `label input[name="pergunta${i + 1}"][value="${j}"]`
    )?.parentElement;
    const span = document.getElementById(`p${i + 1}-op${j + 1}`);

    if (pergunta.opcoes[j]) {
      if (label) label.style.display = "block";
      if (span) span.textContent = pergunta.opcoes[j];
    } else {
      if (label) label.style.display = "none";
    }
}

  });
}

function adicionarEstiloTabela() {
  const css = `
    @font-face {
        font-family: 'secundaria';
        src: url(../view/fonts/Momo_Trust_Sans/MomoTrustSans-Regular.ttf)
        format('truetype');
    }

    #cd-tabela {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-family: 'secundaria';
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      background-color: #ffe2b6ff;
    }

    #cd-tabela thead th {
      background-color:  #FCB33F; 
      color: white; 
      padding: 12px 15px;
      text-align: center;
      font-weight: bold;
    }

    #cd-tabela tbody td {
      padding: 10px 15px;
      vertical-align: middle;
      text-align: center;
    }

    #cd-tabela tbody tr:nth-of-type(even) {
      background-color: #fcf4e8; 
    }

    #cd-tabela tbody tr:hover {
      background-color: #ffffffff; 
      cursor: pointer;
      box-shadow: inset 0 0 5px rgba(197, 75, 20, 0.4); 
    }
    
    @media screen and (max-width: 600px) {
      #cd-tabela thead th,
      #cd-tabela tbody td {
        font-size: 14px; 
        padding: 8px 10px;
      }
    }
`;

  const styleTag = document.createElement('style');
  styleTag.textContent = css;

  if (!document.getElementById('table-styles')) {
    styleTag.id = 'table-styles'; 
    document.head.appendChild(styleTag);
  }
}


function renderizarTabela(dados){
  adicionarEstiloTabela();
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
    const cursoSelec = cursoURL();
    if (!cursoSelec) throw new Error("Parâmetro ?curso não encontrado na URL.");

    const data_perg = await carregarDados(DATA_PERGUNTAS);
    const cursos = data_perg.cursos;

    const data_cursos = await carregarDados(DATA_CURSOS);
    const info = data_cursos.cursos;
    const selec = info.find(c => c["curso-nome"] === cursoSelec);
    const cor_fundo = selec["cor-fundo"];
    const cor_borda = selec["cor-borda"];
    const cor_questao = selec["cor-questao"];

    const perguntas = await randomizarPerguntas(cursos, cursoSelec);
    organizarPerguntas(perguntas, cursoSelec);

    const botaoFinalizar = document.getElementById("finalizar-btn");
    botaoFinalizar.addEventListener("click", () => {
      const acertos = validarRespostas(perguntas);
      alert(`Você acertou ${acertos} de ${perguntas.perguntas.length} perguntas!`);
    });

    const fundo = document.body;
    const enunciados = document.querySelectorAll(".questao-enunciado")
    const opcoes = document.querySelectorAll(".questao-opcao");
    if(cor_fundo && cor_borda && cor_questao){
      if(fundo) fundo.style.backgroundColor = cor_borda;
      enunciados.forEach(enun => {
        enun.style.color = cor_borda;
      });
      opcoes.forEach(op => {
        op.style.accentColor = cor_borda;

        const label = op.parentElement;
        label.style.backgroundColor = cor_questao;
      });
      botaoFinalizar.style.backgroundColor = cor_questao;
    }
  }
   catch (err) {
    const box = document.getElementById("quiz-container");
    if (box) box.innerHTML = "<p>Não foi possível carregar o quiz.</p>";
  }
}

document.addEventListener("DOMContentLoaded", init);
