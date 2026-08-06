# WEBSITE 4.5 — Creative Brief Master v1.0

> **Status:** Oficial — referência master para qualquer trabalho futuro de Design, UX, Motion ou Direção de Arte
>
> **Escopo:** consolidação integral da estratégia do Website Institucional do Hub Tributário (WEBSITE 1, 2, 2.5, 3 e 4)
>
> **Formato:** Documentação (Markdown) — este documento NÃO cria layout, telas, componentes, HTML, CSS ou JavaScript
>
> **Base obrigatória:** WEBSITE 1 · WEBSITE 2 · WEBSITE 2.5 · WEBSITE 3 · WEBSITE 4 · Executive Overview · Commercial Framework
>
> **Regra:** este documento consolida e organiza decisões já aprovadas — **não cria decisões novas** e jamais contradiz qualquer documento anterior. Em divergência de detalhe, o documento de origem prevalece.
>
> **Finalidade:** orientar integralmente o Claude e qualquer designer na criação de conceitos visuais premium, preservando integralmente a identidade do Hub Tributário.

---

## 1. Missão

- Despertar interesse pela plataforma em poucos segundos (menos de 10).
- Transmitir credibilidade por clareza, organização e acabamento.
- Apresentar o Hub — o que é, para quem é, por que existe.
- Explicar o propósito — organização e inteligência tributária.
- Gerar contatos qualificados.
- Converter visitantes em **demonstrações** — a única ação principal.

**Missão transversal do conteúdo:** *o Website constrói confiança antes de vender.* O Website **não vende sozinho** — constrói confiança antes de qualquer pedido.

## 2. Público

Visitantes são decisores e influenciadores do mundo tributário e financeiro:

| Perfil | Dor principal | Busca |
|---|---|---|
| **Escritórios de Contabilidade** | Volume, retrabalho, risco de erro | Redução de custo e escala |
| **Empresas de Consultoria** | Falta de padrão e estrutura | Eficiência e padronização |
| **Gestores** | Sem visão de prazos e status | Controle e previsibilidade |
| **Sócios** | Exposição ao risco fiscal | Segurança e decisão informada |
| **Diretores** | Risco reputacional e financeiro | Confiança institucional |
| **Empresas em organização tributária** | Desorganização, multas | Solução clara e adotável |

- **Decisores:** sócios e diretores — decidem por segurança, conformidade e risco.
- **Influenciadores:** gestores e consultores — decidem por controle, eficiência e padrão.
- **Expectativas transversais:** clareza imediata, linguagem acessível, prova de solidez, caminho curto para a ação.

## 3. Arquitetura

Landing Page única, **9 seções em ordem fixa e imutável** (em qualquer tamanho de tela):

```
1. Hero            2. Problema          3. Solução
4. Como Funciona   5. Benefícios        6. Segurança
7. Demonstração    8. FAQ               9. Contato
```

- Cada seção responde **uma pergunta natural** e prepara a seguinte.
- **Princípios:** Simplicidade · Velocidade · Clareza · Confiança · Elegância · Foco em conversão.
- **Fora de escopo:** blog, área do cliente, login, admin, múltiplas páginas, documentação técnica.
- Reflow mobile-first: empilha, nunca encolhe; ordem narrativa imutável em todos os breakpoints.

## 4. Experiência

- **Sensação geral:** calma operacional — tudo responde imediatamente, tudo se move suavemente, nada corre e nada espera. Emoção-alvo: **tranquilidade confiante**, não entusiasmo.
- **Sinais a transmitir:** Confiança · Inovação · Organização · Maturidade · Qualidade · Simplicidade.
- **Princípios:** a experiência nunca compete com o conteúdo; motion reforça o entendimento; elegância sobre espetáculo; suavidade sobre velocidade; simplicidade sobre quantidade; consistência absoluta; nada sem propósito.
- **Ritmo em 3 atos:** início (Hero, contido) → desenvolvimento (fluido) → encerramento (culminância e repouso). Macro-ritmo uniforme; respiro extra antes da Demonstração.
- **Microinterações:** botões (hover/ativo claros), cards (elevação sutil), links (transição elegante), FAQ (expansão fluida), navegação (destaque discreto do CTA), ícones (movimento curto e preciso), todo interativo com feedback visual; preferência por transformações de posição/escala/opacidade.

