// ELEMENTOS
const $destino = document.getElementById("destino");
const $passagem = document.getElementById("passagem");
const $noite = document.getElementById("noite");
const $hospedagem = document.getElementById("hospedagem");
const $alimentacao = document.getElementById("alimentacao");

const $btnCalc = document.getElementById("btnCalc");
const $btnReset = document.getElementById("btnReset");

const $status = document.getElementById("status");

const $barDestino = document.getElementById("barDestino");
const $barHospedagem = document.getElementById("barHospedagem");
const $barAlimentacao = document.getElementById("barAlimentacao");

const $barDestinoVal = document.getElementById("barDestinoVal");
const $barHospedagemVal = document.getElementById("barHospedagemVal");
const $barAlimentacaoVal = document.getElementById("barAlimentacaoVal");

const $summaryBody = document.getElementById("summaryBody");
const $totalCell = document.getElementById("totalCell");
const $saldoCell = document.getElementById("saldoCell");

let ORCAMENTO_ATUAL = 0;

// GERA ORÇAMENTO BASEADO NO DESTINO
function gerarOrcamentoPorDestino(destino) {
  let base = 0;

  if (destino === "São Paulo") base = 2000;
  if (destino === "Buenos Aires") base = 5000;
  if (destino === "Nova York") base = 9000;

  const variacao = Math.floor(Math.random() * 2000);
  return base + variacao;
}

// RESET
function resetar() {
  ORCAMENTO_ATUAL = 0;

  document.getElementById("orcamento").textContent =
    `Escolha um destino para gerar o orçamento.`;

  $destino.selectedIndex = 0;
  $passagem.selectedIndex = 0;
  $noite.selectedIndex = 0;
  $hospedagem.selectedIndex = 0;
  $alimentacao.selectedIndex = 0;

  $passagem.disabled = true;
  $noite.disabled = true;
  $hospedagem.disabled = true;
  $alimentacao.disabled = true;

  updateBars(0, 0, 0);
  updateSummary([], 0, 0);

  $status.textContent = "Faça suas escolhas e clique em “Verificar”.";
  $status.style.borderColor = "#25304a";
  $status.style.background = "#0b1020";
}

// LEITURA DAS OPÇÕES
function readOption(selectEl) {
  const value = parseInt(selectEl.value);
  const label = selectEl.options[selectEl.selectedIndex]?.dataset.label || "";
  return { value, label };
}

// BARRAS
function updateBars(passagem, hospedagem, alimentacao) {
  if (ORCAMENTO_ATUAL <= 0) return;

  const toPercent = v => Math.min(100, Math.round((v / ORCAMENTO_ATUAL) * 100));

  $barDestino.style.width = `${toPercent(passagem)}%`;
  $barHospedagem.style.width = `${toPercent(hospedagem)}%`;
  $barAlimentacao.style.width = `${toPercent(alimentacao)}%`;

  $barDestinoVal.textContent = `R$ ${passagem}`;
  $barHospedagemVal.textContent = `R$ ${hospedagem}`;
  $barAlimentacaoVal.textContent = `R$ ${alimentacao}`;
}

// TABELA DE RESUMO
function updateSummary(rows, total, saldo) {
  $summaryBody.innerHTML = "";

  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.categoria}</td>
      <td>${r.escolha}</td>
      <td>R$ ${r.custo}</td>
    `;
    $summaryBody.appendChild(tr);
  });

  $totalCell.textContent = `R$ ${total}`;
  $saldoCell.textContent = `R$ ${saldo}`;
}

// CÁLCULO FINAL
function calcular() {
  if (ORCAMENTO_ATUAL <= 0) {
    alert("Escolha um destino primeiro!");
    return;
  }

  const d = readOption($destino);
  const p = readOption($passagem);
  const h = readOption($hospedagem);
  const a = readOption($alimentacao);

  const noites = parseInt($noite.value) || 0;
  const hospedagemTotal = h.value * noites;   // ← CORREÇÃO AQUI

  const total = d.value + p.value + hospedagemTotal + a.value;
  const saldo = ORCAMENTO_ATUAL - total;

  // Atualiza gráfico com valores reais
  updateBars(p.value, hospedagemTotal, a.value);

  updateSummary([
    { categoria: "Destino", escolha: d.label, custo: d.value },
    { categoria: "Passagem (ida e volta)", escolha: p.label, custo: p.value },
    { categoria: "Hospedagem", escolha: `${h.label} × ${noites} noites`, custo: hospedagemTotal },
    { categoria: "Alimentação", escolha: a.label, custo: a.value }
  ], total, saldo);

  const dentro = total <= ORCAMENTO_ATUAL;
  $status.textContent = dentro
    ? "Boa decisão: suas escolhas cabem no orçamento!"
    : "Orçamento estourado: ajuste suas escolhas.";

  $status.style.borderColor = dentro ? "rgba(16,185,129,.4)" : "rgba(239,68,68,.4)";
  $status.style.background = dentro ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)";
}

// REGRAS DE DEPENDÊNCIA
$destino.addEventListener("change", () => {
  if ($destino.selectedIndex > 0) {

    const destino = $destino.selectedOptions[0].dataset.label;
    ORCAMENTO_ATUAL = gerarOrcamentoPorDestino(destino);

    document.getElementById("orcamento").textContent =
      `Orçamento disponível: R$ ${ORCAMENTO_ATUAL}`;

    $passagem.disabled = false;
    $noite.disabled = false;
  }
});

$noite.addEventListener("change", () => {
  if ($noite.selectedIndex > 0) {
    $hospedagem.disabled = false;
  }
});

$hospedagem.addEventListener("change", () => {
  if ($hospedagem.selectedIndex > 0) {
    $alimentacao.disabled = false;
  }
});

// EVENTOS
$btnCalc.addEventListener("click", calcular);
$btnReset.addEventListener("click", resetar);

// INICIALIZAÇÃO
resetar();
