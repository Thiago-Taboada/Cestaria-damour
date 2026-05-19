# Cestaria D'amour

Site da **Cestaria D'amour** — cestas de café da manhã, lanches, bandejas de queijos, bolos e doces feitos com carinho em Maceió, AL.

**Site ao vivo:** [https://thiago-taboada.github.io/Cestaria-damour/](https://thiago-taboada.github.io/Cestaria-damour/)

## Sobre o projeto

Landing page estática que apresenta o negócio, os serviços e a galeria de produtos, com visual inspirado no perfil do Instagram [@cestaria.damour](https://www.instagram.com/cestaria.damour/). O foco é facilitar encomendas pelo WhatsApp e reforçar a presença digital da marca.

### Funcionalidades

- Card de perfil estilo Instagram com estatísticas e bio
- Seções: Sobre, Serviços, Galeria e Contato
- Galeria com fotos dos posts do Instagram
- Contadores animados de seguidores e publicações
- Links diretos para WhatsApp e Instagram
- Layout responsivo com menu mobile
- Animações de scroll (reveal e stagger)

## Tecnologias

- HTML5, CSS3 e JavaScript
- [Google Fonts](https://fonts.google.com/) — Cormorant Garamond e Outfit
- [Playwright](https://playwright.dev/) — script opcional para atualizar imagens do Instagram
- Hospedagem via [GitHub Pages](https://pages.github.com/)

## Estrutura do repositório

```
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos
├── js/
│   └── main.js             # Navegação, animações e contadores
├── assets/
│   └── instagram/          # Fotos de perfil, posts e dados extraídos
│       ├── profile.jpg
│       ├── post-1.jpg … post-12.jpg
│       └── profile-data.json
└── scripts/
    ├── scrape-instagram.js # Atualiza imagens e metadados do Instagram
    └── split-assets.js     # Utilitário para separar HTML monolítico em arquivos
```

## Atualizar conteúdo do Instagram

Para baixar novamente a foto de perfil, os posts da grade e os metadados do perfil `@cestaria.damour`:

```bash
npm install
npx playwright install chromium
node scripts/scrape-instagram.js
```

O script salva os arquivos em `assets/instagram/` e gera o `profile-data.json`. Depois de rodar, revise se os números no `index.html` (seguidores, publicações etc.) precisam ser atualizados manualmente.

> **Nota:** O scraping depende da estrutura pública do Instagram e pode exigir ajustes se a plataforma mudar.