## 5. Narrativa

Arco: **DESCONHECIMENTO (Hero) → RECONHECIMENTO (Problema) → INTERESSE (Solução · Como Funciona) → CONFIANÇA (Benefícios · Segurança) → AÇÃO (Demonstração · FAQ · Contato).**

| Seção | Pergunta | Emoção-alvo |
|---|---|---|
| **Hero** | "O que é e me interessa?" | Acolhimento, curiosidade confiante |
| **Problema** | "Isso acontece comigo?" | Reconhecimento, alívio |
| **Solução** | "Existe um caminho melhor?" | Esperança, clareza |
| **Como Funciona** | "Vai dar muito trabalho?" | Simplicidade, segurança |
| **Benefícios** | "O que eu ganho?" | Desejo fundamentado |
| **Segurança** | "É seguro?" | Tranquilidade |
| **Demonstração** | "Como conheço?" | Prontidão |
| **FAQ** | "E quanto a...?" | Acolhimento |
| **Contato** | "E se eu quiser só conversar?" | Fechamento tranquilo |

**Promessa central:** *o Hub devolve organização, controle e confiança para a área tributária da empresa.* Cada seção é uma variação da promessa. Regras: ordem imutável; confiança crescente (a prova vem depois do valor); atrito zero; sem reviravoltas.

## 6. Design System

**Princípios:** Consistência · Previsibilidade · Reutilização · Simplicidade · Escalabilidade. **Tokens antes de valores; padrão antes de exceção.**

- **Tokens:** `<categoria>-<papel>-<intensidade ou estado>`; **todo valor visual é um token; valores soltos são proibidos.**
- **Tipografia (protagonista):** sans-serif precisa, sóbria, perene; pesos Regular/Medium/Semibold/Bold; **máx. 2 pesos e 3 níveis visíveis por seção** (Display só no Hero → H1 → H2 → Corpo → Rótulo → Micro); leitura 45–75 caracteres; parágrafos 2–4 linhas; texto à esquerda; nada de leitura abaixo de ~14 px; escala fluida com clamp.
- **Layout:** container único ~1120–1200 px; grid 12/8/4 colunas; gutters fixos por faixa; centralização só em Hero e Demonstração; containers página → leitura (~2/3) → superfície; máx. 2 ritmos de largura por seção.
- **Espaçamento:** escala única (scale-1 a scale-6) em micro/meso/macro; macrorritmo uniforme; respiro extra antes da Demonstração; nenhum valor arbitrário.
- **Cor e contraste:** **AA (WCAG 2.1) inegociável**; cor = ênfase (neutros dominam, primária sóbria e rara, acento exclusivo da conversão); estados nunca só por cor; gradientes decorativos, glow e glassmorphism proibidos.
- **Elevação:** 4 níveis invariantes (0 Base → 1 Superfícies → 2 Interação → 3 Sobreposição); hover move 1→2 sem pular; sombra comunica elevação, nunca decoração.
- **Raios:** pequenos/médios/superfície/full (full só em circulares); hover nunca muda raio.
- **Iconografia:** line-style consistente; ícone por função; sem loops; decorativos sem função proibidos.
- **Ilustração:** só para conceitos abstratos; máx. 1 por seção; clichês proibidos (nuvens, foguetes, escudos, cubos 3D).
- **Imagens:** editoriais e raras; fotografia sóbria; conteúdo e velocidade antes de imagens.
- **Vídeo:** apenas na Demonstração, acionado pelo usuário; sem autoplay decorativo.
- **Densidade:** "densidade calma" — nunca comprimir; o conteúdo é reduzido.

## 7. Motion

| Tipo | Duração | Sensação |
|---|---|---|
| Microinteração (hover, clique, foco) | 120 – 200 ms | Imediata |
| Transição de elemento | 200 – 400 ms | Fluida e controlada |
| Entrada de seção no scroll | 300 – 500 ms | Revelação natural |
| Deslocamento de destaque | 400 – 600 ms | Elegante e segura |

