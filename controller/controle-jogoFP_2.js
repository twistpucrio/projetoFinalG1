import { situacoes, gabaritoSanduiche, gabaritoOmelete, compararAlgoritmo }  from "../model/js/logica-jogoFP.js";

let nextId = 1;
const params = new URLSearchParams(window.location.search);
const situacaoURL = params.get("situacao");

let situacaoAtual = situacoes.sanduiche;

if (situacaoURL && situacoes[situacaoURL]) {
  situacaoAtual = situacoes[situacaoURL];
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarArrastarBlocos();
  inicializarAreaWorkspace();
  inicializarLixeira();
  inicializarBotao();
});

function inicializarArrastarBlocos() {
  const container = document.getElementById("blocos-container");
  container.innerHTML = "";


  situacaoAtual.blocos.forEach(b => {
    const bloco = criarBlocoOpcaoDOM(b.funcao, b.args);
    container.appendChild(bloco);
  });
}

function criarBlocoOpcaoDOM(funcao, args = []) {
  const bloco = document.createElement("div");
  bloco.classList.add("bloco-opcao");
  bloco.textContent = funcao;
  bloco.draggable = true;

  bloco.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/bloco", JSON.stringify({ 
      funcao, 
      args: [...args]   // garante que args sempre são ["obj"], ["ingrediente"], etc.
  }));
    e.dataTransfer.effectAllowed = "copy";
    bloco.classList.add("sendo-arrastado");
  });

  bloco.addEventListener("dragend", () => bloco.classList.remove("sendo-arrastado"));

  return bloco;
}


function inicializarAreaWorkspace() {
  const workspace = document.getElementById("workspace");

  workspace.addEventListener("dragover", e => {
    if (e.dataTransfer && (e.dataTransfer.types && e.dataTransfer.types.includes && e.dataTransfer.types.includes("text/bloco") || e.dataTransfer.getData("text/bloco"))) {
      e.preventDefault();
    }
  });

  workspace.addEventListener("drop", e => {
    if (e.target && e.target.closest && e.target.closest('.conteudo-loop')) {
      return;
    }

    const raw = e.dataTransfer.getData("text/bloco");
    if (!raw) return;
    e.preventDefault();
    const data = JSON.parse(raw);
    if (data.funcao === "Loop") {
      adicionarBlocoLoopAoWorkspace();
    } else {
      const argsOriginais = situacaoAtual.blocos.find(b => b.funcao === data.funcao)?.args || [];
      adicionarBlocoSimplesAoWorkspace(data.funcao, undefined, argsOriginais);
    }
  });
}

function adicionarBlocoSimplesAoWorkspace(funcao, parentConteudoEl = null, args = []) {
  const id = `b${Date.now()}_${nextId++}`;
  const bloco = document.createElement("div");
  bloco.classList.add("bloco");
  bloco.dataset.id = id;

  let selectsHtml = "";

  if (args.length > 0) {
    selectsHtml = "(" + args.map((a, i) =>
      gerarSelect(i + 1, obterOpcoesParaSituacaoAtual(a))
    ).join(" ") + ")";
  }

  bloco.innerHTML = `
    <span class="funcao">${funcao}</span>
    ${selectsHtml}
  `;

  bloco.draggable = true;
  bloco.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/bloco-remover", JSON.stringify({ id }));
    e.dataTransfer.effectAllowed = "move";
    bloco.classList.add("sendo-arrastado");
  });
  bloco.addEventListener("dragend", () => bloco.classList.remove("sendo-arrastado"));

  if (parentConteudoEl) parentConteudoEl.appendChild(bloco);
  else document.getElementById("workspace").appendChild(bloco);
}


function adicionarBlocoLoopAoWorkspace() {
  const id = `loop${Date.now()}_${nextId++}`;
  const blocoLoop = document.createElement("div");
  blocoLoop.classList.add("bloco", "bloco-loop");
  blocoLoop.dataset.id = id;
  blocoLoop.dataset.tipo = "workspace";

  blocoLoop.innerHTML = `
    <div class="label">Loop (2x)</div>
    <div class="conteudo-loop" data-parent-id="${id}">
      <div class="placeholder">Arraste blocos aqui dentro</div>
    </div>
  `;

  blocoLoop.draggable = true;
  blocoLoop.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/bloco-remover", JSON.stringify({ id }));
    e.dataTransfer.effectAllowed = "move";
    blocoLoop.classList.add("sendo-arrastado");
  });
  blocoLoop.addEventListener("dragend", () => blocoLoop.classList.remove("sendo-arrastado"));

  const conteudoEl = blocoLoop.querySelector(".conteudo-loop");

  conteudoEl.addEventListener("dragover", e => {
    if (e.dataTransfer && (e.dataTransfer.types && e.dataTransfer.types.includes && e.dataTransfer.types.includes("text/bloco") || e.dataTransfer.getData("text/bloco"))) {
      e.preventDefault();
      conteudoEl.classList.add("conteudo-ativo");
    }
  });
  conteudoEl.addEventListener("dragleave", () => conteudoEl.classList.remove("conteudo-ativo"));

  conteudoEl.addEventListener("drop", e => {
    const raw = e.dataTransfer.getData("text/bloco");
    if (!raw) return;
    e.preventDefault();
    e.stopPropagation();
    conteudoEl.classList.remove("conteudo-ativo");

    const data = JSON.parse(raw);
    const ph = conteudoEl.querySelector(".placeholder");
    if (ph) ph.remove();
    
    const argsOriginais = situacaoAtual.blocos.find(b => b.funcao === data.funcao)?.args || [];
    adicionarBlocoSimplesAoWorkspace(data.funcao, conteudoEl, argsOriginais);
  });

  document.getElementById("workspace").appendChild(blocoLoop);
}

