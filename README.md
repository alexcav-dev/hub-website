# Hub Tributário — Website Institucional

Landing Page oficial do **Hub Tributário** — v1.0 (aprovada e congelada).

O Hub é uma plataforma de **organização e inteligência tributária** que reúne estados, municípios, serviços e obrigações em um único ambiente — com dono, prazo e rastro para cada movimento. Este repositório contém apenas o **website institucional** (marketing/portfólio), separado do repositório principal do Hub.

---

## Propósito

Apresentar o Hub, transmitir credibilidade por clareza e acabamento, e conduzir o visitante a uma **demonstração pessoal** — a única ação principal da página. Nenhuma venda dura: apenas o convite à conversa.

## Contexto

- Landing **100% estática**: HTML + CSS + JavaScript vanilla, sem frameworks, sem build, sem backend.
- Nenhuma informação exibida é real — textos e screenshots são **conceito** (UI demonstrativa), não dados de uma operação existente.
- O Hub real cresce progressivamente conforme a operação é cadastrada; nunca é apresentado como uma base já preenchida.

## Arquitetura

Uma única página em **5 telas (views)** ligadas por um ViewManager próprio (sem roteamento de hash):

| View | Função |
|---|---|
| **Home** | Hero institucional: monograma, placas flutuantes, luz ambiente e CTA de demonstração |
| **Hub** | O que é o Hub: estrutura operacional, fluxo de consulta e pilares |
| **Inteligência** | Inteligência Operacional: como a estrutura gera eficiência |
| **Demonstração** | Vitrine do produto: screenshots modulares navegáveis com lightbox |
| **Vamos Conversar** | Contato: WhatsApp, e-mail, LinkedIn e portfólio |

### Estrutura de diretórios

```
hubwebsite/
├─ index.html          # Única página; monta as 5 views
├─ css/style.css       # Folha única: tokens, base, ambiente, views, responsividade
├─ js/
│  ├─ motion.js        # Motor de movimento (ambiente, luz, placas, monograma, CTA)
│  └─ app.js           # Bootstrap, partículas, eventos, reveal, lightbox, ViewManager
├─ assets/
│  ├─ favicon.svg      # Monograma do Hub
│  └─ landing/         # Screenshots .webp da Demonstração
├─ docs/               # Documentação oficial do processo (sprints WEBSITE-* e AI-*)
└─ fonts/              # (placeholder — fontes servidas via Google Fonts)
```

## Stack & funcionamento

- **HTML semântico** (`section.view.active` única entregue), `aria-*`, `alt`, focus gerenciado no lightbox.
- **CSS**: tokens em `:root` (cores, sombras, escala de espaço, motion), `prefers-reduced-motion` respeitado em todos os sistemas, breakpoints (`1280px`, `960px`, altura `860px/680px`) com fallback de rolagem.
- **JS**: 3 módulos independentes no `app.js` + motor em `motion.js`. Um único `requestAnimationFrame`. `IntersectionObserver` para reveal no scroll e respiração do CTA.
- **Fontes**: Archivo + Inter via Google Fonts (sem self-hosting).
- **Screenshots**: WebP (900–1600 px de largura), abrem em lightbox com zoom-in.

## Demonstração

A view **Demonstração** apresenta capturas de tela conceituais dos módulos: Dashboard, Consulta Tributária (Estado → Município), Personalização, Painel Master (Usuários/Auditoria) e Sistema — cada print com identificador e status. Nada é clicável para fora da Landing: o percurso termina no convite à conversa.

## Inteligência Operacional

A view **Inteligência** traduz a proposta em benefícios: centralização, padronização, rastreabilidade, agilidade, confiabilidade e governança — sempre sem números, sem estatística, sem promessas não verificáveis.

## Contato

| Canal | Valor |
|---|---|
| WhatsApp | `https://wa.me/5511930141234` (mensagem automática no CTA) |
| E-mail | `alexcavalcante1800@gmail.com` |
| LinkedIn | `linkedin.com/in/alex-cavalcante-costa-276483197` |
| Portfólio | `alexcaval-portfolio.vercel.app` |

## Como executar localmente

Sem build, sem instalação:

```bash
# basta servir a pasta raiz (qualquer servidor estático)
python -m http.server 8000
# ou
npx serve
```

Abra `http://localhost:8000`.

## Como publicar (deploy estático)

O site é 100% estático (HTML/CSS/JS/WebP/SVG) — publicável em qualquer hospedagem estática: GitHub Pages, Netlify, Vercel ou Cloudflare Pages. **Não há backend, banco de dados, API ou formulário** na v1.0.

## Estado do projeto

- **Landing v1.0** — concluída e aprovada (baseline congelado).
- **Fase futura (conceito)**: integrações com portais reais, autenticação, multiempresa — fora deste repositório.
- Toda decisão está registrada em `docs/` seguindo a hierarquia `AI-DOCUMENT-HIERARCHY.md`.

## Licença

Nenhuma licença definida: material próprio, para portfolio.