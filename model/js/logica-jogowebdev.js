let jogos = [];
let nivelAtual = 0;

const CODIGO_HTML_FINAL = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Página Final do Jogo</title>
    <style>
        /* CSS aplicado no Painel de Visualização */
        #painel-visualizacao {
            background-color: peachpuff;
            color: orange;
            font-size: 24px;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
        }
        #meu-botao {
            /* Estilos básicos para o botão */
            background-color: #333;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        /* Estilos adicionais para a mudança de cor do botão (Nível 9) */
        #meu-botao:hover {
            background-color: #555;
        }
    </style>
</head>
<body>
    <div id="painel-visualizacao">
        <h1>Minha Primeira Página</h1>
        <h3>Subtítulo</h3>
        
        <p>Este é um parágrafo de teste. Você pode testar se a cor da fonte, o tamanho e a cor de fundo funcionam.</p>
        
        <button id="meu-botao">Clique em Mim</button>
    </div>

    <script>
        // Níveis 3, 6 e 9 (JavaScript)

        const botao = document.querySelector('#meu-botao');
        
        // Aplicação da lógica de clique para todos os efeitos de uma vez
        botao.onclick = function() {
            // Nível 3: Alerta ao clicar
            alert('Parabéns, Você Clicou!');
            
            // Nível 6: Mudar o texto
            this.innerText = 'Clicado!'; 
            
            // Nível 9: Mudar a cor de fundo
            this.style.backgroundColor = 'orange';
        };
    </script>
