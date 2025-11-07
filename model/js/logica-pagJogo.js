// "export" é o mesmo que dizer: "Esta função pode ser usada em outro arquivo que fizer o import dela."
// Uma função async serve pra lidar com operações assíncronas, isto é, que demoram (como buscar um JSON, esperar resposta de servidor, ler arquivo...)

export async function carregarDados(DATA_URL) {
  const resp = await fetch(DATA_URL);
  if (!resp.ok) throw new Error("Não foi possível carregar o JSON."); // Ação assíncrona
  return await resp.json();
}

export function personagemURL() {
  const sp = new URLSearchParams(window.location.search);
  return sp.get("personagem");
}

export function cursoURL() {
  const sp = new URLSearchParams(window.location.search);
  return sp.get("curso");
}
