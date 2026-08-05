# AI Document Hierarchy v1.0

> **Status:** Oficial — ordem de precedência documental do Hub Tributário
>
> **Finalidade:** definir qual documento prevalece quando houver conflito entre documentos, e como qualquer IA deve resolver divergências.

---

## 1. Princípio Central

**Documento de origem prevalece sobre o resumo.** Documentos anteriores são fonte; documentos posteriores consolidam — se um resumo/consolidação divergir da fonte, a fonte vence.

## 2. Ordem de Precedência (da maior para a menor autoridade)

| Nível | Documentos | Autoridade |
|---|---|---|
| **1** | **Documentos de origem do repositório principal** — Executive Overview (posicionamento institucional, promessa central) e Commercial Framework (a oferta comercial, limite das promessas dos CTAs) | Fonte máxima — não podem ser alterados por este repositório |
| **2** | **Sprints WEBSITE na ordem de criação** — WEBSITE 1 (Arquitetura) → WEBSITE 2 (Filosofia, Experiência, Motion) → WEBSITE 2.5 (Benchmark, Catálogo, DNA) → WEBSITE 3 (Foundation, Layout, Tipografia) → WEBSITE 4 (Conteúdo, Conversão, Storytelling, Tom) | Fonte das decisões; cada sprint só pode detalhar, nunca contradizer as anteriores |
| **3** | **WEBSITE 4.5 — Creative Brief Master** (consolidação única de toda a estratégia de criação) + **Creative Checklist** (validação eliminatória) + **Creative Freeze** (congelamento e revisão) | Consolidação oficial da fase de planejamento; dentro do trio 4.5, o documento próprio prevalece sobre a seção correspondente do Brief (checklist sobre §9, freeze sobre §10) |
| **4** | **Documentos de contexto para IA** — AI-PROJECT-CONTEXT, AI-INSTRUCTIONS, AI-WORKFLOW, AI-DOCUMENT-HIERARCHY | Resumo operacional — nunca fonte de decisões; em divergência com qualquer nível acima, os níveis acima vencem |
| **—** | **Arquivos DEPRECATED** (ex.: versões anteriores de briefs/checklists, handoffs antigos) | Nenhuma autoridade — referência histórica apenas |

## 3. Regras de Resolução de Conflito

1. Identificar os documentos em conflito e seus níveis na tabela acima.
2. **Vence o de nível mais alto** (número menor).
3. Dentro do mesmo nível, vence o **mais específico** sobre o tema do conflito; se ambos são específicos, prevalece o **mais recente** com base declarada.
4. Conflito entre sprint e sua consolidação (4.5): a **sprint de origem vence** em detalhe; a consolidação vence apenas em organização/prazo, nunca em decisão.
5. Conflito com documento externo (nível 1): **o repositório principal vence**; o erro é deste repositório e deve ser corrigido.
6. Toda divergência resolvida deve gerar **registro e nova versão** do documento corrigido — nunca correção silenciosa.

## 4. Resolução na Prática (para IA)

- Ao responder ou gerar algo: usar **sempre** o documento do nível mais alto aplicável ao tema.
- Se faltar informação: **não inventar** — indicar que a decisão pertence ao nível 1 (repositório principal) ou a um documento de sprint, e solicitar.
- Se um resumo (AI-* ou 4.5) contradizer a fonte: seguir a fonte e apontar a divergência no resultado.

---

## Critérios de Aceite

- [ ] A ordem de precedência (origem → sprints → 4.5 → contexto IA) está definida.
- [ ] A regra "documento de origem prevalece" está formalizada.
- [ ] O status de arquivos deprecated está previsto (nenhuma autoridade).
- [ ] Existe procedimento de resolução de conflito e registro de novas versões.