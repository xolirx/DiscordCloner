import './style.css';

(function() {
  const cfg = {
    maxLogs: 200,
    apiBase: 'https://discord.com/api/v10',
    retry: 3,
    delay: 1000
  };

  let state = {
    token: null,
    user: null,
    cloning: false,
    cancel: false,
    guilds: [],
    emailVis: false,
    abort: null
  };

  const $ = (id) => document.getElementById(id);
  const esc = (s) => {
    let d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const toast = (m) => {
    let t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = m;
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 300);
    }, 2000);
  };

  const showErr = (el, m) => {
    if (el) {
      el.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${esc(m)}`;
      el.style.display = 'flex';
      setTimeout(() => { el.style.display = 'none'; }, 4000);
    }
  };

  function addLog(msg, type = 'info') {
    let log = $('log');
    if (!log) return;
    let t = new Date().toLocaleTimeString('ru-RU');
    let icons = {
      success: '<i class="fas fa-check-circle"></i>',
      error: '<i class="fas fa-exclamation-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      info: '<i class="fas fa-info-circle"></i>'
    };
    let e = document.createElement('div');
    e.className = `log-entry log-${type}`;
    e.innerHTML = `<span class="log-time">${t}</span><span class="log-msg">${icons[type] || icons.info} ${esc(msg)}</span>`;
    log.appendChild(e);
    log.scrollTop = log.scrollHeight;
    if (log.children.length > cfg.maxLogs) log.removeChild(log.children[0]);
  }

  async function fetchRetry(url, opts, retries = cfg.retry) {
    if (state.cancel) throw new Error('CANCELLED');
    let sig = state.abort?.signal;
    for (let i = 0; i < retries; i++) {
      if (state.cancel) throw new Error('CANCELLED');
      try {
        let res = await fetch(url, { ...opts, signal: sig });
        if (res.status === 429) {
          let w = parseInt(res.headers.get('Retry-After')) || 3;
          await sleep(w * 1000);
          continue;
        }
        if (!res.ok && i === retries - 1) throw new Error(`HTTP ${res.status}`);
        if (!res.ok) { await sleep(cfg.delay * (i + 1)); continue; }
        return res;
      } catch (e) {
        if (e.name === 'AbortError') throw new Error('CANCELLED');
        if (i === retries - 1) throw e;
        await sleep(cfg.delay * (i + 1));
      }
    }
    throw new Error('MAX_RETRIES');
  }

  function toggleTheme() {
    document.body.classList.toggle('light-theme');
    let btn = $('themeToggle');
    if (btn) {
      let i = btn.querySelector('i');
      i.classList.toggle('fa-moon');
      i.classList.toggle('fa-sun');
    }
  }

  function toggleEmail() {
    state.emailVis = !state.emailVis;
    let btn = $('toggleEmailBtn');
    let emailEl = $('userEmail');
    if (!btn || !emailEl) return;
    if (state.emailVis && state.user?.email) {
      emailEl.textContent = state.user.email;
      btn.innerHTML = '<i class="fas fa-eye-slash"></i> Скрыть';
    } else if (state.user?.email) {
      emailEl.textContent = state.user.email.replace(/./g, '\u2022');
      btn.innerHTML = '<i class="fas fa-eye"></i> Показать';
    }
  }

  function logout() {
    state.token = null;
    state.user = null;
    state.guilds = [];
    sessionStorage.clear();
    $('authView').classList.remove('hidden');
    $('mainView').classList.add('hidden');
    $('tokenInput').value = '';
    addLog('Выход из аккаунта', 'info');
    toast('<i class="fas fa-sign-out-alt"></i> Вы вышли из аккаунта');
  }

  function clearLogs() {
    let log = $('log');
    if (log) { log.innerHTML = ''; addLog('Логи очищены', 'info'); }
  }

  function exportLogs() {
    let log = $('log');
    if (!log) return;
    let lines = Array.from(log.children).map((e) => {
      let t = e.querySelector('.log-time')?.textContent;
      let m = e.querySelector('.log-msg')?.textContent;
      return `[${t}] ${m}`;
    }).join('\n');
    let blob = new Blob([`Discord Cloner Logs\n${new Date().toLocaleString()}\n${'='.repeat(50)}\n${lines}`], { type: 'text/plain' });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `clone_logs_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('<i class="fas fa-check-circle"></i> Логи экспортированы');
  }

  async function loadGuilds() {
    if (!state.token) return [];
    try {
      let r = await fetch(`${cfg.apiBase}/users/@me/guilds`, { headers: { 'Authorization': state.token } });
      if (r.ok) { state.guilds = await r.json(); state.guilds.sort((a, b) => a.name.localeCompare(b.name)); }
      return state.guilds;
    } catch (e) { return []; }
  }

  async function showServerList() {
    if (state.guilds.length === 0) await loadGuilds();
    let container = $('serverListContainer');
    if (!container) return;
    if (state.guilds.length) {
      let h = '<div style="color:var(--text-secondary);margin-bottom:0.5rem;padding:0 0.5rem"><i class="fas fa-arrow-down"></i> Нажмите для вставки ID:</div>';
      state.guilds.slice(0, 25).forEach((g) => {
        h += `<div class="server-item" data-id="${esc(g.id)}"><span style="display:flex;align-items:center;gap:0.5rem"><img src="https://cdn.discordapp.com/icons/${g.id}/${g.icon || 'default'}.png?size=32" style="width:20px;height:20px;border-radius:50%" onerror="this.style.display='none'"><span>${esc(g.name)}</span></span><span class="server-id">${g.id}</span></div>`;
      });
      container.innerHTML = h;
      container.classList.remove('hidden');
      container.querySelectorAll('.server-item').forEach((item) => {
        item.addEventListener('click', () => {
          $('sourceId').value = item.dataset.id;
          container.classList.add('hidden');
          addLog(`ID вставлен: ${item.dataset.id}`, 'info');
        });
      });
    }
  }

  async function validateServers() {
    let s = $('sourceId').value.trim();
    let t = $('targetId').value.trim();
    let result = $('serverValidationResult');
    if (!s || !t) {
      result.style.display = 'flex';
      result.style.color = '#ff7b7b';
      result.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Введите оба ID';
      setTimeout(() => result.style.display = 'none', 3000);
      return;
    }
    result.style.display = 'flex';
    result.style.color = 'var(--text-secondary)';
    result.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Проверка...';
    try {
      let [src, tgt] = await Promise.all([
        fetch(`${cfg.apiBase}/guilds/${s}`, { headers: { 'Authorization': state.token } }),
        fetch(`${cfg.apiBase}/guilds/${t}`, { headers: { 'Authorization': state.token } })
      ]);
      if (!src.ok && !tgt.ok) {
        result.style.color = '#ff7b7b';
        result.innerHTML = '<i class="fas fa-exclamation-circle"></i> Оба сервера не найдены';
      } else if (!src.ok) {
        result.style.color = '#ff7b7b';
        result.innerHTML = '<i class="fas fa-exclamation-circle"></i> Исходный сервер не найден';
      } else if (!tgt.ok) {
        result.style.color = '#ff7b7b';
        result.innerHTML = '<i class="fas fa-exclamation-circle"></i> Целевой сервер не найден';
      } else {
        let sg = await src.json();
        let tg = await tgt.json();
        result.style.color = '#7fe07f';
        result.innerHTML = `<i class="fas fa-check-circle"></i> ${esc(sg.name)} \u2192 ${esc(tg.name)}`;
        if (s === t) result.innerHTML += ' <span style="color:#e6b450"><i class="fas fa-exclamation-triangle"></i> Одинаковые ID</span>';
      }
      setTimeout(() => result.style.display = 'none', 5000);
    } catch (e) { result.style.display = 'none'; }
  }

  function convertOverwrites(ow, targetId, roleMap, srcId) {
    if (!ow || !Array.isArray(ow)) return [];
    return ow.map((o) => {
      if (!o || !o.id) return null;
      let id = o.id;
      if (o.type === 0) {
        if (o.id === srcId) id = targetId;
        else if (roleMap && roleMap[o.id]) id = roleMap[o.id];
        else return null;
      } else if (o.type === 1) id = targetId;
      return { id, type: o.type, allow: o.allow?.toString() || '0', deny: o.deny?.toString() || '0' };
    }).filter((o) => o !== null);
  }

  async function copyIcon(src, tgt, token) {
    try {
      let r = await fetch(`${cfg.apiBase}/guilds/${src}`, { headers: { 'Authorization': token } });
      if (!r.ok) return false;
      let g = await r.json();
      if (!g.icon) return false;
      let img = await fetch(`https://cdn.discordapp.com/icons/${src}/${g.icon}.png?size=256`);
      if (!img.ok) return false;
      let blob = await img.blob();
      if (blob.size > 262144) { addLog('\u0418\u043a\u043e\u043d\u043a\u0430 >256kb', 'warning'); return false; }
      let reader = new FileReader();
      let data = await new Promise((res) => { reader.onloadend = () => res(reader.result); reader.readAsDataURL(blob); });
      let base64 = data.split(',')[1];
      let upd = await fetch(`${cfg.apiBase}/guilds/${tgt}`, {
        method: 'PATCH', headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ icon: base64 })
      });
      if (upd.ok) addLog('\u0418\u043a\u043e\u043d\u043a\u0430 \u0441\u043a\u043e\u043f\u0438\u0440\u043e\u0432\u0430\u043d\u0430', 'success');
      return upd.ok;
    } catch (e) { return false; }
  }

  function confetti() {
    let colors = ['#a0a0a0', '#c0c0c0', '#e0e0e0', '#808080', '#b0b0b0', '#d0d0d0'];
    for (let i = 0; i < 60; i++) {
      let p = document.createElement('div');
      p.className = 'confetti';
      p.style.left = Math.random() * innerWidth + 'px';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.width = Math.random() * 8 + 4 + 'px';
      p.style.height = p.style.width;
      p.style.animationDelay = Math.random() * 0.5 + 's';
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove());
    }
  }

  function resetClone() {
    state.cloning = false;
    state.abort = null;
    $('cloneBtn').disabled = false;
    $('cancelCloneBtn').disabled = true;
    $('backgroundStatus').classList.remove('show');
    $('progressFill').style.width = '0%';
  }

  function cancelClone() {
    if (state.cloning) {
      state.cancel = true;
      state.abort?.abort();
      addLog('\u041e\u0442\u043c\u0435\u043d\u0430...', 'warning');
      $('cancelCloneBtn').disabled = true;
    }
  }

  function showAgreement() {
    if (!$('sourceId').value.trim() || !$('targetId').value.trim()) return showErr($('cloneError'), '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 ID \u043e\u0431\u043e\u0438\u0445 \u0441\u0435\u0440\u0432\u0435\u0440\u043e\u0432');
    if ($('sourceId').value.trim() === $('targetId').value.trim()) return showErr($('cloneError'), '\u0421\u0435\u0440\u0432\u0435\u0440\u044b \u043d\u0435 \u043c\u043e\u0433\u0443\u0442 \u0431\u044b\u0442\u044c \u043e\u0434\u0438\u043d\u0430\u043a\u043e\u0432\u044b\u043c\u0438');
    $('rule1').checked = $('rule2').checked = $('rule3').checked = false;
    $('confirmRulesBtn').disabled = true;
    $('agreementModal').classList.add('active');
  }

  function closeModal() {
    $('agreementModal').classList.remove('active');
  }

  function checkRules() {
    $('confirmRulesBtn').disabled = !($('rule1').checked && $('rule2').checked && $('rule3').checked);
  }

  function confirmRules() {
    if ($('rule1').checked && $('rule2').checked && $('rule3').checked) {
      closeModal();
      startClone();
    }
  }

  async function authorize() {
    let t = $('tokenInput').value.trim();
    if (!t) return showErr($('authError'), '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u043e\u043a\u0435\u043d');
    $('loginBtn').innerHTML = '<span class="spinner"></span>';
    $('loginBtn').disabled = true;
    try {
      let r = await fetch(`${cfg.apiBase}/users/@me`, { headers: { 'Authorization': t } });
      if (r.ok) {
        let u = await r.json();
        state.token = t;
        state.user = u;
        sessionStorage.setItem('discord_token', t);
        sessionStorage.setItem('discord_user', JSON.stringify(u));
        $('userName').textContent = u.global_name || u.username;
        $('userId').textContent = `ID: ${u.id}`;
        if (u.email) {
          $('userEmail').textContent = u.email.replace(/./g, '\u2022');
          $('toggleEmailBtn').innerHTML = '<i class="fas fa-eye"></i> \u041f\u043e\u043a\u0430\u0437\u0430\u0442\u044c';
        }
        if (u.avatar) $('userAvatar').src = `https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`;
        $('authView').classList.add('hidden');
        $('mainView').classList.remove('hidden');
        addLog(`\u0410\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f: ${u.username}`, 'success');
        toast(`<i class="fas fa-check-circle"></i> \u0414\u043e\u0431\u0440\u043e \u043f\u043e\u0436\u0430\u043b\u043e\u0432\u0430\u0442\u044c, ${esc(u.global_name || u.username)}`);
        await loadGuilds();
      } else {
        let errMsg = '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u0442\u043e\u043a\u0435\u043d';
        if (r.status === 401) errMsg = '\u0422\u043e\u043a\u0435\u043d \u043d\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043b\u0435\u043d \u0438\u043b\u0438 \u043f\u0440\u043e\u0441\u0440\u043e\u0447\u0435\u043d';
        showErr($('authError'), errMsg);
      }
    } catch (e) { showErr($('authError'), '\u041e\u0448\u0438\u0431\u043a\u0430 \u043f\u043e\u0434\u043a\u043b\u044e\u0447\u0435\u043d\u0438\u044f'); }
    finally {
      $('loginBtn').innerHTML = '<i class="fas fa-sign-in-alt"></i> \u0412\u043e\u0439\u0442\u0438';
      $('loginBtn').disabled = false;
    }
  }

  async function testToken() {
    let t = $('tokenInput').value.trim();
    if (!t) return showErr($('authError'), '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u043e\u043a\u0435\u043d');
    $('testTokenBtn').innerHTML = '<span class="spinner"></span>';
    $('testTokenBtn').disabled = true;
    try {
      let r = await fetch(`${cfg.apiBase}/users/@me`, { headers: { 'Authorization': t } });
      if (r.ok) {
        let u = await r.json();
        toast(`<i class="fas fa-check-circle"></i> \u0422\u043e\u043a\u0435\u043d \u0440\u0430\u0431\u043e\u0447\u0438\u0439 (${esc(u.username)})`);
      } else showErr($('authError'), '\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u0442\u043e\u043a\u0435\u043d');
    } catch (e) { showErr($('authError'), '\u041e\u0448\u0438\u0431\u043a\u0430'); }
    finally {
      $('testTokenBtn').innerHTML = '<i class="fas fa-check-circle"></i> \u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c';
      $('testTokenBtn').disabled = false;
    }
  }

  function pasteToken() {
    navigator.clipboard.readText().then((t) => {
      if (t) { $('tokenInput').value = t; toast('<i class="fas fa-paste"></i> \u0422\u043e\u043a\u0435\u043d \u0432\u0441\u0442\u0430\u0432\u043b\u0435\u043d'); }
    }).catch(() => toast('<i class="fas fa-exclamation-triangle"></i> \u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c'));
  }

  function switchSection(sec) {
    ['mainContent', 'toolsContent', 'fixesContent', 'supportContent'].forEach((s) => {
      let el = $(s);
      if (el) el.classList.add('hidden');
    });
    let map = { main: 'mainContent', tools: 'toolsContent', fixes: 'fixesContent', support: 'supportContent' };
    let target = $(map[sec]);
    if (target) target.classList.remove('hidden');
    if (sec === 'tools') { let el = $('toolResultContainer'); if (el) el.innerHTML = ''; }
  }

  async function startClone() {
    if (state.cloning) return;
    state.cloning = true;
    state.cancel = false;
    state.abort = new AbortController();
    $('cloneBtn').disabled = true;
    $('cancelCloneBtn').disabled = false;
    $('backgroundStatus').classList.add('show');
    $('cloneError').style.display = 'none';
    let src = $('sourceId').value.trim();
    let tgt = $('targetId').value.trim();
    if (!/^\d{17,20}$/.test(src) || !/^\d{17,20}$/.test(tgt)) {
      addLog('\u041d\u0435\u0432\u0435\u0440\u043d\u044b\u0439 \u0444\u043e\u0440\u043c\u0430\u0442 ID', 'error');
      resetClone();
      return;
    }
    try {
      addLog('\u0421\u0442\u0430\u0440\u0442 \u043a\u043b\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f', 'info');
      let gRes = await fetch(`${cfg.apiBase}/users/@me/guilds`, { headers: { 'Authorization': state.token } });
      let guilds = await gRes.json();
      let targetGuild = guilds.find((g) => g.id === tgt);
      if (!targetGuild || !(BigInt(targetGuild.permissions) & 0x8n)) throw new Error('\u041d\u0435\u0442 \u043f\u0440\u0430\u0432 \u0430\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440\u0430');
      $('backgroundStage').textContent = '\u042d\u0442\u0430\u043f: \u043e\u0447\u0438\u0441\u0442\u043a\u0430 \u043a\u0430\u043d\u0430\u043b\u043e\u0432';
      $('progressFill').style.width = '0%';
      $('backgroundProgress').textContent = '\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441: 0%';
      let chRes = await fetchRetry(`${cfg.apiBase}/guilds/${tgt}/channels`, { headers: { 'Authorization': state.token } });
      let channels = await chRes.json();
      for (let i = 0; i < channels.length; i++) {
        if (state.cancel) throw new Error('CANCELLED');
        try {
          await fetchRetry(`${cfg.apiBase}/channels/${channels[i].id}`, { method: 'DELETE', headers: { 'Authorization': state.token } });
          addLog(`\u0423\u0434\u0430\u043b\u0451\u043d: ${channels[i].name}`, 'warning');
        } catch (e) { addLog('\u041e\u0448\u0438\u0431\u043a\u0430 \u0443\u0434\u0430\u043b\u0435\u043d\u0438\u044f \u043a\u0430\u043d\u0430\u043b\u0430', 'error'); }
        await sleep(250);
        let pct = Math.min(15, ((i + 1) / Math.max(channels.length, 1)) * 15);
        $('progressFill').style.width = `${pct}%`;
        $('backgroundProgress').textContent = `\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441: ${Math.floor(pct)}%`;
      }
      $('backgroundStage').textContent = '\u042d\u0442\u0430\u043f: \u043e\u0447\u0438\u0441\u0442\u043a\u0430 \u0440\u043e\u043b\u0435\u0439';
      let rRes = await fetchRetry(`${cfg.apiBase}/guilds/${tgt}/roles`, { headers: { 'Authorization': state.token } });
      let roles = await rRes.json();
      let delRoles = roles.filter((r) => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
      for (let i = 0; i < delRoles.length; i++) {
        if (state.cancel) throw new Error('CANCELLED');
        try { await fetchRetry(`${cfg.apiBase}/guilds/${tgt}/roles/${delRoles[i].id}`, { method: 'DELETE', headers: { 'Authorization': state.token } }); } catch (e) {}
        await sleep(200);
      }
      $('progressFill').style.width = '20%';
      $('backgroundProgress').textContent = '\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441: 20%';
      $('backgroundStage').textContent = '\u042d\u0442\u0430\u043f: \u0437\u0430\u0433\u0440\u0443\u0437\u043a\u0430 \u0434\u0430\u043d\u043d\u044b\u0445';
      let srcGuild = await (await fetchRetry(`${cfg.apiBase}/guilds/${src}`, { headers: { 'Authorization': state.token } })).json();
      await fetchRetry(`${cfg.apiBase}/guilds/${tgt}`, {
        method: 'PATCH', headers: { 'Authorization': state.token, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: srcGuild.name })
      });
      addLog(`\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435: ${srcGuild.name}`, 'success');
      await copyIcon(src, tgt, state.token);
      $('progressFill').style.width = '30%';
      $('backgroundProgress').textContent = '\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441: 30%';
      $('backgroundStage').textContent = '\u042d\u0442\u0430\u043f: \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u0435 \u0440\u043e\u043b\u0435\u0439';
      let srcRoles = await (await fetchRetry(`${cfg.apiBase}/guilds/${src}/roles`, { headers: { 'Authorization': state.token } })).json();
      let rolesToCreate = srcRoles.filter((r) => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
      let roleMap = {};
      for (let i = 0; i < rolesToCreate.length; i++) {
        if (state.cancel) throw new Error('CANCELLED');
        try {
          let cr = await fetchRetry(`${cfg.apiBase}/guilds/${tgt}/roles`, {
            method: 'POST', headers: { 'Authorization': state.token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: rolesToCreate[i].name.substring(0, 100), color: rolesToCreate[i].color || 0,
              hoist: !!rolesToCreate[i].hoist, mentionable: !!rolesToCreate[i].mentionable,
              permissions: rolesToCreate[i].permissions?.toString() || '0'
            })
          });
          if (cr.ok) { let nr = await cr.json(); roleMap[rolesToCreate[i].id] = nr.id; addLog(`\u0420\u043e\u043b\u044c: ${rolesToCreate[i].name}`, 'success'); }
          else addLog(`\u041e\u0448\u0438\u0431\u043a\u0430 \u0440\u043e\u043b\u0438: ${cr.status}`, 'error');
        } catch (e) { addLog(`\u041e\u0448\u0438\u0431\u043a\u0430: ${e.message}`, 'error'); }
        await sleep(300);
        let pct = 30 + ((i + 1) / Math.max(rolesToCreate.length, 1)) * 30;
        $('progressFill').style.width = `${pct}%`;
        $('backgroundProgress').textContent = `\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441: ${Math.floor(pct)}%`;
        $('backgroundStage').textContent = `\u0420\u043e\u043b\u0438: ${i + 1}/${rolesToCreate.length}`;
      }
      $('backgroundStage').textContent = '\u042d\u0442\u0430\u043f: \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u0435 \u043a\u0430\u043d\u0430\u043b\u043e\u0432';
      let srcChannels = await (await fetchRetry(`${cfg.apiBase}/guilds/${src}/channels`, { headers: { 'Authorization': state.token } })).json();
      let cats = srcChannels.filter((c) => c.type === 4).sort((a, b) => a.position - b.position);
      let others = srcChannels.filter((c) => c.type !== 4).sort((a, b) => a.position - b.position);
      let catMap = {}, chCount = 0, total = cats.length + others.length;
      for (let i = 0; i < cats.length; i++) {
        if (state.cancel) throw new Error('CANCELLED');
        try {
          let catData = {
            name: cats[i].name.substring(0, 100), type: 4, position: cats[i].position,
            permission_overwrites: convertOverwrites(cats[i].permission_overwrites, tgt, roleMap, srcGuild.id)
          };
          let cr = await fetchRetry(`${cfg.apiBase}/guilds/${tgt}/channels`, {
            method: 'POST', headers: { 'Authorization': state.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(catData)
          });
          if (cr.ok) { let nc = await cr.json(); catMap[cats[i].id] = nc.id; chCount++; }
          else addLog(`\u041e\u0448\u0438\u0431\u043a\u0430 \u043a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438: ${cr.status}`, 'error');
        } catch (e) { addLog(`\u041e\u0448\u0438\u0431\u043a\u0430: ${e.message}`, 'error'); }
        await sleep(300);
      }
      for (let i = 0; i < others.length; i++) {
        if (state.cancel) throw new Error('CANCELLED');
        let ch = others[i];
        try {
          let chData = {
            name: ch.name.substring(0, 100), type: ch.type, position: ch.position,
            permission_overwrites: convertOverwrites(ch.permission_overwrites, tgt, roleMap, srcGuild.id)
          };
          if (ch.type === 0 || ch.type === 5) {
            if (ch.topic) chData.topic = ch.topic.substring(0, 1024);
            if (ch.rate_limit_per_user) chData.rate_limit_per_user = Math.min(ch.rate_limit_per_user, 21600);
            if (ch.nsfw) chData.nsfw = ch.nsfw;
          }
          if (ch.type === 2) {
            if (ch.bitrate) chData.bitrate = Math.min(ch.bitrate, 96000);
            if (ch.user_limit) chData.user_limit = Math.min(ch.user_limit, 99);
          }
          if (ch.parent_id && catMap[ch.parent_id]) chData.parent_id = catMap[ch.parent_id];
          let cr = await fetchRetry(`${cfg.apiBase}/guilds/${tgt}/channels`, {
            method: 'POST', headers: { 'Authorization': state.token, 'Content-Type': 'application/json' },
            body: JSON.stringify(chData)
          });
          if (cr.ok) chCount++;
          else addLog(`\u041e\u0448\u0438\u0431\u043a\u0430 \u043a\u0430\u043d\u0430\u043b\u0430: ${cr.status}`, 'error');
        } catch (e) { addLog(`\u041e\u0448\u0438\u0431\u043a\u0430: ${e.message}`, 'error'); }
        await sleep(300);
        let pct = 60 + ((cats.length + i + 1) / Math.max(total, 1)) * 40;
        $('progressFill').style.width = `${pct}%`;
        $('backgroundProgress').textContent = `\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441: ${Math.floor(pct)}%`;
        $('backgroundStage').textContent = `\u041a\u0430\u043d\u0430\u043b\u044b: ${cats.length + i + 1}/${total}`;
      }
      $('progressFill').style.width = '100%';
      $('backgroundProgress').textContent = '\u041f\u0440\u043e\u0433\u0440\u0435\u0441\u0441: 100%';
      $('backgroundStage').textContent = '\u0417\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e!';
      addLog('\u041a\u043b\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e!', 'success');
      addLog(`\u0421\u043e\u0437\u0434\u0430\u043d\u043e: ${rolesToCreate.length} \u0440\u043e\u043b\u0435\u0439, ${chCount} \u043a\u0430\u043d\u0430\u043b\u043e\u0432`, 'success');
      toast('<i class="fas fa-check-circle"></i> \u041a\u043b\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043d\u043e!');
      confetti();
    } catch (e) {
      if (e.message === 'CANCELLED') {
        addLog('\u041e\u0442\u043c\u0435\u043d\u0435\u043d\u043e \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u043c', 'warning');
        toast('<i class="fas fa-ban"></i> \u041a\u043b\u043e\u043d\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435 \u043e\u0442\u043c\u0435\u043d\u0435\u043d\u043e');
      } else {
        addLog(`\u041e\u0448\u0438\u0431\u043a\u0430: ${e.message}`, 'error');
        showErr($('cloneError'), e.message);
      }
    } finally { resetClone(); }
  }

  function buildHTML() {
    return `
    <div class="loading-overlay" id="loadingOverlay">
      <div style="text-align:center">
        <div class="loading-logo">Discord Cloner Pro</div>
        <div class="loading-bar"><div class="loading-bar-fill"></div></div>
      </div>
    </div>
    <nav class="navbar">
      <div class="logo">Discord Server Cloner <span>by xolirx</span></div>
      <div class="nav-links">
        <span class="nav-link active" data-section="main">Главная</span>
        <span class="nav-link tools-link" data-section="tools"><i class="fas fa-tools"></i> Инструменты</span>
        <span class="nav-link" data-section="fixes">Обновления</span>
        <span class="nav-link" data-section="support">Поддержка</span>
      </div>
    </nav>
    <div class="main-container">
      <div id="authView">
        <div class="glass-card">
          <div class="auth-title">Discord Cloner Pro</div>
          <div class="auth-subtitle">by xolirx • 2026</div>
          <div class="form-group">
            <label class="form-label">Discord токен</label>
            <div style="position:relative">
              <input type="password" class="form-input" id="tokenInput" placeholder="Введите ваш токен">
              <span style="position:absolute;right:14px;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--text-secondary)" id="toggleTokenVisibility"><i class="fas fa-eye"></i></span>
            </div>
          </div>
          <div style="margin:12px 0;display:flex;gap:8px">
            <button class="btn" id="testTokenBtn"><i class="fas fa-check-circle"></i> Проверить</button>
            <button class="btn" id="pasteTokenBtn"><i class="fas fa-paste"></i> Вставить</button>
          </div>
          <div id="authError" style="color:#ff7b7b;font-size:0.75rem;margin-top:0.5rem;display:none"></div>
          <button class="btn btn-primary" id="loginBtn" style="width:100%"><i class="fas fa-sign-in-alt"></i> Войти</button>
        </div>
      </div>
      <div id="mainView" class="hidden">
        <div class="user-profile">
          <img id="userAvatar" class="avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23111'/%3E%3Ctext x='32' y='40' text-anchor='middle' fill='%23333' font-size='24'%3E●%3C/text%3E%3C/svg%3E">
          <div class="user-details">
            <div class="user-name" id="userName">Загрузка...</div>
            <div class="user-id" id="userId">ID: ...</div>
            <div class="user-email">
              <span class="email-blur" id="userEmail">••••••@•••••.com</span>
              <span id="toggleEmailBtn" style="cursor:pointer;background:var(--fix-bg);padding:0.2rem 0.6rem;border-radius:20px;font-size:0.7rem"><i class="fas fa-eye"></i> Показать</span>
            </div>
          </div>
          <button class="btn" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Выйти</button>
        </div>
        <div id="backgroundStatus" class="background-status">
          <div style="display:flex;align-items:center;gap:12px"><div class="spinner"></div><span>Клонирование активно</span></div>
          <div id="backgroundProgress">Прогресс: 0%</div>
          <div id="backgroundStage" style="font-size:0.7rem;margin-top:6px;color:var(--text-secondary)">Этап: подготовка</div>
        </div>
        <div id="mainContent">
          <div class="clone-card">
            <div class="clone-title">Клонирование сервера</div>
            <div class="clone-subtitle">by xolirx • 2026</div>
            <div class="input-group"><label class="input-label">Исходный сервер ID</label><input type="text" class="clone-input" id="sourceId" placeholder="000000000000000000"></div>
            <div class="input-group"><label class="input-label">Целевой сервер ID</label><input type="text" class="clone-input" id="targetId" placeholder="000000000000000000"></div>
            <div style="display:flex;gap:12px;max-width:480px;margin:10px auto">
              <button class="btn" id="showServersBtn" style="flex:1"><i class="fas fa-list"></i> Мои сервера</button>
              <button class="btn" id="validateBtn" style="flex:1"><i class="fas fa-check"></i> Проверить</button>
            </div>
            <div class="btn-group">
              <button class="btn btn-primary" id="cloneBtn"><i class="fas fa-copy"></i> Начать клонирование</button>
              <button class="btn btn-danger" id="cancelCloneBtn" disabled><i class="fas fa-times-circle"></i> Отменить</button>
            </div>
            <div id="serverListContainer" class="hidden" style="background:var(--fix-bg);border-radius:16px;margin-top:1rem;max-height:250px;overflow-y:auto;padding:0.5rem"></div>
            <div id="serverValidationResult" style="color:#7fe07f;font-size:0.7rem;margin:8px 0;display:none"></div>
            <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
            <div id="cloneError" style="color:#ff7b7b;font-size:0.75rem;margin-top:0.5rem;display:none"></div>
          </div>
          <div class="info-grid">
            <div class="info-card">
              <div class="info-card-title"><i class="fas fa-check-circle" style="color:#7fe07f"></i> Будет скопировано</div>
              <ul class="info-list"><li>Название сервера</li><li>Иконка сервера</li><li>Все роли с правами</li><li>Категории и каналы</li><li>Права доступа</li><li>Настройки каналов</li></ul>
            </div>
            <div class="info-card">
              <div class="info-card-title"><i class="fas fa-ban" style="color:#ff7b7b"></i> Не будет скопировано</div>
              <ul class="info-list"><li>Сообщения</li><li>Участники сервера</li><li>Вебхуки</li><li>Интеграции и боты</li><li>Стикеры и эмодзи</li></ul>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;gap:12px;margin:0 0 1rem 0">
            <button class="btn" id="clearLogsBtn" style="padding:0.4rem 1rem;font-size:0.7rem"><i class="fas fa-eraser"></i> Очистить</button>
          </div>
          <div class="log-container" id="log"></div>
        </div>
        <div id="toolsContent" class="hidden">
          <div class="glass-card">
            <div class="tools-title">Инструменты</div>
            <div class="tools-subtitle">Дополнительные функции для управления</div>
            <div class="tools-grid">
              <div class="tool-card" id="toolGuildInfo"><i class="fas fa-info-circle"></i><h3>Информация о сервере</h3><p>Просмотр подробной информации о любом сервере</p></div>
              <div class="tool-card" id="toolMassClean"><i class="fas fa-broom"></i><h3>Массовая очистка</h3><p>Быстрое удаление всех каналов и ролей</p></div>
              <div class="tool-card" id="toolTokenChecker"><i class="fas fa-shield-alt"></i><h3>Проверка токена</h3><p>Детальная информация о токене и аккаунте</p></div>
              <div class="tool-card" id="toolExportConfig"><i class="fas fa-download"></i><h3>Экспорт структуры</h3><p>Сохранить структуру сервера в JSON</p></div>
              <div class="tool-card" id="toolQuickClone"><i class="fas fa-bolt"></i><h3>Быстрое клонирование</h3><p>Клон с предустановленными настройками</p></div>
              <div class="tool-card" id="toolPermissions"><i class="fas fa-lock"></i><h3>Анализатор прав</h3><p>Проверка прав вашего токена на сервере</p></div>
            </div>
          </div>
          <div id="toolResultContainer" style="margin-top:1.5rem"></div>
        </div>
        <div id="fixesContent" class="hidden">
          <div class="glass-card">
            <div class="fix-title">История обновлений</div>
            <div class="fix-subtitle">by xolirx • все изменения по датам</div>
            <div class="fix-group"><div class="fix-date">26 апреля 2026</div><h3><i class="fas fa-shield-alt"></i> Ultimate обнова: защита + визуал + стабильность</h3><ul class="info-list" style="padding-left:1rem"><li>Полностью обфусцированный код</li><li>Глобальный редизайн: анимации, стекло-эффекты</li><li>Исправлена ошибка прав доступа</li><li>Точный прогресс в реальном времени</li><li>Улучшена обработка rate limit</li><li>Полная адаптация под телефон и ПК</li></ul></div>
            <div class="fix-group"><div class="fix-date">15 апреля 2026</div><h3><i class="fas fa-star"></i> Улучшение интерфейса и оптимизация</h3><ul class="info-list" style="padding-left:1rem"><li>Полностью переработан интерфейс</li><li>Оптимизирована логика клонирования</li><li>Исправлены ошибки API</li><li>Улучшена отмена клонирования</li></ul></div>
          </div>
        </div>
        <div id="supportContent" class="hidden">
          <div class="glass-card">
            <div class="auth-title">Поддержка</div>
            <div class="auth-subtitle">by xolirx • 2026</div>
            <div style="text-align:center"><a href="https://t.me/xolirx" target="_blank" class="btn btn-primary"><i class="fab fa-telegram"></i> Telegram (@xolirx)</a></div>
            <p style="margin-top:2rem;color:var(--text-secondary);text-align:center;font-size:0.8rem">Отвечаю оперативно. Бесплатные консультации.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>Discord Server Cloner Pro • 2026 • by xolirx</span>
      <a href="#" id="checkUpdateLink"><i class="fas fa-sync-alt"></i> Проверить обновления</a>
    </div>
    <div class="bottom-controls">
      <button class="control-btn" id="themeToggle"><i class="fas fa-moon"></i></button>
      <button class="control-btn" id="exportLogsBtn"><i class="fas fa-download"></i></button>
      <button class="control-btn" id="scrollTopBtn"><i class="fas fa-arrow-up"></i></button>
    </div>
    <div id="agreementModal" class="modal">
      <div class="modal-content">
        <div style="font-size:1.3rem;margin-bottom:1rem;text-align:center">Правила и ответственность</div>
        <ul class="info-list" style="margin-bottom:1rem">
          <li>Я использую программу на свой риск</li>
          <li>Автор не несет ответственности за последствия</li>
          <li>Я принимаю ответственность за блокировку аккаунта</li>
          <li>Я имею права администратора на обоих серверах</li>
          <li>Все каналы и роли на целевом сервере будут удалены</li>
          <li>Я понимаю, что клонирование необратимо</li>
        </ul>
        <div class="checkbox-group">
          <div class="checkbox-item"><input type="checkbox" id="rule1"><label>Я прочитал и понял правила</label></div>
          <div class="checkbox-item"><input type="checkbox" id="rule2"><label>Я осознаю все риски</label></div>
          <div class="checkbox-item"><input type="checkbox" id="rule3"><label>Я принимаю полную ответственность</label></div>
        </div>
        <div style="display:flex;gap:1rem;justify-content:flex-end;margin-top:1.5rem">
          <button class="btn" id="closeModalBtn">Отмена</button>
          <button class="btn btn-primary" id="confirmRulesBtn" disabled>Продолжить</button>
        </div>
      </div>
    </div>`;
  }

  function init() {
    document.getElementById('app').innerHTML = buildHTML();
    document.querySelectorAll('.nav-link').forEach((l) => {
      l.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach((ln) => ln.classList.remove('active'));
        this.classList.add('active');
        switchSection(this.dataset.section);
      });
    });
    $('rule1').addEventListener('change', checkRules);
    $('rule2').addEventListener('change', checkRules);
    $('rule3').addEventListener('change', checkRules);
    $('closeModalBtn').addEventListener('click', closeModal);
    $('confirmRulesBtn').addEventListener('click', confirmRules);
    $('showServersBtn').addEventListener('click', showServerList);
    $('validateBtn').addEventListener('click', validateServers);
    $('cloneBtn').addEventListener('click', showAgreement);
    $('cancelCloneBtn').addEventListener('click', cancelClone);
    $('clearLogsBtn').addEventListener('click', clearLogs);
    $('exportLogsBtn').addEventListener('click', exportLogs);
    $('scrollTopBtn').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    $('themeToggle').addEventListener('click', toggleTheme);
    $('loginBtn').addEventListener('click', authorize);
    $('testTokenBtn').addEventListener('click', testToken);
    $('pasteTokenBtn').addEventListener('click', pasteToken);
    $('toggleTokenVisibility').addEventListener('click', () => {
      let i = $('tokenInput');
      let icon = i.parentElement.querySelector('i');
      if (i.type === 'password') { i.type = 'text'; icon.classList.replace('fa-eye', 'fa-eye-slash'); }
      else { i.type = 'password'; icon.classList.replace('fa-eye-slash', 'fa-eye'); }
    });
    $('toggleEmailBtn').addEventListener('click', toggleEmail);
    $('logoutBtn').addEventListener('click', logout);
    $('toolGuildInfo').addEventListener('click', async () => {
      let id = prompt('Введите ID сервера:');
      if (!id) return;
      $('toolResultContainer').innerHTML = '<div class="glass-card"><div style="text-align:center"><div class="spinner"></div><p>Загрузка...</p></div></div>';
      try {
        let r = await fetch(`${cfg.apiBase}/guilds/${id}`, { headers: { 'Authorization': state.token } });
        if (!r.ok) throw new Error('Сервер не найден');
        let g = await r.json();
        let roles = await (await fetch(`${cfg.apiBase}/guilds/${id}/roles`, { headers: { 'Authorization': state.token } })).json();
        let channels = await (await fetch(`${cfg.apiBase}/guilds/${id}/channels`, { headers: { 'Authorization': state.token } })).json();
        $('toolResultContainer').innerHTML = `<div class="glass-card"><h3>${esc(g.name)}</h3><div class="stats-row"><div class="stat-item"><div class="stat-value">${g.approximate_member_count || '?'}</div><div class="stat-label">Участников</div></div><div class="stat-item"><div class="stat-value">${roles.length}</div><div class="stat-label">Ролей</div></div><div class="stat-item"><div class="stat-value">${channels.length}</div><div class="stat-label">Каналов</div></div></div><p style="margin-top:0.8rem;font-size:0.75rem"><strong>ID:</strong> ${g.id}<br><strong>Владелец:</strong> ${g.owner_id}</p></div>`;
      } catch (e) { $('toolResultContainer').innerHTML = `<div class="glass-card"><p style="color:#ff7b7b">${esc(e.message)}</p></div>`; }
    });
    $('toolMassClean').addEventListener('click', async () => {
      let id = prompt('Введите ID сервера для очистки:');
      if (!id || !confirm('ВНИМАНИЕ! Все каналы и роли будут удалены. Продолжить?')) return;
      $('toolResultContainer').innerHTML = '<div class="glass-card"><div style="text-align:center"><div class="spinner"></div><p>Очистка...</p></div></div>';
      let cleaned = 0;
      try {
        let channels = await (await fetch(`${cfg.apiBase}/guilds/${id}/channels`, { headers: { 'Authorization': state.token } })).json();
        for (let ch of channels) { try { await fetch(`${cfg.apiBase}/channels/${ch.id}`, { method: 'DELETE', headers: { 'Authorization': state.token } }); cleaned++; await sleep(200); } catch (e) {} }
        let roles = await (await fetch(`${cfg.apiBase}/guilds/${id}/roles`, { headers: { 'Authorization': state.token } })).json();
        for (let r of roles) { if (r.name !== '@everyone' && !r.managed) { try { await fetch(`${cfg.apiBase}/guilds/${id}/roles/${r.id}`, { method: 'DELETE', headers: { 'Authorization': state.token } }); cleaned++; await sleep(200); } catch (e) {} } }
        $('toolResultContainer').innerHTML = `<div class="glass-card"><p style="color:#7fe07f"><i class="fas fa-check-circle"></i> Очищено: ${cleaned} объектов</p></div>`;
      } catch (e) { $('toolResultContainer').innerHTML = `<div class="glass-card"><p style="color:#ff7b7b">${esc(e.message)}</p></div>`; }
    });
    $('toolTokenChecker').addEventListener('click', () => {
      $('toolResultContainer').innerHTML = `<div class="glass-card"><h3><i class="fas fa-shield-alt"></i> Информация о токене</h3><p><strong>Пользователь:</strong> ${esc(state.user?.username || 'неизвестно')}</p><p><strong>ID:</strong> ${state.user?.id || 'неизвестно'}</p><p><strong>Email:</strong> ${state.user?.email || 'не привязан'}</p></div>`;
    });
    $('toolExportConfig').addEventListener('click', () => {
      if (!$('sourceId').value.trim()) { $('toolResultContainer').innerHTML = '<div class="glass-card"><p style="color:#e6b450">Введите ID исходного сервера</p></div>'; return; }
      $('toolResultContainer').innerHTML = '<div class="glass-card"><div style="text-align:center"><div class="spinner"></div><p>Экспорт...</p></div></div>';
      let src = $('sourceId').value.trim();
      Promise.all([
        fetch(`${cfg.apiBase}/guilds/${src}`, { headers: { 'Authorization': state.token } }),
        fetch(`${cfg.apiBase}/guilds/${src}/roles`, { headers: { 'Authorization': state.token } }),
        fetch(`${cfg.apiBase}/guilds/${src}/channels`, { headers: { 'Authorization': state.token } })
      ]).then(([gr, rr, cr]) => Promise.all([gr.json(), rr.json(), cr.json()]))
        .then(([guild, roles, channels]) => {
          let data = { name: guild.name, roles: roles.filter(r => r.name !== '@everyone').map(r => ({ name: r.name, permissions: r.permissions })), channels: channels.map(c => ({ name: c.name, type: c.type })) };
          let blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          let a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `server_${src}.json`; a.click();
          $('toolResultContainer').innerHTML = '<div class="glass-card"><p style="color:#7fe07f"><i class="fas fa-check-circle"></i> Экспортировано</p></div>';
        }).catch(() => { $('toolResultContainer').innerHTML = '<div class="glass-card"><p style="color:#ff7b7b">Ошибка</p></div>'; });
    });
    $('toolQuickClone').addEventListener('click', () => {
      if ($('sourceId').value && $('targetId').value) showAgreement();
      else $('toolResultContainer').innerHTML = '<div class="glass-card"><p style="color:#e6b450">Заполните ID серверов на главной</p></div>';
    });
    $('toolPermissions').addEventListener('click', async () => {
      let id = prompt('Введите ID сервера:');
      if (!id) return;
      try {
        let r = await fetch(`${cfg.apiBase}/users/@me/guilds`, { headers: { 'Authorization': state.token } });
        let guilds = await r.json();
        let g = guilds.find(g => g.id === id);
        if (!g) throw new Error('Вы не состоите в этом сервере');
        let p = BigInt(g.permissions);
        let checks = ['Администратор:0x8','Управление сервером:0x20','Управление ролями:0x10000000','Управление каналами:0x10','Вебхуки:0x20000000','Приглашения:0x1'];
        let h = `<div class="glass-card"><h3>Права: ${esc(g.name)}</h3>`;
        checks.forEach(c => { let [n, b] = c.split(':'); h += `<p>${n}: ${(p & BigInt(b)) === BigInt(b) ? '<span class="badge badge-green">Есть</span>' : '<span class="badge badge-red">Нет</span>'}</p>`; });
        h += '</div>';
        $('toolResultContainer').innerHTML = h;
      } catch (e) { $('toolResultContainer').innerHTML = `<div class="glass-card"><p style="color:#ff7b7b">${esc(e.message)}</p></div>`; }
    });
    $('checkUpdateLink').addEventListener('click', (e) => { e.preventDefault(); toast('<i class="fas fa-info-circle"></i> Версия v3.1 актуальна'); });
    document.addEventListener('click', (e) => {
      let c = $('serverListContainer');
      if (c && !c.contains(e.target) && e.target !== $('showServersBtn')) c.classList.add('hidden');
    });
    $('agreementModal').addEventListener('click', function(e) { if (e.target === this) closeModal(); });
  }

  window.onload = async () => {
    init();
    setTimeout(() => $('loadingOverlay')?.classList.add('fade-out'), 800);
    let st = sessionStorage.getItem('discord_token'), su = sessionStorage.getItem('discord_user');
    if (st && su) {
      state.token = st; state.user = JSON.parse(su);
      $('userName').textContent = state.user.global_name || state.user.username;
      $('userId').textContent = `ID: ${state.user.id}`;
      if (state.user.email) { $('userEmail').textContent = state.user.email.replace(/./g, '\u2022'); $('toggleEmailBtn').innerHTML = '<i class="fas fa-eye"></i> Показать'; }
      if (state.user.avatar) $('userAvatar').src = `https://cdn.discordapp.com/avatars/${state.user.id}/${state.user.avatar}.png?size=128`;
      $('authView').classList.add('hidden'); $('mainView').classList.remove('hidden');
      addLog('Сессия восстановлена', 'success');
      await loadGuilds();
    }
    addLog('Discord Cloner Pro v3.1 by xolirx', 'info');
  };

  window.addEventListener('beforeunload', () => { if (state.cloning) return 'Клонирование не завершено. Выйти?'; });
})();