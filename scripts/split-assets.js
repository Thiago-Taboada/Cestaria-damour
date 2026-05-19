const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'web-cestaria-damour.html'), 'utf8');

const cssMatch = html.match(/<style>\s*([\s\S]*?)\s*<\/style>/);
const jsMatch = html.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/);

if (!cssMatch || !jsMatch || !bodyMatch) {
  console.error('Parse failed');
  process.exit(1);
}

let css = cssMatch[1];
css = css.replace(/grid-template-columns: repeat\(4, 1fr\)/, 'grid-template-columns: repeat(2, 1fr)');
css = css.replace(
  /    \.ig-bio-link:hover \{ color: #25d366; \}\s*    \.social-link\.whatsapp:hover \{ background: #25d366; \}\s*    \.social-row \{[\s\S]*?    \.social-link svg \{ width: 22px; height: 22px; fill: currentColor; \}\s*/,
  '    .ig-bio-link:hover { color: #25d366; }\n\n'
);

const body = bodyMatch[1].replace(/<script>[\s\S]*?<\/script>\s*/, '').trim();

const head = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cestaria D'amour Maceió — Cestas de Café da Manhã e Presentes</title>
  <meta name="description" content="Cestaria D'amour Maceió — Cestas de café da manhã, cestas de lanches e cakes em Maceió. @cestaria.damour">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
`;

const tail = `
  <script src="js/main.js"></script>
</body>
</html>
`;

const outHtml = head + '\n' + body + '\n' + tail;

fs.mkdirSync(path.join(root, 'css'), { recursive: true });
fs.mkdirSync(path.join(root, 'js'), { recursive: true });
fs.writeFileSync(path.join(root, 'css/styles.css'), css.trim() + '\n');
fs.writeFileSync(path.join(root, 'js/main.js'), jsMatch[1].trim() + '\n');
fs.writeFileSync(path.join(root, 'index.html'), outHtml);
fs.writeFileSync(path.join(root, 'web-cestaria-damour.html'), outHtml);
console.log('Created: css/styles.css, js/main.js, index.html, web-cestaria-damour.html');
