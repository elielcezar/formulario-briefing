/* Briefing ICOP — salvamento automático, progresso e envio por e-mail */

// Destino do envio. FormSubmit não exige cadastro nem credenciais:
// no primeiro envio ele manda um e-mail de ativação para o endereço abaixo.
// Para trocar por um endpoint próprio (Resend, por exemplo), basta apontar
// ENDPOINT para a sua URL — o corpo enviado é um JSON simples.
var ENDPOINT = 'https://formsubmit.co/ajax/elielcezar@gmail.com';
var STORAGE_KEY = 'icop-briefing-v1';

var form = document.getElementById('briefingForm');
// Não use "status" como nome: no escopo global ele colide com window.status,
// que é uma propriedade legada de texto e descarta o elemento silenciosamente.
var statusMsg = document.getElementById('status');
var btnSend = document.getElementById('btnSend');
var progressFill = document.getElementById('progressFill');

/* ---------- salvamento automático ---------- */

function salvar() {
  var dados = {};
  form.querySelectorAll('input, textarea, select').forEach(function (el) {
    if (!el.name) return;
    if (el.type === 'checkbox' || el.type === 'radio') {
      if (el.checked) {
        (dados[el.name] = dados[el.name] || []).push(el.value);
      }
    } else if (el.value.trim()) {
      dados[el.name] = el.value;
    }
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (e) {
    /* modo privado ou storage cheio: seguimos sem persistência */
  }
}

function restaurar() {
  var bruto;
  try {
    bruto = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return;
  }
  if (!bruto) return;

  var dados = JSON.parse(bruto);
  form.querySelectorAll('input, textarea, select').forEach(function (el) {
    var valor = dados[el.name];
    if (valor === undefined) return;
    if (el.type === 'checkbox' || el.type === 'radio') {
      el.checked = valor.indexOf(el.value) !== -1;
    } else {
      el.value = valor;
    }
  });
}

/* ---------- barra de progresso ---------- */

function atualizarProgresso() {
  var grupos = {};
  form.querySelectorAll('input, textarea, select').forEach(function (el) {
    if (!el.name) return;
    if (grupos[el.name] === undefined) grupos[el.name] = false;
    var preenchido =
      el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value.trim() !== '';
    if (preenchido) grupos[el.name] = true;
  });

  var nomes = Object.keys(grupos);
  var respondidos = nomes.filter(function (n) {
    return grupos[n];
  }).length;
  progressFill.style.width = (respondidos / nomes.length) * 100 + '%';
}

/* ---------- coleta das respostas ---------- */

function coletar() {
  var dados = {};
  form.querySelectorAll('input, textarea, select').forEach(function (el) {
    if (!el.name) return;
    if (el.type === 'checkbox' || el.type === 'radio') {
      if (el.checked) {
        dados[el.name] = dados[el.name] ? dados[el.name] + ', ' + el.value : el.value;
      }
    } else if (el.value.trim()) {
      dados[el.name] = el.value.trim();
    }
  });
  return dados;
}

/* ---------- envio ---------- */

form.addEventListener('submit', function (evento) {
  evento.preventDefault();

  var dados = coletar();
  if (Object.keys(dados).length === 0) {
    statusMsg.className = 'status erro';
    statusMsg.textContent = 'Responda ao menos uma pergunta antes de enviar.';
    return;
  }

  var quem = dados.email || 'ICOP';
  dados._subject = 'Briefing novo site ICOP — ' + quem;
  dados._template = 'table';
  dados._captcha = 'false';

  btnSend.disabled = true;
  statusMsg.className = 'status';
  statusMsg.textContent = 'Enviando...';

  fetch(ENDPOINT, {
    method: 'POST',
    // O FormSubmit recusa o envio quando não recebe a URL de origem completa, e
    // a política padrão do navegador omite o caminho em requisições cross-origin.
    referrerPolicy: 'unsafe-url',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(dados)
  })
    .then(function (resposta) {
      if (!resposta.ok) throw new Error('HTTP ' + resposta.status);
      return resposta.json();
    })
    .then(function (retorno) {
      if (retorno && String(retorno.success) === 'false') {
        throw new Error(retorno.message || 'Envio recusado');
      }
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      form.innerHTML =
        '<div class="success-box">' +
        '<h2>Briefing enviado!</h2>' +
        '<p>Recebemos suas respostas. Vamos analisar tudo com calma e voltar com uma proposta ' +
        'de estrutura para o novo site. Obrigado pelo tempo dedicado.</p>' +
        '</div>';
      document.querySelector('.toc').style.display = 'none';
      progressFill.style.width = '100%';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(function () {
      btnSend.disabled = false;
      statusMsg.className = 'status erro';
      statusMsg.textContent =
        'Não foi possível enviar agora. Tente novamente ou envie um e-mail para elielcezar@gmail.com.';
    });
});

/* ---------- inicialização ---------- */

restaurar();
atualizarProgresso();

form.addEventListener('input', function () {
  salvar();
  atualizarProgresso();
});
form.addEventListener('change', function () {
  salvar();
  atualizarProgresso();
});
