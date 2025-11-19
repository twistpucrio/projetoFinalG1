import { animarRobo, carregarSituacao, verificarAlgoritmo, situacaoAtual } 
    from "../model/js/logica-jogoFP.js";

const robo = document.getElementById("robo");

async function executar() {
    const passos = [...document.querySelectorAll('#workspace .block')]
                    .map(b => b.dataset.action);

    for (const passo of passos) {
        await animarRobo(passo);
    }
}