# WEBSITE 2 — Experience Direction v1.0

> **Status:** Oficial
>
> **Escopo:** Direção de experiência (UX) do Website Institucional do Hub Tributário
>
> **Formato:** Documentação (Markdown) — não contém código, layout ou identidade visual
>
> **Finalidade:** Orientar Design, Motion Design, UX e Implementação na direção de experiência oficial

---

## 1. Visão Geral

Este documento estabelece **como o Website Institucional do Hub Tributário se comporta visualmente** e **quais sensações transmite ao visitante**. É a direção de experiência que orienta todas as futuras decisões de Design, Motion Design e Implementação.

A experiência deve parecer construída por um **Product Designer Sênior**: madura, decidida e sem exageros. Jamais como um template pronto ou um website claramente gerado por IA.

---

## 2. Missão da Experiência

O Website deve transmitir, em toda interação:

- **Confiança** — solidez e seriedade visíveis em cada elemento.
- **Inovação** — modernidade que se mostra pelo comportamento, não pelo espetáculo.
- **Organização** — clareza e ordem; o ritmo se percebe em cada seção.
- **Maturidade** — decisões de design contidas e bem executadas.
- **Qualidade** — acabamento premium percebido em cada detalhe.
- **Simplicidade** — leveza e facilidade; nada de complexidade desnecessária.

A experiência é **mínima e precisa**: cada movimento existe porque comunica algo.

---

## 3. Referências Conceituais

As referências servem apenas para compreender a **filosofia de design**. Não devem ser copiados layouts, componentes ou identidade visual.

| Referência | Filosofia adotada |
|---|---|
| **Raycast** | Motion Design — movimento rápido, funcional e que reforça o estado da interface |
| **Stripe** | Hierarquia visual — o conteúdo respira; o olhar é guiado com clareza |
| **Linear** | Tipografia e espaçamento — precisão tipográfica e ritmo espacial consistente |
| **Apple** | Narrativa — storytelling natural; cada etapa flui para a próxima |
| **Notion** | Clareza — informação sem poluição; foco no que importa |
| **Vercel** | Performance — leveza e eficiência percebidas na experiência |

> **Objetivo final:** uma identidade própria do Hub Tributário que combina clareza (Stripe e Notion), narrativa (Apple), precisão (Linear), eficiência (Vercel) e movimento funcional (Raycast).

---

## 4. Sensação Transmitida ao Longo da Página

A sensação do visitante deve evoluir conforme o ritmo da narrativa (ver WEBSITE-1-ARCHITECTURE.md):

| Seção | Sensação alvo |
|---|---|
| **Hero** | Acolhimento e impacto — "isto parece sério e interessante" |
| **Problema** | Reconhecimento — "isso é o que eu vivo todos os dias" |
| **Solução** | Esperança e clareza — "existe um caminho melhor" |
| **Como funciona** | Simplicidade — "é mais fácil do que eu imaginava" |
| **Benefícios** | Desejo — "quero isso para mim" |
| **Segurança** | Confiança — "posso confiar" |
| **Demonstração** | Prontidão — "quero conhecer agora" |
| **FAQ** | Acolhimento — "minhas dúvidas foram previstas" |
| **Contato** | Fechamento — "a porta continua aberta" |

---

## 5. Princípios de Experiência

1. **A experiência nunca compete com o conteúdo.** O design é o contexto; o conteúdo é o protagonista.
2. **O movimento reforça o entendimento.** Animar apenas quando isso ajuda a ler, compreender ou transicionar.
3. **Elegância acima de espetáculo.** Melhor um movimento sutil e bem executado do que um complexo e chamativo.
4. **Suavidade acima de velocidade.** Curvas de aceleração naturais; o olho nunca sofre um "tranco".
5. **Simplicidade acima de quantidade.** Menos movimento e mais foco produzem um resultado melhor.
6. **Consistência absoluta.** O mesmo elemento comporta-se da mesma forma em toda a página.
7. **Nada sem propósito.** Todo movimento possui uma justificativa funcional ou emocional.

---

## 6. Ritmo da Página

