const style = document.createElement('style');
style.textContent = `
:root {
  --bg-deep: #000000;
  --bg-surface: #0a0a0a;
  --bg-elevated: #111111;
  --bg-card: rgba(8, 8, 8, 0.96);
  --border-subtle: rgba(255, 255, 255, 0.04);
  --border-medium: rgba(255, 255, 255, 0.06);
  --border-active: rgba(139, 92, 246, 0.25);
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
  --transition-slow: 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-base: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-fast: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
  background: rgba(139, 92, 246, 0.08);
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
  animation: fadeInUp 0.8s var(--transition-slow);
}

.main-container {
  display: none;
  padding: 20px;
  height: 100vh;
  animation: fadeInUp 0.8s var(--transition-slow);
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
  transition: all var(--transition-base);
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
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  border: 2px solid var(--border-medium);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  font-size: 44px;
}

.logo-icon:hover {
  transform: scale(1.05);
  border-color: var(--accent);
  box-shadow: 0 0 25px rgba(139, 92, 246, 0.2);
}

.logo h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff, #a0a0a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo p {
  color: var(--text-dim);
  font-size: 0.875rem;
  font-weight: 400;
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
  color: var(--text-gray);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 48px 14px 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  color: var(--text-white);
  font-size: 0.875rem;
  font-weight: 400;
  transition: all var(--transition-fast);
}

.input-wrapper input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
}

.input-wrapper input.error {
  border-color: var(--error);
  animation: shake 0.3s var(--transition-fast);
}

.toggle-password {
  position: absolute;
  right: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
}

.toggle-password svg {
  width: 18px;
  height: 18px;
  stroke: var(--text-dim);
  stroke-width: 1.5;
  transition: all var(--transition-fast);
}

.toggle-password:hover svg {
  stroke: var(--accent);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
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

.contact-bar {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 100;
  background: var(--bg-elevated);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  padding: 8px 16px;
  transition: all var(--transition-base);
}

.contact-bar:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.contact-link {
  color: var(--text-gray);
  text-decoration: none;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color var(--transition-fast);
}

.contact-link:hover {
  color: var(--accent);
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
  transition: all var(--transition-fast);
}

.user-info:hover {
  border-color: var(--border-active);
  transform: translateX(4px);
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
  border: 2px solid var(--accent);
  overflow: hidden;
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
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
  font-weight: 700;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-white);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.75rem;
  font-weight: 400;
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
  font-weight: 500;
  color: var(--accent);
  margin-top: 4px;
}

.header {
  margin-bottom: 28px;
  text-align: center;
}

.header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
  background: linear-gradient(135deg, #ffffff, #a0a0a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header .developer {
  color: var(--text-dim);
  font-size: 0.688rem;
  font-weight: 500;
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
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: var(--shadow-sm);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 0.688rem;
  font-weight: 500;
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
  font-size: 0.875rem;
  font-weight: 400;
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
  font-weight: 400;
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
  animation: slideInDown 0.4s var(--transition-base);
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
  transition: width 0.5s var(--transition-base);
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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
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
  padding: 8px 12px;
  margin: 6px 0;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  gap: 12px;
  align-items: center;
  animation: slideInRight 0.3s var(--transition-base);
  word-break: break-word;
  transition: all var(--transition-fast);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-item:hover {
  background: rgba(255, 255, 255, 0.04);
  transform: translateX(4px);
}

.log-time {
  color: var(--text-dim);
  font-size: 0.625rem;
  font-weight: 400;
  min-width: 55px;
  flex-shrink: 0;
}

.log-icon {
  flex-shrink: 0;
  display: inline-flex;
  width: 16px;
  height: 16px;
  align-items: center;
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
  font-weight: 400;
}

.log-header {
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.log-header button {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 0.688rem;
  font-weight: 500;
  transition: all var(--transition-fast);
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
    gap: 16px;
  }
  
  .left-panel, .right-panel {
    flex: none;
    padding: 20px;
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
  
  .contact-bar {
    top: 16px;
    right: 16px;
    padding: 6px 12px;
  }
  
  .contact-link {
    font-size: 0.688rem;
  }
  
  .logo-icon {
    width: 60px;
    height: 60px;
    font-size: 32px;
  }
  
  .logo h1 {
    font-size: 1.5rem;
  }
  
  .header h2 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    gap: 8px;
  }
  
  .stat-card {
    padding: 10px;
  }
  
  .stat-value {
    font-size: 1.125rem;
  }
  
  .button-group {
    flex-direction: column;
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
  transition: background var(--transition-fast);
}

::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

.favicon {
  display: none;
}
`;

