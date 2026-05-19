---
name: instagram-a-web
description: "Converte um perfil do Instagram em uma web profissional de marca pessoal. Use esta skill quando o usuário quiser criar uma web a partir do Instagram, converter seu perfil em web, fazer uma web de marca pessoal ou qualquer variação de gerar um site a partir de um perfil do Instagram. Triggers: 'converte meu Instagram em web', 'web de marca pessoal', 'web a partir do meu Instagram', 'quero uma web como meu perfil', 'web para influencer', 'web para criador de conteúdo', 'landing de marca pessoal', 'web a partir do meu @'."
---

# Instagram → Web de Marca Pessoal

Você converte um perfil do Instagram em uma web profissional de marca pessoal. A web deve refletir a identidade, o estilo e a personalidade do perfil real.

**Regra fundamental: não invente nenhum dado.** Não invente serviços, preços, depoimentos, clientes nem biografia. Tudo deve vir do perfil real ou ser fornecido pelo usuário.

---

## Passo 1 — Obter os dados e fotos do perfil

Peça ao usuário o seu **@handle do Instagram**.

### 1A. Extração automática (sempre tentar primeiro)

Tente extrair dados e fotos do perfil nesta ordem de prioridade:

**Opção 1 — Firecrawl MCP** (se estiver disponível):
Use para fazer scraping de `https://www.instagram.com/[handle]/`. Extraia dados do perfil e imagens.

**Opção 2 — Playwright** (instalar automaticamente se não estiver disponível):

Verifique se está disponível e instale se faltar:
```bash
# Verificar e instalar se faltar
node -e "require('playwright')" 2>/dev/null || (npm install playwright && npx playwright install chromium)
```

**Importante**: antes de executar a instalação, avise o usuário para que ele não se assuste:
> "Estou preparando as ferramentas para acessar o Instagram. Na primeira vez demora um pouco (30-60 segundos), mas isso só acontece uma vez."

Se a instalação falhar (permissões, sem Node.js, etc.), não trave — pule para o passo 1D e pergunte ao usuário. Diga de forma amigável:
> "Não consegui instalar as ferramentas de navegação automática. Sem problema — vou pedir os dados diretamente e a web ficará igualmente boa."

Com o Playwright disponível, crie e execute um script que:
1. Navegue para `https://www.instagram.com/[handle]/`
2. Espere o perfil carregar (aguardar seletor da bio ou timeout)
3. Extraia do DOM: nome, bio, categoria, stats (seguidores/posts/seguidos), link na bio
4. Extraia as URLs das imagens dos posts visíveis no grid
5. Baixe as imagens para `assets/instagram/`
6. Baixe a foto de perfil para `assets/instagram/profile.jpg`

Dicas para o scraping do Instagram:
- Os meta tags (`og:description`, `og:title`, `og:image`) são os mais confiáveis — normalmente contêm nome, stats e foto de perfil
- O formato do meta description costuma ser: "X Followers, Y Following, Z Posts - bio text"
- As imagens dos posts ficam em tags `<img>` dentro do grid — filtre as que não sejam ícones ou avatares pequenos
- O Instagram muda os seletores com frequência — se um falhar, tente alternativas
- Faça scroll para carregar mais imagens caso o grid inicial tenha poucas

**Opção 3 — WebFetch**:
Baixe `https://www.instagram.com/[handle]/` e faça o parse do que for possível no HTML.

### 1B. Extração de outras redes sociais

Depois de obter os dados do Instagram, procure o usuário em outras plataformas para:
- **Somar seguidores totais** entre todas as redes (Instagram + Threads + TikTok + YouTube + LinkedIn + X + Skool, etc.)
- **Obter mais contexto** sobre sua atividade profissional
- **Encontrar depoimentos** em páginas de formação (Skool, academias, etc.)

Use WebSearch para buscar o nome + handle do usuário em outras plataformas. Se ele tiver comunidades (Skool, Discord, etc.), procure também os depoimentos publicados lá.

Para cada rede encontrada, tente obter o número de seguidores com Playwright ou WebFetch. Se não conseguir, pergunte ao usuário.

### 1C. O que você precisa extrair

**Dados do perfil do Instagram:**
- Nome completo
- Bio / descrição
- Categoria profissional
- Número de seguidores, seguindo e publicações
- Link na bio
- Foto de perfil

**Fotos de posts (o objetivo principal):**
- As imagens visíveis do grid de posts (as primeiras 6-12)
- Baixe para `assets/instagram/post-1.jpg`, `post-2.jpg`, etc.
- Essas fotos serão usadas na galeria/portfolio e no hero da web

