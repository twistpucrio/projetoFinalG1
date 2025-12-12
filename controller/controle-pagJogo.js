import { carregarDados, personagemURL } from "../model/js/logica-pagJogo.js"; // Funções de Model

// URL do arquivo JSON de dados
const DATA_URL = "../../model/json/cursos.json";

// Mapeamentos Fixos
const MAPA_CURSO_ID = {
  'Lara': 'fp',
  'Ayla': 'ia',
  'Sofia': 'cd',
  'Kaori': 'hd',
  'Nia': 'sc',
  'Maya': 'wd'
};
const PERSONAGENS_ORDEM = ['Lara', 'Ayla', 'Sofia', 'Kaori', 'Nia', 'Maya'];
const JOGOS_URLS = [
  `jogoFP_1.html`, 
  `jogoIA.html`, 
  `jogocdd.html`, 
  `jogohardware.html`, 
  `jogoSC.html`, 
  `jogowebdev.html`
];

// ----------------------------------------------------------------------
// FUNÇÕES PARA A PÁGINA PRINCIPAL DO CURSO (controle-pagJogo.js)
// ----------------------------------------------------------------------

/**
 * Preenche os elementos do HTML da página de curso com os dados.
 * @param {object} curso - O objeto contendo os dados do curso.
 * @param {string} personagem - O nome do personagem (para lógica de imagem).
 */
function preencherCamposCurso(curso, personagem) {
  const tituloCurso = document.getElementById("curso-titulo");
  const nomePersonagem = document.getElementById("personagem-nome");
  const imgPersonagem = document.getElementById("personagem-img");
  const descricaoCurso = document.getElementById("curso-descricao");
  const instrucoesCurso = document.getElementById("curso-instrucoes");
  const container = document.getElementById("curso-container");
  const btnJogar = document.getElementById("btn-jogar");
  
  // Elementos de outras páginas (Se forem usados na lógica de transição posterior)
  const titEscolha = document.getElementById("titulo-escolha");
  const imgFala = document.getElementById("personagem-fala");
  const btnVoltar = document.getElementById("btn-voltar");

  // Preenchimento de texto e imagem principal
  if (tituloCurso) tituloCurso.textContent = curso.titulo || "";
  if (nomePersonagem) nomePersonagem.textContent = curso["personagem-nome"] || "";
  if (imgPersonagem) {
    imgPersonagem.src = curso["personagem-img"] || "";
    imgPersonagem.alt = curso["personagem-nome"] || "";
  }
  if (descricaoCurso) descricaoCurso.textContent = curso.descricao || "";
  if (instrucoesCurso) instrucoesCurso.textContent = curso.instrucoes || "";

  // Aplicação de estilos
  if (container) {
    if (curso["cor-fundo"]) {
      container.style.backgroundColor = curso["cor-fundo"];
    }
    if (curso["cor-borda"]) {
      container.style.border = `4px solid ${curso["cor-borda"]}`;
      if (btnJogar) {
        btnJogar.style.backgroundColor = curso["cor-borda"];
      }
    }
  }

  // Lógica de elementos da página de Escolha (se este script for reutilizado lá)
  if (titEscolha && curso["cor-borda"]) {
    titEscolha.style.color = curso["cor-borda"];
  }

  if (imgFala && personagem) {
    // Simplificando o bloco if/else com template string
    imgFala.src = `../img/${personagem.toLowerCase()}_fala.png`;
  }

  if (btnVoltar && curso) {
    // Estilização do botão voltar (se existir na página)
    if (curso["cor-borda"]) {
      btnVoltar.style.backgroundColor = curso["cor-borda"];
    }
  }
}

/**
 * Configura o event listener para o botão "JOGAR" na página do curso.
 * Redireciona para a página de escolha.
 * @param {object} curso - O objeto contendo os dados do curso.
 */
function prepararBotoesCurso(curso) {
  const btnJogar = document.getElementById("btn-jogar");
  const personagem = curso["personagem-nome"];
  const cursoId = MAPA_CURSO_ID[personagem];
  const index = PERSONAGENS_ORDEM.indexOf(personagem);

  // Botão JOGAR (EXISTENTE NO HTML DA PÁGINA DE CURSO)
  if (btnJogar && personagem) {
    btnJogar.addEventListener("click", () => {
      // REDIRECIONA para a página de escolha
      window.location.href = `escolha.html?personagem=${personagem}`;
    });
  }

  // --- Lógica de botões para a página 'escolha.html' (Se este script for usado lá) ---
  
  // Botão QUIZZ (btn-quizz)
  const btnQuizz = document.getElementById('btn-quizz');
  if (btnQuizz && cursoId) {
    btnQuizz.addEventListener('click', () => {
      window.location.href = `cd.html?curso=${cursoId}&personagem=${personagem}`;
    });
  } else if (btnQuizz) {
    btnQuizz.disabled = true;
  }

  // Botão JOGO REAL (btn-jogo)
  const btnJogoReal = document.getElementById("btn-jogo");
  if (btnJogoReal && index !== -1) {
    btnJogoReal.addEventListener('click', () => {
      window.location.href = JOGOS_URLS[index];
    });
  } else if (btnJogoReal) {
    btnJogoReal.disabled = true;
  }

  // Botão MATERIAL DE ESTUDO (btn-mat)
  const btnMat = document.getElementById("btn-mat");
  if (btnMat) {
    btnMat.addEventListener('click', () => {
      window.location.href = `material_estudo.html?personagem=${personagem}`;
    });
  } else if (btnMat) {
    btnMat.disabled = true;
  }
}

