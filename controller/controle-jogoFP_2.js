import { situacoes, gabaritoSanduiche, compararAlgoritmo } from "../model/js/logica-jogoFP.js";

/*
  Controller atualizado:
  - corrige duplicação ao dropar dentro do loop (stopPropagation + guard no workspace)
  - loop aceita blocos dentro e blocks no workspace não podem ser reordenados
  - lixeira remove por data-id
  - montarAlgoritmoAPartirDoDOM produz objeto Loop compatível
*/

let nextId = 1;

document.addEventListener("DOMContentLoaded", () => {
  inicializarArrastarBlocos();
  inicializarAreaWorkspace();
  inicializarLixeira();
  inicializarBotao();
});

// -------------- Renderizar barra lateral --------------
function inicializarArrastarBlocos() {
  const container = document.getElementById("blocos-container");
  container.innerHTML = "";

  situacoes.sanduiche.blocos.forEach(b => {
    const bloco = criarBlocoOpcaoDOM(b.funcao);
    container.appendChild(bloco);
  });
}

function criarBlocoOpcaoDOM(funcao) {
  const bloco = document.createElement("div");
  bloco.classList.add("bloco-opcao");
  bloco.textContent = funcao;
  bloco.draggable = true;

  bloco.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/bloco", JSON.stringify({ funcao }));
    e.dataTransfer.effectAllowed = "copy";
    bloco.classList.add("sendo-arrastado");
  });

  bloco.addEventListener("dragend", () => bloco.classList.remove("sendo-arrastado"));

  return bloco;
}

// -------------- Workspace e Loop (recebem drops da barra lateral) --------------
function inicializarAreaWorkspace() {
  const workspace = document.getElementById("workspace");

  // permitir drop apenas quando vem "text/bloco" (da barra lateral)
  workspace.addEventListener("dragover", e => {
    if (e.dataTransfer && (e.dataTransfer.types && e.dataTransfer.types.includes && e.dataTransfer.types.includes("text/bloco") || e.dataTransfer.getData("text/bloco"))) {
      e.preventDefault();
    }
  });

  workspace.addEventListener("drop", e => {
    // GUARD: se o drop veio de dentro de um conteudo-loop, ignorar aqui.
    // Isso evita duplicação quando o .conteudo-loop já tratou o drop e não parou a propagação.
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
      adicionarBlocoSimplesAoWorkspace(data.funcao);
    }
  });
}

function adicionarBlocoSimplesAoWorkspace(funcao, parentConteudoEl = null) {
  // parentConteudoEl: se fornecido, insere dentro do loop; se não, insere no topo do workspace
  const id = `b${Date.now()}_${nextId++}`;
  const bloco = document.createElement("div");
  bloco.classList.add("bloco");
  bloco.dataset.id = id;
  bloco.dataset.tipo = "workspace"; // marca que é um bloco vindo do workspace/loop

  // conteúdo com select igual ao original
  if (funcao === "Passar na fatia de pão") {
    bloco.innerHTML = `
      <span class="funcao">${funcao}</span>
      (<select class="arg1">
        <option value="">---</option>
        <option value="pasta-amendoim">pasta de amendoim</option>
        <option value="geleia">geleia</option>
      </select>)
    `;
  } else {
    bloco.innerHTML = `
      <span class="funcao">${funcao}</span>
      (<select class="arg1">
        <option value="">---</option>
        <option value="fatia-pao">fatia de pão</option>
        <option value="pote-amendoim">pote de amendoim</option>
        <option value="faca">faca</option>
        <option value="pote-geleia">pote de geleia</option>
      </select>)
    `;
  }

  // blocos no workspace/loop SÓ podem ser arrastados para a lixeira
  bloco.draggable = true;
  bloco.addEventListener("dragstart", e => {
    // enviar apenas token de remoção
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

  // header do loop + conteudo-dropzone
  blocoLoop.innerHTML = `
    <div class="label">Loop (2x)</div>
    <div class="conteudo-loop" data-parent-id="${id}">
      <div class="placeholder">Arraste blocos aqui dentro</div>
    </div>
  `;

  // o próprio bloco-loop pode ser arrastado apenas para remoção (como os outros)
  blocoLoop.draggable = true;
  blocoLoop.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/bloco-remover", JSON.stringify({ id }));
    e.dataTransfer.effectAllowed = "move";
    blocoLoop.classList.add("sendo-arrastado");
  });
  blocoLoop.addEventListener("dragend", () => blocoLoop.classList.remove("sendo-arrastado"));

  // configurar a zona interna do loop para aceitar drops de blocos da barra lateral
  const conteudoEl = blocoLoop.querySelector(".conteudo-loop");

  // visual: highlight ao arrastar por cima
  conteudoEl.addEventListener("dragover", e => {
    if (e.dataTransfer && (e.dataTransfer.types && e.dataTransfer.types.includes && e.dataTransfer.types.includes("text/bloco") || e.dataTransfer.getData("text/bloco"))) {
      e.preventDefault();
      conteudoEl.classList.add("conteudo-ativo");
    }
  });
  conteudoEl.addEventListener("dragleave", () => conteudoEl.classList.remove("conteudo-ativo"));

  // IMPORTANT: parar a propagação do evento DROP para evitar que o workspace também
  // receba o drop e crie o bloco fora do loop (isso causava duplicação).
  conteudoEl.addEventListener("drop", e => {
    const raw = e.dataTransfer.getData("text/bloco");
    if (!raw) return;
    // evita que o evento suba e o workspace também processe
    e.preventDefault();
    e.stopPropagation();
    conteudoEl.classList.remove("conteudo-ativo");

    const data = JSON.parse(raw);
    // inserir bloco filho dentro do loop
    // remover placeholder se existir
    const ph = conteudoEl.querySelector(".placeholder");
    if (ph) ph.remove();

    adicionarBlocoSimplesAoWorkspace(data.funcao, conteudoEl);
  });

  document.getElementById("workspace").appendChild(blocoLoop);
}

