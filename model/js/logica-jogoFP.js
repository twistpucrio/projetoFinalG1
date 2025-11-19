export let situacaoAtual = null;

export const situacoes = {
    sanduiche: {
        passos: ["pegar-pao", "passar-recheio", "juntar-fatias"]
    },
    omelete: {
        passos: ["quebrar-ovos", "ligar-fogao", "mexer", "cozinhar"]
    }
};

export function carregarSituacao() {
    const chave = document.getElementById("escolha").value;
    situacaoAtual = situacoes[chave];
}

export function verificarAlgoritmo() {
    const userPassos = [...document.querySelectorAll('#workspace .block')]
                        .map(b => b.dataset.action);

    const corretos = situacaoAtual.passos;

    if (JSON.stringify(userPassos) === JSON.stringify(corretos)) {
        alert("Perfeito! Você executou o algoritmo certinho!");
    } else {
        alert("Ops! A ordem ou instruções estão erradas.");
    }
}

export async function animarRobo(passo) {
    if (passo === "quebrar-ovos") {
        robo.src = "img/robo_quebrando.png";
        await delay(1200);
    }
    if (passo === "ligar-fogao") {
        robo.src = "img/robo_ligando_fogao.png";
        await delay(1300);
    }
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
