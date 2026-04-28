// Стили с премиум черным дизайном
const style = document.createElement('style');
style.textContent = `
:root {
  --bg-primary: #0a0a0a;
  --bg-secondary: #0f0f0f;
  --bg-tertiary: #141414;
  --card-bg: rgba(18, 18, 18, 0.95);
  --card-bg-hover: rgba(28, 28, 28, 0.95);
  --accent-primary: #8b5cf6;
  --accent-secondary: #7c3aed;
  --accent-glow: rgba(139, 92, 246, 0.3);
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-dim: #6b6b6b;
  --border-color: rgba(255, 255, 255, 0.08);
  --border-glow: rgba(139, 92, 246, 0.2);
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: var(--text-primary);
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Анимированный фон */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
  pointer-events: none;
  animation: bgPulse 8s ease-in-out infinite;
}

@keyframes bgPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Частицы */
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
  background: rgba(139, 92, 246, 0.3);
  border-radius: 50%;
  animation: floatParticle 20s infinite linear;
}

@keyframes floatParticle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

/* Контейнеры */
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
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.main-container {
  display: none;
  padding: 20px;
  height: 100vh;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Auth Card */
.auth-card {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: 48px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.6);
  border-color: var(--border-glow);
}

.logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(139, 92, 246, 0);
  }
}

.logo-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.logo h1 {
  font-size: 2rem;
  background: linear-gradient(135deg, #fff, var(--accent-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.logo p {
  color: var(--text-dim);
  font-size: 0.875rem;
}

.input-group {
  margin-bottom: 24px;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.input-group input {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.input-group input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.input-group input.error {
  border-color: var(--error);
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.toggle-password {
  position: absolute;
  right: 12px;
  bottom: 14px;
  cursor: pointer;
  color: var(--text-dim);
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: var(--accent-primary);
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px var(--accent-glow);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-primary:active::before {
  width: 300px;
  height: 300px;
}

/* Main UI */
.wrapper {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 40px);
}

.left-panel, .right-panel {
  background: var(--card-bg);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  padding: 32px;
  transition: all var(--transition-base);
  overflow-y: auto;
}

.left-panel {
  flex: 1.2;
}

.right-panel {
  flex: 0.8;
}

.left-panel:hover, .right-panel:hover {
  border-color: var(--border-glow);
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
}

.header {
  margin-bottom: 32px;
  text-align: center;
}

.header h2 {
  font-size: 1.75rem;
  background: linear-gradient(135deg, #fff, var(--accent-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.header .developer {
  color: var(--text-dim);
  font-size: 0.75rem;
  letter-spacing: 1px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: 16px;
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-primary);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-dim);
  margin-top: 4px;
}

.input-modern {
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 16px;
  transition: all var(--transition-fast);
}

.input-modern:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  border: 1px solid var(--error);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-2px);
}

.status-card {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin: 20px 0;
  display: none;
  border: 1px solid var(--border-color);
}

.status-card.active {
  display: block;
  animation: slideInDown 0.4s ease;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-bar {
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  overflow: hidden;
  margin: 16px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
  border-radius: 3px;
  transition: width 0.4s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.log-box {
  background: var(--bg-tertiary);
  border-radius: var(--radius-lg);
  padding: 16px;
  height: calc(100% - 80px);
  overflow-y: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
}

.log-item {
  padding: 8px 12px;
  margin: 4px 0;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  gap: 12px;
  align-items: center;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}

.log-time {
  color: var(--text-dim);
  font-size: 0.7rem;
  min-width: 60px;
}

.log-success { border-left: 3px solid var(--success); }
.log-error { border-left: 3px solid var(--error); }
.log-warning { border-left: 3px solid var(--warning); }
.log-info { border-left: 3px solid var(--info); }

/* Адаптивность */
@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel, .right-panel {
    flex: none;
  }
  
  .right-panel {
    height: 400px;
  }
  
  .auth-card {
    padding: 32px;
  }
}

/* Стилизация скроллбара */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--accent-primary);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-secondary);
}
`;

document.head.appendChild(style);