- **Teto absoluto: 600 ms.** Linear em destaque e bounce proibidos.
- **Easing:** entradas ease-out ("chega rápido, assenta suave"); saídas ease-in curto; deslocamentos ease-in-out.
- **Entradas:** fade + deslocamento vertical curto; uma revelação por visita; nunca entrada lateral.
- **Scroll:** do usuário — sem parallax dramático, sem scroll forçado; scroll reveal discreto, uma vez por visita.
- **Hover:** resposta ≤ 180 ms, mudança sutil, só em interativos.
- **Carregamento:** sem splash, sem barras decorativas; progresso honesto e curto.
- **Regra de ouro:** toda animação responde a justificativa funcional ou emocional; senão, não existe.

## 8. Benchmark

Influência conceitual, **jamais cópia**:

| Referência | O que ensina |
|---|---|
| Raycast | Motion funcional, resposta imediata |
| Stripe | Hierarquia e respiro |
| Linear | Tipografia e espaçamento precisos |
| Apple | Narrativa progressiva |
| Notion | Clareza e simplicidade |
| Vercel | Performance percebida |
| Resend · Figma · Mercury · Framer · 1Password | Elegância, sistema, solidez, intenção, segurança |

**Alvos do Hub:** motion 8 · tipografia 9 · hierarquia 9 · espaçamento 9 · narrativa 8 · **conversão 9** · clareza 9 · minimalismo 8 · performance 9.

**Governança:** catálogo enxuto (8–15 referências ativas); referência que ensina anti-padrão é rejeitada; admissão por justificativa arquitetural + compatibilidade com DNA + triagem + ficha + aprovação.

## 9. DNA

**Personalidade:** o **especialista sereno** — calmo, preciso, sóbrio, moderno sem modismo, acessível, seguro. Um consultor tributário sênior que domina tecnologia: sabe do que fala e não precisa provar em voz alta.

**Postura visual:** um espaço ordenado onde **a informação é o luxo** — superfícies calmas, hierarquia forte, respiro generoso, cor como ênfase, tipografia protagonista, movimento discreto, acabamento impecável.

**Declaração de independência:** o Hub não é uma mistura das referências; é um produto próprio.

**Testes de DNA:** identidade · sobriedade · sênior · marca · temporalidade · coerência.

**Qualidades permanentes:** organização, clareza, confiança, elegância, solidez. O que se lembra é a mensagem e a sensação; o design é esquecido.

## 10. Tom de Voz

**Voz:** o especialista sereno — Profissional · Humano · Claro · Seguro · Especialista · sem arrogância · sem exageros.

| É | Não é |
|---|---|
| "A organização tributária pode ser simples." | "A melhor plataforma do mercado!" |
| "Uma conversa, sem compromisso." | "Não perca essa oportunidade única!" |
| "Você tem visão do que acontece." | "Solução perfeita para todos!" |

**Regras:** uma frase, uma ideia; verbos ativos; sem superlativos, sem comparação com concorrentes, sem urgência artificial; nunca culpar o visitante; nenhuma promessa que a demonstração não confirme; visitante tratado como profissional experiente; vocabulário do mundo do visitante (organização, controle, prazos, segurança, conformidade).

**Filtros de revisão de texto (obrigatórios):** dor · promessa · exagero · respeito · pressão · voz — falhar em qualquer um = reescrever.

## 11. Conversão

**Filosofia:** conversão é uma conversa, não uma venda. Caminho em 4 estágios: Chegada (Hero) → Leitura (Problema→Segurança) → Decisão (Demonstração) → Pós-decisão (FAQ + Contato).

- Nunca: compra direta, pressão, urgência, escassez, culpa.
- Sempre: previsível, consistente, confiança antes do pedido.
- Formulário: campos mínimos com propósito; privacidade visível; confirmação imediata; sem opt-ins pré-marcados.
- **Regra:** *se uma objeção não foi respondida, o visitante não clica — e isso é defeito de arquitetura, não do visitante.*
- **Pós-ação:** confirmação imediata → próximo passo claro → entrega do prometido (o que a página prometeu = o que a empresa entrega).

