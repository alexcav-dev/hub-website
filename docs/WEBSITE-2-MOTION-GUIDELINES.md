# WEBSITE 2 — Motion Guidelines v1.0

> **Status:** Oficial
>
> **Escopo:** Direção de Motion Design do Website Institucional do Hub Tributário
>
> **Formato:** Documentação (Markdown) — parâmetros e regras; não define implementação técnica
>
> **Finalidade:** Garantir movimento consistente, elegante e funcional em todo o Website

---

## 1. Visão Geral

O movimento do Website deve ser **discreto, rápido e útil**. Cada animação existe para comunicar estado, conduzir atenção ou reduzir atrito — nunca para impressionar. Este documento define velocidade, ritmo, sensação e as regras de uso do movimento.

A referência conceitual de Motion Design é o **Raycast**: movimento rápido, funcional, com propósito claro e sem espetáculo.

---

## 2. Princípios do Movimento

1. **A animação nunca compete com o conteúdo.**
2. **O movimento reforça o entendimento.**
3. **Elegância acima de espetáculo.**
4. **Suavidade acima de velocidade.**
5. **Simplicidade acima de quantidade.**
6. **Consistência:** o mesmo tipo de movimento repete-se em todos os lugares.
7. **Direção significativa:** elementos entram pela origem da ação (ex.: um detalhe abre-se de onde veio o clique).

---

## 3. Velocidade e Durações

A percepção de marca no Website é **rápida e serena**. As durações são curtas, com sensação de imediatez e sem atrito.

| Tipo de movimento | Duração de referência | Sensação |
|---|---|---|
| **Microinteração** (hover, clique, foco) | 120 ms – 200 ms | Immediata, quase imperceptível |
| **Transição de elemento** (aparecimento, expansão) | 200 ms – 400 ms | Fluida e controlada |
| **Entrada de seção no scroll** | 300 ms – 500 ms | Revelação natural, sem pressa |
| **Deslocamentos de destaque** (mudanças de contexto) | 400 ms – 600 ms | Elegante e segura |

**Regras:**

- Durações acima de **600 ms** são proibidas para elementos de interface.
- Nenhum elemento pode exigir espera para começar — a animação inicia no instante do gatilho.
- Uma animação nunca pode atrasar a percepção do resultado: o estado final deve ser alcançado o quanto antes.

---

## 4. Curvas de Aceleração (Easing)

O movimento deve parecer **natural e orgânico**, nunca linear e mecânico.

| Contexto | Curva recomendada | Efeito |
|---|---|---|
| **Entradas** (elementos que chegam) | Saída rápida com desaceleração suave (ease-out) | Chega rápido, assenta com calma |
| **Saídas** (elementos que saem) | Aceleração leve (ease-in) | Sai naturalmente, sem atraso |
| **Deslocamentos contínuos** (menu, expansão, scroll interno) | Aceleração e desaceleração (ease-in-out) | Início e fim suaves, meio eficiente |
| **Microinterações** (hover, foco) | Suavização leve (curta) | Resposta quase instantânea com toque orgânico |

**Regras:**

- Nenhuma curva pode ter velocidade constante (linear) em elementos de destaque.
- Nenhuma curva pode provocar "tranco" no início ou no fim (bounce exagerado é proibido).
- O perfil geral é **"chega rápido, assenta suave"** — velocidade de percepção, desaceleração de conforto.

---

## 5. Ritmo e Sensação

### 5.1 Sensação Geral

O Website deve transmitir **calma operacional**: tudo responde imediatamente, tudo se move suavemente, nada corre e nada espera.

- O visitante nunca sente "pressa".
- O visitante nunca sente "atraso".
- O movimento parece **servir o conteúdo** o tempo todo.

### 5.2 Ritmo por Etapa da Página

| Etapa | Ritmo | Sensação |
|---|---|---|
| **Início (Hero)** | Contido, uma única onda de entrada discreta | Primeira impressão sólida e serena |
| **Desenvolvimento** | Entradas suaves a cada seção, ritmo de leitura | Fluidez; a página "conta a história" |
| **Encerramento** | Movimento concentrado no CTA, depois repouso | Culminância tranquila e acolhimento |

---

## 6. Scroll

### 6.1 Princípios

- O scroll é **do usuário**: a página nunca acelera, atrasa ou interfere no movimento natural.
- O conteúdo se revela no scroll (**scroll reveal**) com entradas discretas, nunca efeitos dramáticos (parallax exagerado é proibido).
- O ritmo das revelações acompanha a leitura: cada bloco entra quando o olhar chega até ele.

### 6.2 Regras

- Revelações ocorrem uma única vez por visita (sem repetição ao rolar para cima e para baixo).
- Nenhuma seção pode girar, escorregar lateralmente ou escalar de forma chamativa.
- Preferir revelações por **blocos de conteúdo**, não por elementos isolados de forma excessiva.

---

## 7. Entradas e Saídas de Elementos

### 7.1 Entradas

