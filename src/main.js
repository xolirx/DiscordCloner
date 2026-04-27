// Стили
const style = document.createElement('style');
style.textContent = `
:root {
  --bg: #020617;
  --card-bg: rgba(15, 23, 42, 0.8);
  --card-border: rgba(148, 163, 184, 0.1);
  --accent: #8b5cf6;
  --accent-glow: rgba(139, 92, 246, 0.4);
  --text: #e2e8f0;
  --dim: #64748b;
  --danger: #f43f5e;
  --success: #10b981;
  --warning: #f59e0b;
  --radius: 20px;
  --shadow-lg: 0 20px 40px rgba(0,0,0,0.6);
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
*{margin:0;padding:0;box-sizing:border-box}
body{
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(ellipse at top, rgba(139,92,246,0.08), transparent 60%),
              radial-gradient(ellipse at bottom, rgba(139,92,246,0.04), transparent 60%);
  pointer-events: none;
}
.wrapper{
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  height: 85vh;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse-glow{0%,100%{opacity:0.5}50%{opacity:1}}
.left, .right{
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 28px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: transform var(--transition), box-shadow var(--transition);
}
.left{flex:1.1}
.right{flex:0.9}
.left:hover, .right:hover{ box-shadow: 0 25px 50px rgba(0,0,0,0.8); }
.log-title{
  font-size: 0.85rem;
  color: var(--dim);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.log-box{
  flex:1;
  background: rgba(0,0,0,0.4);
  border-radius: 14px;
  padding: 14px;
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: var(--dim);
  border: 1px solid var(--card-border);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  scrollbar-width: thin;
  scrollbar-color: var(--accent) transparent;
}
.log-box::-webkit-scrollbar{width: 4px}
.log-box::-webkit-scrollbar-thumb{background: var(--accent);border-radius: 4px}
.log-item{
  padding: 6px 10px;
  margin: 4px 0;
  border-radius: 8px;
  background: rgba(255,255,255,0.02);
  transition: background var(--transition);
  display: flex;
  gap: 10px;
  align-items: center;
  animation: slideIn 0.2s ease-out;
}
@keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
.log-item:hover{background: rgba(255,255,255,0.06)}
.log-time{color: var(--dim);font-size:0.65rem;min-width:50px}
.log-icon svg{width:14px;height:14px;flex-shrink:0}
.log-success .log-icon svg{color:var(--success)}
.log-error .log-icon svg{color:var(--danger)}
.log-warning .log-icon svg{color:var(--warning)}
input,button{
  width:100%;
  padding:13px 16px;
  margin:7px 0;
  border-radius:14px;
  border:1px solid var(--card-border);
  background: rgba(15,23,42,0.6);
  color:var(--text);
  font-size:0.88rem;
  transition: all var(--transition);
  font-family:inherit;
  backdrop-filter: blur(5px);
}
input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-glow)}
button{
  cursor:pointer;
  background: rgba(15,23,42,0.8);
  font-weight:500;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
}
button:hover{background: rgba(30,41,59,0.9);border-color:var(--accent);box-shadow:0 0 15px var(--accent-glow)}
button.primary{background:linear-gradient(135deg, var(--accent), #7c3aed);color:#fff;border:none}
button.primary:hover{background:linear-gradient(135deg, #9d6ff0, #8b5cf6);box-shadow:0 0 25px rgba(139,92,246,0.6)}
button.danger{background:transparent;border-color:var(--danger);color:var(--danger)}
button.danger:hover{background:rgba(244,63,94,0.1)}
.row{display:flex;gap:10px}
.row button{flex:1}
.progress{height:4px;background:rgba(255,255,255,0.06);border-radius:2px;margin:14px 0;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg, var(--accent), #c084fc);width:0%;transition:width 0.4s ease;border-radius:2px}
.status{
  background: rgba(15,23,42,0.6);
  border-radius:12px;
  padding:10px 16px;
  margin:8px 0;
  display:none;
  align-items:center;
  gap:10px;
  border:1px solid var(--card-border);
  backdrop-filter: blur(5px);
}
.status.active{display:flex}
.spinner{
  width:16px;height:16px;
  border:2px solid rgba(255,255,255,0.2);
  border-top-color:var(--accent);
  border-radius:50%;
  animation:spin 0.8s linear infinite;
}
@keyframes spin{to{transform:rotate(360deg)}}
.donate-btn{
  position:fixed;
  top:24px;
  right:24px;
  width:48px;height:48px;
  z-index:100;
  background: rgba(15,23,42,0.8);
  border:1px solid var(--card-border);
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  text-decoration:none;
  box-shadow:0 4px 15px rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
  transition: all var(--transition);
}
.donate-btn svg{width:20px;height:20px;color:var(--accent);transition:transform 0.3s}
.donate-btn:hover{background:var(--accent);border-color:var(--accent);box-shadow:0 0 25px var(--accent-glow)}
.donate-btn:hover svg{color:#fff;transform:scale(1.1)}
/* Адаптивность */
@media (max-width: 768px){
  body{padding:12px;align-items:flex-start}
  .wrapper{flex-direction:column;height:auto;gap:16px}
  .left,.right{width:100%;flex:none;padding:20px}
  .right{height:320px}
  .donate-btn{top:12px;right:12px;width:42px;height:42px}
  .donate-btn svg{width:18px;height:18px}
}
`;
document.head.appendChild(style);

