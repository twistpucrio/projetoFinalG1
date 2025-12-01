export const situacoes = {
  sanduiche: {
    nome: "Preparar um sanduíche PB&J",
    blocos: [
      { funcao: "Pegar", args: ["obj"] },
      { funcao: "Abrir", args: ["obj"] },
      { funcao: "Passar na fatia de pão", args: ["spread"] },
      { funcao: "Juntar", args: [] },
      { funcao: "Loop", args: [] }
    ],
    argsPossiveis: {
      obj: ["pote-amendoim", "pote-geleia", "fatia-pao", "faca"],
      spread: ["pasta-amendoim", "geleia"],
    }
  },

  omelete: {
    nome: "Preparar uma omelete",

    blocos: [
        { funcao: "Pegar", args: ["ingrediente"] },
        { funcao: "Quebrar", args: ["ingrediente"] },

        // NOVO – dois argumentos
        { funcao: "Bater ... na ...", args: ["ingrediente", "dest"] },

        { funcao: "Picotar", args: ["ingrediente"] },

        { funcao: "Untar a panela", args: [] },

        // NOVO – dois argumentos
        { funcao: "Colocar ... na ...", args: ["ingrediente", "dest"] },

        { funcao: "Misturar", args: ["ingrediente"] },
        { funcao: "Servir", args: ["ingrediente"] }
    ],

    argsPossiveis: {
        obj: ["ovo"],
        ingrediente: ["ovo", "presunto", "queijo", "omelete"],
        dest: ["batedeira", "panela"]
    }
    }
};



export function gabaritoSanduiche() {
    return [
        { tipo: "ChooseFirstPot", opcoes: ["Pegar:pote-amendoim", "Pegar:pote-geleia"] },
        { tipo: "OpenSameAsPrevious" },
        { tipo: "PickRemainingPot" },
        { tipo: "OpenSameAsPrevious" },

        "Pegar:faca",
        
        {
            tipo: "Loop",
            repeticoes: 2,
            conteudo: [
                "Pegar:fatia-pao",
                { 
                  tipo: "PassBothInOrder", 
                  opcoes: [
                     "Passar na fatia de pão:pasta-amendoim",
                     "Passar na fatia de pão:geleia"
                  ] 
                }
            ]
        },

        "Juntar"   // <<< CORRIGIDO — sem argumentos
    ];
}


export function gabaritoOmelete() {
    return [
        "Pegar:ovo",
        "Quebrar:ovo",
        "Bater ... na ...:ovo:batedeira",

        "Pegar:presunto",
        "Picotar:presunto",

        "Pegar:queijo",
        "Picotar:queijo",

        "Untar a panela",

        "Colocar ... na ...:ovo:panela",
        "Colocar ... na ...:presunto:panela",
        "Colocar ... na ...:queijo:panela",

        "Misturar:ovo",

        "Servir:omelete"
    ];
}



export function compararAlgoritmo(usuarioOrig, certoOrig) {
    const usuario = (usuarioOrig || []).filter(x => x);
    const certo = JSON.parse(JSON.stringify(certoOrig));

    let i = 0;

    let firstPot = null;
    let firstPegarString = null;

    for (let k = 0; k < certo.length; k++) {
        const etapa = certo[k];
        const u = usuario[i];

        // -----------------------------
        // 1) CASO SANDUÍCHE: objetos com .tipo
        // -----------------------------
        if (etapa && etapa.tipo) {

            if (etapa.tipo === "ChooseFirstPot") {
                if (!u || !etapa.opcoes.includes(u)) return false;
                firstPegarString = u;
                firstPot = u.split(":")[1];
                i++;
                continue;
            }

            if (etapa.tipo === "OpenSameAsPrevious") {
                if (!firstPot) return false;
                const esperado = `Abrir:${firstPot}`;
                if (u !== esperado) return false;
                i++;
                continue;
            }

            if (etapa.tipo === "PickRemainingPot") {
                if (!firstPot) return false;
                const remaining = firstPot === "pote-amendoim" ? "pote-geleia" : "pote-amendoim";
                const esperado = `Pegar:${remaining}`;
                if (u !== esperado) return false;
                firstPot = remaining;
                i++;
                continue;
            }

            if (etapa.tipo === "Loop") {
                const loopUser = u;
                if (typeof loopUser !== "object" || loopUser.tipo !== "Loop") return false;
                if (loopUser.repeticoes !== etapa.repeticoes) return false;

                if (!compararLoop(loopUser.conteudo, JSON.parse(JSON.stringify(etapa.conteudo)))) {
                    return false;
                }

                i++;
                continue;
            }

            // Tipo desconhecido
            return false;
        }

        // -----------------------------
        // 2) CASO SIMPLES DO OMELETE:
        //    etapa = { funcao: "...", args: [...] }
        // -----------------------------
        if (typeof etapa === "object" && etapa.funcao && !etapa.tipo) {
            if (!u) return false;

            // Usuário deve ter salvo como string "Funcao:arg1:arg2"
            const esperado = etapa.funcao + (etapa.args.length ? ":" + etapa.args.join(":") : "");
            if (u !== esperado) return false;

            i++;
            continue;
        }

        // -----------------------------
        // 3) Caso simples de string (sanduíche)
        // -----------------------------
        if (typeof etapa === "string") {
            if (u !== etapa) return false;
            i++;
            continue;
        }

        // Caso inesperado
        return false;
    }

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