// -------------- Lixeira (aceita text/bloco-remover) --------------
function inicializarLixeira() {
  const lixeira = document.getElementById("lixeira");

  lixeira.addEventListener("dragover", e => {
    // aceitar apenas se for token de remoção
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
  // procura bloco ou loop por data-id em workspace e dentro de loops
  const workspace = document.getElementById("workspace");
  const bloco = workspace.querySelector(`.bloco[data-id="${id}"], .bloco-loop[data-id="${id}"]`);
  if (bloco) bloco.remove();
  else {
    // talvez o id seja do loop (loop tem mesmo seletor) — se não encontrado, procurar qualquer nó com data-id
    const any = document.querySelector(`[data-id="${id}"]`);
    if (any) any.remove();
  }
}

// -------------- Botão verificar --------------
function inicializarBotao() {
  const botao = document.getElementById("btn-verificar");
  botao.addEventListener("click", () => {
    const usuario = montarAlgoritmoAPartirDoDOM();
    const certo = gabaritoSanduiche();

    console.log("Usuario (DOM):", usuario);
    console.log("Gabarito:", certo);

    if (compararAlgoritmo(usuario, certo)) {
      alert("✔ Algoritmo correto!");
    } else {
      alert("❌ Ainda não está correto...");
    }
  });
}

// -------------- Montar algoritmo lendo o DOM --------------
function montarAlgoritmoAPartirDoDOM() {
  const workspace = document.getElementById("workspace");
  const passos = [];

  // iterar apenas filhos diretos do workspace (top-level)
  workspace.querySelectorAll(":scope > .bloco, :scope > .bloco-loop").forEach(top => {
    if (top.classList.contains("bloco-loop")) {
      // montar objeto Loop preservando os blocos do usuário COMO STRINGS
      const conteudoEl = top.querySelector(".conteudo-loop");
      const conteudoFeito = [];

      // pegar todos os blocos filhos dentro do loop (apenas .bloco diretos)
      const filhos = conteudoEl ? Array.from(conteudoEl.querySelectorAll(":scope > .bloco")) : [];

      filhos.forEach(f => {
        const funcao = f.querySelector(".funcao") ? f.querySelector(".funcao").textContent.trim() : f.textContent.trim();
        const arg = f.querySelector(".arg1")?.value || "";
        if (arg) conteudoFeito.push(`${funcao}:${arg}`);
        else conteudoFeito.push(`${funcao}:`);
      });

      // **Não transformar** as três entradas em um objeto; mantenha as strings do usuário.
      passos.push({
        tipo: "Loop",
        repeticoes: 2,
        conteudo: conteudoFeito
      });
    } else {
      // bloco simples no nível top
      const funcao = top.querySelector(".funcao") ? top.querySelector(".funcao").textContent.trim() : top.textContent.trim();
      const arg = top.querySelector(".arg1")?.value || "";
      if (arg) passos.push(`${funcao}:${arg}`);
      else passos.push(`${funcao}:`);
    }
  });

  return passos;
}
