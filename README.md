# Formulário de Briefing

Página estática de briefing para o novo site do **ICOP** (Instituto de Carreira e Orientação Profissional). A ficha é preenchida pela Dra. Rafaela e enviada por e-mail para a equipe de desenvolvimento.

Não há backend, framework nem etapa de build: só HTML, CSS e JavaScript.

## Como abrir

Abra o `index.html` no navegador, ou sirva a pasta com qualquer servidor estático. O envio depende de internet, porque as respostas saem por POST para o [FormSubmit](https://formsubmit.co).

## O que a página faz

- Formulário em 10 seções, com índice no topo para pular entre elas.
- Rascunho salvo automaticamente no `localStorage` (`icop-briefing-v1`). A pessoa pode fechar a página e continuar depois.
- Barra fixa no topo mostrando o quanto já foi respondido.
- Envio das respostas em JSON. O assunto do e-mail fica `Briefing novo site ICOP — [e-mail]`.
- Depois do sucesso, o rascunho local é apagado e a página mostra a confirmação.
- Se o envio falhar, o botão volta a ficar disponível e a mensagem pede para tentar de novo ou escrever para `elielcezar@gmail.com`.

O destino do envio está em `ENDPOINT`, no início de `assets/script.js`. O primeiro envio pelo FormSubmit dispara um e-mail de ativação para esse endereço. Para usar outro serviço (Resend, por exemplo), basta apontar `ENDPOINT` para a URL nova: o corpo enviado continua sendo um JSON simples.

## Seções

1. **Identificação** — e-mail, canal e horário de contato, prazo para o site no ar
2. **Motivo da reconstrução** — o que incomoda no site atual, o que preservar e como medir sucesso
3. **Negócio e prioridades** — nota de 1 a 4 para orientação profissional, carreira, cursos e conteúdo/imprensa
4. **Público** — vestibulando, pais, universitário, profissional em transição, psicólogo, RH, escola, brasileiro no exterior
5. **Jornada e conversão** — canais de chegada, ação desejada e forma de contato
6. **Conteúdo página por página** — Home, Sobre, Orientação Profissional, Orientação de Carreira, Cursos, Depoimentos, Notícias e Contato
7. **Identidade visual** — material de marca, três palavras, sites que admira e que não gosta, estilo visual
8. **Imagens e provas** — banco de fotos
9. **Aspectos técnicos** — quem atualiza, facilidade de edição, acessos, outro idioma, WhatsApp e agenda online
10. **Aberto** — comentário livre

## Arquivos

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura da página e os campos do formulário |
| `assets/style.css` | Visual da marca ICOP e layout responsivo |
| `assets/script.js` | Rascunho, barra de progresso e envio |
| `assets/logo.png` | Logo do ICOP |

## Visual

Cores da marca: roxo `#8d70ae`, verde `#afbc00`, laranja `#ef8009` e ciano `#35c2c9`. Fonte Nunito Sans (Google Fonts). Em telas menores que 720 px, grades e rankings empilham em uma coluna.