/**
 * Função principal para inicializar a página de descrição do curso.
 */
async function initCurso() {
  let personagem = null;

  try {
    personagem = personagemURL(); 
    
    // Tenta obter o parâmetro 'personagem' da URL padrão (necessário se personagemURL falhar)
    if (!personagem) {
        const urlParams = new URLSearchParams(window.location.search);
        personagem = urlParams.get('personagem'); 
    }
    
    if (!personagem) {
        throw new Error("Parâmetro ?personagem não encontrado na URL.");
    }

    const data = await carregarDados(DATA_URL);
    const lista = Array.isArray(data) ? data : (data.cursos || []);
    const cursoData = lista.find(c => c["personagem-nome"] === personagem);

    if (!cursoData) {
        throw new Error("Curso não encontrado para: " + personagem);
    }
    
    preencherCamposCurso(cursoData, personagem);
    prepararBotoesCurso(cursoData);

    const cursoId = MAPA_CURSO_ID[personagem];
    if (cursoId) {
      document.body.classList.add(`curso-${cursoId}`);
    }

  } catch (err) {
    console.error("Erro ao inicializar a página do curso:", err.message);
    const box = document.getElementById("curso-container"); // ID da página do curso
    if (box) box.innerHTML = "<p>Não foi possível carregar o curso.</p>";
  }
}

// ----------------------------------------------------------------------
// FUNÇÕES PARA A PÁGINA MATERIAL DE ESTUDO
// ----------------------------------------------------------------------

/**
 * Renderiza os links de estudo na página material_estudo.html.
 * @param {Array<Object>} links - Lista de objetos com {nome: string, url: string}.
 * @param {string} corBorda - Cor de borda/destaque do curso.
 */
function renderizarLinks(links, corBorda) {
  const linksContainer = document.getElementById("links");

  if (!linksContainer) return;

  if (!links || links.length === 0) {
    linksContainer.innerHTML = "<p>Nenhum material de estudo adicional encontrado para este curso.</p>";
    return;
  }
  
  const ul = document.createElement('ul');
  
  links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.url;
    a.target = "_blank"; 
    a.textContent = link.nome;
    
    // Aplica o estilo do curso ao link
    a.style.border = `2px solid ${corBorda}`;
    a.style.color = corBorda; 
    a.style.display = 'block';
    a.style.padding = '10px';
    a.style.margin = '10px 0';
    a.style.textDecoration = 'none';
    a.style.borderRadius = '5px';
    
    li.appendChild(a);
    ul.appendChild(li);
  });
  
  linksContainer.appendChild(ul);
}


/**
 * Função de inicialização para a página de Material de Estudo (material_estudo.html).
 */
async function initMaterialEstudo() {
  try {
    const personagem = personagemURL(); 
    if (!personagem) {
        throw new Error("Parâmetro ?personagem não encontrado na URL.");
    }

    const data = await carregarDados(DATA_URL);
    const lista = Array.isArray(data) ? data : (data.cursos || []);
    const curso = lista.find(c => c["personagem-nome"] === personagem);

    if (!curso) {
        throw new Error("Curso não encontrado para: " + personagem);
    }
    
    const tituloElement = document.getElementById("titulo");
    const btnVoltar = document.getElementById("btn-voltar");
    
    // 1. Configura o título
    if (tituloElement) {
        tituloElement.textContent = `Materiais de Estudo: ${curso.titulo}`;
        if (curso["cor-borda"]) {
            tituloElement.style.color = curso["cor-borda"]; 
        }
    }
    
    // 2. Renderiza os links
    renderizarLinks(curso.links, curso["cor-borda"]);
    
    // 3. Estiliza o botão voltar
    if (btnVoltar) {
        if (curso["cor-borda"]) {
             btnVoltar.style.backgroundColor = curso["cor-borda"];
             btnVoltar.style.border = `4px solid ${curso["cor-borda"]}`;
             btnVoltar.style.boxShadow = `0 6px 0 ${curso["cor-borda"]}, 0 0 15px ${curso["cor-borda"]}`;
        }
    }

  } catch (err) {
    console.error("Erro ao carregar Material de Estudo:", err.message);
    const tituloElement = document.getElementById("titulo");
    const linksContainer = document.getElementById("links");
    
    if (tituloElement) tituloElement.textContent = "Erro de Carregamento";
    if (linksContainer) linksContainer.innerHTML = "<p>Não foi possível carregar os materiais de estudo. Verifique se o parâmetro do personagem está correto na URL.</p>";
  }
}


// ----------------------------------------------------------------------
// LÓGICA DE INICIALIZAÇÃO UNIVERSAL
// ----------------------------------------------------------------------

/**
 * Decide qual função init chamar com base no título da página.
 * Isso permite usar o mesmo script para páginas diferentes (curso ou material).
 */
document.addEventListener("DOMContentLoaded", () => {
    // Se a página for a de Material de Estudo, chama a função específica.
    if (document.title.includes("Material de Estudo")) {
        initMaterialEstudo();
    } 
    // Caso contrário, assume que é a página principal do curso (ou a de escolha).
    else {
        initCurso(); 
    }
});

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