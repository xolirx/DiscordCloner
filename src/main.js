(function() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg: #050505;
      --surface: #0a0a0a;
      --card: #101010;
      --border: #1f1f1f;
      --border-hover: #2e2e2e;
      --text: #e0e0e0;
      --text-secondary: #8a8a8a;
      --text-dim: #505050;
      --success: #0f0;
      --error: #f44;
      --warning: #f90;
      --info: #0af;
      --radius: 12px;
      --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
    }
    .particles {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
    }
    .particle {
      position: absolute;
      background: rgba(255,255,255,0.015);
      border-radius: 50%;
      animation: drift 30s infinite linear;
    }
    @keyframes drift {
      0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
      10% { opacity: 0.15; }
      90% { opacity: 0.15; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
    }
    .auth-screen, .main-screen {
      position: relative;
      z-index: 1;
      width: 100%;
      min-height: 100vh;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .auth-screen {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .auth-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 24px 48px rgba(0,0,0,0.5);
      transition: transform var(--transition), border-color var(--transition);
    }
    .auth-card:hover { border-color: var(--border-hover); }
    .auth-logo {
      width: 72px;
      height: 72px;
      margin: 0 auto 24px;
      position: relative;
    }
    .auth-logo canvas {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
    .auth-title {
      text-align: center;
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 6px;
      letter-spacing: -0.3px;
    }
    .auth-subtitle {
      text-align: center;
      color: var(--text-dim);
      font-size: 0.8rem;
      margin-bottom: 32px;
    }
    .field { margin-bottom: 20px; }
    .field label {
      display: block;
      font-size: 0.78rem;
      color: var(--text-secondary);
      margin-bottom: 8px;
      font-weight: 500;
    }
    .input-row { position: relative; }
    .input-row input {
      width: 100%;
      padding: 13px 46px 13px 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-size: 0.88rem;
      transition: all var(--transition);
    }
    .input-row input:focus {
      outline: none;
      border-color: var(--text-secondary);
      box-shadow: 0 0 0 2px rgba(255,255,255,0.03);
    }
    .input-row input.error {
      border-color: var(--error);
      animation: shake 0.4s ease;
    }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
    .toggle-pass {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-dim);
      padding: 4px;
      display: flex;
      transition: color var(--transition);
    }
    .toggle-pass:hover { color: var(--text); }
    .btn {
      width: 100%;
      padding: 13px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all var(--transition);
      position: relative;
      overflow: hidden;
    }
    .btn:hover { border-color: var(--border-hover); transform: translateY(-1px); }
    .btn:active { transform: translateY(0); }
    .btn.danger { color: var(--error); border-color: rgba(255,68,68,0.2); }
    .btn.danger:hover { border-color: var(--error); background: rgba(255,68,68,0.05); }
    .btn:disabled { opacity: 0.4; pointer-events: none; }
    .instruction-toggle {
      width: 100%;
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 0.7rem;
      padding: 8px 0;
      cursor: pointer;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: color var(--transition);
      margin-top: 4px;
    }
    .instruction-toggle:hover { color: var(--text-secondary); }
    .instruction-toggle svg {
      width: 12px;
      height: 12px;
      transition: transform 0.3s ease;
    }
    .instruction-toggle.open svg { transform: rotate(180deg); }
    .instruction-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s ease, padding 0.4s ease;
      background: var(--surface);
      border-radius: var(--radius);
      font-size: 0.7rem;
      color: var(--text-dim);
      line-height: 1.6;
    }
    .instruction-content.open {
      max-height: 400px;
      padding: 14px;
      margin-top: 6px;
      border: 1px solid var(--border);
    }
    .contact {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 100;
      font-size: 0.72rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 5px 16px;
      transition: all var(--transition);
      color: var(--text-secondary);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .contact:hover { border-color: var(--text-secondary); color: var(--text); }
    .main-screen { display: none; padding: 20px; }
    .main-grid {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 20px;
      width: 100%;
      height: calc(100vh - 40px);
    }
    .panel {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      transition: border-color var(--transition);
    }
    .panel:hover { border-color: var(--border-hover); }
    .user-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px;
      background: var(--surface);
      border-radius: var(--radius);
      margin-bottom: 24px;
      border: 1px solid var(--border);
      transition: all var(--transition);
    }
    .user-row:hover { border-color: var(--border-hover); }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--border);
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1.1rem;
    }
    .avatar img { width: 100%; height: 100%; object-fit: cover; display: none; }
    .user-meta .name { font-weight: 600; font-size: 0.9rem; }
    .user-meta .email { font-size: 0.68rem; color: var(--text-dim); }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      font-size: 0.62rem;
      color: var(--text-dim);
      margin-top: 4px;
    }
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 24px;
    }
    .stat {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 16px;
      text-align: center;
      border: 1px solid var(--border);
      transition: all var(--transition);
    }
    .stat:hover { transform: translateY(-2px); border-color: var(--border-hover); }
    .stat .value { font-size: 1.5rem; font-weight: 700; }
    .stat .label {
      font-size: 0.62rem;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-top: 4px;
    }
    .input {
      width: 100%;
      padding: 11px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      color: var(--text);
      font-size: 0.82rem;
      margin-bottom: 10px;
      transition: all var(--transition);
    }
    .input:focus { outline: none; border-color: var(--text-secondary); }
    .btn-row { display: flex; gap: 10px; margin-top: 20px; }
    .status-bar {
      background: var(--surface);
      border-radius: var(--radius);
      padding: 12px 16px;
      margin-top: 14px;
      display: none;
      align-items: center;
      gap: 12px;
      border: 1px solid var(--border);
    }
    .status-bar.active { display: flex; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--border);
      border-top-color: var(--text);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .progress-track {
      height: 3px;
      background: var(--border);
      border-radius: 2px;
      flex: 1;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--text);
      border-radius: 2px;
      width: 0%;
      transition: width 0.3s ease;
    }
    .log-panel { display: flex; flex-direction: column; }
    .log-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
    }
    .log-header span { font-weight: 600; font-size: 0.85rem; }
    .log-header button {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-dim);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.65rem;
      cursor: pointer;
      transition: all var(--transition);
    }
    .log-header button:hover { border-color: var(--text-secondary); color: var(--text); }
    .log-box {
      flex: 1;
      background: var(--surface);
      border-radius: var(--radius);
      padding: 12px;
      overflow-y: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.62rem;
      line-height: 1.5;
      min-height: 0;
    }
    .log-item {
      padding: 5px 8px;
      margin: 3px 0;
      border-radius: 5px;
      background: rgba(255,255,255,0.015);
      display: flex;
      gap: 8px;
      animation: slideLog 0.2s ease;
    }
    @keyframes slideLog {
      from { opacity: 0; transform: translateX(-4px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .log-item:hover { background: rgba(255,255,255,0.03); }
    .log-time { color: var(--text-dim); min-width: 50px; font-size: 0.6rem; }
    .log-icon svg { width: 11px; height: 11px; }
    .log-success .log-icon svg { color: var(--success); }
    .log-error .log-icon svg { color: var(--error); }
    .log-warning .log-icon svg { color: var(--warning); }
    .log-info .log-icon svg { color: var(--info); }
    @media (max-width: 768px) {
      .main-grid { grid-template-columns: 1fr; height: auto; }
      .main-screen { padding: 12px; }
      .panel { padding: 18px; }
      .auth-card { padding: 28px; max-width: 100%; }
      .auth-logo { width: 56px; height: 56px; }
      .auth-title { font-size: 1.3rem; }
      .stats { gap: 8px; }
      .stat { padding: 14px; }
      .stat .value { font-size: 1.2rem; }
      .contact { top: 12px; right: 12px; font-size: 0.65rem; padding: 4px 12px; }
      .btn-row { flex-direction: column; }
    }
    @media (max-width: 380px) {
      .auth-card { padding: 20px; }
      .auth-logo { width: 48px; height: 48px; }
      .auth-title { font-size: 1.1rem; }
      .input-row input { padding: 12px 40px 12px 12px; font-size: 0.8rem; }
      .btn { padding: 12px; font-size: 0.8rem; }
    }
  `;
  document.head.appendChild(style);

  const SVG = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`
  };

  function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const s = Math.random() * 3 + 1;
      p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-delay:${Math.random()*30}s;animation-duration:${Math.random()*20+15}s`;
      container.appendChild(p);
    }
    document.body.appendChild(container);
  }

  function drawCustomLogo(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 72;
    canvas.height = 72;
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(36, 36, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1f1f1f';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#e0e0e0';
    ctx.font = 'bold 28px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DC', 36, 36);
  }

  function setFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#050505';
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#2e2e2e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#e0e0e0';
    ctx.font = 'bold 26px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DC', 32, 32);
    const link = document.querySelector('link[rel*="icon"]') || document.createElement('link');
    link.rel = 'icon';
    link.href = canvas.toDataURL('image/png');
    document.head.appendChild(link);
  }

  const API = 'https://discord.com/api/v10';
  let authToken = null, currentUser = null;
  let cloning = false, cancelFlag = false, controller = null;
  let keepAliveInterval = null;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const log = (msg, type = 'info', target = 'mainLog') => {
    const box = document.getElementById(target);
    if (!box) return;
    const time = new Date().toLocaleTimeString('ru-RU');
    const div = document.createElement('div');
    div.className = `log-item log-${type}`;
    div.innerHTML = `<span class="log-time">${time}</span><span class="log-icon">${SVG[type]||SVG.info}</span><span>${msg}</span>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    while (box.children.length > 500) box.firstChild.remove();
  };

  const updateStats = s => {
    document.getElementById('rolesCount').textContent = s.roles || 0;
    document.getElementById('channelsCount').textContent = s.channels || 0;
    document.getElementById('errorsCount').textContent = s.errors || 0;
  };

  const updateUserUI = user => {
    document.getElementById('userName').textContent = user.username;
    document.getElementById('userEmail').textContent = user.email || 'email не указан';
    const img = document.getElementById('userAvatarImg');
    const ph = document.getElementById('userAvatarPlaceholder');
    if (user.avatar) {
      img.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
      img.style.display = 'block';
      ph.style.display = 'none';
      img.onerror = () => { img.style.display = 'none'; ph.style.display = 'flex'; ph.textContent = user.username.charAt(0).toUpperCase(); };
    } else {
      img.style.display = 'none';
      ph.style.display = 'flex';
      ph.textContent = user.username.charAt(0).toUpperCase();
    }
  };

  function startKeepAlive() {
    stopKeepAlive();
    keepAliveInterval = setInterval(() => {
      if (authToken && document.visibilityState === 'visible') fetch(`${API}/users/@me`, { headers: { Authorization: authToken } }).catch(() => {});
    }, 240000);
  }

  function stopKeepAlive() {
    if (keepAliveInterval) { clearInterval(keepAliveInterval); keepAliveInterval = null; }
  }

  function notify(msg, type = 'info') {
    const colors = { success: '#0f0', error: '#f44', info: '#0af' };
    const notif = document.createElement('div');
    Object.assign(notif.style, {
      position: 'fixed', top: '20px', right: '20px', zIndex: '1000',
      background: `rgba(${type==='success'?'16,185,129':type==='error'?'239,68,68':'59,130,246'},0.1)`,
      backdropFilter: 'blur(8px)',
      border: `1px solid ${colors[type]}40`,
      color: colors[type], padding: '10px 20px', borderRadius: '10px',
      fontSize: '0.8rem', fontWeight: '500',
      boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
      opacity: '0', transform: 'translateX(20px)',
      transition: 'opacity 0.25s, transform 0.25s'
    });
    notif.textContent = msg;
    document.body.appendChild(notif);
    requestAnimationFrame(() => { notif.style.opacity = '1'; notif.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      notif.style.opacity = '0'; notif.style.transform = 'translateX(20px)';
      setTimeout(() => notif.remove(), 250);
    }, 3000);
  }

  async function apiRequest(url, opts = {}, retries = 3) {
    if (!authToken) throw new Error('Не авторизован');
    if (cancelFlag) throw new Error('CANCELLED');
    const signal = controller?.signal;
    for (let i = 0; i < retries; i++) {
      if (cancelFlag) throw new Error('CANCELLED');
      try {
        const headers = { Authorization: authToken, 'Content-Type': 'application/json', ...opts.headers };
        const res = await fetch(url, { ...opts, headers, signal });
        if (res.status === 429) { await sleep((parseInt(res.headers.get('Retry-After'))||2)*1000); continue; }
        if (!res.ok && i === retries-1) {
          let t = await res.text().catch(() => '');
          if (t.length > 200) t = t.slice(0,200)+'...';
          throw new Error(`HTTP ${res.status}: ${t}`);
        }
        if (!res.ok) { await sleep(1000*(i+1)); continue; }
        return res;
      } catch (e) {
        if (e.name === 'AbortError') throw new Error('CANCELLED');
        if (i === retries-1) throw e;
        await sleep(1000*(i+1));
      }
    }
  }

  function sanitizeOverwrites(ow, tgtId, roleMap, srcId) {
    if (!Array.isArray(ow)) return [];
    return ow.map(o => {
      if (!o?.id) return null;
      if (o.type === 0) {
        if (o.id === srcId) return { id: tgtId, type: 0, allow: String(o.allow||0), deny: String(o.deny||0) };
        if (roleMap[o.id]) return { id: roleMap[o.id], type: 0, allow: String(o.allow||0), deny: String(o.deny||0) };
        return null;
      }
      return null;
    }).filter(Boolean);
  }

  function normalizeChannelType(type, feat) {
    if (type === 5 && !feat.includes('COMMUNITY')) return 0;
    if (type === 13 && !feat.includes('STAGE_CHANNELS')) return 2;
    if (type === 15 && !feat.includes('FORUM_CHANNELS')) return 0;
    return type;
  }

  function buildChannelData(ch, tgtId, roleMap, catMap, srcId, feat) {
    const ct = normalizeChannelType(ch.type, feat);
    const d = {
      name: ch.name.slice(0,100), type: ct, position: ch.position,
      permission_overwrites: sanitizeOverwrites(ch.permission_overwrites, tgtId, roleMap, srcId)
    };
    if (ct === 0 || ct === 5) {
      if (ch.topic) d.topic = ch.topic.slice(0,1024);
      if (ch.rate_limit_per_user) d.rate_limit_per_user = Math.min(ch.rate_limit_per_user, 21600);
      if (ch.nsfw) d.nsfw = true;
    }
    if (ct === 2) {
      d.bitrate = Math.min(Math.max(ch.bitrate||64000,8000),96000);
      d.user_limit = ch.user_limit ? Math.min(Math.max(ch.user_limit,0),99) : 0;
    }
    if (ch.parent_id && catMap[ch.parent_id]) d.parent_id = catMap[ch.parent_id];
    return d;
  }

  async function copyGuildIcon(srcId, tgtId) {
    try {
      const g = await (await fetch(`${API}/guilds/${srcId}`, { headers: { Authorization: authToken } })).json();
      if (!g.icon) return false;
      const r = await fetch(`https://cdn.discordapp.com/icons/${srcId}/${g.icon}.png?size=256`);
      if (!r.ok) throw new Error('download');
      const blob = await r.blob();
      if (blob.size > 262144) { log('Иконка >256KB, пропущена', 'warning'); return false; }
      const b64 = await new Promise(res => { const fr = new FileReader(); fr.onloadend = () => res(fr.result); fr.readAsDataURL(blob); });
      await apiRequest(`${API}/guilds/${tgtId}`, { method: 'PATCH', body: JSON.stringify({ icon: b64.split(',')[1] }) });
      log('Иконка сервера скопирована', 'success'); return true;
    } catch (e) { log(`Ошибка иконки: ${e.message}`, 'warning'); return false; }
  }

  async function createChannelWithRetry(gid, body, feat, attempts = 2) {
    let lastErr;
    for (let i = 0; i < attempts; i++) {
      try {
        const r = await apiRequest(`${API}/guilds/${gid}/channels`, { method: 'POST', body: JSON.stringify(body) });
        return await r.json();
      } catch (e) {
        lastErr = e;
        if ((/400|50024|50035/).test(e.message) && body.type !== 0) { body.type = 0; log('Пробуем как текстовый канал', 'warning'); continue; }
        throw e;
      }
    }
    throw lastErr;
  }

  function resetCloneUI() {
    cloning = false; cancelFlag = false; controller = null;
    document.getElementById('cloneBtn').disabled = false;
    document.getElementById('cancelBtn').disabled = true;
    document.getElementById('cloneStatus').classList.remove('active');
    document.getElementById('progressBar').style.width = '0%';
  }

  function cancelClone() {
    if (cloning) {
      cancelFlag = true;
      if (controller) controller.abort();
      log('Процесс остановлен', 'warning');
      document.getElementById('cancelBtn').disabled = true;
    }
  }

  async function startClone() {
    if (cloning) return;
    const src = document.getElementById('sourceId').value.trim();
    const tgt = document.getElementById('targetId').value.trim();
    if (!/^\d{17,20}$/.test(src) || !/^\d{17,20}$/.test(tgt)) { log('Неверный ID сервера', 'error'); return; }
    if (src === tgt) { log('Серверы совпадают', 'error'); return; }
    cloning = true; cancelFlag = false; controller = new AbortController();
    document.getElementById('cloneBtn').disabled = true;
    document.getElementById('cancelBtn').disabled = false;
    document.getElementById('cloneStatus').classList.add('active');
    document.getElementById('progressBar').style.width = '0%';
    const stats = { roles: 0, channels: 0, errors: 0 };
    try {
      document.getElementById('statusText').textContent = 'Проверка прав';
      document.getElementById('progressPercent').textContent = '0%';
      const meGuilds = await (await apiRequest(`${API}/users/@me/guilds`)).json();
      const tgtGuild = meGuilds.find(g => g.id === tgt);
      if (!tgtGuild || !(BigInt(tgtGuild.permissions) & 0x8n)) throw new Error('Нужны права администратора');
      const targetFull = await (await apiRequest(`${API}/guilds/${tgt}`)).json();
      const feat = targetFull.features || [];
      const srcGuild = await (await apiRequest(`${API}/guilds/${src}`)).json();
      log(`Исходный сервер: ${srcGuild.name}`, 'success');
      await copyGuildIcon(src, tgt);
      document.getElementById('statusText').textContent = 'Очистка каналов';
      let channels = await (await apiRequest(`${API}/guilds/${tgt}/channels`)).json();
      for (let i = 0; i < channels.length; i++) {
        if (cancelFlag) throw new Error('CANCELLED');
        try { await apiRequest(`${API}/channels/${channels[i].id}`, { method: 'DELETE' }); log(`Удалён: ${channels[i].name||channels[i].id}`, 'warning'); } catch (e) { stats.errors++; log(`Ошибка: ${e.message}`, 'error'); }
        await sleep(200);
        const p = Math.min(10, ((i+1)/Math.max(channels.length,1))*10);
        document.getElementById('progressBar').style.width = p+'%';
        document.getElementById('progressPercent').textContent = Math.floor(p)+'%';
        updateStats(stats);
      }
      document.getElementById('statusText').textContent = 'Очистка ролей';
      let roles = await (await apiRequest(`${API}/guilds/${tgt}/roles`)).json();
      for (const r of roles.filter(r => r.name !== '@everyone' && !r.managed).sort((a,b)=>b.position-a.position)) {
        if (cancelFlag) throw new Error('CANCELLED');
        try { await apiRequest(`${API}/guilds/${tgt}/roles/${r.id}`, { method: 'DELETE' }); } catch (e) {}
        await sleep(150);
      }
      document.getElementById('progressBar').style.width = '15%';
      document.getElementById('progressPercent').textContent = '15%';
      document.getElementById('statusText').textContent = 'Создание ролей';
      const srcRoles = await (await apiRequest(`${API}/guilds/${src}/roles`)).json();
      const toCreate = srcRoles.filter(r => r.name !== '@everyone' && !r.managed).sort((a,b)=>b.position-a.position);
      const roleMap = {};
      for (let i = 0; i < toCreate.length; i++) {
        if (cancelFlag) throw new Error('CANCELLED');
        const r = toCreate[i];
        try {
          const resp = await apiRequest(`${API}/guilds/${tgt}/roles`, {
            method: 'POST',
            body: JSON.stringify({ name: r.name.slice(0,100), color: r.color||0, hoist: !!r.hoist, mentionable: !!r.mentionable, permissions: String(r.permissions||0) })
          });
          roleMap[r.id] = (await resp.json()).id;
          stats.roles++; log(`Роль: ${r.name}`, 'success');
        } catch (e) { stats.errors++; log(`Ошибка: ${e.message}`, 'error'); }
        await sleep(250);
        const p = 15 + ((i+1)/Math.max(toCreate.length,1))*30;
        document.getElementById('progressBar').style.width = p+'%';
        document.getElementById('progressPercent').textContent = Math.floor(p)+'%';
        updateStats(stats);
      }
      document.getElementById('statusText').textContent = 'Создание каналов';
      const srcCh = await (await apiRequest(`${API}/guilds/${src}/channels`)).json();
      const cats = srcCh.filter(c => c.type === 4).sort((a,b)=>a.position-b.position);
      const oth = srcCh.filter(c => c.type !== 4).sort((a,b)=>a.position-b.position);
      const catMap = {}, allMap = {};
      const total = cats.length + oth.length;
      for (const cat of cats) {
        if (cancelFlag) throw new Error('CANCELLED');
        try {
          const body = buildChannelData(cat, tgt, roleMap, catMap, srcGuild.id, feat);
          const r = await apiRequest(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
          const ch = await r.json();
          catMap[cat.id] = ch.id; allMap[cat.id] = ch.id;
          stats.channels++; log(`Категория: ${cat.name}`, 'success');
        } catch (e) { stats.errors++; log(`Ошибка: ${e.message}`, 'error'); }
        await sleep(250);
        updateStats(stats);
      }
      for (let i = 0; i < oth.length; i++) {
        if (cancelFlag) throw new Error('CANCELLED');
        const ch = oth[i];
        try {
          let body = buildChannelData(ch, tgt, roleMap, catMap, srcGuild.id, feat);
          const nc = await createChannelWithRetry(tgt, body, feat);
          allMap[ch.id] = nc.id;
          stats.channels++; log(`Канал: ${ch.name}`, 'success');
        } catch (e) { stats.errors++; log(`Ошибка: ${e.message}`, 'error'); }
        await sleep(200);
        const p = 45 + ((cats.length+i+1)/Math.max(total,1))*45;
        document.getElementById('progressBar').style.width = p+'%';
        document.getElementById('progressPercent').textContent = Math.floor(p)+'%';
        updateStats(stats);
      }
      document.getElementById('statusText').textContent = 'Настройки';
      const patch = {
        name: srcGuild.name,
        verification_level: srcGuild.verification_level,
        default_message_notifications: srcGuild.default_message_notifications,
        explicit_content_filter: srcGuild.explicit_content_filter,
        preferred_locale: srcGuild.preferred_locale
      };
      if (srcGuild.afk_channel_id && allMap[srcGuild.afk_channel_id]) patch.afk_channel_id = allMap[srcGuild.afk_channel_id];
      if (srcGuild.system_channel_id && allMap[srcGuild.system_channel_id]) patch.system_channel_id = allMap[srcGuild.system_channel_id];
      if (srcGuild.description) patch.description = srcGuild.description.slice(0,1024);
      await apiRequest(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify(patch) });
      log('Настройки применены', 'success');
      document.getElementById('progressBar').style.width = '100%';
      document.getElementById('progressPercent').textContent = '100%';
      log('Клонирование завершено', 'success');
      log(`Статистика: ${stats.roles} ролей, ${stats.channels} каналов`, 'info');
      if (stats.errors) log(`Ошибок: ${stats.errors}`, 'warning');
      notify('Клонирование завершено', 'success');
    } catch (e) {
      if (e.message === 'CANCELLED') { log('Процесс отменён', 'warning'); notify('Клонирование отменено', 'info'); }
      else { log(`Критическая ошибка: ${e.message}`, 'error'); notify('Ошибка клонирования', 'error'); }
    } finally { resetCloneUI(); }
  }

  function togglePassword() {
    const inp = document.getElementById('authToken');
    const icon = document.getElementById('eyeIcon');
    if (inp.type === 'password') { inp.type = 'text'; icon.innerHTML = SVG.eyeOff; }
    else { inp.type = 'password'; icon.innerHTML = SVG.eye; }
  }

  function toggleInstruction(btn) {
    const content = btn.nextElementSibling;
    const isOpen = content.classList.contains('open');
    document.querySelectorAll('.instruction-content.open').forEach(c => { c.classList.remove('open'); c.previousElementSibling.classList.remove('open'); });
    if (!isOpen) { content.classList.add('open'); btn.classList.add('open'); }
  }

  async function authorize() {
    const input = document.getElementById('authToken');
    const token = input.value.trim();
    if (!token) {
      const err = document.getElementById('authError');
      input.classList.add('error'); err.textContent = 'Введите токен'; err.style.display = 'block';
      setTimeout(() => { input.classList.remove('error'); err.style.display = 'none'; }, 3000);
      return;
    }
    const btn = document.getElementById('authBtn');
    const orig = btn.textContent;
    btn.textContent = 'Проверка...'; btn.disabled = true;
    try {
      const res = await fetch(`${API}/users/@me`, { headers: { Authorization: token } });
      if (!res.ok) throw new Error(res.status === 401 ? 'Неверный токен' : `Ошибка ${res.status}`);
      const user = await res.json();
      authToken = token; currentUser = user;
      sessionStorage.setItem('dc_token', token);
      sessionStorage.setItem('dc_user', JSON.stringify(user));
      sessionStorage.setItem('dc_last_active', Date.now().toString());
      startKeepAlive();
      notify(`Добро пожаловать, ${user.username}`, 'success');
      const authScreen = document.querySelector('.auth-screen');
      const mainScreen = document.querySelector('.main-screen');
      authScreen.style.opacity = '0'; authScreen.style.transform = 'scale(0.98)';
      setTimeout(() => {
        authScreen.style.display = 'none';
        mainScreen.style.display = 'block';
        mainScreen.style.opacity = '0'; mainScreen.style.transform = 'translateY(8px)';
        requestAnimationFrame(() => {
          mainScreen.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          mainScreen.style.opacity = '1'; mainScreen.style.transform = 'translateY(0)';
        });
        initMainUI();
      }, 400);
    } catch (e) {
      const err = document.getElementById('authError');
      input.classList.add('error'); err.textContent = e.message; err.style.display = 'block';
      setTimeout(() => { input.classList.remove('error'); err.style.display = 'none'; }, 3000);
    } finally { btn.textContent = orig; btn.disabled = false; }
  }

  function initMainUI() {
    document.getElementById('sourceId').value = localStorage.getItem('lastSrc') || '';
    document.getElementById('targetId').value = localStorage.getItem('lastTgt') || '';
    document.getElementById('cloneBtn').addEventListener('click', startClone);
    document.getElementById('cancelBtn').addEventListener('click', cancelClone);
    document.getElementById('clearLogsBtn').addEventListener('click', () => { const b = document.getElementById('mainLog'); if (b) b.innerHTML = ''; });
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('sourceId').addEventListener('input', e => localStorage.setItem('lastSrc', e.target.value));
    document.getElementById('targetId').addEventListener('input', e => localStorage.setItem('lastTgt', e.target.value));
    if (currentUser) { updateUserUI(currentUser); log(`Авторизация: ${currentUser.username}`, 'success', 'mainLog'); }
  }

  function logout() {
    stopKeepAlive();
    sessionStorage.clear();
    localStorage.removeItem('lastSrc'); localStorage.removeItem('lastTgt');
    notify('Выход выполнен', 'success');
    setTimeout(() => location.reload(), 800);
  }

  function buildUI() {
    document.body.insertAdjacentHTML('beforeend', `
      <div class="auth-screen">
        <a class="contact" href="https://t.me/xolirx" target="_blank">● @xolirx</a>
        <div class="auth-card">
          <div class="auth-logo"><canvas id="authLogoCanvas"></canvas></div>
          <div class="auth-title">Discord Cloner</div>
          <div class="auth-subtitle">Профессиональное клонирование серверов</div>
          <div class="field">
            <label>Токен авторизации</label>
            <div class="input-row">
              <input type="password" id="authToken" placeholder="Введите Discord токен">
              <button class="toggle-pass" id="togglePasswordBtn">${SVG.eye}</button>
            </div>
            <div id="authError" style="color:#f44;font-size:0.68rem;margin-top:6px;display:none;"></div>
          </div>
          <button class="btn" id="authBtn">Авторизоваться</button>
          <button class="instruction-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.classList.toggle('open')">
            Инструкция ${SVG.chevron}
          </button>
          <div class="instruction-content">
            <b>Как получить токен:</b><br>
            1. Откройте Discord в браузере (F12 → Консоль)<br>
            2. Вставьте и выполните код:<br>
            <code style="word-break:break-all;color:var(--text);">(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()</code><br>
            3. Скопируйте полученный токен и вставьте сюда.
          </div>
          <div style="margin-top:24px;text-align:center;font-size:0.62rem;color:var(--text-dim);">
            <p>Разработчик: xolirx</p>
            <p>Версия 3.1</p>
          </div>
        </div>
      </div>
      <div class="main-screen" style="display:none;">
        <a class="contact" href="https://t.me/xolirx" target="_blank">● @xolirx</a>
        <div class="main-grid">
          <div class="panel">
            <div class="user-row">
              <div class="avatar"><img id="userAvatarImg" style="display:none;"><div id="userAvatarPlaceholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:600;"></div></div>
              <div class="user-meta"><div class="name" id="userName">Загрузка...</div><div class="email" id="userEmail">Загрузка...</div><div class="badge">Авторизован</div></div>
            </div>
            <div class="stats">
              <div class="stat"><div class="value" id="rolesCount">0</div><div class="label">Ролей</div></div>
              <div class="stat"><div class="value" id="channelsCount">0</div><div class="label">Каналов</div></div>
              <div class="stat"><div class="value" id="errorsCount">0</div><div class="label">Ошибок</div></div>
              <div class="stat"><div class="value" id="statusIcon">●</div><div class="label">Статус</div></div>
            </div>
            <input class="input" id="sourceId" placeholder="ID исходного сервера">
            <button class="instruction-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.classList.toggle('open')">
              Инструкция ${SVG.chevron}
            </button>
            <div class="instruction-content">
              Введите ID сервера, с которого нужно скопировать структуру. Скопируйте ID, нажав правой кнопкой по серверу → «Копировать ID» (нужен режим разработчика в настройках Discord).
            </div>
            <input class="input" id="targetId" placeholder="ID целевого сервера" style="margin-top:10px;">
            <button class="instruction-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.classList.toggle('open')">
              Инструкция ${SVG.chevron}
            </button>
            <div class="instruction-content">
              Введите ID сервера, куда будет скопирована структура. Вы должны быть администратором на целевом сервере.
            </div>
            <div class="btn-row">
              <button class="btn" id="cloneBtn">Начать клонирование</button>
              <button class="btn" id="cancelBtn" disabled>Отмена</button>
            </div>
            <button class="instruction-toggle" onclick="this.nextElementSibling.classList.toggle('open');this.classList.toggle('open')">
              Инструкция ${SVG.chevron}
            </button>
            <div class="instruction-content">
              <b>Как работает клонирование:</b><br>
              — Очищаются все каналы и роли на целевом сервере<br>
              — Создаются роли в обратном порядке (снизу вверх)<br>
              — Создаются категории, затем остальные каналы<br>
              — Копируется название, иконка и основные настройки<br>
              — Процесс можно отменить в любой момент
            </div>
            <div class="status-bar" id="cloneStatus">
              <div class="spinner"></div>
              <span id="statusText" style="font-size:0.78rem;">Инициализация</span>
              <div class="progress-track"><div class="progress-fill" id="progressBar"></div></div>
              <span id="progressPercent" style="font-weight:600;font-size:0.75rem;min-width:36px;">0%</span>
            </div>
            <button class="btn danger" id="logoutBtn" style="margin-top:20px;">Выйти</button>
          </div>
          <div class="panel log-panel">
            <div class="log-header"><span>Логи</span><button id="clearLogsBtn">Очистить</button></div>
            <div id="mainLog" class="log-box"></div>
          </div>
        </div>
      </div>
    `);
    drawCustomLogo(document.getElementById('authLogoCanvas'));
  }

  createParticles();
  setFavicon();
  buildUI();

  document.getElementById('togglePasswordBtn').addEventListener('click', togglePassword);
  document.getElementById('authBtn').addEventListener('click', authorize);
  document.getElementById('authToken').addEventListener('keypress', e => { if (e.key === 'Enter') authorize(); });

  const savedToken = sessionStorage.getItem('dc_token');
  const savedUser = sessionStorage.getItem('dc_user');
  const lastActive = sessionStorage.getItem('dc_last_active');
  if (savedToken && savedUser && lastActive && (Date.now() - parseInt(lastActive) < 86400000)) {
    authToken = savedToken;
    currentUser = JSON.parse(savedUser);
    document.getElementById('authToken').value = savedToken;
    setTimeout(() => authorize(), 80);
  } else if (savedToken) { sessionStorage.clear(); }
})();
