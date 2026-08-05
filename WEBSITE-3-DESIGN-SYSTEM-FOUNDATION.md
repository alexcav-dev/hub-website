# WEBSITE 3 — Design System Foundation v1.0

> **Status:** Oficial
>
> **Escopo:** Fundação do Design System do Website Institucional do Hub Tributário
>
> **Formato:** Documentação (Markdown) — conceitual; não contém layout, telas, componentes ou código
>
> **Base obrigatória:** WEBSITE 1 (Arquitetura), WEBSITE 2 (Experiência, Motion, Filosofia), WEBSITE 2.5 (Benchmark, Catálogo, DNA)
>
> **Finalidade:** Base visual permanente para Design, UX e Implementação

---

## 1. Visão Geral

Este documento é a **fundação oficial do Design System** do Website Institucional do Hub Tributário. Ele define, em nível conceitual, todos os fundamentos visuais do Website: grid, espaçamento, tipografia, layout, cores, tokens, iconografia, imagens e movimento de superfície.

Nenhuma decisão aqui pode contradizer os documentos anteriores. Ao contrário: este sistema **materializa** a filosofia (WEBSITE-2), as regras de movimento (WEBSITE-2-MOTION-GUIDELINES) e o DNA do Hub (WEBSITE-2.5-DESIGN-DNA).

---

## 2. Princípios do Design System

O sistema é governado por cinco princípios, derivados do DNA do Hub:

| Princípio | Significado |
|---|---|
| **Consistência** | O mesmo elemento comporta-se e parece-se da mesma forma em toda a página |
| **Previsibilidade** | O visitante aprende o sistema uma vez e ele nunca muda de comportamento |
| **Reutilização** | Toda decisão visual nasce de um token ou padrão existente; nada é criado isolado |
| **Simplicidade** | O mínimo necessário; toda adição ao sistema exige justificativa |
| **Escalabilidade** | O sistema cresce sem quebrar — novas seções usam os mesmos fundamentos |

**Regra do sistema:** se uma decisão não pode ser descrita por um padrão existente, o padrão é que precisa existir primeiro — a decisão isolada não é admitida.

---

## 3. Camadas do Sistema

O Design System opera em quatro camadas, da mais estável à mais volátil:

| Camada | O que define | Estabilidade |
|---|---|---|
| **Fundação (tokens)** | Escala de espaço, tipografia, cores conceituais, raios, sombras | Máxima — muda raramente |
| **Layout** | Grid, containers, larguras, zonas de respiro | Alta — muda por evolução |
| **Componentes** | Botões, cards, acordeões (padrões, não telas) | Média — muda por adição |
| **Página** | Composição das seções da Landing Page | Baixa — muda por conteúdo |

Este documento cobre exclusivamente a **Fundação** e os princípios que ligam as camadas.

---

## 4. Tokens Conceituais

Tokens são os valores únicos que alimentam todo o sistema. Nesta sprint definem-se os **tokens conceituais** (papel e estrutura); os valores definitivos serão atribuídos na sprint de Design.

### 4.1 Estrutura de nomeação

```
<categoria>-<papel>-<intensidade ou estado>
```

Exemplos conceituais:

- `color-surface-elevated` (superfície em elevação)
- `color-text-primary` (texto principal)
- `space-scale-4` (quarto degrau da escala de espaço)
- `radius-surface` (raio aplicado a superfícies)
- `shadow-elevation-2` (sombra do segundo nível de elevação)
- `typography-size-display` (tamanho do nível display)

### 4.2 Categorias de tokens

| Categoria | Exemplos conceituais |
|---|---|
| **Cores** | `color-primary`, `color-neutral`, `color-accent`, `color-surface`, `color-state-*` |
| **Espaço** | `space-scale-*`, `space-section`, `space-gutter` |
| **Tipografia** | `typography-size-*`, `typography-weight-*`, `typography-line-*` |
| **Layout** | `layout-container-max`, `layout-column-*`, `layout-breakpoint-*` |
| **Raio** | `radius-small`, `radius-medium`, `radius-surface` |
| **Sombra** | `shadow-elevation-0..3`, `shadow-focus` |
| **Movimento** | `motion-duration-*`, `motion-easing-*` (valores já definidos no WEBSITE-2-MOTION-GUIDELINES) |
| **Z-index** | `z-sticky`, `z-overlay`, `z-top` |

### 4.3 Regras de tokens

- Todo valor visual do Website é um token; valores "soltos" são proibidos.
- Tokens mudam apenas em revisão oficial do sistema, nunca em implementação pontual.
- Tokens conceituais são **tema-agnósticos** (não definem cor, fonte ou valor numérico definitivo nesta sprint).

---

## 5. Cores Conceituais

A paleta definitiva **não será escolhida nesta sprint**. Define-se aqui apenas a **filosofia de cor** e o papel de cada família.

### 5.1 Famílias de cor

