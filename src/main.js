// Discord Cloner Pro - финальная исправленная версия
// Аватар пользователя загружается корректно, черно-белый дизайн

(function() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg-deep: #000000;
      --bg-surface: #0a0a0a;
      --bg-elevated: #141414;
      --bg-card: rgba(10, 10, 10, 0.96);
      --border-subtle: rgba(255, 255, 255, 0.06);
      --border-medium: rgba(255, 255, 255, 0.1);
      --border-active: rgba(255, 255, 255, 0.2);
      --text-white: #ffffff;
      --text-gray: #b0b0b0;
      --text-dim: #5a5a5a;
      --shadow-sm: 0 2px 8px rgba(0,0,0,0.5);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.6);
      --shadow-lg: 0 8px 32px rgba(0,0,0,0.7);
      --shadow-xl: 0 16px 48px rgba(0,0,0,0.8);
      --success: #10b981;
      --error: #ef4444;
      --warning: #f59e0b;
      --info: #3b82f6;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: var(--bg-deep);
      color: var(--text-white);
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.02) 0%, transparent 60%),
                  radial-gradient(circle at 80% 70%, rgba(255,255,255,0.01) 0%, transparent 60%);
      pointer-events: none;
    }
    .particles {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    .particle {
      position: absolute;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      animation: floatParticle 20s infinite linear;
    }
    @keyframes floatParticle {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
      20% { opacity: 0.3; }
      80% { opacity: 0.3; }
      100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    .auth-container, .main-container {
      position: relative;
      z-index: 10;
    }
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .main-container {
      display: none;
      padding: 20px;
      height: 100vh;
    }
    .auth-card {
      background: var(--bg-card);
      backdrop-filter: blur(24px);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-medium);
      padding: 48px;
      max-width: 480px;
      width: 100%;
      box-shadow: var(--shadow-xl);
      transition: all 0.3s ease;
    }
    .auth-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-active);
      box-shadow: var(--shadow-xl), 0 0 30px rgba(255,255,255,0.05);
    }
    .logo { text-align: center; margin-bottom: 40px; }
    .logo-icon {
      width: 88px;
      height: 88px;
      background: #111;
      border: 1px solid var(--border-medium);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: var(--shadow-lg);
      transition: all 0.3s ease;
      font-size: 52px;
    }
    .logo-icon:hover {
      transform: scale(1.05);
      border-color: var(--text-gray);
      box-shadow: 0 0 30px rgba(255,255,255,0.1);
    }
    .logo h1 {
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--text-white);
    }
    .logo p {
      color: var(--text-dim);
      font-size: 0.875rem;
      margin-top: 8px;
    }
    .input-group { margin-bottom: 24px; }
    .input-group label {
      display: block;
      margin-bottom: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-gray);
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-wrapper input {
      width: 100%;
      padding: 14px 48px 14px 18px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-white);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }
    .input-wrapper input:focus {
      outline: none;
      border-color: var(--text-gray);
      box-shadow: 0 0 0 2px rgba(255,255,255,0.05);
    }
    .input-wrapper input.error {
      border-color: var(--error);
      animation: shake 0.3s ease;
    }
    .toggle-password {
      position: absolute;
      right: 14px;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toggle-password svg {
      width: 20px;
      height: 20px;
      stroke: var(--text-dim);
      transition: stroke 0.2s;
    }
    .toggle-password:hover svg { stroke: var(--text-white); }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
    .btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary {
      background: #1a1a1a;
      color: var(--text-white);
      border: 1px solid var(--border-medium);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      background: #222;
      border-color: var(--text-gray);
      box-shadow: var(--shadow-md);
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      transform: translate(-50%, -50%);
      transition: width 0.5s, height 0.5s;
    }
    .btn-primary:active::before {
      width: 200px;
      height: 200px;
    }
    .wrapper {
      display: flex;
      gap: 24px;
      max-width: 1400px;
      margin: 0 auto;
      height: calc(100vh - 40px);
    }
    .left-panel, .right-panel {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-medium);
      padding: 28px;
      transition: all 0.3s ease;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }
    .left-panel { flex: 1.2; }
    .right-panel { flex: 0.8; }
    .left-panel:hover, .right-panel:hover {
      border-color: var(--border-active);
      box-shadow: var(--shadow-xl);
    }
    .contact-bar {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 100;
      background: rgba(20,20,20,0.9);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border-medium);
      border-radius: 40px;
      padding: 8px 20px;
      transition: all 0.3s ease;
    }
    .contact-bar:hover {
      border-color: var(--text-gray);
      transform: translateY(-2px);
    }
    .contact-link {
      color: var(--text-gray);
      text-decoration: none;
      font-size: 0.813rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .contact-link:hover { color: var(--text-white); }
    .user-info {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 18px;
      background: var(--bg-elevated);
      border-radius: var(--radius-lg);
      margin-bottom: 28px;
      border: 1px solid var(--border-subtle);
      transition: all 0.2s;
    }
    .user-info:hover {
      border-color: var(--border-active);
      transform: translateX(6px);
    }
    .user-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #1a1a1a;
      border: 1px solid var(--text-gray);
      overflow: hidden;
      flex-shrink: 0;
    }
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .user-avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #222;
      color: var(--text-white);
      font-size: 26px;
      font-weight: 600;
    }
    .user-name {
      font-weight: 700;
      font-size: 1.1rem;
      margin-bottom: 4px;
    }
    .user-email {
      font-size: 0.75rem;
      color: var(--text-dim);
    }
    .user-badge {
      display: inline-block;
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 2px 10px;
      font-size: 0.65rem;
      color: var(--text-gray);
      margin-top: 6px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: var(--bg-elevated);
      border-radius: var(--radius-lg);
      padding: 16px;
      text-align: center;
      border: 1px solid var(--border-subtle);
      transition: all 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-4px);
      border-color: var(--text-gray);
      box-shadow: var(--shadow-sm);
    }
    .stat-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-white);
    }
    .stat-label {
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--text-dim);
      margin-top: 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .input-modern {
      width: 100%;
      padding: 12px 16px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      color: var(--text-white);
      font-size: 0.875rem;
      margin-bottom: 14px;
      transition: all 0.2s;
    }
    .input-modern:focus {
      outline: none;
      border-color: var(--text-gray);
      box-shadow: 0 0 0 2px rgba(255,255,255,0.05);
    }
    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }
    .btn-secondary {
      background: var(--bg-elevated);
      color: var(--text-white);
      border: 1px solid var(--border-medium);
    }
    .btn-secondary:hover {
      border-color: var(--text-gray);
      transform: translateY(-2px);
    }
    .btn-danger {
      background: rgba(239,68,68,0.1);
      color: var(--error);
      border: 1px solid rgba(239,68,68,0.3);
    }
    .btn-danger:hover {
      background: rgba(239,68,68,0.2);
      transform: translateY(-2px);
    }
    .status-card {
      background: var(--bg-elevated);
      border-radius: var(--radius-lg);
      padding: 18px;
      margin: 20px 0;
      display: none;
      border: 1px solid var(--border-subtle);
    }
    .status-card.active { display: block; animation: fadeSlide 0.3s ease; }
    @keyframes fadeSlide {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .status-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-medium);
      border-top-color: var(--text-white);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .progress-bar {
      height: 4px;
      background: var(--bg-surface);
      border-radius: 2px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--text-white);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
    .log-box {
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      padding: 16px;
      height: calc(100% - 70px);
      overflow-y: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      border: 1px solid var(--border-subtle);
    }
    .log-item {
      padding: 8px 12px;
      margin: 6px 0;
      border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.02);
      display: flex;
      gap: 12px;
      align-items: center;
      animation: logEntry 0.2s ease;
    }
    @keyframes logEntry {
      from { opacity: 0; transform: translateX(-8px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .log-item:hover {
      background: rgba(255,255,255,0.05);
    }
    .log-time {
      color: var(--text-dim);
      min-width: 60px;
      font-size: 0.65rem;
    }
    .log-icon svg { width: 14px; height: 14px; }
    .log-success .log-icon svg { color: var(--success); }
    .log-error .log-icon svg { color: var(--error); }
    .log-warning .log-icon svg { color: var(--warning); }
    .log-info .log-icon svg { color: var(--info); }
    .log-header {
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .clear-logs-btn {
      background: transparent;
      border: 1px solid var(--border-medium);
      color: var(--text-gray);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    .clear-logs-btn:hover {
      background: rgba(255,255,255,0.05);
      border-color: var(--text-gray);
      color: var(--text-white);
    }
    @media (max-width: 768px) {
      .wrapper { flex-direction: column; height: auto; gap: 16px; }
      .left-panel, .right-panel { flex: none; padding: 20px; }
      .right-panel { height: 400px; }
      .auth-card { padding: 32px; margin: 16px; }
      .user-avatar { width: 48px; height: 48px; }
      .logo-icon { width: 64px; height: 64px; font-size: 38px; }
      .logo h1 { font-size: 1.6rem; }
      .contact-bar { top: 16px; right: 16px; padding: 5px 14px; }
      .stat-value { font-size: 1.4rem; }
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg-surface); }
    ::-webkit-scrollbar-thumb { background: #3a3a3a; border-radius: 4px; }
  `;
  document.head.appendChild(style);

  // ------------------------------ SVG иконки ---------------------------------
  const SVG_ICONS = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
  };

  function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles';
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 20}s`;
      p.style.animationDuration = `${Math.random() * 15 + 10}s`;
      container.appendChild(p);
    }
    document.body.appendChild(container);
  }

  function setFavicon() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#fff';
    ctx.font = '40px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐱', 32, 32);
    const link = document.querySelector('link[rel*="icon"]') || document.createElement('link');
    link.rel = 'icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
  }

  // ------------------------------ Основное приложение ---------------------------------
  const API = 'https://discord.com/api/v10';
  let cloning = false, cancel = false, controller = null;
  let authToken = null, currentUser = null;
  let keepAliveInterval = null;

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const log = (msg, type = 'info', target = 'mainLog') => {
    const box = document.getElementById(target);
    if (!box) return;
    const time = new Date().toLocaleTimeString('ru-RU');
    const div = document.createElement('div');
    div.className = `log-item log-${type}`;
    div.innerHTML = `<span class="log-time">${time}</span><span class="log-icon">${SVG_ICONS[type] || SVG_ICONS.info}</span><span>${msg}</span>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    while (box.children.length > 300) box.removeChild(box.firstChild);
  };

  const updateStats = (stats) => {
    const rolesEl = document.getElementById('rolesCount');
    const channelsEl = document.getElementById('channelsCount');
    const errorsEl = document.getElementById('errorsCount');
    if (rolesEl) rolesEl.textContent = stats.roles || 0;
    if (channelsEl) channelsEl.textContent = stats.channels || 0;
    if (errorsEl) errorsEl.textContent = stats.errors || 0;
  };

  const updateUserInfo = (user) => {
    const nameEl = document.getElementById('userName');
    const emailEl = document.getElementById('userEmail');
    const avatarImg = document.getElementById('userAvatarImg');
    const placeholder = document.getElementById('userAvatarPlaceholder');
    if (nameEl) nameEl.textContent = user.username;
    if (emailEl) emailEl.textContent = user.email || 'email не указан';
    if (user.avatar) {
      const url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
      avatarImg.src = url;
      avatarImg.style.display = 'block';
      placeholder.style.display = 'none';
      avatarImg.onerror = () => {
        avatarImg.style.display = 'none';
        placeholder.style.display = 'flex';
        placeholder.textContent = user.username.charAt(0).toUpperCase();
      };
    } else {
      avatarImg.style.display = 'none';
      placeholder.style.display = 'flex';
      placeholder.textContent = user.username.charAt(0).toUpperCase();
    }
  };

  const startKeepAlive = () => {
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(async () => {
      if (authToken && document.visibilityState === 'visible') {
        try { await fetch(`${API}/users/@me`, { headers: { 'Authorization': authToken } }); } catch(e) {}
      }
    }, 240000);
  };
  const stopKeepAlive = () => { if (keepAliveInterval) clearInterval(keepAliveInterval); keepAliveInterval = null; };

  // ------------------------------ Авторизация ---------------------------------
  async function authorize() {
    const input = document.getElementById('authToken');
    const token = input.value.trim();
    if (!token) { showAuthError('Введите токен'); return; }
    const btn = document.getElementById('authBtn');
    const original = btn.textContent;
    btn.textContent = 'проверка...';
    btn.disabled = true;
    try {
      const res = await fetch(`${API}/users/@me`, { headers: { 'Authorization': token } });
      if (!res.ok) throw new Error(res.status === 401 ? 'Неверный токен' : `Ошибка ${res.status}`);
      const user = await res.json();
      authToken = token;
      currentUser = user;
      sessionStorage.setItem('discord_token', token);
      sessionStorage.setItem('discord_user', JSON.stringify(user));
      sessionStorage.setItem('lastActive', Date.now().toString());
      startKeepAlive();
      showNotification(`Добро пожаловать, ${user.username}`, 'success');
      const authContainer = document.querySelector('.auth-container');
      const mainContainer = document.querySelector('.main-container');
      authContainer.style.transition = 'opacity 0.5s, transform 0.5s';
      authContainer.style.opacity = '0';
      authContainer.style.transform = 'scale(0.96)';
      setTimeout(() => {
        authContainer.style.display = 'none';
        mainContainer.style.display = 'block';
        mainContainer.style.opacity = '0';
        mainContainer.style.transform = 'translateY(20px)';
        mainContainer.style.transition = 'opacity 0.5s, transform 0.5s';
        requestAnimationFrame(() => {
          mainContainer.style.opacity = '1';
          mainContainer.style.transform = 'translateY(0)';
        });
        initMainUI();
      }, 500);
    } catch (err) {
      showAuthError(err.message);
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  }

  function showAuthError(msg) {
    const input = document.getElementById('authToken');
    input.classList.add('error');
    const errDiv = document.getElementById('authError');
    errDiv.textContent = msg;
    errDiv.style.display = 'block';
    setTimeout(() => {
      input.classList.remove('error');
      errDiv.style.display = 'none';
    }, 3000);
  }

  function showNotification(msg, type = 'info') {
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6' };
    const bg = type === 'success' ? 'rgba(16,185,129,0.12)' : (type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.12)');
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed; top: 24px; right: 24px; z-index: 1000;
      background: ${bg}; backdrop-filter: blur(12px);
      border: 1px solid ${colors[type] + '40'};
      color: ${colors[type]}; padding: 12px 24px; border-radius: 12px;
      font-size: 0.875rem; font-weight: 500;
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      opacity: 0; transform: translateX(30px);
      transition: 0.3s;
    `;
    notif.textContent = msg;
    document.body.appendChild(notif);
    requestAnimationFrame(() => { notif.style.opacity = '1'; notif.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(30px)';
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }

  function togglePasswordVisibility() {
    const input = document.getElementById('authToken');
    const eye = document.getElementById('eyeIcon');
    if (input.type === 'password') {
      input.type = 'text';
      eye.innerHTML = SVG_ICONS.eyeOff;
    } else {
      input.type = 'password';
      eye.innerHTML = SVG_ICONS.eye;
    }
  }

  function initMainUI() {
    const savedSrc = localStorage.getItem('lastSourceId') || '';
    const savedDst = localStorage.getItem('lastTargetId') || '';
    document.getElementById('sourceId').value = savedSrc;
    document.getElementById('targetId').value = savedDst;
    document.getElementById('cloneBtn').addEventListener('click', startClone);
    document.getElementById('cancelBtn').addEventListener('click', cancelClone);
    document.getElementById('clearLogsBtn').addEventListener('click', () => clearLogs('mainLog'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    ['sourceId', 'targetId'].forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener('input', (e) => localStorage.setItem(`last${id === 'sourceId' ? 'Source' : 'Target'}Id`, e.target.value));
    });
    if (currentUser) {
      updateUserInfo(currentUser);
      log(`авторизация выполнена: ${currentUser.username}`, 'success', 'mainLog');
    }
  }

  function logout() {
    stopKeepAlive();
    sessionStorage.clear();
    localStorage.removeItem('lastSourceId');
    localStorage.removeItem('lastTargetId');
    showNotification('выход выполнен', 'success');
    setTimeout(() => location.reload(), 1000);
  }

  function clearLogs(logId) {
    const box = document.getElementById(logId);
    if (box) while (box.firstChild) box.removeChild(box.firstChild);
  }

  // ------------------------------ API запросы ---------------------------------
  async function apiRequest(url, opts = {}, retries = 3) {
    if (!authToken) throw new Error('не авторизован');
    if (cancel) throw new Error('CANCELLED');
    const signal = controller?.signal;
    for (let i = 0; i < retries; i++) {
      if (cancel) throw new Error('CANCELLED');
      try {
        const headers = { 'Authorization': authToken, 'Content-Type': 'application/json', ...opts.headers };
        const res = await fetch(url, { ...opts, headers, signal });
        if (res.status === 429) {
          const wait = parseInt(res.headers.get('Retry-After')) || 2;
          await sleep(wait * 1000);
          continue;
        }
        if (!res.ok && i === retries - 1) {
          let errText = await res.text().catch(() => '');
          if (errText.length > 200) errText = errText.slice(0,200) + '...';
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }
        if (!res.ok) { await sleep(1000 * (i+1)); continue; }
        return res;
      } catch(e) {
        if (e.name === 'AbortError') throw new Error('CANCELLED');
        if (i === retries-1) throw e;
        await sleep(1000 * (i+1));
      }
    }
  }

  async function copyGuildIcon(srcId, tgtId) {
    try {
      const srcGuild = await (await fetch(`${API}/guilds/${srcId}`, { headers: { 'Authorization': authToken } })).json();
      if (!srcGuild.icon) { log(`исходный сервер не имеет иконки`, 'info'); return false; }
      const iconRes = await fetch(`https://cdn.discordapp.com/icons/${srcId}/${srcGuild.icon}.png?size=256`);
      if (!iconRes.ok) throw new Error('загрузка иконки');
      const blob = await iconRes.blob();
      if (blob.size > 262144) { log(`иконка >256KB, пропуск`, 'warning'); return false; }
      const base64 = await new Promise(r => { const fr = new FileReader(); fr.onloadend = () => r(fr.result); fr.readAsDataURL(blob); });
      const base64Data = base64.split(',')[1];
      const upd = await fetch(`${API}/guilds/${tgtId}`, {
        method: 'PATCH',
        headers: { 'Authorization': authToken, 'Content-Type': 'application/json' },
        body: JSON.stringify({ icon: base64Data })
      });
      if (upd.ok) { log(`иконка сервера скопирована`, 'success'); return true; }
      throw new Error(`статус ${upd.status}`);
    } catch(e) { log(`ошибка копирования иконки: ${e.message}`, 'warning'); return false; }
  }

  function normalizeChannelType(origType, targetFeatures = []) {
    if (origType === 5 && !targetFeatures.includes('COMMUNITY')) return 0;
    if (origType === 13 && !targetFeatures.includes('STAGE_CHANNELS')) return 2;
    if (origType === 15 && !targetFeatures.includes('FORUM_CHANNELS')) return 0;
    return origType;
  }

  async function createChannelWithRetry(guildId, body, targetFeatures, maxAttempts = 2) {
    let lastError;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const resp = await apiRequest(`${API}/guilds/${guildId}/channels`, { method: 'POST', body: JSON.stringify(body) });
        return await resp.json();
      } catch(e) {
        lastError = e;
        if ((e.message.includes('400') || e.message.includes('50024') || e.message.includes('50035')) && body.type !== 0) {
          const originalType = body.type;
          body.type = 0;
          log(`ошибка типа канала (${originalType}), пробуем как текстовый`, 'warning');
          continue;
        }
        throw e;
      }
    }
    throw lastError;
  }

  function buildChannelData(ch, targetId, roleMap, catMap, srcGuildId, targetFeatures) {
    let ctype = normalizeChannelType(ch.type, targetFeatures);
    const data = {
      name: ch.name.substring(0, 100),
      type: ctype,
      position: ch.position,
      permission_overwrites: sanitizeOverwrites(ch.permission_overwrites, targetId, roleMap, srcGuildId)
    };
    if (ctype === 0 || ctype === 5) {
      if (ch.topic) data.topic = ch.topic.substring(0, 1024);
      if (ch.rate_limit_per_user) data.rate_limit_per_user = Math.min(ch.rate_limit_per_user, 21600);
      if (ch.nsfw) data.nsfw = true;
    }
    if (ctype === 2) {
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
    }).filter(v => v);
  }

  function resetClone() {
    cloning = false; cancel = false; controller = null;
    const cloneBtn = document.getElementById('cloneBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const statusDiv = document.getElementById('cloneStatus');
    if (cloneBtn) cloneBtn.disabled = false;
    if (cancelBtn) cancelBtn.disabled = true;
    if (statusDiv) statusDiv.classList.remove('active');
    const prog = document.getElementById('progressBar');
    if (prog) prog.style.width = '0%';
  }

  function cancelClone() {
    if (cloning) {
      cancel = true;
      if (controller) controller.abort();
      log('процесс остановлен', 'warning');
      const btn = document.getElementById('cancelBtn');
      if (btn) btn.disabled = true;
    }
  }

  async function startClone() {
    if (cloning) return;
    const src = document.getElementById('sourceId').value.trim();
    const tgt = document.getElementById('targetId').value.trim();
    if (!/^\d{17,20}$/.test(src) || !/^\d{17,20}$/.test(tgt)) {
      log('ошибка: неверный формат ID сервера', 'error');
      return;
    }
    if (src === tgt) { log('ошибка: серверы совпадают', 'error'); return; }

    cloning = true; cancel = false; controller = new AbortController();
    const cloneBtn = document.getElementById('cloneBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const statusDiv = document.getElementById('cloneStatus');
    const progFill = document.getElementById('progressBar');
    const progPercent = document.getElementById('progressPercent');
    const statusText = document.getElementById('statusText');

    cloneBtn.disabled = true;
    cancelBtn.disabled = false;
    statusDiv.classList.add('active');
    progFill.style.width = '0%';

    const stats = { roles: 0, channels: 0, errors: 0 };

    try {
      statusText.textContent = 'проверка прав';
      progPercent.textContent = '0%';
      const meGuilds = await (await apiRequest(`${API}/users/@me/guilds`)).json();
      const tgtGuild = meGuilds.find(g => g.id === tgt);
      if (!tgtGuild || !(BigInt(tgtGuild.permissions) & 0x8n)) throw new Error('требуются права администратора');

      const targetFull = await (await apiRequest(`${API}/guilds/${tgt}`)).json();
      const targetFeatures = targetFull.features || [];

      const srcGuild = await (await apiRequest(`${API}/guilds/${src}`)).json();
      log(`исходный сервер: ${srcGuild.name}`, 'success');
      await copyGuildIcon(src, tgt);

      statusText.textContent = 'очистка каналов';
      let channels = await (await apiRequest(`${API}/guilds/${tgt}/channels`)).json();
      for (let i=0; i<channels.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        try {
          await apiRequest(`${API}/channels/${channels[i].id}`, { method: 'DELETE' });
          log(`удалён канал: ${channels[i].name || channels[i].id}`, 'warning');
        } catch(e) { stats.errors++; log(`ошибка удаления: ${e.message}`, 'error'); }
        await sleep(200);
        const pct = Math.min(10, ((i+1)/Math.max(channels.length,1))*10);
        progFill.style.width = pct+'%';
        progPercent.textContent = Math.floor(pct)+'%';
        updateStats(stats);
      }

      statusText.textContent = 'очистка ролей';
      let roles = await (await apiRequest(`${API}/guilds/${tgt}/roles`)).json();
      const delRoles = roles.filter(r => r.name !== '@everyone' && !r.managed).sort((a,b)=>b.position-a.position);
      for (let r of delRoles) {
        if (cancel) throw new Error('CANCELLED');
        try { await apiRequest(`${API}/guilds/${tgt}/roles/${r.id}`, { method: 'DELETE' }); } catch(e) {}
        await sleep(150);
      }
      progFill.style.width = '15%'; progPercent.textContent = '15%';

      statusText.textContent = 'настройка сервера';
      await apiRequest(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify({ name: srcGuild.name }) });
      log(`название скопировано: ${srcGuild.name}`, 'success');
      progFill.style.width = '25%'; progPercent.textContent = '25%';

      statusText.textContent = 'создание ролей';
      const srcRoles = await (await apiRequest(`${API}/guilds/${src}/roles`)).json();
      const rolesToCreate = srcRoles.filter(r => r.name !== '@everyone' && !r.managed).sort((a,b)=>b.position-a.position);
      const roleMap = {};
      for (let i=0; i<rolesToCreate.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        const r = rolesToCreate[i];
        try {
          const body = JSON.stringify({
            name: r.name.slice(0,100), color: r.color||0, hoist: !!r.hoist,
            mentionable: !!r.mentionable, permissions: String(r.permissions||0)
          });
          const resp = await apiRequest(`${API}/guilds/${tgt}/roles`, { method: 'POST', body });
          const nr = await resp.json();
          roleMap[r.id] = nr.id;
          stats.roles++;
          log(`роль создана: ${r.name}`, 'success');
        } catch(e) { stats.errors++; log(`ошибка роли ${r.name}: ${e.message}`, 'error'); }
        await sleep(250);
        const pct = 25 + ((i+1)/Math.max(rolesToCreate.length,1))*30;
        progFill.style.width = pct+'%';
        progPercent.textContent = Math.floor(pct)+'%';
        updateStats(stats);
      }
      log(`создано ролей: ${stats.roles}`, 'info');

      statusText.textContent = 'создание каналов';
      const srcChannels = await (await apiRequest(`${API}/guilds/${src}/channels`)).json();
      const categories = srcChannels.filter(c => c.type === 4).sort((a,b)=>a.position-b.position);
      const others = srcChannels.filter(c => c.type !== 4).sort((a,b)=>a.position-b.position);
      const catMap = {};
      let created = 0;
      const total = categories.length + others.length;

      for (let cat of categories) {
        if (cancel) throw new Error('CANCELLED');
        try {
          const body = buildChannelData(cat, tgt, roleMap, catMap, srcGuild.id, targetFeatures);
          const resp = await apiRequest(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
          const ch = await resp.json();
          catMap[cat.id] = ch.id;
          created++; stats.channels++;
          log(`категория создана: ${cat.name}`, 'success');
        } catch(e) { stats.errors++; log(`ошибка категории ${cat.name}: ${e.message}`, 'error'); }
        await sleep(250);
        updateStats(stats);
      }

      for (let i=0; i<others.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        const ch = others[i];
        try {
          let body = buildChannelData(ch, tgt, roleMap, catMap, srcGuild.id, targetFeatures);
          await createChannelWithRetry(tgt, body, targetFeatures);
          created++; stats.channels++;
          log(`канал создан: ${ch.name}`, 'success');
        } catch(e) { stats.errors++; log(`ошибка канала ${ch.name}: ${e.message}`, 'error'); }
        await sleep(200);
        const pct = 60 + ((categories.length + i + 1)/Math.max(total,1))*40;
        progFill.style.width = pct+'%';
        progPercent.textContent = Math.floor(pct)+'%';
        updateStats(stats);
      }

      progFill.style.width = '100%';
      progPercent.textContent = '100%';
      log(`клонирование завершено`, 'success');
      log(`статистика: ${stats.roles} ролей, ${stats.channels} каналов`, 'info');
      if (stats.errors) log(`ошибок: ${stats.errors}`, 'warning');
      showNotification('клонирование завершено', 'success');
    } catch(e) {
      if (e.message === 'CANCELLED') {
        log('процесс отменён', 'warning');
        showNotification('клонирование отменено', 'info');
      } else {
        log(`критическая ошибка: ${e.message}`, 'error');
        showNotification('ошибка при клонировании', 'error');
      }
    } finally { resetClone(); }
  }

  // ------------------------------ Запуск ---------------------------------
  createParticles();
  setFavicon();

  document.body.innerHTML = `
    <div class="auth-container">
      <div class="contact-bar"><a href="https://t.me/xolirx" target="_blank" class="contact-link"><span>●</span><span>@xolirx</span></a></div>
      <div class="auth-card">
        <div class="logo"><div class="logo-icon">🐱</div><h1>discord cloner</h1><p>профессиональный инструмент для клонирования</p></div>
        <div class="input-group">
          <label>токен авторизации</label>
          <div class="input-wrapper">
            <input type="password" id="authToken" placeholder="введите ваш discord токен">
            <button class="toggle-password" id="togglePasswordBtn" type="button">${SVG_ICONS.eye}</button>
          </div>
          <div id="authError" style="color:#ef4444; font-size:0.7rem; margin-top:6px; display:none;"></div>
        </div>
        <button class="btn btn-primary" id="authBtn">авторизоваться</button>
        <div style="margin-top:28px; text-align:center; font-size:0.7rem; color:#5a5a5a;"><p>разработчик: xolirx</p><p>версия 2.1.0</p></div>
      </div>
    </div>
    <div class="main-container">
      <div class="contact-bar"><a href="https://t.me/xolirx" target="_blank" class="contact-link"><span>●</span><span>@xolirx</span></a></div>
      <div class="wrapper">
        <div class="left-panel">
          <div class="user-info">
            <div class="user-avatar"><img id="userAvatarImg" style="display:none;"><div id="userAvatarPlaceholder" class="user-avatar-placeholder"></div></div>
            <div class="user-details"><div class="user-name" id="userName">загрузка...</div><div class="user-email" id="userEmail">загрузка...</div><div class="user-badge">авторизован</div></div>
          </div>
          <div class="header"><h2>discord cloner pro</h2><div class="developer">xolirx — профессиональное издание</div></div>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-value" id="rolesCount">0</div><div class="stat-label">создано ролей</div></div>
            <div class="stat-card"><div class="stat-value" id="channelsCount">0</div><div class="stat-label">создано каналов</div></div>
            <div class="stat-card"><div class="stat-value" id="errorsCount">0</div><div class="stat-label">ошибок</div></div>
            <div class="stat-card"><div class="stat-value" id="statusIcon">●</div><div class="stat-label">статус системы</div></div>
          </div>
          <input type="hidden" id="tokenInput">
          <input class="input-modern" id="sourceId" placeholder="id исходного сервера">
          <input class="input-modern" id="targetId" placeholder="id целевого сервера">
          <div class="button-group"><button class="btn btn-primary" id="cloneBtn">Начать клонирование</button><button class="btn btn-secondary" id="cancelBtn" disabled>Отмена</button></div>
          <div class="status-card" id="cloneStatus"><div class="status-header"><div class="spinner"></div><span id="statusText">Инициализация</span><span id="progressPercent" style="margin-left:auto; font-weight:600;">0%</span></div><div class="progress-bar"><div class="progress-fill" id="progressBar"></div></div></div>
          <button class="btn btn-danger" id="logoutBtn" style="margin-top:20px;">Выйти</button>
        </div>
        <div class="right-panel"><div class="log-header"><span>Логи</span><button class="clear-logs-btn" id="clearLogsBtn">Очистить</button></div><div id="mainLog" class="log-box"></div></div>
      </div>
    </div>
  `;

  document.getElementById('togglePasswordBtn').addEventListener('click', togglePasswordVisibility);
  document.getElementById('authBtn').addEventListener('click', authorize);
  document.getElementById('authToken').addEventListener('keypress', e => { if (e.key === 'Enter') authorize(); });

  const savedToken = sessionStorage.getItem('discord_token');
  const savedUser = sessionStorage.getItem('discord_user');
  const lastActive = sessionStorage.getItem('lastActive');
  if (savedToken && savedUser && lastActive && (Date.now() - parseInt(lastActive) < 86400000)) {
    authToken = savedToken;
    currentUser = JSON.parse(savedUser);
    document.getElementById('authToken').value = savedToken;
    setTimeout(() => authorize(), 100);
  } else if (savedToken) sessionStorage.clear();
})();