**Dados de outras redes:**
- Seguidores em cada plataforma encontrada
- Total de comunidade somando todas as redes
- Depoimentos de clientes/alunos, se existirem em plataformas públicas

### 1D. Se o scraping falhar ou for parcial

Diga ao usuário de forma clara e amigável:

> "Não consegui acessar seu perfil automaticamente (o Instagram bloqueia bastante). Preciso que você me ajude com duas coisas:
>
> 1. **Seus dados**: copie aqui sua bio, com o que você trabalha, serviços com preços, email e redes
> 2. **Suas fotos**: baixe 6-12 fotos dos seus posts favoritos e coloque na pasta `assets/instagram/` que criei aqui"

Crie a pasta `assets/instagram/` automaticamente:

```bash
mkdir -p assets/instagram
```

**Alternativa**: diga que ele pode exportar seus dados pelo Instagram: Configurações → Sua atividade → Baixar suas informações.

### 1E. Perguntas complementares (depois de ter os dados base)

- **Bio completa** (se não foi possível extrair)
- **Com o que você trabalha** (fotógrafo, coach, designer, nutricionista, etc.)
- **Serviços reais** com preços, se tiver — se disser que não quer colocar preços ou que é "sob orçamento", respeite e não coloque preços
- **Email ou forma de contato**
- **Link que você tem na bio**

### Bloco 2 — Identidade visual (perguntar depois)

- **Cores da marca** — se tiver web ou materiais, extraia as cores de lá com WebFetch. Se não tiver, proponha 2-3 paletas que combinem com o perfil e deixe o usuário escolher
- **Slogan ou frase principal** — se a bio tiver uma boa, proponha essa. Se não, ofereça 2-3 opções
- **Fotos adicionais** — além das fotos do Instagram, pergunte se tem fotos profissionais ou logo

### Bloco 3 — Conteúdo opcional

- **Depoimentos de clientes reais** — se você encontrou no Skool/web/Google, mostre ao usuário e pergunte se ele quer usar. Se não tiver, **omita a seção**
- **Portfolio / trabalhos reais** — se tiver exemplos do trabalho, inclua
- **Redes sociais** — URLs reais de todas as redes

---

## Passo 2 — Adaptar ao tipo de marca pessoal

A web de um fotógrafo deve parecer completamente diferente da web de um coach de negócios. Adapte tudo ao perfil.

### Guia de adaptação

**Fotógrafo / Videógrafo / Criativo visual**
- Tom: visual, artístico, imersivo
- Seção principal: Portfolio/Galeria com grid grande e marcante
- A web deve ser quase toda visual — as fotos são as protagonistas
- CTA: "Reserve sua sessão" / "Ver portfolio"

**Coach / Consultor / Mentor**
- Tom: inspirador, profissional, próximo
- Seção principal: Serviços/Programas com descrição clara do que oferece
- Social proof importante: número de alunos, depoimentos, comunidade
- CTA: "Agende uma chamada" / "Comece sua transformação"

**Influencer / Criador de conteúdo**
- Tom: fresco, pessoal, autêntico
- Seção principal: Conteúdo em destaque / Colaborações
- Stats de todas as redes como social proof
- CTA: "Colabore comigo" / "Contato para marcas"

**Freelancer / Designer / Desenvolvedor**
- Tom: profissional, moderno, limpo
- Seção principal: Portfolio com projetos reais
- Skills técnicas em badges ou barras
- CTA: "Vamos falar sobre seu projeto" / "Ver trabalhos"

**Nutricionista / Fitness / Saúde**
- Tom: energético, saudável, motivador
- Seção principal: Planos/Programas com preços (se foram fornecidos)
- Resultados de clientes, se tiver
- CTA: "Comece seu plano" / "Consulta grátis"

**Artista / Músico / Performer**
- Tom: expressivo, imersivo, emotivo
- Seção principal: Galeria/Shows/Obra
- Audio/video embeds, se tiver links
- CTA: "Ouça meu trabalho" / "Próximos eventos"

---

## Passo 3 — Gerar a web

Crie **um único arquivo HTML** autocontido com CSS e JS inline. Sem dependências externas, exceto Google Fonts.

### Princípio criativo

Você tem liberdade total para desenhar. A web deve parecer uma extensão natural do perfil do Instagram — mesma energia, mesmo estilo, mas em formato web profissional. Faça com que seja única, não um template genérico.

Requisitos técnicos:
- **Responsive** (mobile, tablet, desktop)
- **Performance** (sem bibliotecas externas pesadas)
- **Acessibilidade básica** (contraste, tamanhos legíveis)