| Família | Papel no sistema | Filosofia |
|---|---|---|
| **Primária** | A voz institucional do Hub; uso sóbrio e estratégico | Uma única cor de identidade, aplicada com parcimônia; nunca dominante |
| **Neutros** | A base da página: fundos, textos, divisores | A maioria absoluta da superfície; o neutro é o silêncio visual |
| **Acentos** | Ênfase de conversão: CTA, destaques, foco | Reservado para a ação; aparece onde o olhar deve ir |
| **Superfícies** | Hierarquia de fundos: base, elevada, realçada | Distinção por profundidade sutil, nunca por cor chamativa |
| **Estados** | Feedback: sucesso, erro, alerta, neutro | Sempre acompanhados de texto ou ícone; cor nunca é o único sinal |

### 5.2 Regras de cor (derivadas da filosofia)

- **Parcimônia:** cor é ênfase, não decoração. Menos cor é mais sofisticação.
- **Gradientes:** proibidos como elemento decorativo (anti-padrão oficial); no máximo, uso técnico e sutil para estados ou superfícies específicas, com justificativa.
- **Glow:** proibido (WEBSITE-2.5, seção 9).
- **Glassmorphism:** proibido como tratamento de superfície.
- **Temas:** o sistema é projetado para um tema claro, com possibilidade futura de tema escuro a partir dos mesmos tokens (sem trabalho de design duplicado).

---

## 6. Sistema de Contraste

O contraste é tratado como **função do sistema**, não como ajuste posterior.

### 6.1 Níveis de contraste

| Nível | Uso | Exigência |
|---|---|---|
| **Texto (corpo e interface)** | Textos de leitura, rótulos, botões | Conformidade AA (WCAG 2.1) — nunca negociável |
| **Destaque** | Títulos grandes (display e h1–h2) | AA relaxado (texto grande, 18pt+/24px+) |
| **Decorativo** | Divisores, bordas, superfícies | Perceptível sem depender de contraste de texto |

### 6.2 Regras de contraste

- Texto sobre superfície sempre acima do mínimo de contraste AA.
- **A cor nunca é o único sinal de estado** (erro = cor + mensagem; sucesso = cor + confirmação).
- Estados de foco de teclado possuem contraste próprio e visível (acessibilidade não se sacrifica por estética — WEBSITE-2).
- A hierarquia tipográfica nunca é substituída por diferença de cor: texto importante é maior e mais pesado, e somente depois recebe cor.

---

## 7. Iconografia

### 7.1 Filosofia

Ícones são **apoio à leitura**, nunca protagonistas. Comunicam com o mínimo de forma possível.

| Definição conceitual | Regra |
|---|---|
| Estilo | Traço (line) consistente, sem preenchimentos decorativos |
| Espessura de traço | Uniforme em todo o conjunto |
| Tamanhos | Escala restrita (pequeno em apoio, médio em cards, grande somente quando informativo) |
| Formas | Cantos suaves e consistentes com o sistema de raios |
| Comportamento | Movimento curto e preciso em trocas de estado (WEBSITE-2-MOTION-GUIDELINES, seção 8.6) |

### 7.2 Regras

- Ícones são escolhidos por **função**, não por tendência.
- Nenhum ícone animado em loop (anti-padrão oficial).
- Ícones decorativos sem função comunicativa são proibidos.
- Toda superfície com ícone mantém alinhamento óptico consistente.

---

## 8. Ilustrações

### 8.1 Filosofia

Ilustração é usada **somente para explicar conceitos abstratos** (organização, fluxo, controle) — nunca para decorar.

| Definição conceitual | Regra |
|---|---|
| Estilo | Abstrato e geométrico, derivado da identidade do Hub |
| Função | Explicar "como funciona" e transmitir organização |
| Frequência | Rara; uma ilustração por seção, no máximo |
| Movimento | Estático ou com movimento mínimo funcional; nunca contínuo |
| Clichês | Proibidos: nuvens, foguetes, escudos de segurança, cubos 3D genéricos |

### 8.2 Regras

- Toda ilustração precisa de justificativa funcional ou emocional (filosofia WEBSITE-2).
- Ilustração nunca compete com o conteúdo — é coadjuvante didática.
- Visual de "IA genérica" é proibido por definição (WEBSITE-2.5).

---

## 9. Imagens

### 9.1 Filosofia

Imagens fotográficas são **editoriais e raras**, usadas apenas quando acrescentam credibilidade real (por exemplo, contexto de trabalho profissional).

| Definição conceitual | Regra |
|---|---|
| Estilo | Fotografia sóbria, natural, sem filtros pesados |
| Função | Contexto humano ou institucional, em seções pontuais |
| Tratamento | Consistente em todo o Website; mesma grade de enquadramento |
| Prioridade | Conteúdo e velocidade vêm antes de imagens (Vercel — WEBSITE-2.5) |

