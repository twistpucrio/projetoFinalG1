const carregar = document.getElementById('btnCarregar')
carregar.addEventListener('click', () => {
    const chave = document.getElementById('escolha').value;
    window.location.href = `jogoFP_2.html?situacao=${encodeURIComponent(chave)}`;
});

const select = document.getElementById("escolha");
const img = document.getElementById("img-prato");

select.addEventListener("change", () => {
  const valor = select.value;

  if (valor === "sanduiche") {
    img.src = "../img/lara_sanduiche.png";
  } else if (valor === "nada"){
    img.src = "../img/lara_feliz.png";
  } else if (valor === "omelete") {
    img.src = "../img/lara_omelete.png";
  }
});
