const style = document.createElement('style');
style.textContent = `
:root {
  --bg-deep: #000000;
  --bg-surface: #0a0a0a;
  --bg-elevated: #111111;
  --bg-card: rgba(8, 8, 8, 0.96);
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-medium: rgba(255, 255, 255, 0.06);
  --border-active: rgba(139, 92, 246, 0.2);
  --accent: #8b5cf6;
  --accent-dark: #7c3aed;
  --accent-glow: rgba(139, 92, 246, 0.12);
  --text-white: #ffffff;
  --text-gray: #a0a0a0;
  --text-dim: #4a4a4a;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.7);
  --shadow-glow: 0 0 30px rgba(139, 92, 246, 0.05);
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-deep);
  color: var(--text-white);
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 40%, rgba(139, 92, 246, 0.02) 0%, transparent 60%),
              radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.01) 0%, transparent 60%);
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
  background: rgba(139, 92, 246, 0.1);
  border-radius: 2px;
  animation: floatParticle 25s infinite linear;
}

@keyframes floatParticle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  15% {
    opacity: 0.3;
  }
  85% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
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
  animation: fadeInUp 0.8s var(--transition-base);
}

.main-container {
  display: none;
  padding: 20px;
  height: 100vh;
  animation: fadeInUp 0.8s var(--transition-base);
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

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.96);
  }
}

.auth-card {
  background: var(--bg-card);
  backdrop-filter: blur(24px);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-medium);
  padding: 48px;
  max-width: 480px;
  width: 100%;
  box-shadow: var(--shadow-xl), var(--shadow-glow);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.auth-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 92, 246, 0.08);
  border-color: var(--border-active);
}

.logo {
  text-align: center;
  margin-bottom: 40px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  border: 1px solid var(--border-medium);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: var(--shadow-lg);
  animation: logoPulse 2s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.15);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
  }
}

.logo-icon svg {
  width: 36px;
  height: 36px;
  color: var(--text-white);
}

.logo h1 {
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
  color: var(--text-white);
}

.logo p {
  color: var(--text-dim);
  font-size: 0.813rem;
}

.input-group {
  margin-bottom: 24px;
  position: relative;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.813rem;
  font-weight: 500;
  color: var(--text-gray);
}

.input-group input {
  width: 100%;
  padding: 14px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-white);
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.input-group input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.input-group input.error {
  border-color: var(--error);
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}

.toggle-password {
  position: absolute;
  right: 14px;
  bottom: 14px;
  cursor: pointer;
  color: var(--text-dim);
  font-size: 1rem;
  transition: color var(--transition-fast);
}

.toggle-password:hover {
  color: var(--text-gray);
}

.btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #1a1a1a, #0f0f0f);
  color: var(--text-white);
  border: 1px solid var(--border-medium);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md), 0 0 20px var(--accent-glow);
  border-color: var(--accent);
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
  background: rgba(139, 92, 246, 0.15);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.btn-primary:active::before {
  width: 200px;
  height: 200px;
}

.wrapper {
  display: flex;
  gap: 20px;
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
  transition: all var(--transition-base);
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
}

.left-panel {
  flex: 1.2;
}

.right-panel {
  flex: 0.8;
}

.left-panel:hover, .right-panel:hover {
  border-color: var(--border-active);
  box-shadow: var(--shadow-xl), var(--shadow-glow);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  margin-bottom: 24px;
  border: 1px solid var(--border-subtle);
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  border: 2px solid var(--accent);
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
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-white);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  color: var(--text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-badge {
  display: inline-block;
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 0.625rem;
  color: var(--accent);
  margin-top: 4px;
}

.header {
  margin-bottom: 28px;
  text-align: center;
}

.header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
  color: var(--text-white);
}

.header .developer {
  color: var(--text-dim);
  font-size: 0.688rem;
  letter-spacing: 1px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 14px;
  text-align: center;
  border: 1px solid var(--border-subtle);
  transition: all var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent);
  box-shadow: var(--shadow-sm);
}

.stat-value {
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--accent);
}

.stat-label {
  font-size: 0.688rem;
  color: var(--text-dim);
  margin-top: 4px;
}

.input-modern {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-white);
  font-size: 0.813rem;
  margin-bottom: 14px;
  transition: all var(--transition-fast);
}

.input-modern:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.input-modern::placeholder {
  color: var(--text-dim);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-secondary {
  background: var(--bg-elevated);
  color: var(--text-white);
  border: 1px solid var(--border-medium);
}

.btn-secondary:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.btn-danger {
  background: rgba(239, 68, 68, 0.08);
  color: var(--error);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.12);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.status-card {
  background: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 18px;
  margin: 20px 0;
  display: none;
  border: 1px solid var(--border-subtle);
}

.status-card.active {
  display: block;
  animation: slideInDown 0.4s ease;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border-medium);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-bar {
  height: 4px;
  background: var(--bg-surface);
  border-radius: 2px;
  overflow: hidden;
  margin: 14px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-dark));
  border-radius: 2px;
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
  animation: shimmer 1.8s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.log-box {
  background: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: 14px;
  height: calc(100% - 70px);
  overflow-y: auto;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.688rem;
  border: 1px solid var(--border-subtle);
}

.log-item {
  padding: 8px 10px;
  margin: 4px 0;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  gap: 10px;
  align-items: center;
  animation: slideInRight 0.25s ease;
  word-break: break-word;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-item:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: translateX(2px);
}

.log-time {
  color: var(--text-dim);
  font-size: 0.625rem;
  min-width: 55px;
  flex-shrink: 0;
}

.log-icon {
  flex-shrink: 0;
  display: inline-flex;
  width: 16px;
  height: 16px;
}

.log-icon svg {
  width: 14px;
  height: 14px;
}

.log-success .log-icon svg { color: var(--success); }
.log-error .log-icon svg { color: var(--error); }
.log-warning .log-icon svg { color: var(--warning); }
.log-info .log-icon svg { color: var(--info); }

.log-item span:last-child {
  flex: 1;
}

.log-header {
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.log-header button {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 0.688rem;
  transition: color var(--transition-fast);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
}

.log-header button:hover {
  color: var(--text-gray);
  background: rgba(255, 255, 255, 0.03);
}

@media (max-width: 768px) {
  body {
    overflow-y: auto;
  }
  
  .wrapper {
    flex-direction: column;
    height: auto;
  }
  
  .left-panel, .right-panel {
    flex: none;
  }
  
  .right-panel {
    height: 380px;
  }
  
  .auth-card {
    padding: 32px;
    margin: 16px;
  }
  
  .user-info {
    padding: 12px;
  }
  
  .user-avatar {
    width: 44px;
    height: 44px;
  }
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: var(--bg-surface);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

.loading-skeleton {
  background: linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;

document.head.appendChild(style);

const SVG_ICONS = {
  discord: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9c0 3.5-2 6-6 6s-6-2.5-6-6 2-6 6-6 6 2.5 6 6z"/><path d="M12 3v3"/><path d="M12 15v6"/><path d="M8 21h8"/><circle cx="12" cy="9" r="2"/></svg>`,
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`,
  error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
};

function createParticles() {
  const particlesDiv = document.createElement('div');
  particlesDiv.className = 'particles';
  for (let i = 0; i < 35; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 2 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 20}s`;
    particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
    particlesDiv.appendChild(particle);
  }
  document.body.appendChild(particlesDiv);
}

