# AI Workflow v1.0

> **Status:** Oficial — fluxo oficial de desenvolvimento do Hub Tributário
>
> **Finalidade:** Documentar a sequência obrigatória de etapas do projeto. Nenhuma etapa avança antes da anterior aprovada; nenhuma etapa é pulada.

---

## O Fluxo

```
Arquitetura → Documentação → Review → Design → Implementação → Validação → Deploy
```

---

## 1. Arquitetura

**O que é:** definição estrutural do que será construído — missão, público, narrativa, seções, escopo (e o que está fora dele).

**Regras:** decisões exclusivamente arquiteturais; nada de layout, conteúdo final ou código. É a base de tudo que vem depois.

**Evidência no projeto:** WEBSITE 1 (Arquitetura da Landing Page).

## 2. Documentação

**O que é:** registro oficial de cada decisão em Markdown, declarando a base obrigatória dos documentos anteriores.

**Regras:** não contradizer o que já é oficial; não inventar; cada sprint produz seus próprios documentos; sem documentação aprovada, a fase seguinte não começa.

**Evidência no projeto:** WEBSITE 1 → 2 → 2.5 → 3 → 4 → 4.5.

## 3. Review

**O que é:** verificação de coerência — o documento não contradiz os anteriores, preserva DNA, anti-padrões e limites; checagem contra os critérios de aceite da sprint e a hierarquia documental.

**Regras:** divergência é defeito do documento mais recente; revisão pode devolver a etapa anterior; nada segue para Design sem um documento "oficial" aprovado.

**Evidência no projeto:** critérios de aceite no final de cada documento; Freeze da 4.5.

## 4. Design

**O que é:** exploração visual **dentro** dos limites congelados pelo Creative Freeze — identidade, layout, componentes, motion, conteúdo visual.

**Regras:** explora-se dentro do sistema; decisões de execução (paleta, fonte, composição) são livres dentro do sistema; mudar bloco congelado (arquitetura, experiência, benchmark, design system, storytelling) exige revisão arquitetural documentada (6 etapas); toda proposta é validada pelo checklist eliminatório (WEBSITE-4.5-CREATIVE-CHECKLIST.md) — um item ⛔ reprova.

## 5. Implementação

**O que é:** tradução do design aprovado em código (a Landing Page do Website).

**Regras:** nunca implementar antes da documentação + design aprovados; respeitar tokens, motion (120–600 ms, ease-out nas entradas), WCAG AA, reflow mobile-first com ordem narrativa imutável; não reintroduzir anti-padrões; nada de valores soltos.

## 6. Validação

**O que é:** verificação técnica e de qualidade — acessibilidade (AA, foco de teclado, reduced-motion), responsividade (ordem de leitura em todas as faixas), desempenho percebido, motion dentro do teto, contraste, estados visíveis.

**Regras:** validar contra o checklist oficial e os critérios de qualidade do Creative Brief; falha eliminatória bloqueia o deploy.

## 7. Deploy

**O que é:** publicação da Landing Page no ar.

**Regras:** somente após Validação aprovada; repositório do Website é separado do repositório principal do Hub.

---

## Regras Gerais do Fluxo

- **Ordem imutável** — nenhuma etapa é pulada ou reordenada.
- **Gate de aprovação** — cada etapa termina com documento/artefato oficial aprovado; sem aprovação, não avança.
- **Revisão arquitetural** — mudanças estruturais em blocos congelados seguem 6 etapas: Solicitação → Impacto → Revisão → Decisão → Registro → Atualização (nova versão documentada, nunca alteração silenciosa).
- **Validação eliminatória** — propostas de design que falham em item ⛔ do checklist são devolvidas antes de avançar.

---

## Critérios de Aceite

- [ ] O fluxo oficial (Arquitetura → Documentação → Review → Design → Implementação → Validação → Deploy) está documentado.
- [ ] Cada etapa tem definição, regras e evidência no projeto.
- [ ] A regra "sem documentação aprovada não há Design/Implementação" está formalizada.
- [ ] O processo de revisão arquitetural e a validação eliminatória estão registrados.