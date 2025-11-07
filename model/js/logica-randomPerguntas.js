export async function randomizarPerguntas(cursos, curso_selec) {
    const niveis = cursos[curso_selec];
    const nivelRandom = niveis[Math.floor(Math.random() * niveis.length)];
    const perguntas = nivelRandom.perguntas;

    const perguntasAleatorias = perguntas
    .sort(() => Math.random() - 0.5) // Embaralha o array das perguntas
    .slice(0, 3); // Pega as três primeiras perguntas do array

    return {
    nivel: nivelRandom.id,
    descricao: nivelRandom.descricao,
    perguntas: perguntasAleatorias.map(p => ({
      texto: p[0],
      opcoes: p[1],
      gabarito: p[2]
    }))
  };
}