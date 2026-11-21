/* =========================================================================
   SK Jurídico HTML — 14-entrada.js · 🔑 TELA DE LOGIN NA ENTRADA (17/11)
   Igual à Replit: abriu o app em qualquer aparelho (celular, PC, PWA, APK) →
   e-mail + senha → os seus processos aparecem. Ninguém cola endereço nenhum.
   19/11: aparece sempre que você ainda não entrou (sem embutir nada): na 1ª vez
   cola a URL e a chave anon ali mesmo e 📋 copia o comando que cria a tabela. O 🐘 Neon continua do mesmo jeito, por dentro.
   ========================================================================= */
(function (J) {
  'use strict';

  // 🔒 20/11: senha OBRIGATÓRIA toda vez que o app abre (igual ao jurídico). O login da vez passada é esquecido ao abrir.
  // (Dá para desligar em ⚙️ → ☁️ Nuvem → "Pedir a senha toda vez que abrir".) Dentro de outro app não pede.
  let emailAntes = '';
  try {
    const dentro = (() => { try { return window.parent !== window; } catch (e) { return true; } })();
    const raw = localStorage.getItem('meuchat:nuvem:sessao'); const s0 = raw ? JSON.parse(raw) : null;
    if (!dentro && s0 && J.nuvem && J.nuvem.temEmb() && J.pref.get('entrada:sempre', true) !== false) { emailAntes = s0.email || ''; localStorage.setItem('meuchat:nuvem:sessao', 'null'); }
  } catch (e) {}
  const E = J.esc;
  function precisa() {
    const N = J.nuvem; if (!N) return false; try { if (window.parent !== window) return false; } catch (e) { return false; }
    if (N.sessao()) return false;                       // já entrou
    if (N.ehNeon() && N.logado()) return false;         // está usando o Neon
    if (N.temEmb()) return true; // com o Supabase embutido o login é obrigatório
    return !J.pref.get('entrada:pular', false);         // escolheu "só neste aparelho"
  }
  function mostrar() {
    if (J.$('#entrada')) return;
    const w = document.createElement('div');
    w.id = 'entrada';
    w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', 'Entrar');
    w.innerHTML = '<div class="ent-caixa">' +
      '<div class="ent-logo">⚖️</div><h1>SK Jurídico</h1>' +
      '<p class="ent-sub">Entre para ter os seus processos em qualquer aparelho — celular, computador, onde for.</p>' +
      '<label class="ent-rot" for="ent-email">E-mail</label><input id="ent-email" type="email" autocomplete="username" inputmode="email" placeholder="seu@email.com" value="' + E(emailAntes) + '">' +
      '<label class="ent-rot" for="ent-senha">Senha</label><div class="ent-senha"><input id="ent-senha" type="password" autocomplete="current-password" placeholder="mínimo 6"><button type="button" class="ent-olho" data-e="olho" aria-label="Mostrar a senha">👁</button></div>' +
      (J.nuvem.temEmb() ? '' : '<details class="ent-cfg"' + (J.nuvem.config().url ? '' : ' open') + '><summary>⚙ 1ª vez: ligar o seu Supabase (só uma vez por aparelho)</summary>' +
        '<ol class="ent-passos"><li>No <b>supabase.com</b>, abra o seu projeto.</li><li><b>SQL Editor</b> → <b>New query</b> → toque em <b>📋 Copiar o comando das tabelas</b> aqui → cole lá → <b>Run</b>. (Cria a tabela sozinho. Só uma vez. É a mesma do Meu Chat.)</li><li><b>Project Settings → API</b>: copie a <b>Project URL</b> e a chave <b>anon public</b> e cole aqui embaixo.</li></ol>' +
        '<button type="button" class="bt ent-bt" data-e="sql">📋 Copiar o comando das tabelas</button>' +
        '<label class="ent-rot" for="ent-url">Project URL</label><input id="ent-url" autocomplete="off" placeholder="https://xxxx.supabase.co" value="' + E(J.nuvem.config().url) + '">' +
        '<label class="ent-rot" for="ent-anon">Chave anon public</label><input id="ent-anon" autocomplete="off" placeholder="eyJ… ou sb_publishable_…" value="' + E(J.nuvem.config().anon) + '">' +
        '<p class="ent-sub" style="font-size:12px">Essas duas são públicas. Quem protege é o seu e-mail e senha. <b>Nunca</b> cole aqui a "service_role" nem a senha do banco.</p></details>') +
      '<button class="bt forte ent-bt" data-e="entrar">🔑 Entrar</button>' +
      '<button class="bt ent-bt" data-e="criar">✨ Criar conta (1ª vez)</button>' +
      '<p id="ent-msg" class="ent-msg" role="status"></p>' +
      '<div class="ent-rodape"><button class="ent-link" data-e="esqueci">Esqueci a senha</button>' + (J.nuvem.temEmb() ? '' : '<button class="ent-link" data-e="pular">Usar só neste aparelho, sem login</button>') + '</div>' +
      '</div>';
    document.body.appendChild(w);
    const msg = (t, ruim) => { const m = J.$('#ent-msg'); m.textContent = t; m.className = 'ent-msg' + (ruim ? ' ruim' : ''); };
    const campos = () => [J.$('#ent-email').value, J.$('#ent-senha').value];
    setTimeout(() => { try { J.$(emailAntes ? '#ent-senha' : '#ent-email').focus(); } catch (e) {} }, 100);
    w.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target.id === 'ent-senha') { const b = w.querySelector('[data-e="entrar"]'); if (b) b.click(); } });
    w.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-e]'); if (!b) return;
      const a = b.dataset.e;
      if (a === 'olho') { const s = J.$('#ent-senha'); s.type = s.type === 'password' ? 'text' : 'password'; return; }
      if (a === 'sql') { try { await navigator.clipboard.writeText(J.nuvem.SQL); msg('✅ Copiado. Cole no SQL Editor do Supabase e toque em Run.'); } catch (er) { prompt('Copie:', J.nuvem.SQL); } return; }
      if (a === 'pular') { J.pref.set('entrada:pular', true); w.remove(); J.aviso('Tudo fica só neste aparelho. Para entrar depois: ⚙️ Config → ☁️ Nuvem.', 'info', 6000); return; }
      const botoes = [...w.querySelectorAll('button')]; botoes.forEach((x) => { x.disabled = true; });
      try {
        if (a === 'esqueci') { await J.nuvem.esqueci(campos()[0]); msg('📧 Mandei um e-mail para trocar a senha. Abra o e-mail e siga o link.'); return; }
        if (J.$('#ent-url')) { const u = J.$('#ent-url').value.trim(), an = J.$('#ent-anon').value.trim(); if (!/^https:\/\/\S+$/.test(u) || an.length < 20) throw new Error('Primeiro cole a Project URL e a chave anon public (em ⚙ 1ª vez, aqui em cima).'); J.nuvem.salvarConfig(u, an); }
        msg(a === 'criar' ? '⏳ Criando a sua conta…' : '⏳ Entrando…');
        const [email, senha] = campos();
        const r = await J.nuvem.entrar(email, senha, a === 'criar');
        if (r.confirmar) { msg('📧 Conta criada! Abra o e-mail do Supabase, toque no link de confirmação e depois volte aqui e toque em 🔑 Entrar.'); return; }
        msg('✅ Entrou! Trazendo os seus processos…');
        try {
          const s = await J.nuvem.sincronizar(true);
          J.aviso('☁️ Pronto: ' + s.desceu + ' item(ns) chegaram da nuvem, ' + s.subiu + ' foram deste aparelho.', 'ok', 6000);
        } catch (err) { J.aviso('Entrou, mas a nuvem respondeu: ' + err.message, 'erro', 9000); }
        w.remove();
        if (J.nuvem.pintar) J.nuvem.pintar();
        try { if (J.recarregar) J.recarregar(); else if (J.emit) J.emit('nuvem'); } catch (e) {}
      } catch (err) { msg('⚠ ' + err.message, true); }
      finally { botoes.forEach((x) => { x.disabled = false; }); }
    });
  }

  // 🔁 17/11: voltou do e-mail de "esqueci a senha" (o link traz #access_token=…&type=recovery): pede a senha nova
  function recuperacao() {
    const h = new URLSearchParams(String(location.hash || '').replace(/^#/, ''));
    if (h.get('type') !== 'recovery' || !h.get('access_token')) return false;
    const EMB = J.nuvem ? J.nuvem.config() : (window.NUVEM_EMBUTIDA || {}); if (!EMB.url || !EMB.anon) return false;
    const w = document.createElement('div'); w.id = 'entrada'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true');
    w.innerHTML = '<div class="ent-caixa"><div class="ent-logo">🔁</div><h1>Nova senha</h1><p class="ent-sub">Escolha a senha nova (mínimo 6). Depois é só entrar com ela.</p>' +
      '<label class="ent-rot" for="ent-nova">Senha nova</label><input id="ent-nova" type="password" autocomplete="new-password">' +
      '<button class="ent-bt bt forte" data-r="ok">💾 Salvar a senha nova</button><p id="ent-msg" class="ent-msg" role="status"></p></div>';
    document.body.appendChild(w);
    w.querySelector('[data-r="ok"]').onclick = async () => {
      const s = w.querySelector('#ent-nova').value, m = w.querySelector('#ent-msg');
      if (!s || s.length < 6) { m.textContent = '⚠ A senha precisa de pelo menos 6 letras/números.'; m.className = 'ent-msg ruim'; return; }
      try {
        const r = await fetch(String(EMB.url).replace(/\/+$/, '') + '/auth/v1/user', { method: 'PUT', headers: { apikey: EMB.anon, Authorization: 'Bearer ' + h.get('access_token'), 'content-type': 'application/json' }, body: JSON.stringify({ password: s }) });
        if (!r.ok) throw new Error('o link venceu ou já foi usado — peça outro em "Esqueci a senha"');
        history.replaceState(null, '', location.pathname + location.search);
        m.textContent = '✅ Senha trocada! Agora entre com ela.'; m.className = 'ent-msg';
        setTimeout(() => { w.remove(); mostrar(); }, 1500);
      } catch (e) { m.textContent = '⚠ ' + e.message; m.className = 'ent-msg ruim'; }
    };
    return true;
  }
  document.addEventListener('DOMContentLoaded', () => { if (recuperacao()) return; if (precisa()) mostrar(); });
  J.entrada = { mostrar, precisa };
})(window.J);