</body>
</html>`;


function carregarJogos() { 
  try {
    const jsonString = `[
        {"id": 1,"topico": "HTML (Estrutura)","pergunta": "O título principal da página desapareceu! Qual linha de código HTML você deve escolher para que o título 'Minha Primeira Página' apareça como o cabeçalho principal?","opcoes": ["<h2>Minha Primeira Página</h2>","<h1>Minha Primeira Página</h1>","<p>Minha Primeira Página</p>"],"respostaCorreta": "<h1>Minha Primeira Página</h1>","efeitoCorrecao": {"tipo": "html","seletor": "#div-vazia-titulo","codigo": "<h1>Minha Primeira Página</h1>"}},
        {"id": 2,"topico": "CSS (Estilo)","pergunta": "O painel de visualização está sem cor! Aplique um estilo para mudar a cor de fundo (background-color) para 'peachpuff' (um tom suave que combina com laranja).","opcoes": ["style='background-color: red;'","style='font-size: 20px;'","style='background-color: peachpuff;'"],"respostaCorreta": "style='background-color: peachpuff;'","efeitoCorrecao": {"tipo": "css","seletor": "#painel-visualizacao","propriedade": "backgroundColor","valor": "peachpuff"}},
        {"id": 3,"topico": "JavaScript (Interatividade)","pergunta": "O botão 'Clique em Mim' precisa ser funcional. Qual código JavaScript você usaria para fazê-lo exibir 'Parabéns, Você Clicou!' quando for clicado?","opcoes": ["alert('Código Incorreto')","document.querySelector('#meu-botao').innerHTML = 'Clicado!';","document.querySelector('#meu-botao').onclick = () => alert('Parabéns, Você Clicou!');"],"respostaCorreta": "document.querySelector('#meu-botao').onclick = () => alert('Parabéns, Você Clicou!');","efeitoCorrecao": {"tipo": "js-evento","seletor": "#meu-botao","evento": "onclick","codigo": "() => alert('Parabéns, Você Clicou!')"}},
        {"id": 4,"topico": "CSS","pergunta": "Altere a cor do texto para laranja.","opcoes": ["color: blue;","color: orange;","color: red;"],"respostaCorreta": "color: orange;","efeitoCorrecao": {"tipo": "css","seletor": "#painel-visualizacao","propriedade": "color","valor": "orange"}},
        {"id": 5,"topico": "HTML","pergunta": "Adicione um subtítulo abaixo do título principal.","opcoes": ["<h1>Subtítulo</h1>","<h3>Subtítulo</h3>","<p>Subtítulo</p>"],"respostaCorreta": "<h3>Subtítulo</h3>","efeitoCorrecao": {"tipo": "html","seletor": "#div-vazia-titulo","codigo": "<h3>Subtítulo</h3>"}},
        {"id": 6,"topico": "JavaScript","pergunta": "Faça o botão exibir a mensagem 'Clicado!' ao ser pressionado.","opcoes": ["botao.innerText = 'Clicado!';","botao.style.color = 'orange';","botao.remove();"],"respostaCorreta": "botao.innerText = 'Clicado!';","efeitoCorrecao": {"tipo": "javascript","codigo": "document.querySelector('#meu-botao').innerText = 'Clicado!';"}},
        {"id": 7,"topico": "CSS","pergunta": "Aumente o tamanho do texto para 24px.","opcoes": ["font-size: 12px;","font-size: 24px;","font-size: 40px;"],"respostaCorreta": "font-size: 24px;","efeitoCorrecao": {"tipo": "css","seletor": "#painel-visualizacao","propriedade": "font-size","valor": "24px"}},
        {"id": 8,"topico": "HTML","pergunta": "Insira um parágrafo explicativo.","opcoes": ["<p>Olá Mundo!</p>","<p>Este é um parágrafo de teste.</p>","<span>Texto</span>"],"respostaCorreta": "<p>Este é um parágrafo de teste.</p>","efeitoCorrecao": {"tipo": "html","seletor": "#painel-visualizacao","conteudo": "<p>Este é um parágrafo de teste. Você pode testar se a cor da fonte, o tamanho e a cor de fundo funcionam.</p>"}},
        {"id": 9,"topico": "JavaScript","pergunta": "Faça o botão ficar laranja ao ser clicado.","opcoes": ["botao.style.backgroundColor = 'orange';","botao.style.border = 'none';","botao.innerText = 'Oi!';"],"respostaCorreta": "botao.style.backgroundColor = 'orange';","efeitoCorrecao": {"tipo": "javascript","codigo": "document.querySelector('#meu-botao').style.backgroundColor = 'orange';"}},
        {"id": 10,"topico": "CSS","pergunta": "Deixe os cantos arredondados.","opcoes": ["border-radius: 0;","border-radius: 10px;","border-inline:inherit;"],"respostaCorreta": "border-radius: 10px;","efeitoCorrecao": {"tipo": "css","seletor": "#painel-visualizacao","propriedade": "border-radius","valor": "10px"}}
    ]`;

    jogos = JSON.parse(jsonString);
    carregarNivel();
  } catch (error) {
    console.error('Erro ao carregar o JSON:', error);
    document.getElementById('pergunta-atual').innerText = 'Erro ao carregar o jogo. Veja o console.';
  }
}

function carregarNivel() {
  document.getElementById('proximo-btn').style.display = 'none';
  
  const codigoFinalDiv = document.getElementById('codigo-final');
  if (codigoFinalDiv) codigoFinalDiv.style.display = 'none';

  const nivel = jogos[nivelAtual];
  if (!nivel) {
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
  if (!efeito || (!efeito.seletor && efeito.tipo !== 'javascript')) return;

  if (efeito.tipo === 'javascript') {
    try {
        const botao = document.querySelector('#meu-botao');
       
        if (efeito.codigo.includes('botao.')) {
            eval(efeito.codigo.replace('botao.', 'document.querySelector("#meu-botao").'));
        } else {
            eval(efeito.codigo);
        }
      return;
    } catch (e) {
      console.error('Erro ao executar JS do nível:', e);
      return;
    }
  }

  const elemento = document.querySelector(efeito.seletor);
  if (!elemento) {
    return;
  }

  if (efeito.tipo === 'html') {
    const htmlParaAdicionar = efeito.conteudo || efeito.codigo;
    elemento.insertAdjacentHTML("beforeend", htmlParaAdicionar);
  } else if (efeito.tipo === 'css') {
    elemento.style[efeito.propriedade] = efeito.valor;
  } else if (efeito.tipo === 'js-evento') {
    try {
      elemento[efeito.evento] = eval(efeito.codigo);
    } catch (e) {
      console.error('Erro ao aplicar evento JS:', e);
    }
  }
}



function exibirCodigoFinal() {
    const painelControle = document.getElementById('painel-controle');
    
    
    if (painelControle) {
        painelControle.innerHTML = '<h2>Parabéns! Você concluiu o jogo!</h2><p>Abaixo está o código HTML completo gerado:</p>';
    }
    const painelVisualizacao = document.getElementById('painel-visualizacao');
    if (painelVisualizacao) {
        painelVisualizacao.innerHTML = '<h2>Jogo Concluído</h2><p>O resultado final é o código que você vê abaixo! Agora você pode fazer a sua própria página :)</p>';
    }

    
    let codigoFinalDiv = document.getElementById('codigo-final');
    if (!codigoFinalDiv) {
        
        codigoFinalDiv = document.createElement('div');
        codigoFinalDiv.id = 'codigo-final';
        
        const preElement = document.createElement('pre');
        preElement.id = 'codigo-html';
        
        codigoFinalDiv.innerHTML = `
            <hr>
            <h3>Código HTML Completo:</h3>
        `;
        codigoFinalDiv.appendChild(preElement);
        
        if (painelControle) {
        
            painelControle.appendChild(codigoFinalDiv);
        }
    }

 
 
    codigoFinalDiv.style.setProperty('display', 'block', 'important');
    
 
    const codigoHtmlElement = document.getElementById('codigo-html');
    if (codigoHtmlElement) {
 
        codigoHtmlElement.textContent = CODIGO_HTML_FINAL;
    }
}


document.addEventListener('DOMContentLoaded', () => {
  const proximoBtn = document.getElementById('proximo-btn');
  proximoBtn.onclick = () => {
    nivelAtual++;
    if (nivelAtual < jogos.length) {
      carregarNivel();
    } else {
 
      exibirCodigoFinal(); 
    }
  };

  carregarJogos();
});