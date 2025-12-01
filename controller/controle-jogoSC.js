import { state, getScene } from "../model/js/logica-jogoSC.js";

const root = document.getElementById('game-root');

export function startGame(startSceneId = 'intro') {
    renderScene(startSceneId);
}

function crearElementoTexto(text) {
    const p = document.createElement('p');
    p.className = 'texto-cena';
    p.textContent = text;
    return p;
}

function limparRoot() {
    root.innerHTML = '';
}

function renderScene(sceneId) {
    const scene = getScene(sceneId);
    if (!scene) {
        console.error('Cena não encontrada:', sceneId);
        return;
    }

    limparRoot();

    // cartão central
    const card = document.createElement('div');
    card.className = 'card';

    if (scene.title) {
        const h = document.createElement('h2');
        h.className = 'card-title';
        h.textContent = scene.title;
        card.appendChild(h);
    }

    // texto (string, array ou função)
    const containerTexto = document.createElement('div');
    containerTexto.className = 'card-text';

    let textoCena = scene.text;

    // se for função, execute com o estado
    if (typeof textoCena === "function") {
        textoCena = textoCena(state);
    }

    if (Array.isArray(textoCena)) {
        textoCena.forEach(t => containerTexto.appendChild(crearElementoTexto(t)));
    } else {
        containerTexto.appendChild(crearElementoTexto(textoCena || ''));
    }

    card.appendChild(containerTexto);


    // área de opções (botoes)
    const actions = document.createElement('div');
    actions.className = 'card-actions';

    scene.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-action';
        btn.textContent = opt.label;

        btn.addEventListener('click', () => {
            if (opt.action) {
                // ação customizada
                opt.action(state);
            }

            if (opt.next) {
                card.classList.add('fade-out');
                setTimeout(() => renderScene(opt.next), 220);
            }
        });

        actions.appendChild(btn);
    });

    card.appendChild(actions);
    root.appendChild(card);
}

startGame();