function inicializarLixeira() {
  const lixeira = document.getElementById("lixeira");

  lixeira.addEventListener("dragover", e => {
    const dt = e.dataTransfer;
    if (dt && (dt.types && (dt.types.includes && dt.types.includes("text/bloco-remover") || dt.getData("text/bloco-remover")))) {
      e.preventDefault();
      lixeira.classList.add("lixeira-ativa");
    }
  });

  lixeira.addEventListener("dragleave", () => lixeira.classList.remove("lixeira-ativa"));

  lixeira.addEventListener("drop", e => {
    e.preventDefault();
    lixeira.classList.remove("lixeira-ativa");
    const raw = e.dataTransfer.getData("text/bloco-remover");
    if (!raw) return;
    const obj = JSON.parse(raw);
    removerBlocoDoDOMPorId(obj.id);
  });
}

function removerBlocoDoDOMPorId(id) {
  const workspace = document.getElementById("workspace");
  const bloco = workspace.querySelector(`.bloco[data-id="${id}"], .bloco-loop[data-id="${id}"]`);
  if (bloco) bloco.remove();
  else {
    const any = document.querySelector(`[data-id="${id}"]`);
    if (any) any.remove();
  }
}

function inicializarBotao() {
  const botao = document.getElementById("btn-verificar");

  botao.addEventListener("click", () => {
    const usuario = montarAlgoritmoAPartirDoDOM();

    let certo;

    if (situacaoURL === "omelete") {
      certo = gabaritoOmelete();
    } else {
      // padrão = sanduíche
      certo = gabaritoSanduiche();
    }

    console.log("Usuario (DOM):", usuario);
    console.log("Gabarito:", certo);

    if (compararAlgoritmo(usuario, certo)) {
      alert("Algoritmo correto!");
    } else {
      alert("Ainda não está correto...");
    }
  });
}


function montarAlgoritmoAPartirDoDOM() {
  const workspace = document.getElementById("workspace");
  const passos = [];

  function montarParaBlocoEl(blocoEl) {
    const funcao = (blocoEl.querySelector(".funcao") ? blocoEl.querySelector(".funcao").textContent : blocoEl.textContent).trim();

    // coletar todos os selects argN dentro do bloco, em ordem por número N
    const selects = Array.from(blocoEl.querySelectorAll('[class^="arg"]'))
      .sort((a, b) => {
        const na = (a.className.match(/arg(\d+)/) || [0,0])[1];
        const nb = (b.className.match(/arg(\d+)/) || [0,0])[1];
        return Number(na) - Number(nb);
      });

    const valores = selects.map(s => (s.value || "").trim()).filter(v => v !== "");

    if (valores.length > 0) {
      return funcao + ":" + valores.join(":");
    } else {
      return funcao; // sem ":" quando não tem argumento
    }
  }

  workspace.querySelectorAll(":scope > .bloco, :scope > .bloco-loop").forEach(top => {
    if (top.classList.contains("bloco-loop")) {
      const conteudoEl = top.querySelector(".conteudo-loop");
      const conteudoFeito = [];

      const filhos = conteudoEl ? Array.from(conteudoEl.querySelectorAll(":scope > .bloco")) : [];

      filhos.forEach(f => {
        conteudoFeito.push(montarParaBlocoEl(f));
      });

      passos.push({
        tipo: "Loop",
        repeticoes: 2,
        conteudo: conteudoFeito
      });
    } else {
      passos.push(montarParaBlocoEl(top));
    }
  });

  return passos;
}



function gerarSelect(indice, valoresPossiveis) {
  return `
    <select class="arg${indice}">
      <option value="">---</option>
      ${valoresPossiveis.map(v => `<option value="${v}">${v}</option>`).join("")}
    </select>
  `;
}

function obterOpcoesParaSituacaoAtual(tipo) {
  return situacaoAtual.argsPossiveis[tipo] || [];
}
