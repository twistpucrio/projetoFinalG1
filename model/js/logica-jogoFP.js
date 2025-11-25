export const situacoes = {
    sanduiche: {
        nome: "Preparar um sanduíche PB&J",
        blocos: [
            { funcao: "Pegar" },
            { funcao: "Abrir" },
            { funcao: "Passar na fatia de pão" },
            { funcao: "Juntar" },
            { funcao: "Loop" }
        ]
    }
};


export function gabaritoSanduiche() {
    return [
        ["Pegar:pote-amendoim", "Pegar:pote-geleia"],
        ["Abrir:pote-amendoim", "Abrir:pote-geleia"],

        "Pegar:faca",

        {
            tipo: "Loop",
            repeticoes: 2,
            conteudo: [
                // cada iteração: primeiro pegar a fatia, depois passar (amendoim OU geleia)
                "Pegar:fatia-pao",
                ["Passar na fatia de pão:pasta-amendoim", 
                 "Passar na fatia de pão:geleia"]
            ]
        },

        "Juntar:fatia-pao"
    ];
}



export function renderizarBlocosDeOpcao(blocos) {
    const container = document.getElementById("blocos-container");
    container.innerHTML = "";

    blocos.forEach(b => {
        const bloco = document.createElement("div");
        bloco.classList.add("bloco-opcao");
        bloco.draggable = true;

        bloco.textContent = b.funcao;
        bloco.dataset.funcao = b.funcao;

        bloco.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text", JSON.stringify(b));
        });

        container.appendChild(bloco);
    });
}

export function compararAlgoritmo(usuarioOrig, certoOrig) {
    const usuario = (usuarioOrig || []).filter(x => x);
    // fazemos cópia profunda rasa do gabarito para não mutá-lo
    const certo = JSON.parse(JSON.stringify(certoOrig));

    let i = 0;

    for (let k = 0; k < certo.length; k++) {
        const etapa = certo[k];

        // CASO: etapa é string simples
        if (typeof etapa === "string") {
            if (usuario[i] !== etapa) return false;
            i++;
            continue;
        }

        // CASO: etapa é uma lista de alternativas (ordem flexível para ESTA POSIÇÃO)
        if (Array.isArray(etapa)) {
            if (!usuario[i] || !etapa.includes(usuario[i])) return false;

            // consumimos a opção escolhida (em cópia já feita)
            const idx = etapa.indexOf(usuario[i]);
            if (idx !== -1) etapa.splice(idx, 1);

            i++;
            continue;
        }

        // CASO: LOOP
        if (etapa && etapa.tipo === "Loop") {

            const loopUser = usuario[i];
            if (typeof loopUser !== "object" || loopUser.tipo !== "Loop") return false;
            if (loopUser.repeticoes !== etapa.repeticoes) return false;

            // comparar conteúdo do loop — nota: passagem por cópia para não alterar o gabarito
            if (!compararLoop(loopUser.conteudo, JSON.parse(JSON.stringify(etapa.conteudo)))) return false;

            i++;
            continue;
        }

        // se chegar aqui: tipo desconhecido
        return false;
    }

    return i === usuario.length;
}

export function compararLoop(conteudoUser, conteudoCerto) {
    // conteudoCerto é uma cópia (já feita no chamador)
    if (conteudoUser.length !== conteudoCerto.length) return false;

    for (let j = 0; j < conteudoCerto.length; j++) {
        const esperado = conteudoCerto[j];
        const feito = conteudoUser[j];

        // simples (string)
        if (typeof esperado === "string") {
            if (feito !== esperado) return false;
            continue;
        }

        // múltiplas opções flexíveis (array)
        if (Array.isArray(esperado)) {
            if (!feito || !esperado.includes(feito)) return false;

            // remova da cópia para evitar repetição na mesma posição (cópia já foi feita)
            const idx = esperado.indexOf(feito);
            if (idx !== -1) esperado.splice(idx, 1);

            continue;
        }

        // outro tipo inesperado
        return false;
    }

    return true;
}
