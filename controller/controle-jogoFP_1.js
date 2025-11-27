const carregar = document.getElementById('btnCarregar')
carregar.addEventListener('click', () => {
    const chave = document.getElementById('escolha').value;
    window.location.href = `jogoFP_2.html?situacao=${encodeURIComponent(chave)}`;
});