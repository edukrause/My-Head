# My-Head — HeadCalc

Landing page de uma calculadora SaaS satírica: a matemática é grátis, mas o resultado é premium.

## Sobre

Projeto desenvolvido como atividade de **GitFlow + Pull Request + GitHub Pages**, evoluindo a página "cabeça girando" da aula anterior.

A ideia:

- Calculadora funcional (soma, subtração, multiplicação, divisão, %, ±)
- Ao clicar em `=`, um modal de paywall aparece com 3 planos (Free / Pro / Enterprise)
- Como easter egg, a cabeça da versão anterior fica girando dentro do modal (via GSAP)
- Suporte a teclado

## Stack

- HTML5 + CSS3 (dark, responsivo)
- JavaScript puro
- Bootstrap 5 (grid utilitário)
- GSAP 3 (animação da cabeça)

## Rodar localmente

Basta abrir o `index.html` no navegador — não há build.

## Deploy

Publicado via **GitHub Pages** a partir da branch `main`:

> https://edukrause.github.io/My-Head/

## Estrutura do repositório

```
.
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
├── css/style.css
├── img/cabeca.jpg
├── js/main.js
├── 404.html
├── index.html
└── readme.html
```

## Fluxo de branches

```
main  ← release estável (publicado no Pages)
 └── develop  ← integração
      ├── feature/personalizar-home
      └── feature/github-pages
```