(async function() {
  const API = 'https://discord.com/api/v10';
  let cloning = false, cancel = false, controller = null;
  let authToken = null;
  let currentUser = null;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  
  const log = (msg, type = 'info', targetLog = 'mainLog') => {
    const box = document.getElementById(targetLog);
    if (!box) return;
    const time = new Date().toLocaleTimeString('ru-RU');
    const div = document.createElement('div');
    div.className = `log-item log-${type}`;
    div.innerHTML = `
      <span class="log-time">${time}</span>
      <span class="log-icon">${SVG_ICONS[type] || SVG_ICONS.info}</span>
      <span>${msg}</span>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    if (box.children.length > 200) box.removeChild(box.children[0]);
  };

  const updateStats = (stats) => {
    const rolesElem = document.getElementById('rolesCount');
    const channelsElem = document.getElementById('channelsCount');
    const errorsElem = document.getElementById('errorsCount');
    if (rolesElem) rolesElem.textContent = stats.roles || 0;
    if (channelsElem) channelsElem.textContent = stats.channels || 0;
    if (errorsElem) errorsElem.textContent = stats.errors || 0;
  };

  const updateUserInfo = (user) => {
    const userNameElem = document.getElementById('userName');
    const userEmailElem = document.getElementById('userEmail');
    const userAvatarImg = document.getElementById('userAvatarImg');
    const userAvatarPlaceholder = document.getElementById('userAvatarPlaceholder');
    
    if (userNameElem) userNameElem.textContent = user.username;
    if (userEmailElem) userEmailElem.textContent = user.email || 'email не указан';
    
    if (user.avatar) {
      const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
      if (userAvatarImg) {
        userAvatarImg.src = avatarUrl;
        userAvatarImg.style.display = 'block';
      }
      if (userAvatarPlaceholder) userAvatarPlaceholder.style.display = 'none';
    } else {
      if (userAvatarImg) userAvatarImg.style.display = 'none';
      if (userAvatarPlaceholder) {
        userAvatarPlaceholder.style.display = 'flex';
        const firstLetter = user.username.charAt(0).toUpperCase();
        userAvatarPlaceholder.textContent = firstLetter;
      }
    }
  };

  async function authorize() {
    const token = document.getElementById('authToken').value.trim();
    if (!token) {
      showAuthError('Введите токен');
      return;
    }

    const authBtn = document.getElementById('authBtn');
    const originalText = authBtn.textContent;
    authBtn.textContent = 'проверка...';
    authBtn.disabled = true;

    try {
      const response = await fetch(`${API}/users/@me`, {
        headers: { 'Authorization': token }
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Неверный токен');
        throw new Error(`Ошибка ${response.status}`);
      }
      
      const user = await response.json();
      authToken = token;
      currentUser = user;
      
      sessionStorage.setItem('discord_token', token);
      sessionStorage.setItem('discord_user', JSON.stringify(user));
      
      showNotification(`Добро пожаловать, ${user.username}`, 'success');
      
      const authContainer = document.querySelector('.auth-container');
      const mainContainer = document.querySelector('.main-container');
      
      if (authContainer) {
        authContainer.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => {
          authContainer.style.display = 'none';
          if (mainContainer) {
            mainContainer.style.display = 'block';
            initMainUI();
          }
        }, 500);
      }
      
    } catch (error) {
      showAuthError(error.message);
    } finally {
      authBtn.textContent = originalText;
      authBtn.disabled = false;
    }
  }

  function showAuthError(message) {
    const input = document.getElementById('authToken');
    if (input) input.classList.add('error');
    const errorDiv = document.getElementById('authError');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
    setTimeout(() => {
      if (input) input.classList.remove('error');
      if (errorDiv) errorDiv.style.display = 'none';
    }, 3000);
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';
    const borderColor = type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)';
    const textColor = type === 'success' ? '#10b981' : '#ef4444';
    notification.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: ${bgColor};
      backdrop-filter: blur(12px);
      border: 1px solid ${borderColor};
      color: ${textColor};
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.813rem;
      z-index: 10000;
      animation: slideInRight 0.3s ease;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  function initMainUI() {
    const savedSource = localStorage.getItem('lastSourceId') || '';
    const savedTarget = localStorage.getItem('lastTargetId') || '';
    
    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput) tokenInput.value = authToken;
    
    const sourceInput = document.getElementById('sourceId');
    const targetInput = document.getElementById('targetId');
    if (sourceInput) sourceInput.value = savedSource;
    if (targetInput) targetInput.value = savedTarget;
    
    const cloneBtn = document.getElementById('cloneBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (cloneBtn) cloneBtn.addEventListener('click', startClone);
    if (cancelBtn) cancelBtn.addEventListener('click', cancelClone);
    if (clearLogsBtn) clearLogsBtn.addEventListener('click', () => clearLogs('mainLog'));
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    if (sourceInput) {
      sourceInput.addEventListener('change', (e) => {
        localStorage.setItem('lastSourceId', e.target.value);
      });
    }
    if (targetInput) {
      targetInput.addEventListener('change', (e) => {
        localStorage.setItem('lastTargetId', e.target.value);
      });
    }
    
    if (currentUser) {
      updateUserInfo(currentUser);
      log(`авторизация выполнена: ${currentUser.username}`, 'success', 'mainLog');
    }
  }

  function logout() {
    sessionStorage.clear();
    localStorage.removeItem('lastSourceId');
    localStorage.removeItem('lastTargetId');
    authToken = null;
    currentUser = null;
    showNotification('выход выполнен', 'success');
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  function clearLogs(logId) {
    const box = document.getElementById(logId);
    if (box) box.innerHTML = '';
  }

  function buildChannelData(ch, targetId, roleMap, catMap, srcGuildId) {
    const data = {
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
          const retryAfter = parseInt(res.headers.get('Retry-After')) || 2;
          await sleep(retryAfter * 1000);
          continue;
        }
        
        if (!res.ok && i === retries - 1) {
          const errorData = await res.text().catch(() => 'unknown error');
          throw new Error(`HTTP ${res.status}: ${errorData.substring(0, 100)}`);
        }
        
        if (!res.ok) {
          await sleep(1000 * (i + 1));
          continue;
        }
        
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
    const cloneBtn = document.getElementById('cloneBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const cloneStatus = document.getElementById('cloneStatus');
    const progressBar = document.getElementById('progressBar');
    
    if (cloneBtn) cloneBtn.disabled = false;
    if (cancelBtn) cancelBtn.disabled = true;
    if (cloneStatus) cloneStatus.classList.remove('active');
    if (progressBar) progressBar.style.width = '0%';
  }

  function cancelClone() {
    if (cloning) {
      cancel = true;
      if (controller) controller.abort();
      log('процесс остановлен', 'warning', 'mainLog');
      const cancelBtn = document.getElementById('cancelBtn');
      if (cancelBtn) cancelBtn.disabled = true;
    }
  }

  async function startClone() {
    if (cloning) return;
    
    const sourceInput = document.getElementById('sourceId');
    const targetInput = document.getElementById('targetId');
    
    if (!sourceInput || !targetInput) return;
    
    const src = sourceInput.value.trim();
    const tgt = targetInput.value.trim();
    
    if (!/^\d{17,20}$/.test(src) || !/^\d{17,20}$/.test(tgt)) {
      log('ошибка: неверный формат ID сервера', 'error', 'mainLog');
      return;
    }
    if (src === tgt) {
      log('ошибка: исходный и целевой серверы совпадают', 'error', 'mainLog');
      return;
    }
    
    cloning = true;
    cancel = false;
    controller = new AbortController();
    
    const cloneBtn = document.getElementById('cloneBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const cloneStatus = document.getElementById('cloneStatus');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const statusText = document.getElementById('statusText');
    
    if (cloneBtn) cloneBtn.disabled = true;
    if (cancelBtn) cancelBtn.disabled = false;
    if (cloneStatus) cloneStatus.classList.add('active');
    if (progressBar) progressBar.style.width = '0%';
    
    const stats = { roles: 0, channels: 0, errors: 0 };
    
    try {
      if (statusText) statusText.textContent = 'проверка прав';
      if (progressPercent) progressPercent.textContent = '0%';
      
      const meGuildsRes = await apiRequest(`${API}/users/@me/guilds`);
      const meGuilds = await meGuildsRes.json();
      const tgtGuild = meGuilds.find(g => g.id === tgt);
      
      if (!tgtGuild || !(BigInt(tgtGuild.permissions) & 0x8n)) {
        throw new Error('требуются права администратора на целевом сервере');
      }
      
      const srcGuildRes = await apiRequest(`${API}/guilds/${src}`);
      const srcGuild = await srcGuildRes.json();
      log(`исходный сервер: ${srcGuild.name}`, 'success', 'mainLog');
      
      if (statusText) statusText.textContent = 'очистка каналов';
      const channelsRes = await apiRequest(`${API}/guilds/${tgt}/channels`);
      let channels = await channelsRes.json();
      
      for (let i = 0; i < channels.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        try {
          await apiRequest(`${API}/channels/${channels[i].id}`, { method: 'DELETE' });
          log(`удалён канал: ${channels[i].name || channels[i].id}`, 'warning', 'mainLog');
        } catch (e) {
          stats.errors++;
          log(`ошибка удаления: ${e.message}`, 'error', 'mainLog');
        }
        await sleep(200);
        const pct = Math.min(10, ((i + 1) / Math.max(channels.length, 1)) * 10);
        if (progressBar) progressBar.style.width = pct + '%';
        if (progressPercent) progressPercent.textContent = Math.floor(pct) + '%';
        updateStats(stats);
      }
      
      if (statusText) statusText.textContent = 'очистка ролей';
      const rolesRes = await apiRequest(`${API}/guilds/${tgt}/roles`);
      let roles = await rolesRes.json();
      const delRoles = roles.filter(r => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
      
      for (let i = 0; i < delRoles.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        try {
          await apiRequest(`${API}/guilds/${tgt}/roles/${delRoles[i].id}`, { method: 'DELETE' });
        } catch (e) {}
        await sleep(150);
      }
      
      if (progressBar) progressBar.style.width = '15%';
      if (progressPercent) progressPercent.textContent = '15%';
      
      if (statusText) statusText.textContent = 'настройка сервера';
      await apiRequest(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify({ name: srcGuild.name }) });
      log(`название скопировано: ${srcGuild.name}`, 'success', 'mainLog');
      
      if (srcGuild.icon) {
        try {
          const iconRes = await fetch(`https://cdn.discordapp.com/icons/${src}/${srcGuild.icon}.png?size=256`);
          if (iconRes.ok) {
            const blob = await iconRes.blob();
            if (blob.size <= 262144) {
              const base64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
              const base64Data = base64.split(',')[1];
              await apiRequest(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify({ icon: base64Data }) });
              log(`иконка скопирована`, 'success', 'mainLog');
            } else {
              log(`иконка превышает 256 кб`, 'warning', 'mainLog');
            }
          }
        } catch(e) {
          log(`ошибка копирования иконки: ${e.message}`, 'warning', 'mainLog');
        }
      }
      
      if (progressBar) progressBar.style.width = '25%';
      if (progressPercent) progressPercent.textContent = '25%';
      
      if (statusText) statusText.textContent = 'создание ролей';
      const srcRolesRes = await apiRequest(`${API}/guilds/${src}/roles`);
      const srcRoles = await srcRolesRes.json();
      const rolesToCreate = srcRoles.filter(r => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
      const roleMap = {};
      
      for (let i = 0; i < rolesToCreate.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        const r = rolesToCreate[i];
        try {
          const body = JSON.stringify({
            name: r.name.substring(0, 100),
            color: r.color || 0,
            hoist: !!r.hoist,
            mentionable: !!r.mentionable,
            permissions: String(r.permissions || 0)
          });
          const resp = await apiRequest(`${API}/guilds/${tgt}/roles`, { method: 'POST', body });
          const newRole = await resp.json();
          roleMap[r.id] = newRole.id;
          stats.roles++;
          log(`роль создана: ${r.name}`, 'success', 'mainLog');
        } catch (e) {
          stats.errors++;
          log(`ошибка роли ${r.name}: ${e.message}`, 'error', 'mainLog');
        }
        await sleep(250);
        const pct = 25 + ((i + 1) / Math.max(rolesToCreate.length, 1)) * 30;
        if (progressBar) progressBar.style.width = pct + '%';
        if (progressPercent) progressPercent.textContent = Math.floor(pct) + '%';
        updateStats(stats);
      }
      
      log(`создано ролей: ${stats.roles}`, 'info', 'mainLog');
      
      if (statusText) statusText.textContent = 'создание каналов';
      const srcChannelsRes = await apiRequest(`${API}/guilds/${src}/channels`);
      const srcChannels = await srcChannelsRes.json();
      const categories = srcChannels.filter(c => c.type === 4).sort((a, b) => a.position - b.position);
      const others = srcChannels.filter(c => c.type !== 4).sort((a, b) => a.position - b.position);
      const catMap = {};
      let createdCount = 0;
      const total = categories.length + others.length;
      
      for (let i = 0; i < categories.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        const c = categories[i];
        try {
          const body = buildChannelData(c, tgt, roleMap, catMap, srcGuild.id);
          const resp = await apiRequest(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
          const ch = await resp.json();
          catMap[c.id] = ch.id;
          createdCount++;
          stats.channels++;
          log(`категория создана: ${c.name}`, 'success', 'mainLog');
        } catch (e) {
          stats.errors++;
          log(`ошибка категории ${c.name}: ${e.message}`, 'error', 'mainLog');
        }
        await sleep(250);
        updateStats(stats);
      }
      
      for (let i = 0; i < others.length; i++) {
        if (cancel) throw new Error('CANCELLED');
        const c = others[i];
        try {
          const body = buildChannelData(c, tgt, roleMap, catMap, srcGuild.id);
          await apiRequest(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
          createdCount++;
          stats.channels++;
          log(`канал создан: ${c.name}`, 'success', 'mainLog');
        } catch (e) {
          stats.errors++;
          log(`ошибка канала ${c.name}: ${e.message}`, 'error', 'mainLog');
        }
        await sleep(200);
        const pct = 60 + ((categories.length + i + 1) / Math.max(total, 1)) * 40;
        if (progressBar) progressBar.style.width = pct + '%';
        if (progressPercent) progressPercent.textContent = Math.floor(pct) + '%';
        updateStats(stats);
      }
      
      if (progressBar) progressBar.style.width = '100%';
      if (progressPercent) progressPercent.textContent = '100%';
      log(`клонирование завершено успешно`, 'success', 'mainLog');
      log(`статистика: ${stats.roles} ролей, ${stats.channels} каналов`, 'info', 'mainLog');
      if (stats.errors > 0) {
        log(`ошибок: ${stats.errors}`, 'warning', 'mainLog');
      }
      showNotification('клонирование завершено', 'success');
      
    } catch (e) {
      if (e.message === 'CANCELLED') {
        log('процесс отменён', 'warning', 'mainLog');
        showNotification('клонирование отменено', 'info');
      } else {
        log(`критическая ошибка: ${e.message}`, 'error', 'mainLog');
        showNotification('ошибка при клонировании', 'error');
      }
    } finally {
      resetClone();
    }
  }

  createParticles();

  document.body.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <div class="logo">
          <div class="logo-icon">
            ${SVG_ICONS.discord}
          </div>
          <h1>discord cloner</h1>
          <p>профессиональный инструмент для клонирования</p>
        </div>
        
        <div class="input-group">
          <label>токен авторизации</label>
          <div style="position: relative;">
            <input type="password" id="authToken" placeholder="введите ваш discord токен">
            <span class="toggle-password" onclick="window.togglePasswordVisibility('authToken')">◉</span>
          </div>
          <div id="authError" style="color: #ef4444; font-size: 0.688rem; margin-top: 4px; display: none;"></div>
        </div>
        
        <button class="btn btn-primary" id="authBtn">
          авторизоваться
        </button>
        
        <div style="margin-top: 24px; text-align: center; font-size: 0.688rem; color: #4a4a4a;">
          <p>разработчик: xolirx</p>
          <p>версия 2.0.0</p>
        </div>
      </div>
    </div>
    
    <div class="main-container">
      <div class="wrapper">
        <div class="left-panel">
          <div class="user-info" id="userInfo">
            <div class="user-avatar">
              <img id="userAvatarImg" style="display: none;" alt="avatar">
              <div id="userAvatarPlaceholder" class="user-avatar-placeholder" style="display: flex;"></div>
            </div>
            <div class="user-details">
              <div class="user-name" id="userName">загрузка...</div>
              <div class="user-email" id="userEmail">загрузка...</div>
              <div class="user-badge">авторизован</div>
            </div>
          </div>
          
          <div class="header">
            <h2>discord cloner pro</h2>
            <div class="developer">xolirx • профессиональное издание</div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value" id="rolesCount">0</div>
              <div class="stat-label">создано ролей</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="channelsCount">0</div>
              <div class="stat-label">создано каналов</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="errorsCount">0</div>
              <div class="stat-label">ошибок</div>
            </div>
            <div class="stat-card">
              <div class="stat-value" id="statusIcon">●</div>
              <div class="stat-label">статус системы</div>
            </div>
          </div>
          
          <input type="hidden" id="tokenInput">
          <input class="input-modern" id="sourceId" placeholder="id исходного сервера">
          <input class="input-modern" id="targetId" placeholder="id целевого сервера">
          
          <div class="button-group">
            <button class="btn btn-primary" id="cloneBtn">▶ начать клонирование</button>
            <button class="btn btn-secondary" id="cancelBtn" disabled>■ отмена</button>
          </div>
          
          <div class="status-card" id="cloneStatus">
            <div class="status-header">
              <div class="spinner"></div>
              <span id="statusText">инициализация</span>
              <span id="progressPercent" style="margin-left: auto; font-weight: 500;">0%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" id="progressBar"></div>
            </div>
          </div>
          
          <button class="btn btn-danger" id="logoutBtn" style="margin-top: 20px;">✖ выйти</button>
        </div>
        
        <div class="right-panel">
          <div class="log-header">
            <span>журнал событий</span>
            <button id="clearLogsBtn">очистить</button>
          </div>
          <div id="mainLog" class="log-box"></div>
        </div>
      </div>
    </div>
  `;

  window.togglePasswordVisibility = function(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  };

  const authBtn = document.getElementById('authBtn');
  const authTokenInput = document.getElementById('authToken');
  
  if (authBtn) authBtn.addEventListener('click', authorize);
  if (authTokenInput) {
    authTokenInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') authorize();
    });
  }
  
  const savedToken = sessionStorage.getItem('discord_token');
  const savedUser = sessionStorage.getItem('discord_user');
  
  if (savedToken && savedUser) {
    authToken = savedToken;
    currentUser = JSON.parse(savedUser);
    document.getElementById('authToken').value = savedToken;
    setTimeout(() => authorize(), 100);
  }
})();
