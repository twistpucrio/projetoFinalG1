document.addEventListener("DOMContentLoaded", () => {
    // Descobre o nível atual (ex: "1" ou "2")
    const nivel = document.body.dataset.nivel;

    // Referências
    const botao = document.getElementById("btn-analisar");
    const resultado = document.getElementById("resultado");

    if (!botao || !resultado) return;

    // Impede que o botão dentro de <form> recarregue a página
    botao.addEventListener("click", e => e.preventDefault());
    const niveis = {
        1: {
            perguntas: {
                p1: {
                    correta: "clima",
                    feedbacks: {
                        clima: "Correto! Está mais quente na sexta, e os alunos preferem salgados e sucos.",
                        fimdesemana: "Parcialmente certo! O clima ajuda, mas o calor é o principal fator.",
                        promo: "Não exatamente! A promoção não aparece nos dados."
                    }
                },
                p2: {
                    correta: "quente",
                    feedbacks: {
                        quente: "Correto! Nos dias mais quentes, como quinta e sexta, há mais sucos.",
                        igual: "Quase! Há uma leve diferença, observe os dias.",
                        frio: "Quando está frio, vendem menos sucos."
                    }
                },
                p3: {
                    correta: "pastel",
                    feedbacks: {
                        pastel: "Correto! O pastel é o mais popular, principalmente na sexta.",
                        paodequeijo: "Parcialmente certo! É popular, mas o pastel ganha no total.",
                        coxinha: "Não, a coxinha aparece menos nas vendas."
                    }
                }
            }
        },
        2: {
            perguntas: {
                p1: {
                    correta: "clima",
                    feedbacks: {
                        clima: "Correto! Quando o tempo está bom, mais alunos vêm de bicicleta.",
                        sexta: "Quase lá! Há mais bicicletas na sexta, mas por causa do clima.",
                        chuva: "Ops! Quando chove, há menos bicicletas, não mais."
                    }
                },
                p2: {
                    correta: "clima",
                    feedbacks: {
                        clima: "Correto! O clima ensolarado e quente aumenta o uso de bicicletas.",
                        sexta: "Quase! Sexta ajuda, mas o fator principal é o clima.",
                        chuva: "Não, quando chove, há menos bicicletas."
                    }
                },
                p3: {
                    correta: "menos",
                    feedbacks: {
                        menos: "Certo! A chuva reduziria o número de bicicletas.",
                        mais: "Não, a chuva costuma diminuir o uso de bicicleta.",
                        nenhuma: "Observe os dados — o clima claramente tem influência."
                    }
                }

            }
        }
    }

    botao.addEventListener("click", () => {
        const dadosNivel = niveis[nivel];
        if (!dadosNivel) return;

        const perguntas = dadosNivel.perguntas;
        let acertos = 0;
        let total = Object.keys(perguntas).length;
        let feedbackHTML = "";

        for (let chave in perguntas) {
            const p = perguntas[chave];
            // busca o input selecionado, mesmo que esteja em formulários diferentes
            const selecionada = document.querySelector(`input[name="${chave}"]:checked`);

            if (!selecionada) {
                feedbackHTML += `⚠️ Você não respondeu à pergunta ${chave.replace("p", "")}.<br>`;
                continue;
            }

            const fb = p.feedbacks[selecionada.value] || "Sem feedback.";
            feedbackHTML += `<strong>Pergunta ${chave.replace("p", "")}:</strong> ${fb}<br>`;

            if (selecionada.value === p.correta) acertos++;
        }

        resultado.innerHTML = `
            <h3>Você acertou ${acertos} de ${total} perguntas!</h3>
            ${feedbackHTML}
        `;

        // Botão de próximo nível (só aparece se acertar tudo)
        if (acertos === total && !document.getElementById("btn-proximo")) {
            const botaoProximo = document.createElement("button");
            botaoProximo.id = "btn-proximo";
            botaoProximo.textContent = "Próximo Nível";

            const proximoNivel = Number(nivel) + 1;
            botaoProximo.addEventListener("click", () => {
                window.location.href = `cd${proximoNivel}.html`;
            });

            resultado.insertAdjacentElement("afterend", botaoProximo);
        }
    });
});