### Idioma

O mesmo usado pelo usuário na conversa.

### Seções

Inclua nesta ordem. Omita as que não se aplicarem:

1. **Navegação fixa** — Com o nome/marca do usuário. Blur + semitransparente ao scroll. Links para as seções.

2. **Hero com cartão de perfil do Instagram** — O hero deve incluir um cartão premium que simule a parte superior de um perfil do Instagram, mas com design elevado. O cartão deve conter:
   - **Foto de perfil** com anel decorativo animado (estilo stories do IG, com gradiente que gira)
   - **Stats reais**: publicações, seguidores e seguindo — visíveis diretamente, não animados (o usuário quer ver os números imediatamente)
   - **Nome com tick de verificação azul** — um badge circular azul com gradiente e check branco ao lado do nome. Estilo premium com sombra sutil
   - **Handle do Instagram** como link clicável
   - **Categoria profissional** e localização, se tiver
   - **Bio real** exatamente como está
   - **Botões de ação** estilo IG: Contatar, Serviços, Seguir (ou os que fizerem sentido)
   - **Mini grid de 6 fotos** dos posts mais recentes no final do cartão

   Abaixo do cartão, um título grande com o propósito/missão do usuário e o **total de comunidade somando todas as redes**.

3. **Sobre mim** — Bio real expandida (baseada no que foi fornecido, sem inventar). Áreas de expertise em badges/pills. Fotos reais do Instagram em grid visual. Apenas informações que o usuário tenha fornecido.

4. **Serviços** — Apenas com serviços REAIS. Se o usuário disse que não quer colocar preços, não coloque — use "Sob orçamento" ou algo similar. Se não forneceu serviços, omita a seção. Se tiver uma comunidade/formação em destaque (como Skool), crie uma seção própria com seus stats.

5. **Galeria / Conteúdo** — Use as fotos reais baixadas do Instagram com rotas relativas a `assets/instagram/`. Grid visual atraente com hover effects. As fotos são o maior ativo visual — faça com que sejam protagonistas.

6. **Métricas** — Barra de stats com os dados reais mais impactantes (casos de sucesso, países, comunidade total, anos de experiência). Apenas dados reais fornecidos ou extraídos. Números com counter animation ao entrar no viewport.

7. **Depoimentos** — **Apenas depoimentos reais** encontrados no Skool, web ou fornecidos pelo usuário. Escolha os mais fortes — aqueles que mencionam resultados concretos (clientes fechados, faturamento, transformação). Respeite a quantidade exata que você tem.

8. **Contato + Footer** — Formulário, email real, links para TODAS as redes reais com ícones. CTA direto para o Instagram. Copyright com nome e ano.

### Efeitos de scroll obrigatórios

Implemente com **Intersection Observer nativo**:

- **Reveal animations** — Elementos aparecem ao entrar no viewport
- **Stagger** — Grids/listas entram de forma escalonada
- **Counter** — Números das métricas contam a partir de 0
- **Parallax** — Pelo menos 1 seção com movimento diferencial
- **Hover effects** — Cards respondem ao hover

Escolha as animações que melhor combinem com a personalidade do perfil.

### Design visual

- **Tema**: escolha de acordo com a marca pessoal — escuro para tech/criativos, claro para coaches/saúde
- **Tipografia**: 2-3 fontes do Google Fonts que reflitam a personalidade do perfil
- **Paleta**: as cores escolhidas pelo usuário ou extraídas da web/marca dele
- **Detalhes criativos**: scrollbar personalizada, elementos decorativos, gradientes, linha dourada de acento no cartão IG — o que for necessário para que pareça premium e pessoal
- **Instagram como fio condutor**: a web nasce do perfil do Instagram — isso deve ficar visualmente claro no cartão do hero, nas fotos, nos stats e nos links proeminentes para o perfil

---

## Passo 4 — Salvar e abrir

- Salve como `web-[handle].html` (sem o @, em kebab-case)
- Abra automaticamente no navegador

---

## Passo 5 — Apresentar o resultado

Mostre:

1. Nome do arquivo gerado
2. Seções incluídas
3. De onde saiu cada dado (extraído do Instagram / extraído de outra rede / fornecido pelo usuário)
4. **Seguidores totais** — detalhamento por rede e soma total
5. **Fotos utilizadas** — quantas foram baixadas do Instagram e onde estão (`assets/instagram/`)
6. **Dados que faltam** — placeholders que o usuário deve preencher
7. Pergunte se quer ajustar algo

Não mostre preços sugeridos nem conselhos de venda.
