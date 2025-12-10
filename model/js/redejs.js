document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleciona todos os botões de "Ver Perfil"
    const botoesAbrir = document.querySelectorAll('.btn-modal');
    // 2. Seleciona todos os elementos de fechar (o 'x')
    const botoesFechar = document.querySelectorAll('.fechar-modal');
    
    // 3. Adiciona evento para abrir o modal
    botoesAbrir.forEach(botao => {
        botao.addEventListener('click', () => {
            // Pega o ID do modal do atributo data-modal-target
            const targetId = botao.getAttribute('data-modal-target');
            const modal = document.querySelector(targetId);
            
            // Adiciona a classe 'visivel' (que tem display: block no CSS)
            if (modal) {
                modal.classList.add('visivel');
            }
        });
    });

    // 4. Adiciona evento para fechar o modal (clicando no 'x')
    botoesFechar.forEach(span => {
        span.addEventListener('click', () => {
            // O pai do <span> é o .modal-conteudo, e o avô é o .modal
            const modal = span.closest('.modal');
            if (modal) {
                modal.classList.remove('visivel');
            }
        });
    });

    // 5. Fecha o modal se o usuário clicar fora da caixa do modal
    window.addEventListener('click', (event) => {
        // Verifica se o elemento clicado é um dos modais abertos
        if (event.target.classList.contains('modal')) {
             event.target.classList.remove('visivel');
        }
    });

    // 6. Fecha o modal se o usuário pressionar a tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const modalVisivel = document.querySelector('.modal.visivel');
            if (modalVisivel) {
                modalVisivel.classList.remove('visivel');
            }
        }
    });

});