### 6.1 Início (Hero)

Sensação de **contenção e confiança**. O primeiro impacto não deve gritar; deve ser alto e leve. A entrada de elementos é sutil e quase imperceptível. O visitante conclui a leitura com uma única pergunta: "quero saber mais".

### 6.2 Desenvolvimento (Problema → Benefícios)

Sensação de **fluidez progressiva**. Cada seção nasce da anterior; o scroll é confortável e sem atrito. A animação aqui é discreta: o conteúdo se revela com o avanço da página, em ritmo que acompanha a leitura natural.

### 6.3 Encerramento (Segurança → Demonstração → Contato)

Sensação de **culminância e repouso**. A Demonstração concentra a energia da página (a ação principal), enquanto o FAQ e o Contato acalmam o ritmo. A página termina sem pressa, deixando o visitante com uma próxima ação clara.

---

## 7. Microinterações por Superfície

Regras comuns a todas as microinterações:

- **Preferir transformações de posição, escala e opacidade** — as mais naturais e performáticas.
- **Cadernos de feedback:** hover, foco, ativo e estados vazios sempre distinguidos.
- **Resposta imediata, evolução suave** — o início do feedback é instantâneo; a evolução é fluida.

| Superfície | Direção |
|---|---|
| **Botões** | Hover claro e ativo nítido; nunca há espera para o feedback |
| **Cards** | Elevação e deslocamento sutis no hover; nada de animações pesadas |
| **Links** | Transição elegante de cor e sublinhado; suavidade nas trocas de estado |
| **FAQ** | Expansão fluida, dimensionada pelo conteúdo e acompanhada de leve movimento de ícone |
| **Navegação** | Destaque discreto da ação principal; foco claro em todos os itens |
| **Ícones** | Movimento curto e preciso; rotação e deslocamento no estado de abertura |
| **Elementos interativos** | Feedback visual sempre presente; jamais a troca seca de estado |

---

## 8. Quando Utilizar e Quando Evitar Animações

### Utilizar quando

- O movimento **reduz custo cognitivo** (um elemento entra no lugar de onde vem).
- O movimento **informa o estado** (algo começou, concluiu, expandiu).
- O movimento **conduza a atenção para o que muda** (nova seção, novo dado).

### Evitar quando

- O conteúdo é **denso** — texto deve permanecer estável.
- O movimento é **contínuo ou repetitivo** — cansa e polui.
- O movimento **não tem motivo** — é decoração, não comunicação.
- O elemento é **operativo** — o progresso é comunicado por estado, não por animação decorativa.
- O movimento **atrasa ou atrapalha** a leitura ou a ação.

---

## 9. Restrições Estéticas (Anti-Padrões)

A experiência deve **evitar expressamente**:

- Excesso de **glow** (brilho) sem propósito.
- **Gradientes exagerados** e sem direção definida.
- **Glassmorphism pesado** e desproporcionado.
- **Animações constantes** que impeçam o repouso visual.
- **Efeitos chamativos** sem justificativa funcional ou emocional.
- Estética **"gerada por IA"** e genérica.
- Visual comum de **Landing Page SaaS genérica**.

---

## 10. Caminho até a Conversão

| Momento | Estratégia |
|---|---|
| **Chegada** | Rápida, clara, sem sobrecarga; contenção transmite segurança |
| **Leitura** | Ritmo confortável; nenhuma seção apressa o visitante |
| **Ação** | CTA claro e sempre acessível; o caminho até a demonstração é óbvio |

---

## 11. Critérios de Aceite

- [ ] Existir uma direção de experiência oficial para o Website.
- [ ] A missão e as sensações esperadas estarem formalizadas.
- [ ] Os princípios e as referências conceituais estarem documentados.
- [ ] O ritmo da página (início, desenvolvimento, encerramento) estar definido.
- [ ] As orientações de microinterações e as regras de quando evitar animações estarem definidas.
- [ ] As restrições estéticas estarem formalizadas.
- [ ] A direção bastar para orientar Motion Design, Design, UX e Implementação com identidade premium, elegante e atemporal.