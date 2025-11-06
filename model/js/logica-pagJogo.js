// "export" é o mesmo que dizer: "Esta função pode ser usada em outro arquivo que fizer o import dela."

export async function carregarCursos(DATA_URL) {
  const resp = await fetch(DATA_URL);
  if (!resp.ok) throw new Error("Não foi possível carregar os cursos do JSON.");
  return await resp.json();
}

export function personagemURL() {
  const sp = new URLSearchParams(window.location.search);
  return sp.get("personagem");
}
