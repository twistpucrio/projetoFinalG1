import { 
    situacoes, 
    renderizarBlocosDeOpcao,
    compararAlgoritmo,
    gabaritoSanduiche
} from "../model/js/logica-jogoFP.js";


function getSituacaoDaURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("situacao");
}

const chave = getSituacaoDaURL();
const situacaoAtual = situacoes[chave];

const workspace = document.getElementById("workspace");

workspace.addEventListener("dragover", e => {
    if (e.target.closest(".dropzone-loop") || e.target === workspace) {
        e.preventDefault();
    }
});

function ativarDragNoBloco(bloco) {
    bloco.draggable = true;

    bloco.addEventListener("dragstart", () => {
        bloco.classList.add("being-dragged");
    });

    bloco.addEventListener("dragend", () => {
        bloco.classList.remove("being-dragged");
    });
}

workspace.addEventListener("drop", e => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text"));

    const bloco = document.createElement("div");
    bloco.classList.add("bloco");

    ativarDragNoBloco(bloco);

    if (data.funcao === "Loop") {
        bloco.classList.add("bloco-loop");
        bloco.innerHTML = `
            <div class="label">Loop (2x)</div>
            <div class="conteudo-loop dropzone-loop"></div>
        `;
    }
    else if (data.funcao === "Passar na fatia de pão") {
        bloco.innerHTML = `
            <span class="funcao">${data.funcao}</span>
            (<select class="arg1">
                <option value="">---</option>
                <option value="pasta-amendoim">pasta de amendoim</option>
                <option value="geleia">geleia</option>
            </select>)
        `;
    }
    else {
        bloco.innerHTML = `
            <span class="funcao">${data.funcao}</span>
            (<select class="arg1">
                <option value="">---</option>
                <option value="fatia-pao">fatia de pão</option>
                <option value="pote-amendoim">pote de amendoim</option>
                <option value="faca">faca</option>
                <option value="pote-geleia">pote de geleia</option>
            </select>)
        `;
    }

    const destino = e.target.closest(".dropzone-loop") || workspace;
    destino.appendChild(bloco);
});

function lerWorkspace() {

    function lerBloco(blocoEl) {
        const funcao = blocoEl.querySelector(".funcao")?.textContent;

        if (funcao && funcao.includes("Passar na fatia de pão")) {
            const ingrediente = blocoEl.querySelector(".arg1")?.value || "";
            if (!ingrediente) return "";

            return `Passar na fatia de pão:${ingrediente}`;
        }

        if (blocoEl.classList.contains("bloco-loop")) {
            const conteudoEls = blocoEl.querySelectorAll(".conteudo-loop > .bloco");
            const conteudo = [];

            conteudoEls.forEach(inner => {
                const c = lerBloco(inner);
                if (c) conteudo.push(c);
            });

            return {
                tipo: "Loop",
                repeticoes: 2,
                conteudo
            };
        }

        const arg = blocoEl.querySelector(".arg1")?.value || "";
        return `${funcao}:${arg}`;
    }

    const passos = [];

    workspace.querySelectorAll(":scope > .bloco").forEach(bloco => {
        const resultado = lerBloco(bloco);
        if (resultado) passos.push(resultado);
    });

    return passos;
}

if (situacaoAtual) {
    renderizarBlocosDeOpcao(situacaoAtual.blocos);

    document.getElementById("btn-verificar").addEventListener("click", () => {
        const usuario = lerWorkspace();
        const certo = gabaritoSanduiche();

        console.log("Usuario:", usuario);
        console.log("Certo:", certo);

        if (compararAlgoritmo(usuario, certo)) {
            alert("Você acertou!");
        } else {
            alert("Ainda não está correto.");
        }
    });
}