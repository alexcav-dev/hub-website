# WEBSITE 3 — Layout System v1.0

> **Status:** Oficial
>
> **Escopo:** Sistema de layout conceitual do Website Institucional do Hub Tributário
>
> **Formato:** Documentação (Markdown) — conceitual; não cria telas nem composições definitivas
>
> **Base obrigatória:** WEBSITE 1, WEBSITE 2, WEBSITE 2.5, WEBSITE-3-DESIGN-SYSTEM-FOUNDATION
>
> **Finalidade:** Definir a estrutura espacial que orientará o design de cada seção

---

## 1. Visão Geral

O layout do Hub transmite **ordem e respiro** (DNA: organização e elegância). Este documento define a estrutura espacial oficial: larguras, grid, comportamento responsivo, alinhamentos, zonas de respiro e a organização das seções da Landing Page.

Toda composição futura — de qualquer seção de WEBSITE-1 — deverá nascer destas regras.

---

## 2. Largura Máxima

- O Website opera com **um container principal único**, com largura máxima de referência entre 1120px e 1200px, unificada em toda a página.
- A largura máxima será **fixada como token** (`layout-container-max`) na sprint de Design; nenhuma seção terá largura própria.
- Conteúdo de leitura (texto corrido) usa **colunas internas mais estreitas** (ver seção 5), nunca a largura total.
- Fundos e superfícies coloridas podem ocupar a largura total da viewport; **o conteúdo permanece no container**.

**Regra:** um container, uma régua de largura, para toda a página. Qualquer variação exige justificativa e aprovação do sistema.

---

## 3. Grid

### 3.1 Estrutura conceitual

| Faixa | Colunas | Caráter |
|---|---|---|
| **Desktop** | 12 colunas | Flexibilidade com ordem; a régua da página |
| **Tablet** | 8 colunas | Transição; composições simplificam |
| **Mobile** | 4 colunas | Clareza absoluta; uma coluna de conteúdo |

### 3.2 Gutter (espaço entre colunas)

- Gutter único em cada faixa, derivado da escala de espaço (espaçamento por degraus — ver seção 4).
- Gutter é fixo por faixa; nunca varia por seção.

### 3.3 Regras de grid

- Elementos são alinhados às colunas do grid em todas as faixas; alinhamento "solto" é proibido.
- A **proporção de seções** é estável: blocos de conteúdo variam em largura, mas sempre dentro de combinações de colunas previsíveis.
- Máximo de **dois ritmos de largura por seção** (ex.: título em 7 colunas + apoio em 5), evitando mosaicos.
- O grid nunca é quebrado por efeitos (elementos flutuantes, parallax, composições diagonais são proibidos).

---

## 4. Espaçamento e Escala de Espaço

### 4.1 Escala única

Todo espaço do Website nasce de **uma única escala de degraus**, aplicada em micro, meso e macro ritmo (WEBSITE-3-DESIGN-SYSTEM-FOUNDATION, seção 15).

| Degrau | Uso conceitual |
|---|---|
| **scale-1** | Ajustes mínimos entre ícone e rótulo |
| **scale-2** | Espaço entre itens de lista, pares internos |
| **scale-3** | Espaço entre blocos de uma unidade (título e apoio) |
| **scale-4** | Espaço entre unidades de uma seção (listas, pares de FAQ) |
| **scale-5** | Espaço interno de seção (conteúdo até as margens da seção) |
| **scale-6** | Respiro entre seções (macro-ritmo da página) |

### 4.2 Regras de espaçamento

- **Nenhum valor arbitrário:** todo espaço pertence a um degrau da escala.
- **Nunca multiplicar sem token:** combinações são criadas como novos degraus ou tokens compostos, não como valores soltos.
- O macro-ritmo (entre seções) é o degrau mais alto e **uniforme em toda a página**, com ajuste pontual aprovado apenas em momentos de decisão (Demonstração).
- Em telas pequenas, os degraus contraem proporcionalmente — o ritmo nunca desaparece, apenas comprime.

---

## 5. Alinhamentos

### 5.1 Posição do texto

- **Texto alinhado à esquerda** é o padrão de leitura da página (português, leitura natural).
- **Centralização:** reservada, por princípio, ao Hero e a momentos de culminância (Demonstração); nunca mista na mesma seção.
- Texto justificado é proibido.

### 5.2 Colunas de leitura

