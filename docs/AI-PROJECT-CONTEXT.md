# AI Project Context v1.0

> **Status:** Oficial — contexto-base otimizado para Inteligências Artificiais
>
> **Finalidade:** permitir que qualquer IA (Claude, ChatGPT, Gemini, Cursor, OpenCode, Copilot e futuras) compreenda o projeto, sua arquitetura, filosofia, DNA, metodologia e hierarquia documental **sem reenviar toda a documentação**.
>
> **Regra:** documento de origem prevalece em divergência; hierarquia completa em AI-DOCUMENT-HIERARCHY.md. Regras obrigatórias de conduta em AI-INSTRUCTIONS.md. Fluxo oficial em AI-WORKFLOW.md.

---

## 1. Visão Geral do Hub

O **Hub Tributário** é uma plataforma de **organização e inteligência tributária** para empresas que levam conformidade a sério. Devolve **controle, ordem e tranquilidade** à área tributária — contabilidade, consultoria, gestores, sócios e diretores.

**Website Institucional:** a representação oficial da plataforma na web — uma **Landing Page única**, de rolagem contínua, separada do repositório principal do Hub.

## 2. Missão

- Apresentar o Hub (o que é, para quem, por que existe).
- Transmitir credibilidade por clareza, organização e acabamento.
- Explicar o propósito: organização e inteligência tributária.
- Gerar contatos qualificados.
- Converter visitantes em **demonstrações** — a única ação principal.

**Ação principal:** Agendar Demonstração. **Ação secundária:** Entrar em Contato.

O Website **não vende sozinho**: constrói confiança antes de qualquer pedido.

## 3. Pilares

- **Valores:** Confiança · Organização · Simplicidade · Elegância · Maturidade.
- **Traços de marca:** Inovação · Confiança · Simplicidade · Profissionalismo.
- **Princípios de conteúdo:** Simplicidade · Velocidade · Clareza · Confiança · Elegância · Foco em conversão.

## 4. Arquitetura Resumida (Website)

- Landing Page única, 9 seções em **ordem imutável**:
  `Hero → Problema → Solução → Como Funciona → Benefícios → Segurança → Demonstração → FAQ → Contato`.
- Jornada narrativa: `DESCONHECIMENTO → RECONHECIMENTO → INTERESSE → CONFIANÇA → AÇÃO`.
- Cada seção responde uma pergunta natural e prepara a seguinte.
- **Fora de escopo:** blog, área do cliente, login, admin, múltiplas páginas, documentação técnica.
- Repositório separado do núcleo do Hub.

> **Estado v1.0 (implementado):** a Landing foi entregue em **cinco telas** — Home, Hub, Inteligência Operacional, Demonstração e Vamos Conversar — mantendo a jornada narrativa e o tom editorial definidos por esta arquitetura de conteúdo. Detalhes de implementação em `README.md`.

## 5. Filosofia de Engenharia

- **Performance percebida é identidade** (lição Vercel/Apple): página leve, carregamento rápido, sem splashes nem animações decorativas de loading.
- **Motion sistematizado** — teto absoluto de **600 ms**; entradas com ease-out ("chega rápido, assenta suave"); linear em destaque proibido; scroll pertence ao usuário; sem parallax dramático; animações só com propósito funcional ou emocional.
- **Tokens antes de valores** — todo valor visual é um token; valores soltos proibidos; tokens mudam só via revisão oficial.
- **Mobile-first, reflow por faixas** — a narrativa nunca muda de ordem em qualquer breakpoint; intenção mobile-first.
- **Acessibilidade inegociável** — WCAG 2.1 AA em texto e interface; foco de teclado sempre visível; leitura nunca abaixo de ~14 px.

## 6. Filosofia Comercial

- **Confiança antes da venda** — nenhuma pressão, urgência, escassez ou contador.
- Conversão é uma **conversa**, não uma venda: CTAs com verbos de conversação ("Agendar uma conversa", "Conhecer o Hub"); nunca verbos de transação ("Comprar", "Assinar").
- Um CTA dominante (Demonstração); Contato como porta alternativa humilde.
- **Promessa consultiva e verificável** — nada que a demonstração não possa confirmar; microcopy nunca excede o que foi prometido.
- Clímax da página: a seção Demonstração ("uma conversa, sem compromisso", ~30 minutos).
- Objeções são respondidas **antes** do momento da ação.

## 7. Filosofia de Design