// SVG иконки
const SVG_ICONS = {
  discord: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 9c0 3.5-2 6-6 6s-6-2.5-6-6 2-6 6-6 6 2.5 6 6z"/><path d="M12 3v3"/><path d="M12 15v6"/><path d="M8 21h8"/><circle cx="12" cy="9" r="2"/></svg>`,
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`,
  error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

// Генерация частиц
function createParticles() {
  const particlesDiv = document.createElement('div');
  particlesDiv.className = 'particles';
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    particlesDiv.appendChild(particle);
  }
  document.body.appendChild(particlesDiv);
}

// Основное приложение
(function() {
  const API = 'https://discord.com/api/v10';
  let cloning = false, cancel = false, controller = null;
  let authToken = null;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  
  const log = (msg, type = 'info', targetLog = 'mainLog') => {
    let box = document.getElementById(targetLog);
    if (!box) return;
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

  const updateStats = (stats) => {
    const elements = ['rolesCount', 'channelsCount', 'errorsCount'];
    elements.forEach(el => {
      const elem = document.getElementById(el);
      if (elem) elem.textContent = stats[el.replace('Count', '')] || 0;
    });
  };

  // Авторизация
  async function authorize() {
    const token = document.getElementById('authToken').value.trim();
    if (!token) {
      showAuthError('Введите токен');
      return;
    }

    const authBtn = document.getElementById('authBtn');
    const originalText = authBtn.textContent;
    authBtn.textContent = 'Проверка...';
    authBtn.disabled = true;

    try {
      const response = await fetch(`${API}/users/@me`, {
        headers: { 'Authorization': token }
      });

      if (!response.ok) throw new Error('Неверный токен');
      
      const user = await response.json();
      authToken = token;
      
      // Сохраняем токен
      sessionStorage.setItem('discord_token', token);
      sessionStorage.setItem('discord_user', JSON.stringify(user));
      
      // Показываем уведомление
      showNotification(`Добро пожаловать, ${user.username}!`, 'success');
      
      // Плавно переключаемся на главный экран
      setTimeout(() => {
        document.querySelector('.auth-container').style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
          document.querySelector('.auth-container').style.display = 'none';
          document.querySelector('.main-container').style.display = 'block';
          initMainUI();
        }, 500);
      }, 1000);
      
    } catch (error) {
      showAuthError(error.message);
    } finally {
      authBtn.textContent = originalText;
      authBtn.disabled = false;
    }
  }

  function showAuthError(message) {
    const input = document.getElementById('authToken');
    input.classList.add('error');
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      input.classList.remove('error');
      errorDiv.style.display = 'none';
    }, 3000);
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Инициализация главного интерфейса
  function initMainUI() {
    // Загружаем сохраненные данные
    const savedSource = localStorage.getItem('lastSourceId') || '';
    const savedTarget = localStorage.getItem('lastTargetId') || '';
    
    document.getElementById('tokenInput').value = authToken;
    document.getElementById('sourceId').value = savedSource;
    document.getElementById('targetId').value = savedTarget;
    
    // Настройка обработчиков
    document.getElementById('cloneBtn').addEventListener('click', startClone);
    document.getElementById('cancelBtn').addEventListener('click', cancelClone);
    document.getElementById('clearLogsBtn').addEventListener('click', () => clearLogs('mainLog'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Автосохранение ID
    document.getElementById('sourceId').addEventListener('change', (e) => {
      localStorage.setItem('lastSourceId', e.target.value);
    });
    document.getElementById('targetId').addEventListener('change', (e) => {
      localStorage.setItem('lastTargetId', e.target.value);
    });
    
    // Показываем приветствие
    const user = JSON.parse(sessionStorage.getItem('discord_user'));
    if (user) {
      log(`👋 Добро пожаловать, ${user.username}! Готов к клонированию.`, 'success', 'mainLog');
    }
  }

  // Выход из аккаунта
  function logout() {
    sessionStorage.clear();
    localStorage.removeItem('lastSourceId');
    localStorage.removeItem('lastTargetId');
    showNotification('Выход выполнен', 'success');
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  function clearLogs(logId) {
    const box = document.getElementById(logId);
    if (box) box.innerHTML = '';
  }

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
    if (!authToken) throw new Error('Не авторизован');
    if (cancel) throw new Error('CANCELLED');
    let signal = controller?.signal;
    for (let i = 0; i < retries; i++) {
      if (cancel) throw new Error('CANCELLED');
      try {
        let headers = { 'Authorization': authToken, 'Content-Type': 'application/json', ...opts.headers };
        let res = await fetch(url, { ...opts, headers, signal });
        if (res.status === 429) {
          let r = parseInt(res.headers.get('Retry-After')) || 2;
          await sleep(r * 1000);
          continue;
        }
        if (!res.ok && i === retries - 1) {
          const errorData = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorData.substring(0, 100)}`);
        }
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
    document.getElementById('cloneBtn').disabled = false;
    document.getElementById('cancelBtn').disabled = true;
    document.getElementById('cloneStatus').classList.remove('active');
    document.getElementById('progressBar').style.width = '0%';
  }

  function cancelClone() {
    if (cloning) {
      cancel = true;
      controller?.abort();
      log('⚠️ Отмена процесса...', 'warning', 'mainLog');
      document.getElementById('cancelBtn').disabled = true;
    }
  }

  async function startClone() {
    if (cloning) return;
    let src = document.getElementById('sourceId').value.trim();
    let tgt = document.getElementById('targetId').value.trim();
    
    if (!/^\d{17,20}$/.test(src) || !/^\d{17,20}$/.test(tgt)) {
      log('❌ Неверный ID сервера (должен содержать 17-20 цифр)', 'error', 'mainLog');
      return;
    }
    if (src === tgt) {
      log('❌ Серверы не должны быть одинаковыми', 'error', 'mainLog');
      return;
    }
    
    cloning = true;
    cancel = false;
    controller = new AbortController();
    document.getElementById('cloneBtn').disabled = true;
    document.getElementById('cancelBtn').disabled = false;
    document.getElementById('cloneStatus').classList.add('active');
    document.getElementById('progressBar').style.width = '0%';
    
    const stats = { roles: 0, channels: 0, errors: 0 };
    
    try {
      document.getElementById('statusText').textContent = '🔍 Проверка прав';
      document.getElementById('progressPercent').textContent = '0%';
      
      // Проверка прав
      let meGuilds = await (await api(`${API}/users/@me/guilds`)).json();
      let tgtGuild = meGuilds.find(g => g.id === tgt);
      if (!tgtGuild || !(BigInt(tgtGuild.permissions) & 0x8n)) {
        throw new Error('Нет прав администратора на целевом сервере');
      }
      
      let srcGuild = await (await api(`${API}/guilds/${src}`)).json();
      log(`📋 Исходный сервер: ${srcGuild.name}`, 'success', 'mainLog');
      
      // Очистка каналов
      document.getElementById('statusText').textContent = '🧹 Очистка каналов';
      let channels = await (await api(`${API}/guilds/${tgt}/channels`)).json();
      for (let i = 0; i < channels.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        try {
          await api(`${API}/channels/${channels[i].id}`, { method: 'DELETE' });
          log(`🗑️ Удалён канал: ${channels[i].name || channels[i].id}`, 'warning', 'mainLog');
        } catch (e) {
          stats.errors++;
          log(`⚠️ Ошибка удаления канала: ${e.message}`, 'error', 'mainLog');
        }
        await sleep(200);
        let pct = Math.min(10, ((i + 1) / Math.max(channels.length, 1)) * 10);
        document.getElementById('progressBar').style.width = pct + '%';
        document.getElementById('progressPercent').textContent = Math.floor(pct) + '%';
        updateStats(stats);
      }
      
      // Очистка ролей
      document.getElementById('statusText').textContent = '🧹 Очистка ролей';
      let roles = await (await api(`${API}/guilds/${tgt}/roles`)).json();
      let delRoles = roles.filter(r => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
      for (let i = 0; i < delRoles.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        try {
          await api(`${API}/guilds/${tgt}/roles/${delRoles[i].id}`, { method: 'DELETE' });
        } catch (e) {}
        await sleep(150);
      }
      
      document.getElementById('progressBar').style.width = '15%';
      document.getElementById('progressPercent').textContent = '15%';
      
      // Копирование названия
      document.getElementById('statusText').textContent = '📝 Настройка сервера';
      await api(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify({ name: srcGuild.name }) });
      log(`✅ Название скопировано: ${srcGuild.name}`, 'success', 'mainLog');
      
      // Копирование иконки
      if (srcGuild.icon) {
        try {
          let iconRes = await fetch(`https://cdn.discordapp.com/icons/${src}/${srcGuild.icon}.png?size=256`);
          if (iconRes.ok) {
            let blob = await iconRes.blob();
            if (blob.size <= 262144) {
              let base64 = await new Promise(r => {
                let reader = new FileReader();
                reader.onloadend = () => r(reader.result);
                reader.readAsDataURL(blob);
              });
              let base64Data = base64.split(',')[1];
              await api(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify({ icon: base64Data }) });
              log(`✅ Иконка скопирована`, 'success', 'mainLog');
            } else {
              log(`⚠️ Иконка больше 256 КБ`, 'warning', 'mainLog');
            }
          }
        } catch(e) {
          log(`⚠️ Ошибка копирования иконки: ${e.message}`, 'warning', 'mainLog');
        }
      }
      
      document.getElementById('progressBar').style.width = '25%';
      document.getElementById('progressPercent').textContent = '25%';
      
      // Создание ролей
      document.getElementById('statusText').textContent = '🎭 Создание ролей';
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
          stats.roles++;
          log(`✅ Роль создана: ${r.name}`, 'success', 'mainLog');
        } catch (e) {
          stats.errors++;
          log(`⚠️ Ошибка роли ${r.name}: ${e.message}`, 'error', 'mainLog');
        }
        await sleep(250);
        let pct = 25 + ((i + 1) / Math.max(rolesToCreate.length, 1)) * 30;
        document.getElementById('progressBar').style.width = pct + '%';
        document.getElementById('progressPercent').textContent = Math.floor(pct) + '%';
        updateStats(stats);
      }
      
      log(`📊 Создано ролей: ${stats.roles}`, 'info', 'mainLog');
      
      // Создание каналов
      document.getElementById('statusText').textContent = '📁 Создание каналов';
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
          stats.channels++;
          log(`✅ Категория создана: ${c.name}`, 'success', 'mainLog');
        } catch (e) {
          stats.errors++;
          log(`⚠️ Ошибка категории ${c.name}: ${e.message}`, 'error', 'mainLog');
        }
        await sleep(250);
        updateStats(stats);
      }
      
      for (let i = 0; i < others.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        let c = others[i];
        try {
          let body = buildChannelData(c, tgt, roleMap, catMap, srcGuild.id);
          await api(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
          createdCount++;
          stats.channels++;
          log(`✅ Канал создан: ${c.name}`, 'success', 'mainLog');
        } catch (e) {
          stats.errors++;
          log(`⚠️ Ошибка канала ${c.name}: ${e.message}`, 'error', 'mainLog');
        }
        await sleep(200);
        let pct = 60 + ((categories.length + i + 1) / Math.max(total, 1)) * 40;
        document.getElementById('progressBar').style.width = pct + '%';
        document.getElementById('progressPercent').textContent = Math.floor(pct) + '%';
        updateStats(stats);
      }
      
      document.getElementById('progressBar').style.width = '100%';
      document.getElementById('progressPercent').textContent = '100%';
      log(`🎉 Клонирование завершено!`, 'success', 'mainLog');
      log(`📊 Статистика: ${stats.roles} ролей, ${stats.channels} каналов`, 'info', 'mainLog');
      if (stats.errors > 0) {
        log(`⚠️ Ошибок: ${stats.errors}`, 'warning', 'mainLog');
      }
      showNotification('Клонирование успешно завершено!', 'success');
      
    } catch (e) {
      if (e.message === 'CANCELLED') {
        log('⚠️ Клонирование отменено пользователем', 'warning', 'mainLog');
        showNotification('Клонирование отменено', 'info');
      } else {
        log(`❌ Критическая ошибка: ${e.message}`, 'error', 'mainLog');
        showNotification('Ошибка при клонировании', 'error');
      }
    } finally {
      resetClone();
    }
  }

  // Запуск анимации и создание частиц
  createParticles();
  
  // Добавляем CSS анимацию fadeOut
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // Рендер UI
  document.body.innerHTML = `
    <!-- Auth Container -->
    <div class="auth-container">
      <div class="auth-card">
        <div class="logo">
          <div class="logo-icon">
            ${SVG_ICONS.discord}
          </div>
          <h1>Discord Cloner</h1>
          <p>Профессиональный инструмент для клонирования серверов</p>
        </div>
        
        <div class="input-group">
          <label>Токен бота или пользователя</label>
          <div style="position: relative;">
            <input type="password" id="authToken" placeholder="Введите ваш Discord токен">
            <span class="toggle-password" onclick="togglePasswordVisibility('authToken')">👁️</span>
          </div>
          <div id="authError" style="color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: none;"></div>
        </div>
        
        <button class="btn btn-primary" id="authBtn">
          Войти в систему
        </button>
        
        <div style="margin-top: 24px; text-align: center; font-size: 0.75rem; color: #6b6b6b;">
          <p>Разработчик: <span style="color: #8b5cf6;">xolirx</span></p>
          <p>© 2024 Все права защищены</p>
        </div>
      </div>
    </div>
    
    <!-- Main Container -->
    <div class="main-container">
      <div class="wrapper">
        <div class="left-panel">
          <div class="header">
            <h2>Discord Cloner Pro</h2>
            <div class="developer">by xolirx • Премиум инструмент</div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value" id="rolesCount">0</div>
              <div class="stat-label">Создано ролей</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="channelsCount">0</div>
              <div class="stat-label">Создано каналов</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="errorsCount">0</div>
              <div class="stat-label">Ошибок</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="statusIcon">🟢</div>
              <div class="stat-label">Статус</div>
            </div>
          </div>
          
          <input type="hidden" id="tokenInput">
          <input class="input-modern" id="sourceId" placeholder="📌 ID исходного сервера">
          <input class="input-modern" id="targetId" placeholder="🎯 ID целевого сервера">
          
          <div class="button-group">
            <button class="btn btn-primary" id="cloneBtn">🚀 Начать клонирование</button>
            <button class="btn btn-secondary" id="cancelBtn" disabled>⏸️ Отмена</button>
          </div>
          
          <div class="status-card" id="cloneStatus">
            <div class="status-header">
              <div class="spinner"></div>
              <span id="statusText">Подготовка</span>
              <span id="progressPercent" style="margin-left: auto; font-weight: 600;">0%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" id="progressBar"></div>
            </div>
          </div>
          
          <button class="btn btn-danger" id="logoutBtn" style="margin-top: 20px;">🚪 Выйти</button>
        </div>
        
        <div class="right-panel">
          <div class="log-header" style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 600;">📋 Лог операций</div>
            <button id="clearLogsBtn" style="background: none; border: none; color: #6b6b6b; cursor: pointer;">Очистить</button>
          </div>
          <div id="mainLog" class="log-box"></div>
        </div>
      </div>
    </div>
  `;

  // Добавляем функцию для показа/скрытия пароля
  window.togglePasswordVisibility = function(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
      input.type = 'text';
    } else {
      input.type = 'password';
    }
  };

  // Обработчик авторизации
  document.getElementById('authBtn').addEventListener('click', authorize);
  
  // Enter на поле ввода токена
  document.getElementById('authToken').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') authorize();
  });
  
  // Проверяем сохраненный токен
  const savedToken = sessionStorage.getItem('discord_token');
  if (savedToken) {
    document.getElementById('authToken').value = savedToken;
    // Автоматическая авторизация
    setTimeout(() => authorize(), 100);
  }
})();