### 9.2 Regras

- Imagens que não comunicam são proibidas (stock genérico de "aperto de mão" é clichê).
- Toda imagem respeita a largura do grid e possui tratamento unificado.
- Carregamento leve: sem imagens pesadas desnecessárias (performance percebida).

---

## 10. Uso de Vídeo

| Regra | Orientação |
|---|---|
| **Quando usar** | Apenas em Demonstração (mostrar o produto em ação), se aprovado em conteúdo |
| **Como usar** | Reprodução sob demanda do visitante; sem autoplay decorativo |
| **Controle** | Controles nativos, botão de play claro, duração curta |
| **Performance** | Carregamento leve e progressivo; nunca bloquear o texto da seção |
| **Proibido** | Vídeo de fundo em hero, vídeo decorativo em loop, autoplay com som |

---

## 11. Border Radius

### 11.1 Filosofia

Raios são **pequenos e precisos**: transmitem acabamento sem perder sobriedade.

| Nível | Uso conceitual | Caráter |
|---|---|---|
| **Small** | Elementos pequenos: botões, inputs, chips | Preciso, quase reto |
| **Medium** | Cards, caixas de conteúdo | Suave, contido |
| **Surface** | Superfícies amplas: painéis, modais | Confortável, nunca excessivo |
| **Full** | Permitido apenas em elementos circulares (avatars, indicadores) | Exceção, nunca moda |

### 11.2 Regras

- Raios grandes em superfícies de conteúdo são proibidos (anti-padrão estético).
- Raios nunca variam por estado de forma aleatória; hover não altera raio.
- Consistência: o mesmo nível de raio em todos os elementos do mesmo tipo.

---

## 12. Shadows

### 12.1 Filosofia

Sombras comunicam **elevação**, não decoração. São discretas, difusas e sem brilho.

### 12.2 Regras

- Sombra indica profundidade: quanto mais elevada a superfície, mais presente a sombra — sempre com sutileza.
- **Glow é proibido** (sombra com cor vibrante ou brilho).
- Sombra de foco (acessibilidade) é parte do sistema de estados.
- Nenhuma sombra acompanha movimento contínuo ou pulsante.

---

## 13. Elevation

O sistema define **quatro níveis de elevação**, usados de forma previsível:

| Nível | Uso | Sinal |
|---|---|---|
| **0 — Base** | Fundo padrão da página | Plano, sem sombra |
| **1 — Superfícies** | Cards e caixas de conteúdo | Leve profundidade |
| **2 — Interação** | Estados de hover, elementos em destaque | Profundidade perceptível |
| **3 — Sobreposição** | Menus, modais, overlays | Profundidade clara, com escurecimento do fundo |

Regras:

- Níveis são invariantes: um card em hover sobe de 1 para 2, nunca pula níveis.
- Elevação é comunicada por sombra e cor de superfície juntas (nunca apenas por uma delas).
- Nenhum elemento "flutua" sem razão; elevação sempre tem motivo funcional.

---

## 14. Densidade

- O Website opera em **densidade calma**: espaço generoso, respiro constante (WEBSITE-2).
- Densidade nunca é reduzida para "caber mais conteúdo" — o conteúdo é que é reduzido.
- Texto corrido mantém densidade de leitura confortável (ver WEBSITE-3-TYPOGRAPHY.md).
- Superfícies de apoio (cards, FAQ) podem ser levemente mais densas, sem quebrar o respiro geral.

---

## 15. Rhythm

O ritmo visual da página segue uma **escala de espaço única** (ver WEBSITE-3-LAYOUT-SYSTEM.md):

- **Micro-ritmo:** espaços entre elementos de uma mesma unidade (lista de benefícios, pares de FAQ).
- **Meso-ritmo:** espaços entre unidades de uma mesma seção (blocos internos).
- **Macro-ritmo:** espaços entre seções (zonas de respiro da narrativa — WEBSITE-1).

Regras:

- O macro-ritmo é **uniforme e generoso**: seções espaçadas de forma consistente.
- O ritmo acompanha a narrativa: respiro maior antes de momentos de decisão (Demonstração).
- Nunca há ritmo aleatório: todo espaço pertence à escala.

---

## 16. Critérios de Aceite

- [ ] Existir um Design System Foundation oficial do Website do Hub Tributário.
- [ ] Grid, espaçamento, tipografia, layout, containers, densidade e rhythm estarem definidos conceitualmente.
- [ ] Border radius, shadows e elevation estarem definidos como sistema.
- [ ] Iconografia, ilustrações, imagens e vídeo estarem definidos com regras de uso.
- [ ] Tokens conceituais e a estrutura de nomeação existirem.
- [ ] A filosofia de cores e o sistema de contraste estarem definidos sem contradizer WEBSITE 1, 2 e 2.5.
- [ ] A fundação bastar para orientar a criação do design e a implementação posterior.