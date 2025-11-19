// --- REFERÊNCIAS ---
const painel = document.getElementById("imagens");
const imagensPainel = document.querySelectorAll("#imagens img");
const slots = document.querySelectorAll(".slot");

// Guarda como o painel estava no início
const estadoInicialPainel = painel.innerHTML;

let dragged = null;
let slotOrigem = null;

// --- ARRASTAR DO PAINEL ---
function adicionarEventoDragPainel(img) {
    img.addEventListener("dragstart", e => {
        dragged = img;
        slotOrigem = null; // veio do painel
        e.dataTransfer.setData("id", img.dataset.id);
        e.dataTransfer.setData("src", img.src);
    });
}

imagensPainel.forEach(img => adicionarEventoDragPainel(img));


// --- ARRASTAR DE UM SLOT ---
slots.forEach(slot => {
    slot.addEventListener("dragstart", e => {
        if (e.target.tagName === "IMG") {
            dragged = e.target;
            slotOrigem = slot;
            e.dataTransfer.setData("id", dragged.dataset.id);
            e.dataTransfer.setData("src", dragged.src);
        }
    });
});


// --- PERMITIR DROP NOS SLOTS ---
slots.forEach(slot => {
    slot.addEventListener("dragover", e => e.preventDefault());

    slot.addEventListener("drop", e => {
        e.preventDefault();

        const id = e.dataTransfer.getData("id");

        // Se a imagem estava em outro slot, limpa o slot anterior
        if (slotOrigem) {
            slotOrigem.innerHTML = "";
            slotOrigem.classList.remove("correto", "errado");
        }

        // Coloca a imagem no slot atual
        slot.innerHTML = "";
        slot.appendChild(dragged);

        // Verifica acerto
        if (id === slot.dataset.aceita) {
            slot.classList.add("correto");
            slot.classList.remove("errado");
        } else {
            slot.classList.add("errado");
            slot.classList.remove("correto");
        }
    });
});


// --- BOTÃO RESETAR ---
document.getElementById("resetar").addEventListener("click", () => {

    // 1. Limpa todos os slots
    slots.forEach(slot => {
        slot.innerHTML = "";
        slot.classList.remove("correto", "errado");
    });

    // 2. Restaura o painel original
    painel.innerHTML = estadoInicialPainel;

    // 3. Reaplica eventos de arrastar nas imagens restauradas
    const novasImagens = painel.querySelectorAll("img");
    novasImagens.forEach(img => adicionarEventoDragPainel(img));

    // 4. Reset das variáveis internas
    dragged = null;
    slotOrigem = null;
});
