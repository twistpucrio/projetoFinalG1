let jogos = [];
let nivelAtual = 0;

async function carregarJogos() {
  try {
    const response = await fetch('../../model/json/jogowebdev.json');
    if (!response.ok) throw new Error('Falha ao buscar JSON: ' + response.status);
    jogos = await response.json();
    carregarNivel();
  } catch (error) {
    console.error('Erro ao carregar o JSON:', error);
    document.getElementById('pergunta-atual').innerText = 'Erro ao carregar o jogo. Veja o console.';
  }
}

function carregarNivel() {
  console.log("Carregando nível:", nivelAtual);

  document.getElementById('proximo-btn').style.display = 'none';

  const nivel = jogos[nivelAtual];
  if (!nivel) {
    console.error("Nível não encontrado! jogos:", jogos);
    document.getElementById('pergunta-atual').innerText = 'Nenhum nível encontrado.';
    return;
  }

  document.getElementById('nivel-atual').innerText = nivel.id;
  document.getElementById('topico-atual').innerText = nivel.topico;
  document.getElementById('pergunta-atual').innerText = nivel.pergunta;

  const divOpcoes = document.getElementById('opcoes-codigo');
  divOpcoes.innerHTML = '';

  nivel.opcoes.forEach(opcao => {
    const botao = document.createElement('button');
    botao.classList.add('opcao-btn');
    botao.innerText = opcao;
    botao.onclick = () => verificarResposta(opcao, botao, nivel);
    divOpcoes.appendChild(botao);
  });
}

function verificarResposta(resposta, botaoClicado, nivel) {
  document.querySelectorAll('.opcao-btn').forEach(btn => btn.disabled = true);

  if (resposta === nivel.respostaCorreta) {
    botaoClicado.classList.add('correta');
    alert('CÓDIGO CORRETO! O problema foi resolvido.');
    aplicarEfeitoCorrecao(nivel.efeitoCorrecao);
    document.getElementById('proximo-btn').style.display = 'block';
  } else {
    botaoClicado.style.backgroundColor = 'salmon';
    alert('CÓDIGO INCORRETO! Tente outra opção.');
    document.querySelectorAll('.opcao-btn').forEach(btn => btn.disabled = false);
    botaoClicado.disabled = true;
  }
}

function aplicarEfeitoCorrecao(efeito) {
  if (!efeito || !efeito.seletor) return;
  const elemento = document.querySelector(efeito.seletor);
  if (!elemento) {
    console.warn('Seletor não encontrado:', efeito.seletor);
    return;
  }

  if (efeito.tipo === 'html') {
  elemento.insertAdjacentHTML("beforeend", efeito.codigo);
}
 else if (efeito.tipo === 'css') {
    elemento.style[efeito.propriedade] = efeito.valor;
  } else if (efeito.tipo === 'js-evento') {
    try {
      elemento[efeito.evento] = eval(efeito.codigo);
    } catch (e) {
      console.error('Erro ao aplicar evento JS:', e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const proximoBtn = document.getElementById('proximo-btn');
  proximoBtn.onclick = () => {
    nivelAtual++;
    if (nivelAtual < jogos.length) {
      carregarNivel();
    } else {
      document.getElementById('painel-controle').innerHTML = '<h2>Parabéns!</h2><p>Você concluiu o jogo!</p>';
      document.getElementById('painel-visualizacao').innerHTML = '<h2>Página Totalmente Funcional!</h2><p>Agora ocê pode testar os recursos que consertou criando sua própria página :)</p>';
    }
  };

  carregarJogos();
});
