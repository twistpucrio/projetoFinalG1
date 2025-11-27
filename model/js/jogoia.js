// --- ESTADO INTERNO DO AGENTE ---
let estadoAmbiente = []; // 9 células
let posicaoAgente = 0;
let regrasAgente = []; // ARRAY DINÂMICO! As alunas o preencherão via UI

// --- FUNÇÕES DE INTERFACE ---
function logDecisao(mensagem) {
    const log = document.getElementById('log');
    log.innerHTML += `<div>> ${mensagem}</div>`;
    log.scrollTop = log.scrollHeight;
}

function renderizarAmbiente() {
    const ambienteDiv = document.getElementById('ambiente');
    ambienteDiv.innerHTML = '';
    estadoAmbiente.forEach((estado, index) => {
        const celula = document.createElement('div');
        celula.className = `celula ${estado}`;
        celula.textContent = estado === 'sujo' ? '🔴' : '🟢';
        if (index === posicaoAgente) {
            celula.classList.add('agente');
            celula.textContent = '🤖';
        }
        ambienteDiv.appendChild(celula);
    });
}

function exibirRegras() {
    const listaDiv = document.getElementById('lista-regras');
    listaDiv.innerHTML = '';

    if (regrasAgente.length === 0) {
        listaDiv.innerHTML = '<p>Nenhuma regra definida. O Agente não sabe o que fazer!</p>';
        return;
    }

    regrasAgente.forEach((regra, index) => {
        const item = document.createElement('div');
        item.className = 'regra-item';
        item.innerHTML = `
            <span>Regra ${index + 1}: SE <strong>${regra.percepcao.replace(/_/g, ' ')}</strong> ENTÃO <strong>${regra.acao.toUpperCase()}</strong></span>
            <button onclick="removerRegra(${index})">X</button>
        `;
        listaDiv.appendChild(item);
    });
}

// --- CONFIGURAÇÃO DE REGRAS PELA ALUNA (INTERATIVIDADE PRINCIPAL) ---

function adicionarRegra() {
    const percepcao = document.getElementById('select-percepcao').value;
    const acao = document.getElementById('select-acao').value;

    const novaRegra = {
        percepcao: percepcao,
        acao: acao
    };

    regrasAgente.push(novaRegra);
    exibirRegras();
    logDecisao(`Regra adicionada: SE ${percepcao} ENTÃO ${acao}`);
}

function removerRegra(index) {
    regrasAgente.splice(index, 1);
    exibirRegras();
    logDecisao(`Regra ${index + 1} removida. O cérebro foi modificado.`);
}

// --- LÓGICA DO AGENTE (O MOTOR DE REGRAS) ---

function perceber() {
    // Mesma lógica de percepção do robô de limpeza
    if (estadoAmbiente[posicaoAgente] === 'sujo') return 'celula_atual_suja';
    if (estadoAmbiente.every(estado => estado === 'limpo')) return 'todas_limpas';
    return 'celula_atual_limpa';
}

function rodarUmCiclo() {
    if (regrasAgente.length === 0) {
        logDecisao('🚨 ERRO: O agente não tem regras e não pode agir.');
        return;
    }

    const percepcaoAtual = perceber();
    
    // O AGENTE BUSCA A PRIMEIRA REGRA QUE CORRESPONDE À PERCEPÇÃO ATUAL
    const regraEncontrada = regrasAgente.find(regra => regra.percepcao === percepcaoAtual);

    if (!regraEncontrada) {
        logDecisao(`⚠️ Nenhuma regra para a percepção '${percepcaoAtual.replace(/_/g, ' ')}'. Agente fica inerte.`);
        return;
    }

    logDecisao(`[DECISÃO] Percepção: ${percepcaoAtual}. Ação Escolhida: ${regraEncontrada.acao}`);
    executarAcao(regraEncontrada.acao);
    renderizarAmbiente();
}

function executarAcao(acao) {
    // Lógica para limpar, mover ou parar (simplificada)
    if (acao === 'limpar') {
        estadoAmbiente[posicaoAgente] = 'limpo';
    } 
    else if (acao === 'mover_aleatorio') {
        let novoPosicao;
        do {
            novoPosicao = Math.floor(Math.random() * estadoAmbiente.length);
        } while (novoPosicao === posicaoAgente);
        posicaoAgente = novoPosicao;
    }
    else if (acao === 'parar') {
        document.getElementById('controles').innerHTML = '<h2>🎉 Objetivo Atingido!</h2>';
    }
}


// --- INICIALIZAÇÃO DA SIMULAÇÃO ---
function iniciarSimulacao() {
    // Gera um ambiente inicial semi-sujo
    estadoAmbiente = ['sujo', 'sujo', 'limpo', 'sujo', 'limpo', 'sujo', 'limpo', 'sujo', 'sujo'];
    posicaoAgente = 0;
    document.getElementById('log').innerHTML = ''; // Limpa o log
    
    // Reinicia os botões de controle
    document.getElementById('controles').innerHTML = `
        <button onclick="iniciarSimulacao()">Reiniciar Ambiente</button>
        <button onclick="rodarUmCiclo()">Executar Próxima Ação</button>
    `;
    
    renderizarAmbiente();
    logDecisao('Simulação reiniciada. Crie as regras para o Robô!');
}

// Inicializa a página
iniciarSimulacao();
exibirRegras();