// SVG иконки
const SVG_ICONS = {
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`
};

// Приложение
(function(){
  const API = 'https://discord.com/api/v10';
  let cloning = false, cancel = false, controller = null;

  const $ = id => document.getElementById(id);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const toast = msg => {
    let t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 1800);
  };

  const log = (msg, type = 'info') => {
    let box = $('logBox'); if (!box) return;
    let time = new Date().toLocaleTimeString('ru-RU');
    let div = document.createElement('div');
    div.className = `log-item log-${type}`;
    div.innerHTML = `
      <span class="log-time">${time}</span>
      <span class="log-icon">${SVG_ICONS[type] || SVG_ICONS.info}</span>
      <span style="flex:1">${msg}</span>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    if (box.children.length > 200) box.removeChild(box.children[0]);
  };

  function buildChannelData(ch, targetId, roleMap, catMap, srcGuildId) {
    let data = {
      name: ch.name.substring(0, 100),
      type: ch.type,
      position: ch.position,
      permission_overwrites: sanitizeOverwrites(ch.permission_overwrites, targetId, roleMap, srcGuildId)
    };
    if (ch.type === 0 || ch.type === 5) {
      if (ch.topic) data.topic = ch.topic.substring(0, 1024);
      if (ch.rate_limit_per_user) data.rate_limit_per_user = Math.min(ch.rate_limit_per_user, 21600);
      if (ch.nsfw) data.nsfw = true;
    }
    if (ch.type === 2) {
      data.bitrate = Math.min(Math.max(ch.bitrate || 64000, 8000), 96000);
      data.user_limit = ch.user_limit ? Math.min(Math.max(ch.user_limit, 0), 99) : 0;
    }
    if (ch.parent_id) {
      if (catMap[ch.parent_id]) data.parent_id = catMap[ch.parent_id];
      else if (roleMap[ch.parent_id]) data.parent_id = roleMap[ch.parent_id];
    }
    return data;
  }

  function sanitizeOverwrites(overwrites, targetId, roleMap, srcGuildId) {
    if (!Array.isArray(overwrites)) return [];
    return overwrites.map(o => {
      if (!o || !o.id) return null;
      let id = o.id;
      if (o.type === 0) {
        if (o.id === srcGuildId) id = targetId;
        else if (roleMap[o.id]) id = roleMap[o.id];
        else return null;
      } else if (o.type === 1) id = targetId;
      return { id, type: o.type, allow: String(o.allow || 0), deny: String(o.deny || 0) };
    }).filter(o => o !== null);
  }

  async function api(url, opts = {}, retries = 3) {
    let token = $('tokenInput').value.trim();
    if (!token) throw new Error('Введите токен');
    if (cancel) throw new Error('CANCELLED');
    let signal = controller?.signal;
    for (let i = 0; i < retries; i++) {
      if (cancel) throw new Error('CANCELLED');
      try {
        let headers = { 'Authorization': token, 'Content-Type': 'application/json', ...opts.headers };
        let res = await fetch(url, { ...opts, headers, signal });
        if (res.status === 429) {
          let r = parseInt(res.headers.get('Retry-After')) || 2;
          await sleep(r * 1000);
          continue;
        }
        if (!res.ok && i === retries - 1) throw new Error(`HTTP ${res.status}`);
        if (!res.ok) { await sleep(1000 * (i + 1)); continue; }
        return res;
      } catch (e) {
        if (e.name === 'AbortError') throw new Error('CANCELLED');
        if (i === retries - 1) throw e;
        await sleep(1000 * (i + 1));
      }
    }
  }

  function resetClone() {
    cloning = false;
    controller = null;
    $('cloneBtn').disabled = false;
    $('cancelBtn').disabled = true;
    $('cloneStatus').classList.remove('active');
    $('progressBar').style.width = '0%';
  }

  function cancelClone() {
    if (cloning) {
      cancel = true;
      controller?.abort();
      log('Отмена...', 'warning');
      $('cancelBtn').disabled = true;
    }
  }

  async function startClone() {
    if (cloning) return;
    let src = $('sourceId').value.trim(), tgt = $('targetId').value.trim();
    if (!/^\d{17,20}$/.test(src) || !/^\d{17,20}$/.test(tgt)) {
      log('Неверный ID сервера', 'error');
      return;
    }
    if (src === tgt) {
      log('Серверы не должны быть одинаковыми', 'error');
      return;
    }
    cloning = true; cancel = false; controller = new AbortController();
    $('cloneBtn').disabled = true; $('cancelBtn').disabled = false;
    $('cloneStatus').classList.add('active'); $('progressBar').style.width = '0%';
    try {
      $('statusText').textContent = 'Проверка прав'; $('progressPercent').textContent = '0%';
      let meGuilds = await (await api(`${API}/users/@me/guilds`)).json();
      let tgtGuild = meGuilds.find(g => g.id === tgt);
      if (!tgtGuild || !(BigInt(tgtGuild.permissions) & 0x8n)) throw new Error('Нет прав администратора на целевом сервере');
      let srcGuild = await (await api(`${API}/guilds/${src}`)).json();
      $('statusText').textContent = 'Очистка каналов';
      let channels = await (await api(`${API}/guilds/${tgt}/channels`)).json();
      for (let i = 0; i < channels.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        try {
          await api(`${API}/channels/${channels[i].id}`, { method: 'DELETE' });
          log(`Удалён канал: ${channels[i].name || channels[i].id}`, 'warning');
        } catch (e) { log('Ошибка удаления канала', 'error'); }
        await sleep(200);
        let pct = Math.min(10, ((i + 1) / Math.max(channels.length, 1)) * 10);
        $('progressBar').style.width = pct + '%'; $('progressPercent').textContent = Math.floor(pct) + '%';
      }
      $('statusText').textContent = 'Очистка ролей';
      let roles = await (await api(`${API}/guilds/${tgt}/roles`)).json();
      let delRoles = roles.filter(r => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
      for (let i = 0; i < delRoles.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        try { await api(`${API}/guilds/${tgt}/roles/${delRoles[i].id}`, { method: 'DELETE' }); } catch (e) {}
        await sleep(150);
      }
      $('progressBar').style.width = '15%'; $('progressPercent').textContent = '15%';
      $('statusText').textContent = 'Название и иконка';
      await api(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify({ name: srcGuild.name }) });
      log('Название скопировано', 'success');
      // Копирование иконки
      if (srcGuild.icon) {
        try {
          let iconRes = await fetch(`https://cdn.discordapp.com/icons/${src}/${srcGuild.icon}.png?size=256`);
          if (!iconRes.ok) throw new Error('Не удалось загрузить иконку');
          let blob = await iconRes.blob();
          if (blob.size > 262144) {
            log('Иконка больше 256 КБ, пропускаем', 'warning');
          } else {
            let base64 = await new Promise(r => { let reader = new FileReader(); reader.onloadend = () => r(reader.result); reader.readAsDataURL(blob); });
            let base64Data = base64.split(',')[1];
            let updRes = await api(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify({ icon: base64Data }) });
            if (updRes.ok) log('Иконка скопирована', 'success');
            else log('Не удалось установить иконку', 'error');
          }
        } catch(e) { log(`Ошибка копирования иконки: ${e.message}`, 'error'); }
      } else {
        log('У исходного сервера нет иконки', 'info');
      }
      $('progressBar').style.width = '25%'; $('progressPercent').textContent = '25%';
      $('statusText').textContent = 'Создание ролей';
      let srcRoles = await (await api(`${API}/guilds/${src}/roles`)).json();
      let rolesToCreate = srcRoles.filter(r => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
      let roleMap = {};
      for (let i = 0; i < rolesToCreate.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        let r = rolesToCreate[i];
        try {
          let body = JSON.stringify({
            name: r.name.substring(0, 100),
            color: r.color || 0,
            hoist: !!r.hoist,
            mentionable: !!r.mentionable,
            permissions: String(r.permissions || 0)
          });
          let resp = await api(`${API}/guilds/${tgt}/roles`, { method: 'POST', body });
          let newRole = await resp.json();
          roleMap[r.id] = newRole.id;
          log(`Роль создана: ${r.name}`, 'success');
        } catch (e) { log(`Ошибка роли ${r.name}: ${e.message}`, 'error'); }
        await sleep(250);
        let pct = 25 + ((i + 1) / Math.max(rolesToCreate.length, 1)) * 30;
        $('progressBar').style.width = pct + '%'; $('progressPercent').textContent = Math.floor(pct) + '%';
      }
      log(`Всего ролей создано: ${Object.keys(roleMap).length}`, 'info');
      $('statusText').textContent = 'Создание каналов';
      let srcChannels = await (await api(`${API}/guilds/${src}/channels`)).json();
      let categories = srcChannels.filter(c => c.type === 4).sort((a, b) => a.position - b.position);
      let others = srcChannels.filter(c => c.type !== 4).sort((a, b) => a.position - b.position);
      let catMap = {};
      let createdCount = 0, total = categories.length + others.length;
      for (let i = 0; i < categories.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        let c = categories[i];
        try {
          let body = buildChannelData(c, tgt, roleMap, catMap, srcGuild.id);
          let resp = await api(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
          let ch = await resp.json();
          catMap[c.id] = ch.id;
          createdCount++;
          log(`Категория создана: ${c.name}`, 'success');
        } catch (e) { log(`Ошибка категории ${c.name}: ${e.message}`, 'error'); }
        await sleep(250);
      }
      for (let i = 0; i < others.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        let c = others[i];
        try {
          let body = buildChannelData(c, tgt, roleMap, catMap, srcGuild.id);
          await api(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
          createdCount++;
          log(`Канал создан: ${c.name}`, 'success');
        } catch (e) { log(`Ошибка канала ${c.name}: ${e.message}`, 'error'); }
        await sleep(200);
        let pct = 60 + ((categories.length + i + 1) / Math.max(total, 1)) * 40;
        $('progressBar').style.width = pct + '%'; $('progressPercent').textContent = Math.floor(pct) + '%';
      }
      $('progressBar').style.width = '100%'; $('progressPercent').textContent = '100%';
      log(`Клонирование завершено! Ролей: ${Object.keys(roleMap).length}, каналов: ${createdCount}`, 'success');
      toast('Готово!');
    } catch (e) {
      if (e.message === 'CANCELLED') { log('Отменено', 'warning'); toast('Отменено'); }
      else { log(`Ошибка: ${e.message}`, 'error'); toast('Ошибка'); }
    } finally { resetClone(); }
  }

  function clearLogs() { $('logBox').innerHTML = ''; }

  function buildUI() {
    document.getElementById('app').innerHTML = `
      <a class="donate-btn" href="https://www.tinkoff.ru/rm/r_AOUzDhUNVZ.xFFkoxrVId/Swdgp93058" target="_blank" rel="noopener" title="Поддержать проект">
        ${SVG_ICONS.heart}
      </a>
      <div class="wrapper">
        <div class="left">
          <div style="font-size:1.8rem;font-weight:700;color:#fff;letter-spacing:-0.5px;margin-bottom:6px;background:linear-gradient(135deg,#e9d5ff,#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Discord Cloner</div>
          <div style="font-size:0.75rem;color:var(--dim);margin-bottom:24px;letter-spacing:1px;">by xolirx</div>
          <input type="password" id="tokenInput" placeholder="Токен">
          <input id="sourceId" placeholder="Исходный сервер ID">
          <input id="targetId" placeholder="Целевой сервер ID">
          <div class="row">
            <button id="cloneBtn" class="primary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Клонировать</button>
            <button id="cancelBtn" class="danger" disabled><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Отмена</button>
          </div>
          <div id="cloneStatus" class="status">
            <div class="spinner"></div>
            <span id="statusText" style="font-weight:500;">Клонирование</span>
            <span id="progressPercent" style="margin-left:auto;font-weight:600;">0%</span>
          </div>
          <div class="progress"><div class="progress-fill" id="progressBar"></div></div>
        </div>
        <div class="right">
          <div class="log-title"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 17"/><line x1="12" y1="5" x2="20" y2="5"/><line x1="12" y1="9" x2="20" y2="9"/><line x1="12" y1="13" x2="16" y2="13"/></svg> Логи</div>
          <div id="logBox" class="log-box"></div>
          <button id="clearLogsBtn" style="margin-top:12px;width:auto;padding:8px 16px;font-size:0.75rem;border-radius:20px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg> Очистить</button>
        </div>
      </div>`;
  }

  buildUI();
  $('cloneBtn').addEventListener('click', startClone);
  $('cancelBtn').addEventListener('click', cancelClone);
  $('clearLogsBtn').addEventListener('click', clearLogs);
})();
