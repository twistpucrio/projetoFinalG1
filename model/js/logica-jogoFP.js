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


// Novo gabarito com objetos que descrevem dependências
export function gabaritoSanduiche() {
    return [
        // 1. pegar um dos potes (amendoim OU geleia)
        { tipo: "ChooseFirstPot", opcoes: ["Pegar:pote-amendoim", "Pegar:pote-geleia"] },

        // 2. abrir o pote escolhido anteriormente
        { tipo: "OpenSameAsPrevious" },

        // 3. pegar o pote restante
        { tipo: "PickRemainingPot" },

        // 4. abrir o pote restante
        { tipo: "OpenSameAsPrevious" },

        // 5. pegar faca
        "Pegar:faca",

        // 6. loop 2x: para cada fatia: pegar fatia, passar uma substância, passar a substância restante
        {
            tipo: "Loop",
            repeticoes: 2,
            conteudo: [
                "Pegar:fatia-pao",
                // este objeto significa: dois "Passar" consecutivos, primeiro qualquer uma das duas substâncias,
                // segundo a SUBSTÂNCIA RESTANTE (não pode repetir a mesma duas vezes)
                { tipo: "PassBothInOrder", opcoes: ["Passar na fatia de pão:pasta-amendoim", "Passar na fatia de pão:geleia"] }
            ]
        },

        // 7. juntar
        "Juntar:fatia-pao"
    ];
}


// compararAlgoritmo revisada para entender as novas etapas dependentes
export function compararAlgoritmo(usuarioOrig, certoOrig) {
    const usuario = (usuarioOrig || []).filter(x => x);
    const certo = JSON.parse(JSON.stringify(certoOrig)); // cloninho

    let i = 0;
    // estado para lembrar qual pote foi escolhido primeiro
    let firstPot = null; // "pote-amendoim" ou "pote-geleia"
    let firstPegarString = null; // ex: "Pegar:pote-amendoim"

    for (let k = 0; k < certo.length; k++) {
        const etapa = certo[k];

        if (typeof etapa === "string") {
            // passo simples: comparar igualdade exata
            if (usuario[i] !== etapa) return false;
            i++;
            continue;
        }

        // etapa é um objeto com regras especiais
        if (etapa && etapa.tipo === "ChooseFirstPot") {
            const u = usuario[i];
            if (!u || !etapa.opcoes.includes(u)) return false;
            // guardar escolha
            firstPegarString = u; // ex: "Pegar:pote-amendoim"
            // extrair nome do pote depois dos dois pontos
            firstPot = u.split(":")[1]; // "pote-amendoim" ou "pote-geleia"
            i++;
            continue;
        }

        if (etapa && etapa.tipo === "OpenSameAsPrevious") {
            if (firstPot == null) return false; // não foi escolhido primeiro pote
            const esperado = `Abrir:${firstPot}`;
            // Note: isso é usado duas vezes consecutivas: a primeira abre o primeiro pote,
            // a segunda OpenSameAsPrevious deverá abrir o pote que for 'current' (ver abaixo).
            // Para a segunda ocorrência, antes de chamá-la, nós atualizamos firstPot (veja PickRemainingPot).
            if (usuario[i] !== esperado) return false;
            i++;
            continue;
        }

        if (etapa && etapa.tipo === "PickRemainingPot") {
            if (firstPot == null) return false;
            // remaining pot:
            const remaining = firstPot === "pote-amendoim" ? "pote-geleia" : "pote-amendoim";
            const esperado = `Pegar:${remaining}`;
            if (usuario[i] !== esperado) return false;
            // atualizar 'firstPot' para agora apontar para o pote que foi pego (para que a próxima
            // OpenSameAsPrevious abra esse pote restante)
            firstPot = remaining;
            i++;
            continue;
        }

        if (etapa && etapa.tipo === "Loop") {
            // o usuário deve ter um objeto Loop nesta posição
            const loopUser = usuario[i];
            if (typeof loopUser !== "object" || loopUser.tipo !== "Loop") return false;
            if (loopUser.repeticoes !== etapa.repeticoes) return false;

            // comparar o conteúdo do loop; vamos permitir validar a regra "PassBothInOrder"
            if (!compararLoop(loopUser.conteudo, JSON.parse(JSON.stringify(etapa.conteudo)))) return false;

            i++;
            continue;
        }

        // se chegou aqui, encontrou algo inesperado
        return false;
    }

    // todos os passos em certo devem corresponder aos passos do usuário, e não sobrar itens no usuário
    return i === usuario.length;
}


// compararLoop revisada para suportar PassBothInOrder
export function compararLoop(conteudoUser, conteudoCerto) {
    // conteudoUser é a lista de blocos dentro do loop (por exemplo, [
    //   "Pegar:fatia-pao",
    //   "Passar na fatia de pão:pasta-amendoim",
    //   "Passar na fatia de pão:geleia"
    // ])
    // conteudoCerto é a lista de expectativas (no modelo acima, tem um item "Pegar:fatia-pao"
    // e um objeto { tipo: "PassBothInOrder", opcoes: [...] } )

    // Para facilitar, vamos transformar conteudoUser em uma cópia
    const feito = (conteudoUser || []).slice();

    // Acontece que no gabarito eu defini 2 elementos (Pegar e PassBothInOrder),
    // mas na prática o usuário terá 3 blocos por repetição (Pegar + Pass + Pass).
    // Então aqui não podemos exigir mesma quantidade direta; vamos iterar sobre o gabarito
    // consumindo itens do 'feito' conforme necessário.
    let idxFeito = 0;

    for (let j = 0; j < conteudoCerto.length; j++) {
        const esperado = conteudoCerto[j];

        if (typeof esperado === "string") {
            // esperar que próximo 'feito' seja exatamente essa string
            if (feito[idxFeito] !== esperado) return false;
            idxFeito++;
            continue;
        }

        if (esperado && esperado.tipo === "PassBothInOrder") {
            // vamos pegar dois feitos consecutivos
            const primeiro = feito[idxFeito];
            const segundo = feito[idxFeito + 1];

            if (!primeiro || !segundo) return false;

            // Ambos devem começar com "Passar na fatia de pão:"
            if (typeof primeiro !== "string" || typeof segundo !== "string") return false;
            if (!primeiro.startsWith("Passar na fatia de pão:") || !segundo.startsWith("Passar na fatia de pão:")) return false;

            // Os substrings após ':' precisam corresponder às duas opções, mas em ordem: primeiro qualquer uma, segundo a restante.
            const opt = esperado.opcoes.slice(); // ["Passar ...:pasta-amendoim","Passar ...:geleia"]

            // Primeiro deve estar em opt
            if (!opt.includes(primeiro)) return false;
            // Remover a que foi usada
            const remIdx = opt.indexOf(primeiro);
            if (remIdx !== -1) opt.splice(remIdx, 1);

            // Segundo deve ser exatamente a que sobrou
            if (opt.length !== 1) return false;
            if (segundo !== opt[0]) return false;

            // consumimos dois feitos
            idxFeito += 2;
            continue;
        }

        // se encontrar algo que não reconhece
        return false;
    }

    // Ao final, devemos ter consumido exatamente todos os blocos do loop do usuário
    return idxFeito === feito.length;
}


// Mantive essa função como antes - sem mudança
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