document.head.appendChild(style);

const SVG_ICONS = {
  discord: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 9c0 3.5-2 6-6 6s-6-2.5-6-6 2-6 6-6 6 2.5 6 6z"/><path d="M12 3v3"/><path d="M12 15v6"/><path d="M8 21h8"/><circle cx="12" cy="9" r="2"/></svg>`,
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`,
  error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
};

function createParticles() {
  const particlesDiv = document.createElement('div');
  particlesDiv.className = 'particles';
  for (let i = 0; i < 30; i++) {
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

function setFavicon() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = '#8b5cf6';
  ctx.font = '48px "Segoe UI", "Inter"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐱‍👤', 32, 32);
  
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/x-icon';
  link.href = canvas.toDataURL();
  document.head.appendChild(link);
}

(async function() {
  const API = 'https://discord.com/api/v10';
  let cloning = false, cancel = false, controller = null;
  let authToken = null;
  let currentUser = null;
  let keepAliveInterval = null;

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
    if (box.children.length > 200) {
      while (box.children.length > 200) {
        box.removeChild(box.children[0]);
      }
    }
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
        userAvatarImg.onerror = () => {
          userAvatarImg.style.display = 'none';
          if (userAvatarPlaceholder) {
            userAvatarPlaceholder.style.display = 'flex';
            const firstLetter = user.username.charAt(0).toUpperCase();
            userAvatarPlaceholder.textContent = firstLetter;
          }
        };
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

  const startKeepAlive = () => {
    if (keepAliveInterval) clearInterval(keepAliveInterval);
    keepAliveInterval = setInterval(async () => {
      if (authToken) {
        try {
          await fetch(`${API}/users/@me`, {
            headers: { 'Authorization': authToken }
          });
        } catch (e) {}
      }
    }, 240000);
  };

  const stopKeepAlive = () => {
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
  };

  async function authorize() {
    const tokenInput = document.getElementById('authToken');
    if (!tokenInput) return;
    
    const token = tokenInput.value.trim();
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
      sessionStorage.setItem('lastActive', Date.now().toString());
      
      startKeepAlive();
      showNotification(`Добро пожаловать, ${user.username}`, 'success');
      
      const authContainer = document.querySelector('.auth-container');
      const mainContainer = document.querySelector('.main-container');
      
      if (authContainer && mainContainer) {
        authContainer.style.animation = 'fadeOut 0.5s var(--transition-slow) forwards';
        setTimeout(() => {
          authContainer.style.display = 'none';
          mainContainer.style.display = 'block';
          initMainUI();
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
    const bgColor = type === 'success' ? 'rgba(16, 185, 129, 0.12)' : (type === 'error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(59, 130, 246, 0.12)');
    const borderColor = type === 'success' ? 'rgba(16, 185, 129, 0.3)' : (type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)');
    const textColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#3b82f6');
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
      font-weight: 500;
      z-index: 10000;
      animation: slideInRight 0.3s var(--transition-base);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(30px)';
      notification.style.transition = 'all 0.3s var(--transition-base)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  function togglePasswordVisibility() {
    const input = document.getElementById('authToken');
    const eyeIcon = document.getElementById('eyeIcon');
    if (input.type === 'password') {
      input.type = 'text';
      if (eyeIcon) eyeIcon.innerHTML = SVG_ICONS.eyeOff;
    } else {
      input.type = 'password';
      if (eyeIcon) eyeIcon.innerHTML = SVG_ICONS.eye;
    }
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
      sourceInput.addEventListener('input', (e) => {
        localStorage.setItem('lastSourceId', e.target.value);
      });
    }
    if (targetInput) {
      targetInput.addEventListener('change', (e) => {
        localStorage.setItem('lastTargetId', e.target.value);
      });
      targetInput.addEventListener('input', (e) => {
        localStorage.setItem('lastTargetId', e.target.value);
      });
    }
    
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
    authToken = null;
    currentUser = null;
    showNotification('выход выполнен', 'success');
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  function clearLogs(logId) {
    const box = document.getElementById(logId);
    if (box) {
      while (box.firstChild) {
        box.removeChild(box.firstChild);
      }
    }
  }

  async function copyGuildIcon(srcGuildId, targetGuildId, token) {
    try {
      const srcGuildRes = await fetch(`${API}/guilds/${srcGuildId}`, {
        headers: { 'Authorization': token }
      });
      const srcGuild = await srcGuildRes.json();
      
      if (!srcGuild.icon) {
        log(`исходный сервер не имеет иконки`, 'info', 'mainLog');
        return false;
      }
      
      const iconUrl = `https://cdn.discordapp.com/icons/${srcGuildId}/${srcGuild.icon}.png?size=256`;
      const iconRes = await fetch(iconUrl);
      
      if (!iconRes.ok) {
        throw new Error('не удалось загрузить иконку');
      }
      
      const blob = await iconRes.blob();
      
      if (blob.size > 262144) {
        log(`иконка превышает 256 кб, пропуск`, 'warning', 'mainLog');
        return false;
      }
      
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      const base64Data = base64.split(',')[1];
      
      const updateRes = await fetch(`${API}/guilds/${targetGuildId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ icon: base64Data })
      });
      
      if (updateRes.ok) {
        log(`иконка сервера скопирована`, 'success', 'mainLog');
        return true;
      } else {
        throw new Error(`ошибка установки иконки: ${updateRes.status}`);
      }
    } catch (e) {
      log(`ошибка копирования иконки: ${e.message}`, 'warning', 'mainLog');
      return false;
    }
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
    cancel = false;
    controller = null;
    const cloneBtn = document.getElementById('cloneBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const cloneStatus = document.getElementById('cloneStatus');
    const progressBar = document.getElementById('progressBar');
    
    if (cloneBtn) cloneBtn.disabled = false;
    if (cancelBtn) cancelBtn.disabled = true;
    if (cloneStatus && cloneStatus.classList.contains('active')) {
      cloneStatus.classList.remove('active');
    }
    if (progressBar) progressBar.style.width = '0%';
  }

  function cancelClone() {
    if (cloning) {
      cancel = true;
      if (controller) controller.abort();
      log('процесс остановлен пользователем', 'warning', 'mainLog');
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
      log('ошибка: неверный формат id сервера', 'error', 'mainLog');
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
      
      await copyGuildIcon(src, tgt, authToken);
      
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
        log('процесс отменён пользователем', 'warning', 'mainLog');
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
  setFavicon();

  document.body.innerHTML = `
    <div class="auth-container">
      <div class="contact-bar">
        <a href="https://t.me/xolirx" target="_blank" class="contact-link">
          <span>●</span>
          <span>@xolirx</span>
        </a>
      </div>
      <div class="auth-card">
        <div class="logo">
          <div class="logo-icon">
            🐱‍👤
          </div>
          <h1>discord cloner</h1>
          <p>профессиональный инструмент для клонирования</p>
        </div>
        
        <div class="input-group">
          <label>токен авторизации</label>
          <div class="input-wrapper">
            <input type="password" id="authToken" placeholder="введите ваш discord токен">
            <button class="toggle-password" id="togglePasswordBtn" type="button">
              ${SVG_ICONS.eye}
            </button>
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
      <div class="contact-bar">
        <a href="https://t.me/xolirx" target="_blank" class="contact-link">
          <span>●</span>
          <span>@xolirx</span>
        </a>
      </div>
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
            <div class="developer">xolirx — профессиональное издание</div>
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
            <button class="btn btn-primary" id="cloneBtn">начать клонирование</button>
            <button class="btn btn-secondary" id="cancelBtn" disabled>отмена</button>
          </div>
          
          <div class="status-card" id="cloneStatus">
            <div class="status-header">
              <div class="spinner"></div>
              <span id="statusText">инициализация</span>
              <span id="progressPercent" style="margin-left: auto; font-weight: 600;">0%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" id="progressBar"></div>
            </div>
          </div>
          
          <button class="btn btn-danger" id="logoutBtn" style="margin-top: 20px;">выйти</button>
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

  const toggleBtn = document.getElementById('togglePasswordBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', togglePasswordVisibility);
  }

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
  const lastActive = sessionStorage.getItem('lastActive');
  
  if (savedToken && savedUser && lastActive) {
    const now = Date.now();
    const lastActiveTime = parseInt(lastActive);
    if (now - lastActiveTime < 86400000) {
      authToken = savedToken;
      currentUser = JSON.parse(savedUser);
      const authTokenInputField = document.getElementById('authToken');
      if (authTokenInputField) authTokenInputField.value = savedToken;
      setTimeout(() => authorize(), 100);
    } else {
      sessionStorage.clear();
    }
  }
})();