- **DNA:** "especialista sereno" — calmo, preciso, sóbrio, moderno sem modismo, acessível, seguro.
- Identidade **própria, premium, elegante e atemporal** — nunca visual "gerado por IA", nunca template, nunca mistura das referências.
- **Conteúdo é o protagonista;** design é o cenário. **Tipografia é a protagonista visual.**
- Elegância sobre espetáculo; simplicidade sobre quantidade; clareza antes de criatividade; consistência como respeito.
- **Referências = influência conceitual, jamais cópia** (Raycast, Stripe, Linear, Apple, Notion, Vercel, Resend, Figma, Mercury, Framer, 1Password).
- **Anti-padrões proibidos:** glow exagerado, gradientes decorativos, glassmorphism pesado, cyberpunk, landing SaaS genérica, elementos flutuantes, parallax dramático, loops, bounce, urgência artificial.
- **Regra de ouro:** se um efeito pode ser removido sem perda de comunicação, ele deve ser removido.

## 8. Identidade do Website

- Voz em todos os pontos: **"especialista sereno"** (Profissional · Humano · Claro · Seguro · Especialista · sem arrogância · sem exageros).
- 6 níveis tipográficos, máx. 3 visíveis por seção; máx. 2 pesos por seção.
- Container único ~1120–1200 px; grid 12/8/4 colunas; leitura 45–75 caracteres; texto à esquerda (centralização só em Hero e Demonstração).
- Cor = ênfase, não decoração; neutros dominam; acento reservado à conversão; estados nunca só por cor.
- Motion (teto 600 ms): micro 120–200 ms · transição 200–400 ms · entrada no scroll 300–500 ms · deslocamento 400–600 ms.
- Demonstração é a seção mais contida: menos texto, mais ação.
- Ritmo: micro/meso/macro com escala de espaço única; macrorritmo uniforme, respiro extra antes da Demonstração.

## 9. Arquitetura Multiempresa

A plataforma atende **cada empresa separadamente** — dados, prazos e conformidade por cliente, em isolamento. A segurança dessa arquitetura é comunicada ao visitante na seção Segurança ("é seguro confiar meus dados?").

> **Nota de contexto:** a definição técnica autoritativa da arquitetura Multiempresa — isolamento de dados por empresa (tenant), modelos de dados, permissões — **pertence ao repositório principal do Hub** (Executive Overview / Commercial Framework), não a esta documentação do website. **Não inventar especificações de multiempresa neste repositório** — anuncie a premissa, não a implementação.

## 10. Resumo da Documentação Existente

As Sprints são cumulativas e **não podem se contradizer**: cada documento novo declara a base obrigatória dos anteriores.

| Grupo | Define |
|---|---|
| WEBSITE 1 — Arquitetura | Missão, público, narrativa, estrutura (9 seções) |
| WEBSITE 2 — Filosofia + Experiência + Motion | Valores, princípios, microinterações, motion |
| WEBSITE 2.5 — Benchmark + Catálogo + DNA | Referências (governança), anti-padrões, personalidade |
| WEBSITE 3 — Design System Foundation + Layout + Tipografia | Tokens, grid, escala, contraste, tipografia |
| WEBSITE 4 — Conteúdo + Conversão + Storytelling + Tom | Jornada, promessa central, voz, CTA |
| WEBSITE 4.5 — Creative Brief Master + Moodboards + Claude Design Brief + Design Checklist | Documento mestre da criação, direções conceituais (A/B/C), contrato do Claude, validação eliminatória |
| WEBSITE 5 — Creative Brief | Briefing executivo consolidado — base oficial da etapa de Design |
| WEBSITE 6 — Art Direction Master | Baseline de Direção de Arte — ensina a pensar antes de desenhar (entre o Brief e o Claude) |
| AI-* (este grupo) — Contexto para IA | Resumo, instruções, workflow, hierarquia |

**Documentos externos de origem (repositório principal do Hub):** **Executive Overview** (posicionamento institucional e promessa central do Hub) e **Commercial Framework** (a oferta comercial, limite das promessas e dos CTAs). Consultar somente o necessário.

## 11. Princípios Permanentes

1. Confiança primeiro — nada de pressão, urgência ou promessas não verificáveis.
2. Simplicidade é arquitetura — menos é mais; a remoção é validação.
3. Organização como identidade — em docs, código, layout e fala.
4. Segurança inegociável — dados, conformidade e acessibilidade.
5. Identidade própria — nunca inspiração vira cópia, nunca parece IA/template.
6. Documentação dirige — nada de código, design ou layout antes da documentação aprovada.
7. Documentos de origem prevalecem — contradição é sempre um erro do documento mais recente.
8. Execução livre, estratégia congelada — mudar fundamento exige revisão arquitetural (AI-WORKFLOW).

---

## Critérios de Aceite (deste documento)

- [ ] Reduzir drasticamente o consumo de tokens frente ao reenvio dos arquivos originais.
- [ ] Preservar identidade, DNA, filosofia e limites do Hub Tributário.
- [ ] Não copiar nem duplicar o conteúdo dos documentos de origem; apenas sintetizar decisões.
- [ ] Apontar corretamente como deve ser usada a hierarquia (AI-DOCUMENT-HIERARCHY.md) e o fluxo (AI-WORKFLOW.md).