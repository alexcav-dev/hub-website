# WEBSITE 3 — Typography v1.0

> **Status:** Oficial
>
> **Escopo:** Sistema tipográfico conceitual do Website Institucional do Hub Tributário
>
> **Formato:** Documentação (Markdown) — conceitual; não escolhe fonte ou valores definitivos
>
> **Base obrigatória:** WEBSITE 1, WEBSITE 2, WEBSITE 2.5, WEBSITE-3-DESIGN-SYSTEM-FOUNDATION
>
> **Finalidade:** Definir a voz tipográfica que orientará Design e Implementação

---

## 1. Visão Geral

A tipografia é a **protagonista da identidade visual do Hub** (WEBSITE-2.5-DESIGN-DNA). A página fala pelo texto; o resto é cenário. Este documento define a personalidade, os papéis, a hierarquia e o ritmo de leitura da tipografia — sem escolher a fonte, que pertence à sprint de Design.

---

## 2. Personalidade Tipográfica

A fonte ideal para o Hub será avaliada por estas características:

| Característica | Exigência |
|---|---|
| **Sans-serif** | Sem serifa: modernidade e clareza institucional |
| **Precisa e sóbria** | Sem formas decorativas, sem personalidade "de display" |
| **Neutra com caráter** | Confiável a ponto de ser neutra, com detalhes que a distinguem de fontes genéricas de sistema |
| **Versátil** | Funciona em títulos grandes e em texto corrido pequeno |
| **Rica em pesos** | Suporte sólido de Regular a Semibold (e idealmente Bold) |
| **Perene** | Sem modismo; continuará atual em anos (teste da temporalidade — DNA) |

**Proibido:** fontes decorativas de display, fontes manuscritas, fontes de aparência técnica (monoespaçadas em massa) e famílias que parecem "template".

---

## 3. Famílias e Pesos

### 3.1 Famílias

O sistema admite **uma família principal** (texto e títulos) e, no máximo, uma família complementar para casos técnicos pontuais, se necessário.

| Família | Papel |
|---|---|
| **Principal** | Todo o texto da página: títulos, corpo, rótulos, botões |
| **Complementar (opcional)** | Dados técnicos ou numéricos em contextos específicos (prazos, números de destaque), apenas se a principal não cumprir |

### 3.2 Pesos conceituais

| Peso | Uso |
|---|---|
| **Regular** | Texto de corpo, parágrafos, textos de apoio |
| **Medium** | Destaques sutis: rótulos, legendas, ênfase leve |
| **Semibold** | Títulos, CTAs, elementos de decisão |
| **Bold** | Uso raro: números de destaque, nunca texto corrido |

**Regras de peso:**

- Máximo de **dois pesos por seção visível** (hierarquia limpa, contraste tipográfico por tamanho e peso juntos).
- Não existe peso "Light" em texto de leitura (fere contraste e sobriedade).
- Títulos em Semibold, corpo em Regular: a relação padrão de voz.

---

## 4. Hierarquia Tipográfica

### 4.1 Níveis conceituais

O sistema define seis níveis, com papéis fixos:

| Nível | Papel | Uso |
|---|---|---|
| **Display** | Impacto institucional | Apenas no Hero (frase de abertura) |
| **H1 — Seção** | Abertura de seção | Título de cada seção da página |
| **H2 — Bloco** | Abertura de bloco | Subtítulos dentro da seção |
| **Corpo** | Leitura | Texto de apoio, explicações |
| **Rótulo / Legendas** | Orientação | Etiquetas, metadados, legendas de apoio |
| **Micro** | Apoio mínimo | Notas, créditos, textos legais |

### 4.2 Regras de hierarquia

- **No máximo três níveis visíveis por seção** (ex.: H1 + Corpo + Rótulo). Hierarquia é visível, não é lista completa.
- A hierarquia é comunicada por **tamanho, peso e espaço** — nessa ordem de prioridade (verdade tipográfica do DNA).
- Cor entra **por último**: texto importante é maior e mais pesado, não apenas colorido.
- O Display existe **apenas no Hero**; nenhuma outra seção usa impacto de Display.
- Nunca mais de um H1 conceitual por seção (a narrativa de WEBSITE-1 define qual é).

---

## 5. Ritmo de Leitura

### 5.1 Entrelinha (line-height)

| Contexto | Caráter |
|---|---|
| **Títulos** | Apertado, confiante — nunca colado, nunca solto demais |
| **Corpo** | Aberto e confortável — a linha respira (referência 1,5–1,6 vezes o tamanho) |
| **Rótulos** | Compacto, com respiro no espaçamento entre elementos |

### 5.2 Comprimento de linha

- **Largura ideal de texto corrido:** entre 45 e 75 caracteres por linha; alvo de ~60–70 caracteres.
- Texto de leitura nunca ocupa a largura total do container (ver WEBSITE-3-LAYOUT-SYSTEM.md).
- Parágrafos: bloco corrido, sem justificar; alinhamento à esquerda.

### 5.3 Entrelinha de parágrafos (margin between blocks)

- O espaço entre parágrafos segue a escala de espaço (WEBSITE-3-LAYOUT-SYSTEM.md) — nunca "Enter" duplo arbitrário.
- Parágrafos são curtos: 2–4 linhas máximas, na média (linguagem do DNA: frases curtas).

### 5.4 Regras de leitura

- Nenhum texto com menos de ~14px em leitura (acessibilidade e seriedade).
- Texto corrido em maiúsculas é proibido; caixa alta apenas em rótulos curtos.
- Ênfase em negrito dentro do parágrafo é permitida, mas contida (uma ênfase por parágrafo, idealmente).

---

## 6. Comportamento Responsivo da Tipografia

- A escala usa **clamp (fluidez)** entre um mínimo móvel e um máximo desktop — a tipografia nunca "pula" bruscamente entre tamanhos.
- O Display e o H1 reduzem de forma mais agressiva em telas pequenas; o corpo varia pouco.
- O comprimento de linha é mantido ideal em qualquer tamanho de tela (as colunas se ajustam, não as linhas esticam).
- Em telas pequenas, a hierarquia nunca desaparece: tamanho, peso e espaço continuam distintos.

---

## 7. Regras de Uso na Página (por seção — WEBSITE-1)

| Seção | Direção tipográfica |
|---|---|
| **Hero** | Display + Corpo curto + CTA. Máximo silêncio visual |
| **Problema** | H1 direto + parágrafos curtos; tom de reconhecimento |
| **Solução** | H1 + blocos H2; texto explica, não compete |
| **Como Funciona** | Passos numerados: número + H2 + Corpo curto |
| **Benefícios** | Lista com rótulo + descrição curta; leitura por varredura |
| **Segurança** | H1 + itens de confiança; texto sóbrio e direto |
| **Demonstração** | H1 + frase curta + CTA forte; menor quantidade de texto da página |
| **FAQ** | Pergunta em peso médio, resposta em corpo; ritmo de acordeão |
| **Contato** | H1 + mínimo de texto; canal direto |

---

## 8. Critérios de Aceite

- [ ] A personalidade tipográfica estar definida (sem escolher a fonte).
- [ ] Famílias e pesos conceituais estarem definidos.
- [ ] A hierarquia de níveis (Display a Micro) estar definida com regras de uso.
- [ ] O ritmo de leitura (entrelinha, largura ideal, espaçamento entre parágrafos) estar definido.
- [ ] O comportamento responsivo da tipografia estar definido.
- [ ] As regras por seção da Landing Page existirem.
- [ ] O sistema tipográfico orientar Design e Implementação sem contradizer WEBSITE 1, 2 e 2.5.