- Padrão: **fade (opacidade) + deslocamento vertical curto**.
- Direção: elementos sobem ligeiramente; nunca entram por laterais ou com distâncias longas.
- Duração: 300 ms – 500 ms, com desaceleração suave.
- Regra: nunca mais de um "clima" de entrada por seção — entradas são consistentes.

### 7.2 Saídas

- Uso raro: saídas acontecem apenas quando há troca real de estado (menu fechando, FAQ recolhendo).
- Direção: o elemento sai na direção oposta de onde entrou.
- Duração: mais curta que a entrada (150 ms – 300 ms).

### 7.3 Regra Geral

- O conjunto **entrada + saída** de um mesmo elemento deve ser curto e simétrico em direção, com a saída ligeiramente mais rápida.

---

## 8. Microinterações

### 8.1 Botões

- Hover: elevação ou preenchimento sutil, resposta imediata (120 ms – 180 ms).
- Clique (ativo): recuo ou mudança de pressão perceptível, sem bounce.
- Estado de carregamento: comunica progresso com clareza; nunca usa animação decorativa contínua.

### 8.2 Cards

- Hover: elevação discreta + sutil intensificação de sombra ou borda.
- Proibido: rotação, escala exagerada, brilhos e animações de fundo.

### 8.3 Links

- Transição de cor e sublinhado em **200 ms**, com suavização suave.
- Nenhum link "pula" ou desloca o texto vizinho.

### 8.4 FAQ (Acordeão)

- Expansão dimensionada ao conteúdo (altura fluida), 250 ms – 350 ms.
- O ícone acompanha o movimento: rotação curta e precisa.
- Nunca: acordeão abrupto ou com bounce.

### 8.5 Navegação

- Hover: sublinhado ou tom de cor discreto.
- CTA da navegação: mantém o padrão de botão.
- Ação de rolar até a seção: deslocamento suave e contínuo (300 ms – 500 ms), sem animações fantasma.

### 8.6 Ícones

- Transições de estado: rotação ou deslocamento curtos (150 ms – 250 ms).
- Nunca: pulso contínuo, rotação infinita decorativa.

### 8.7 Elementos Interativos (geral)

- Todo estado interativo (hover, foco, ativo, selecionado) deve ter distinção visual clara.
- Foco de teclado sempre visível e suave — acessibilidade não se sacrifica por estética.

---

## 9. Carregamento

### 9.1 Carregamento Inicial

- O Website carrega **rápido por natureza**; o carregamento visível é mínimo ou inexistente.
- Entrada do Hero: única onda discreta (fade + leve subida), 300 ms – 500 ms.
- Proibido: splash screens, barras de progresso decorativas, animações de "typing".

### 9.2 Carregamento de Conteúdo (formulários, envio)

- Comunica estado por **progresso claro e honesto** (texto ou barra simples).
- Animações de espera são neutras e curtas; nunca contínuas e chamativas.

---

## 10. Hover — Regras de Uso

- **Rápido:** resposta em até 180 ms.
- **Sutil:** mudança de superfície (cor, sombra, elevação), nunca movimento brusco.
- **Significativo:** o hover antecipa a ação; não existe hover decorativo em elementos não interativos.
- **Consistente:** o mesmo estilo de hover em todos os elementos do mesmo tipo.

---

## 11. Exceções e Anti-Padrões

### 11.1 Quando NÃO animar

- Texto longo em leitura (densidade alta).
- Elementos cujo estado final é imediato (nenhuma informação chega ao usuário mais rápido com animação).
- Movimentos que exigem atenção contínua do olhar (contradizem o repouso).
- Carga pesada de informação: o movimento compete com o conteúdo.

### 11.2 Proibições explícitas

- **Bounce** e molas exageradas.
- **Glow** animado ou pulsante.
- **Gradientes animados**.
- **Parallax** dramático.
- **Animações em loop** decorativas (bolhas, partículas, flutuação contínua).
- **Transições de página** elaboradas (o Website é uma Landing Page de rolagem única).
- Qualquer movimento com duração maior que **600 ms**.

---

## 12. Qualidade — Justificativa do Movimento

Todo movimento deve responder a uma das perguntas:

| Tipo | Pergunta a responder |
|---|---|
| **Funcional** | "Este movimento ajuda o usuário a entender o que mudou ou o que fazer?" |
| **Emocional** | "Este movimento reforça a sensação de confiança, clareza ou qualidade?" |

**Regra de ouro:** se a resposta for "não" para ambas, a animação não existe.

---

## 13. Critérios de Aceite

- [ ] Existirem parâmetros de velocidade, duração e curvas de aceleração definidos.
- [ ] Estar definido o comportamento de scroll, entradas, saídas e microinterações.
- [ ] Estar definido o tratamento de carregamento e hover.
- [ ] Estarem formalizadas as regras de quando evitar animações e os anti-padrões.
- [ ] Toda orientação possuir justificativa funcional ou emocional.
- [ ] As regras bastarem para orientar a Implementação sem ambiguidade.