## 12. CTA

| Princípio | Aplicação |
|---|---|
| Convidar, não pressionar | "Agendar uma conversa", "Conhecer o Hub" — nunca "Comprar" |
| Um CTA dominante | Demonstração é a única ação principal |
| Secundário humilde | Contato como porta alternativa, sem competir |
| Sem urgência falsa | Sem contadores, sem "vagas limitadas" |
| Posição de confiança | CTA aparece depois da confiança construída |

**Ação principal:** Agendar Demonstração. **Ação secundária:** Entrar em Contato.

## 13. Restrições

- **Nenhuma decisão nova; nenhuma decisão existente alterada** — este documento apenas consolida.
- **Nunca contradizer documento oficial**; em divergência, a origem prevalece.
- **Nenhum layout/tela/componente/código** nesta sprint — tudo em Markdown.
- Landing Page única; escopo limitado (sem blog, login, admin, múltiplas páginas).
- Sem venda agressiva, sem urgência/escassez, sem promessas não verificáveis.
- **Identidade própria:** sem cópia de referências, sem visual "gerado por IA", sem template.
- **Acessibilidade inegociável:** WCAG 2.1 AA, foco de teclado visível, estados nunca só por cor, `prefers-reduced-motion` respeitado.
- Mudanças estruturais em blocos congelados exigem **revisão arquitetural documentada**; execução é livre dentro do sistema.

## 14. Anti-padrões (proibição absoluta)

- **Estética:** excesso de glow/brilho; gradientes exagerados ou decorativos; glassmorphism pesado; cyberpunk; estética típica de IA; template.
- **Estrutura:** hero extremamente carregado; excesso de texto acima da dobra; landing SaaS genérica (telas flutuantes, painéis prontos); elementos flutuantes decorativos; parallax dramático.
- **Comportamento:** loops decorativos, animações contínuas, bounce/springs; transições que atrasam resposta; efeitos que competem com o conteúdo; urgência artificial; cópia de componente/layout/identidade.
- **Regra de ouro:** se um efeito pode ser removido sem perda de comunicação, ele deve ser removido.

---

## 15. Moodboards Conceituais

Três direções criativas conceituais — **Mood A, Mood B e Mood C** — cada uma com sensação, personalidade, ritmo, iluminação, contraste, densidade e impacto emocional. Sem layout. Documento completo: **WEBSITE-4.5-MOODBOARDS.md**.

| Mood | Essência |
|---|---|
| **A — Respiração Absoluta** | O silêncio como mensagem de solidez |
| **B — Contexto Qualificado** | Clareza imediata de "para quem" é o Hub |
| **C — Marca de Precisão** | O acabamento como assinatura |

---

## 16. Diretrizes para Exploração Criativa

### 16.1 O que o Claude pode explorar

- Direções visuais completas e conceitos (identidade, composição, paleta, tipografia, componente, motion) **dentro** dos limites deste documento.
- Decisões de **execução**: paleta, fonte, raio, elevação, composição de seções, estilo de microinterações — livres dentro do sistema congelado.
- As três moods conceituais (WEBSITE-4.5-MOODBOARDS.md) como matéria-prima de exploração, incluindo variações e combinações, desde que respeitando os princípios imutáveis.
- Propostas de texto (headlines, rótulos, microcopy) desde que passem nos seis filtros de revisão do Tom de Voz.

### 16.2 O que nunca poderá alterar