| Tipo de conteúdo | Comportamento |
|---|---|
| **Texto corrido** | Coluna estreita central ou à esquerda (~60–70 caracteres — WEBSITE-3-TYPOGRAPHY.md) |
| **Blocos com lista** | Texto em coluna + lista/suporte em coluna irmã |
| **Títulos de seção** | Podem ser maiores que a coluna de leitura, dentro de combinações previsíveis de colunas |

### 5.3 Regras de alinhamento

- Elementos da mesma seção compartilham o **mesmo eixo de alinhamento**.
- O alinhamento vertical de itens de lista e cards é consistente (bordas superiores alinhadas).
- Nenhum elemento é posicionado por "centro óptico" livre — toda centralização é decisão de seção, não de elemento.

---

## 6. Zonas de Respiro

### 6.1 Margens de segurança

- O conteúdo mantém uma **zona de segurança horizontal** em relação às bordas da viewport, maior em mobile (dedos e respiro), confortável em desktop.
- Nada crítico (texto, botões) chega às bordas; superfícies de fundo podem, o conteúdo não.

### 6.2 Respiro da narrativa (WEBSITE-1)

O respiro vertical acompanha a narrativa:

| Momento | Respiro |
|---|---|
| **Hero** | Respiro de chegada: generoso, o primeiro contato não aperta |
| **Desenvolvimento** | Ritmo uniforme; cada seção respira antes e depois |
| **Demonstração** | Respiro extra antes do CTA (momento de decisão) |
| **Encerramento (FAQ/Contato)** | Ritmo calmo, acolhedor |

---

## 7. Containers

O sistema define **três containers conceituais**:

| Container | Uso | Largura relativa |
|---|---|---|
| **Container de página** | Todo o conteúdo da seção | Máxima (token único) |
| **Container de leitura** | Texto corrido e parágrafos | Coluna estreita (~2/3 do container) |
| **Container de superfície** | Cards, painéis, grupos de elementos | Combinações de colunas do grid |

Regras:

- Containers aninham-se apenas no padrão: página → leitura ou superfície. Nenhum terceiro nível sem aprovação.
- Nenhum container recebe largura própria fora do grid.

---

## 8. Comportamento Responsivo

### 8.1 Estratégia

**Mobile-first em intenção, reflow por faixas:**

| Faixa | Comportamento |
|---|---|
| **Mobile** | Conteúdo em coluna única; ordem da narrativa preservada; CTA sempre acessível |
| **Tablet** | Composições em 2 colunas começam; respiro contrai proporcionalmente |
| **Desktop** | Composição completa do grid de 12 colunas; largura máxima aplicada |

### 8.2 Regras responsivas

- **Reflow, não redimensionamento:** elementos empilham-se, nunca encolhem ao ponto de ilegibilidade.
- A ordem de leitura da narrativa (WEBSITE-1) é **imutável** em qualquer faixa.
- Botões e alvos de toque respeitam tamanho mínimo confortável (acessibilidade).
- Nenhum elemento é ocultado por conveniência de layout sem decisão oficial (o conteúdo é o protagonista).
- O CTA principal permanece visível ou rapidamente acessível em todas as faixas (foco em conversão).

---

## 9. Organização das Seções

A Landing Page (WEBSITE-1) organiza-se em **pares visuais alternados**, respeitando o ritmo da narrativa:

| Padrão | Aplicação |
|---|---|
| **Texto e superfície** | Solução, Benefícios: texto em uma coluna + superfície (card, lista) na outra |
| **Texto central** | Hero e Demonstração: foco absoluto no título e na ação |
| **Listas alinhadas** | Como Funciona, FAQ: itens em coluna, respiro entre unidades |
| **Itens de confiança** | Segurança: itens concisos, sem densidade excessiva |

### 9.1 Regras de composição

- Alternância de padrões é previsível e cíclica; nunca há três seções com o mesmo padrão seguidas sem propósito narrativo.
- Toda seção abre com **H1 + frase de apoio** no mesmo padrão de alinhamento.
- Seções nunca se sobrepõem nem se interpenetram; a superfície da página é contínua.
- A Demonstração é o ponto mais contido da página: menos conteúdo, mais ação.

---

## 10. Critérios de Aceite

- [ ] A largura máxima e o comportamento responsivo estarem definidos.
- [ ] O grid (12/8/4 colunas) e os gutters estarem definidos conceitualmente.
- [ ] Os alinhamentos e as colunas de leitura estarem definidos.
- [ ] As zonas de respiro e o macro-ritmo estarem definidos.
- [ ] Os containers do sistema estarem definidos.
- [ ] A organização das seções da Landing Page estar definida.
- [ ] O sistema de layout orientar o design sem contradizer WEBSITE 1, 2, 2.5 e a Foundation.