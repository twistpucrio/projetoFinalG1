export const state = {
// guarda decisões importantes que as próximas cenas vão checar
    senha: null,
    fezBackup: false,
    arquivosCriptografados: false,
    firewallConfig: [],
    score: 0
};


// Cada cena tem: id, title (opcional), text (string ou array de parágrafos),
// options: lista de ações { label, next } ou { label, action } para ações JS.
export const scenes = {
    intro: {
        id: 'intro',
        title: 'Boas-vindas!',
        text: [
            'Você foi selecionado(a) para gerir uma startup tech.',
            'Sua missão: manter a empresa segura enquanto cresce. Nem todos os dias serão fáceis — hackers adoram startups promissoras!',
            'Mas não se preocupe, meu nome é Nia, expert em segurança cibernética, e vou te ajudar neste desafio.'
        ],
        // opção segue para a próxima cena (ainda não implementada aqui): 'senha'
        options: [
            { label: 'Começar a jornada!', next: 'senha' },
            { label: 'Quero aprender primeiro (dica rápida)', next: 'dica' }
        ]
    },


    // cenas placeholder (apenas IDs para navegar). Não incluem lógica/markup nessa entrega.
    senha: {
        id: 'senha',
        title: 'Criação de Senha',
        text: [
            'Sua startup acabou de ser criada!',
            'Antes de começar, você precisa definir a senha principal do sistema.',
            'Escolha entre as opções abaixo — mas cuidado: algumas são fáceis demais para hackers.'
        ],
        options: [
            {
                label: "Fenix#Start_49!",
                action: (state) => {
                    state.senha = "forte";
                    state.score += 15;
                },
                next: "resultadoSenha"
            },
            {
                label: "1234Empresa",
                action: (state) => {
                    state.senha = "fraca";
                    state.score -= 10;
                },
                next: "resultadoSenha"
            },
            {
                label: "Empresa2025!",
                action: (state) => {
                    state.senha = "media";
                    state.score += 5;
                },
                next: "resultadoSenha"
            }
        ]
    },

    resultadoSenha: {
        id: "resultadoSenha",
        title: "Consequência da Senha",
        text: (state) => {
            if (state.senha === "fraca") {
                return [
                    "🔴 Sua senha era extremamente fraca!",
                    "Um hacker entrou no sistema em menos de 5 segundos.",
                    "Isso vai custar caro para sua startup…"
                ];
            }

            if (state.senha === "media") {
                return [
                    "🟡 Sua senha é razoável.",
                    "Ela resistiu a ataques básicos, mas hackers mais experientes podem quebrá-la.",
                    "Você pode melhorar isso depois."
                ];
            }

            return [
                "🟢 Excelente escolha!",
                "Sua senha é forte e resistente a ataques de força bruta.",
                "Sua startup começa sua jornada mais protegida."
            ];
        },
        options: [
            { label: "Continuar", next: "phishing" },
            { label: "Voltar ao início", next: "intro" }
        ]
    },

    phishing: {
        id: "phishing",
        title: "Possível Ataque de Phishing",
        text: [
            "Você recebe um e-mail com o assunto:",
            "'Parabéns! Você ganhou um brinde exclusivo da TechCorp!'",
            "O e-mail contém um link chamativo e um anexo duvidoso.",
            "O que você faz?"
        ],
        options: [
            {
                label: "Clico no link",
                action: (state) => {
                    state.score -= 20;
                    state.phishing = "clicou";
                },
                next: "resultadoPhishing"
            },
            {
                label: "Ignoro e sigo meu dia",
                action: (state) => {
                    state.score += 0; // neutro
                    state.phishing = "ignorou";
                },
                next: "resultadoPhishing"
            },
            {
                label: "Denuncio como phishing",
                action: (state) => {
                    state.score += 15;
                    state.phishing = "denunciou";
                },
                next: "resultadoPhishing"
            }
        ]
    },

    // --- RESULTADO DO PHISHING ---
    resultadoPhishing: {
        id: "resultadoPhishing",
        title: "Resultado do E-mail Suspeito",
        text: (state) => {
            if (state.phishing === "clicou") {
                return [
                    "🔴 Você clicou no link...",
                    "O site era falso e tentou instalar malware no sistema.",
                    "Felizmente o navegador bloqueou parte do ataque, mas sua startup ficou vulnerável."
                ];
            }

            if (state.phishing === "ignorou") {
                return [
                    "🟡 Você ignorou o e-mail...",
                    "Nada de ruim aconteceu, mas também não ajudou a treinar o sistema.",
                    "Fique atento(a) — ataques podem ser bem mais convincentes!"
                ];
            }

            return [
                "🟢 Excelente decisão!",
                "Você denunciou o e-mail como phishing.",
                "Isso ajuda a treinar filtros e protege outras pessoas da sua startup."
            ];
        },
        options: [
            { label: "Continuar para segurança de rede", next: "firewall" },
            { label: "Voltar ao início", next: "intro" }
        ]
    },

    // --- PLACEHOLDER DE FIREWALL (próxima cena de verdade que faremos) ---
    firewall: {
        id: "firewall",
        title: "Configuração do Firewall",
        text: [
            "🧱 Sua startup acaba de lançar uma API que está exposta na internet.",
            "Para evitar ataques externos, você precisa configurar o firewall.",
            "Escolha como proteger seu sistema:"
        ],
        options: [
            {
                label: "Desativar o firewall (libera tudo)",
                next: "resultadoFirewall",
                action: (state) => state.firewall = "desativado"
            },
            {
                label: "Ativar firewall avançado e configurar somente portas necessárias",
                next: "resultadoFirewall",
                action: (state) => state.firewall = "avancado"
            },
            {
                label: "Ativar firewall básico (bloqueia poucas portas)",
                next: "resultadoFirewall",
                action: (state) => state.firewall = "basico"
            }
        ]
    },

    resultadoFirewall: {
        id: "resultadoFirewall",
        title: "Resultado da Configuração do Firewall",
        text: (state) => {
            switch (state.firewall) {
                case "desativado":
                    return [
                        "🔴 Você desativou o firewall.",
                        "Em menos de 2 minutos, bots do mundo inteiro começaram a escanear sua API.",
                        "Um atacante conseguiu acesso à sua base de dados sem muito esforço."
                    ];

                case "basico":
                    return [
                        "🟡 Você ativou um firewall básico.",
                        "Isso bloqueou alguns ataques automatizados, mas ainda deixou portas sensíveis expostas.",
                        "Sua startup recebeu tentativas constantes de invasão. Quase deu ruim!"
                    ];

                case "avancado":
                    return [
                        "🟢 Parabéns!",
                        "Você ativou um firewall avançado, liberando apenas portas essenciais (80/443).",
                        "Sua API está protegida contra scanners, varreduras agressivas e acessos não autorizados.",
                        "Sua startup ficou bem mais segura graças a você."
                    ];
            }
        },
        options: [
            { label: "Continuar", next: "backup" }, // depois me fala qual será
            { label: "Voltar ao início", next: "intro" }
        ]
    },

    backup: {
        id: 'backup',
        title: 'Backup dos Arquivos',
        text: [
            'Durante a manhã, o servidor começa a apresentar lentidão e você recebe um aviso de possível falha em disco.',
            'Se seus dados não estiverem protegidos… você pode perder tudo.',
            'Qual estratégia de backup você escolhe para sua startup?'
        ],
        options: [
            {
                label: 'Fazer backup apenas quando der problema',
                action: (state) => {
                    alert('Risco alto! Se o problema ocorrer antes do backup, seus dados podem ser perdidos.');
                    state.fezBackup = false;
                    state.score -= 5;
                },
                next: 'final' // ou a próxima cena que você quiser
            },
            {
                label: 'Manter backup semanal automático',
                action: (state) => {
                    alert('Excelente! Isso protege seus dados de forma consistente.');
                    state.fezBackup = true;
                    state.score += 10;
                },
                next: 'final'
            },
            {
                label: 'Não fazer nenhum backup',
                action: (state) => {
                    alert('Decisão perigosa! Uma falha simples pode te fazer perder tudo.');
                    state.fezBackup = false;
                    state.score -= 10;
                },
                next: 'final'
            }
        ]
    },

    final: {
        id: 'final',
        title: 'Missão Concluída!',
        text: (state) => {
            let avaliacao = "";

            if (state.score >= 30) {
                avaliacao = "🟢 Incrível! Sua startup está segura graças às suas escolhas inteligentes.";
            } else if (state.score >= 10) {
                avaliacao = "🟡 Nada mal! Sua startup está razoavelmente protegida, mas ainda há espaço para melhorar.";
            } else {
                avaliacao = "🔴 Sua startup ficou vulnerável… mas o importante é aprender e tentar de novo!";
            }

            return [
                "Você chegou ao fim da simulação!",
                `Pontuação final: **${state.score} pontos**`,
                avaliacao,
                "Obrigado(a) por jogar e aprender sobre segurança cibernética! 🛡️"
            ];
        },
        options: [
            { label: "Jogar novamente", next: "intro" }
        ]
    },

    // ... continua

    dica: {
        id: 'dica',
        title: 'Dica rápida',
        text: [
            'Dica: senhas longas e únicas e backups regulares salvam startups.',
            'No jogo você verá consequências diretas das suas escolhas.'
        ],
        options: [{ label: 'Pronto, vamos!', next: 'senha' }, { label: 'Voltar', next: 'intro' }]
    }
};


export function getScene(id) {
    return scenes[id];
}