- **Arquitetura:** as 9 seções e a ordem fixa (Hero → Problema → Solução → Como Funciona → Benefícios → Segurança → Demonstração → FAQ → Contato).
- **Narrativa:** uma pergunta por seção; arco DESCONHECIMENTO → RECONHECIMENTO → INTERESSE → CONFIANÇA → AÇÃO; promessa central.
- **DNA e tom:** especialista sereno; sem superlativos, sem urgência, sem culpa.
- **Filosofia comercial:** confiança antes da venda; Demonstração = única ação principal; Contato = alternativa humilde.
- **Design system:** tokens, grid (12/8/4), escala única de espaço, hierarquia tipográfica (máx. 3 níveis e 2 pesos por seção), contraste AA, estados nunca só por cor.
- **Motion:** teto de 600 ms; entradas com ease-out; scroll do usuário; sem loops, parallax, bounce.
- **Anti-padrões e restrições** (seções 13 e 14) — proibição absoluta.
- **Escopo:** Landing Page única; nada fora do escopo.

### 16.3 Documentos obrigatórios

1. **WEBSITE-4.5-CREATIVE-BRIEF.md** (este documento — referência master).
2. **WEBSITE-4.5-MOODBOARDS.md** (direções conceituais).
3. **WEBSITE-4.5-CLAUDE-DESIGN-BRIEF.md** (contrato de trabalho da exploração).
4. **WEBSITE-4.5-DESIGN-CHECKLIST.md** (validação eliminatória — ⛔ reprova).
5. Documentos de origem (WEBSITE 1–4, Executive Overview, Commercial Framework) apenas para resolver divergência — a origem prevalece.

### 16.4 Princípios imutáveis

- Confiança primeiro — nada de pressão, urgência ou promessas não verificáveis.
- Simplicidade é arquitetura — menos é mais; a remoção é validação.
- Conteúdo é o protagonista; o design é o cenário.
- Identidade própria — nunca inspiração vira cópia, nunca parece IA/template.
- Acessibilidade nunca se sacrifica por estética.
- Estratégia é congelada; execução é livre dentro do sistema.

---

## 17. Checklist de Aprovação

Checklist a ser utilizado **antes da aprovação de qualquer proposta visual**. Instrumento operacional completo e eliminatório: **WEBSITE-4.5-DESIGN-CHECKLIST.md** — itens ⛔ reprovam a proposta; uma única falha devolve a proposta antes de avançar. Resumo dos itens obrigatórios:

- [ ] ⛔ Parece um produto **enterprise**, sério e maduro?
- [ ] ⛔ **Não parece "gerada por IA"** nem template?
- [ ] ⛔ **DNA preservado** — especialista sereno?
- [ ] ⛔ **Arquitetura preservada** — 9 seções na ordem oficial?
- [ ] ⛔ **Narrativa preservada** — uma pergunta por seção?
- [ ] ⛔ **Nenhum anti-padrão** presente?
- [ ] ⛔ **Motion dentro do teto de 600 ms**, com propósito?
- [ ] ⛔ **Contraste AA** garantido em texto e interface?
- [ ] Identidade própria, premium, elegante, atemporal?
- [ ] Clareza imediata; tipografia protagonista; conteúdo respira?
- [ ] Foco em confiança; CTA consultivo; foco em conversão?
- [ ] Landing page única; 9 seções; ordem imutável?
- [ ] Simplicidade — teste de remoção aprovado?

**Veredito:** Aprovado · Aprovado com ressalvas · **Reprovado** (qualquer falha obrigatória ou anti-padrão).

---

## Critérios de Aceite

- [ ] Existir um Creative Brief Master completo, consolidando missão, público, arquitetura, experiência, narrativa, design system, motion, benchmark, DNA, tom de voz, conversão, CTA, restrições e anti-padrões.
- [ ] Existir o documento de moodboards conceituais (Mood A, B, C) sem criar layout.
- [ ] Existir o capítulo "Diretrizes para Exploração Criativa" (o que explorar, o que nunca alterar, documentos obrigatórios, princípios imutáveis).
- [ ] Existir o checklist de aprovação de propostas visuais.
- [ ] Existir o contrato de trabalho do Claude (WEBSITE-4.5-CLAUDE-DESIGN-BRIEF.md).
- [ ] Nenhum documento anterior contradito; nenhuma decisão nova.
- [ ] O conjunto orientar o Claude na criação de conceitos visuais premium, preservando integralmente a identidade do Hub Tributário.
