# AI Instructions v1.0

> **Status:** Oficial — regras obrigatórias de conduta para qualquer IA que atue no projeto
>
> **Finalidade:** Formalizar comportamentos que protegem a identidade, a arquitetura, a organização e a segurança do Hub Tributário e de sua documentação.

---

## 1. Regras Absolutas

1. **NUNCA contradizer documento oficial.** Todo documento novo declara a base obrigatória dos anteriores e não pode divergir deles.
2. **NUNCA inventar arquitetura.** Se algo não está documentado (ex.: detalhes técnicos de Multiempresa), diga que não está documentado e solicite a fonte do repositório principal. Não suponha, não complete, não invente.
3. **NUNCA gerar código, layout, wireframe, componente ou identidade visual antes da documentação aprovada.** A cadeia é: Arquitetura → Documentação → Review → Design → Implementação → Validação → Deploy (AI-WORKFLOW.md).
4. **Preservar o DNA do Hub.** A voz é sempre a do "especialista sereno": calmo, preciso, sóbrio, moderno sem modismo, acessível, seguro. Qualquer conteúdo, design ou feature deve passar por esse filtro.
5. **Preservar simplicidade.** Menos é mais. Se algo pode ser removido sem perda de comunicação, ele deve ser removido (regra de ouro).
6. **Preservar organização.** Estrutura, tokens, grids, escala única de espaço, hierarquia — nenhum valor solto, nenhum padrão sem token.
7. **Preservar segurança.** Dados, conformidade e acessibilidade são inegociáveis (WCAG 2.1 AA, foco de teclado, estados nunca só por cor).
8. **Solicitar contexto adicional quando necessário.** Se a tarefa exige informação que não está na documentação fornecida (repositório, Commercial Framework, Executive Overview), peça antes de criar.

---

## 2. Regras de Trabalho

| Regra | Aplicação |
|---|---|
| Contexto mínimo | Use AI-PROJECT-CONTEXT.md + apenas os docs específicos da sprint. Não reenviar a documentação inteira. |
| Precedência | Ao conflitar, vale a ordem de AI-DOCUMENT-HIERARCHY.md: documento de origem vence o resumo. |
| Formas permitidas | Documentação, síntese e decisões registradas. Propostas visuais só depois do Freeze e dentro do checklist. |
| Código | Só em fases de Implementação após Documentação + Review da fase. Nunca "antes". |
| Tom do documento | Mesmo tom do projeto: objetivo, preciso, sem exageros, sem promessas falsas. Em português, atemporal. |
| Registro | Decisões que alteram estratégia congelada passam por revisão arquitetural (ver AI-WORKFLOW.md). |
| Proteção de decisões | Não transformar decisões definidas e congeladas em tema de discussão — provocar revisão formal se necessário. |

---

## 3. Autoria

| Regra | Detalhe |
|---|---|
| Não faça | Não reescrever decisões oficiais, contradizer, copiar visual/referências, gerar material não aprovado ou fora do escopo, afirmar fatos não documentados. |
| Faça | Sintetizar, organizar, preservar o DNA, apontar lacunas, decidir só o previsto na sprint, respeitar o freeze. |

---

## 4. Processo de divergência

- Indicar qual documento(s) conflita(m).
- Registrar qual prevalece (ordem da hierarquia).
- Provocar a atualização da documentação da sprint (nova versão, nunca silenciosa).
- Se a divergência vier de um terreno não documentado: pedir a fonte principal do repo.

---

## Critério de aceite

- [ ] Qualquer produção de IA (resposta, código, design, copy) deve aplicar o comportamento acima sem exceção.