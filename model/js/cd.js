//codigo padrão para montar a tabela no JSON


function tabelaParaJSON(idTabela) {
  const tabela = document.getElementById(idTabela);
  if (!tabela) {
    console.error(`Tabela com id "${idTabela}" não encontrada.`);
    return [];
  }

  const ths = tabela.querySelectorAll("thead th");
  const linhas = tabela.querySelectorAll("tbody tr");

  // Captura os títulos (cabeçalhos)
  const cabecalhos = Array.from(ths).map(th => th.textContent.trim());

  // Mapeia cada linha para um objeto usando os cabeçalhos
  const dados = Array.from(linhas).map(linha => {
    const colunas = linha.querySelectorAll("td");
    const item = {};

    cabecalhos.forEach((chave, i) => {
      let valor = colunas[i]?.textContent.trim() ?? "";
      // Converte números automaticamente, se for o caso
      if (!isNaN(valor) && valor !== "") valor = Number(valor);
      item[chave] = valor;
    });

    return item;
  });

  return dados;
}

// Exemplo de uso:
const resultado = tabelaParaJSON("tabela-dados");
console.log(JSON.stringify(resultado, null, 2));
