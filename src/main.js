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
            --accent: #ffffff;
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
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        .particles {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
        }
        .particle {
            position: absolute;
            background: rgba(255,255,255,0.02);
            border-radius: 50%;
            animation: drift 30s infinite linear;
        }
        @keyframes drift {
            0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
            10% { opacity: 0.2; }
            90% { opacity: 0.2; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
        .app {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 1200px;
            padding: 20px;
        }
        .auth-screen, .main-screen {
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .auth-screen {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .auth-card {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6);
            transform: translateY(0);
            transition: transform var(--transition), border-color var(--transition);
        }
        .auth-card:hover {
            border-color: var(--border-hover);
            transform: translateY(-2px);
        }
        .auth-icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: var(--surface);
            border: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            font-size: 32px;
            transition: all var(--transition);
        }
        .auth-icon:hover {
            border-color: var(--text-secondary);
            transform: scale(1.05);
        }
        .auth-title {
            text-align: center;
            font-size: 1.6rem;
            font-weight: 600;
            margin-bottom: 8px;
            letter-spacing: -0.3px;
        }
        .auth-subtitle {
            text-align: center;
            color: var(--text-dim);
            font-size: 0.8rem;
            margin-bottom: 32px;
        }
        .field {
            margin-bottom: 20px;
        }
        .field label {
            display: block;
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-bottom: 8px;
            font-weight: 500;
        }
        .input-row {
            position: relative;
        }
        .input-row input {
            width: 100%;
            padding: 14px 44px 14px 16px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            color: var(--text);
            font-size: 0.9rem;
            transition: all var(--transition);
        }
        .input-row input:focus {
            outline: none;
            border-color: var(--text-secondary);
            box-shadow: 0 0 0 2px rgba(255,255,255,0.04);
        }
        .input-row input.error {
            border-color: var(--error);
            animation: shake 0.4s ease;
        }
        @keyframes shake {
            0%,100% { transform: translateX(0); }
            20% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
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
            display: flex;
            padding: 4px;
            transition: color var(--transition);
        }
        .toggle-pass:hover { color: var(--text); }
        .btn {
            width: 100%;
            padding: 14px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            color: var(--text);
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all var(--transition);
            position: relative;
            overflow: hidden;
        }
        .btn::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(255,255,255,0.03);
            opacity: 0;
            transition: opacity var(--transition);
        }
        .btn:hover { border-color: var(--border-hover); transform: translateY(-1px); }
        .btn:active::after { opacity: 1; }
        .btn.danger { color: var(--error); border-color: rgba(255,68,68,0.3); }
        .btn.danger:hover { border-color: var(--error); background: rgba(255,68,68,0.05); }
        .btn:disabled { opacity: 0.5; pointer-events: none; }
        .contact {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 20;
            font-size: 0.75rem;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 20px;
            padding: 6px 16px;
            transition: all var(--transition);
            color: var(--text-secondary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .contact:hover {
            border-color: var(--text-secondary);
            color: var(--text);
            transform: translateY(-1px);
        }
        .main-screen {
            display: none;
            flex-direction: column;
            gap: 20px;
            min-height: 100vh;
        }
        .main-grid {
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 20px;
            flex: 1;
            height: calc(100vh - 40px);
        }
        .panel {
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 24px;
            overflow-y: auto;
            transition: border-color var(--transition);
        }
        .panel:hover { border-color: var(--border-hover); }
        .user-row {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 12px;
            background: var(--surface);
            border-radius: var(--radius);
            margin-bottom: 24px;
            border: 1px solid var(--border);
            transition: all var(--transition);
        }
        .user-row:hover { border-color: var(--border-hover); transform: translateX(4px); }
        .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--border);
            overflow: hidden;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
        }
        .avatar img { width: 100%; height: 100%; object-fit: cover; display: none; }
        .user-meta .name { font-weight: 600; font-size: 0.95rem; }
        .user-meta .email { font-size: 0.7rem; color: var(--text-dim); }
        .badge {
            display: inline-block;
            padding: 2px 8px;
            background: rgba(255,255,255,0.05);
            border-radius: 20px;
            font-size: 0.6rem;
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
        .stat .value {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--text);
        }
        .stat .label {
            font-size: 0.6rem;
            color: var(--text-dim);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 4px;
        }
        .input {
            width: 100%;
            padding: 10px 14px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            color: var(--text);
            font-size: 0.85rem;
            margin-bottom: 12px;
            transition: all var(--transition);
        }
        .input:focus { outline: none; border-color: var(--text-secondary); }
        .btn-row {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .status-bar {
            background: var(--surface);
            border-radius: var(--radius);
            padding: 12px 16px;
            margin-top: 16px;
            display: none;
            align-items: center;
            gap: 12px;
            border: 1px solid var(--border);
        }
        .status-bar.active { display: flex; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid var(--border);
            border-top-color: var(--text);
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .progress-track {
            height: 4px;
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
        .log-panel {
            display: flex;
            flex-direction: column;
        }
        .log-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        .log-header button {
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-dim);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.7rem;
            cursor: pointer;
            transition: all var(--transition);
        }
        .log-header button:hover {
            border-color: var(--text-secondary);
            color: var(--text);
        }
        .log-box {
            flex: 1;
            background: var(--surface);
            border-radius: var(--radius);
            padding: 12px;
            overflow-y: auto;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.65rem;
            line-height: 1.5;
        }
        .log-item {
            padding: 6px 10px;
            margin: 4px 0;
            border-radius: 6px;
            background: rgba(255,255,255,0.02);
            display: flex;
            gap: 10px;
            animation: slideLog 0.2s ease;
        }
        @keyframes slideLog {
            from { opacity: 0; transform: translateX(-6px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .log-item:hover { background: rgba(255,255,255,0.04); }
        .log-time { color: var(--text-dim); min-width: 55px; }
        .log-icon svg { width: 12px; height: 12px; }
        .log-success .log-icon svg { color: var(--success); }
        .log-error .log-icon svg { color: var(--error); }
        .log-warning .log-icon svg { color: var(--warning); }
        .log-info .log-icon svg { color: var(--info); }
        @media (max-width: 768px) {
            .main-grid { grid-template-columns: 1fr; height: auto; }
            .auth-card { padding: 30px; }
            .contact { font-size: 0.7rem; padding: 4px 12px; }
        }
    `;
    document.head.appendChild(style);

    const SVG = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>`,
        error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
        eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    };

    function initParticles() {
        const container = document.createElement('div');
        container.className = 'particles';
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 3 + 1;
            p.style.width = p.style.height = `${size}px`;
            p.style.left = `${Math.random() * 100}%`;
            p.style.animationDelay = `${Math.random() * 30}s`;
            p.style.animationDuration = `${Math.random() * 20 + 15}s`;
            container.appendChild(p);
        }
        document.body.appendChild(container);
    }

    function setFavicon() {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#fff';
        ctx.font = '20px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐱', 16, 16);
        const link = document.querySelector('link[rel*="icon"]') || document.createElement('link');
        link.rel = 'icon';
        link.href = canvas.toDataURL();
        document.head.appendChild(link);
    }

    const API = 'https://discord.com/api/v10';
    let authToken = null, currentUser = null;
    let cloning = false, cancelFlag = false, controller = null;
    let keepAliveInterval = null;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function log(msg, type = 'info', targetId = 'mainLog') {
        const box = document.getElementById(targetId);
        if (!box) return;
        const time = new Date().toLocaleTimeString('ru-RU');
        const div = document.createElement('div');
        div.className = `log-item log-${type}`;
        div.innerHTML = `<span class="log-time">${time}</span><span class="log-icon">${SVG[type] || SVG.info}</span><span>${msg}</span>`;
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
        while (box.children.length > 300) box.firstChild.remove();
    }

    function updateStats(st) {
        document.getElementById('rolesCount').textContent = st.roles || 0;
        document.getElementById('channelsCount').textContent = st.channels || 0;
        document.getElementById('errorsCount').textContent = st.errors || 0;
    }

    function renderUser(user) {
        document.getElementById('userName').textContent = user.username;
        document.getElementById('userEmail').textContent = user.email || 'email не указан';
        const img = document.getElementById('userAvatarImg');
        const placeholder = document.getElementById('userAvatarPlaceholder');
        if (user.avatar) {
            const url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
            img.src = url;
            img.style.display = 'block';
            placeholder.style.display = 'none';
            img.onerror = () => {
                img.style.display = 'none';
                placeholder.style.display = 'flex';
                placeholder.textContent = user.username.charAt(0).toUpperCase();
            };
        } else {
            img.style.display = 'none';
            placeholder.style.display = 'flex';
            placeholder.textContent = user.username.charAt(0).toUpperCase();
        }
    }

    function startKeepAlive() {
        stopKeepAlive();
        keepAliveInterval = setInterval(() => {
            if (authToken && document.visibilityState === 'visible') {
                fetch(`${API}/users/@me`, { headers: { 'Authorization': authToken } }).catch(() => {});
            }
        }, 240000);
    }

    function stopKeepAlive() {
        if (keepAliveInterval) {
            clearInterval(keepAliveInterval);
            keepAliveInterval = null;
        }
    }

    function notify(msg, type = 'info') {
        const colors = { success: '#0f0', error: '#f44', info: '#0af' };
        const bg = `rgba(${type==='success'?'16,185,129':type==='error'?'239,68,68':'59,130,246'},0.1)`;
        const notif = document.createElement('div');
        Object.assign(notif.style, {
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: '1000',
            background: bg,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${colors[type]}40`,
            color: colors[type],
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: '500',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            opacity: '0',
            transform: 'translateX(20px)',
            transition: 'opacity 0.25s, transform 0.25s'
        });
        notif.textContent = msg;
        document.body.appendChild(notif);
        requestAnimationFrame(() => {
            notif.style.opacity = '1';
            notif.style.transform = 'translateX(0)';
        });
        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transform = 'translateX(20px)';
            setTimeout(() => notif.remove(), 250);
        }, 3000);
    }

    async function apiRequest(url, opts = {}, retries = 3) {
        if (!authToken) throw new Error('not authorized');
        if (cancelFlag) throw new Error('CANCELLED');
        const signal = controller?.signal;
        for (let i = 0; i < retries; i++) {
            if (cancelFlag) throw new Error('CANCELLED');
            try {
                const headers = { 'Authorization': authToken, 'Content-Type': 'application/json', ...opts.headers };
                const res = await fetch(url, { ...opts, headers, signal });
                if (res.status === 429) {
                    const retryAfter = parseInt(res.headers.get('Retry-After')) || 2;
                    await sleep(retryAfter * 1000);
                    continue;
                }
                if (!res.ok && i === retries - 1) {
                    let text = await res.text().catch(() => '');
                    if (text.length > 200) text = text.slice(0, 200) + '...';
                    throw new Error(`HTTP ${res.status}: ${text}`);
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

    function sanitizeOverwrites(overwrites, targetId, roleMap, srcGuildId) {
        if (!Array.isArray(overwrites)) return [];
        return overwrites.map(o => {
            if (!o || !o.id) return null;
            if (o.type === 0) {
                if (o.id === srcGuildId) return { id: targetId, type: 0, allow: String(o.allow || 0), deny: String(o.deny || 0) };
                if (roleMap[o.id]) return { id: roleMap[o.id], type: 0, allow: String(o.allow || 0), deny: String(o.deny || 0) };
                return null;
            }
            return null;
        }).filter(Boolean);
    }

    function normalizeChannelType(type, targetFeatures) {
        if (type === 5 && !targetFeatures.includes('COMMUNITY')) return 0;
        if (type === 13 && !targetFeatures.includes('STAGE_CHANNELS')) return 2;
        if (type === 15 && !targetFeatures.includes('FORUM_CHANNELS')) return 0;
        return type;
    }

    function buildChannelData(ch, targetId, roleMap, catMap, srcGuildId, targetFeatures) {
        let ctype = normalizeChannelType(ch.type, targetFeatures);
        const data = {
            name: ch.name.slice(0, 100),
            type: ctype,
            position: ch.position,
            permission_overwrites: sanitizeOverwrites(ch.permission_overwrites, targetId, roleMap, srcGuildId)
        };
        if (ctype === 0 || ctype === 5) {
            if (ch.topic) data.topic = ch.topic.slice(0, 1024);
            if (ch.rate_limit_per_user) data.rate_limit_per_user = Math.min(ch.rate_limit_per_user, 21600);
            if (ch.nsfw) data.nsfw = true;
        }
        if (ctype === 2) {
            data.bitrate = Math.min(Math.max(ch.bitrate || 64000, 8000), 96000);
            data.user_limit = ch.user_limit ? Math.min(Math.max(ch.user_limit, 0), 99) : 0;
        }
        if (ch.parent_id && catMap[ch.parent_id]) {
            data.parent_id = catMap[ch.parent_id];
        }
        return data;
    }

    async function copyGuildIcon(srcId, tgtId) {
        try {
            const srcGuild = await (await fetch(`${API}/guilds/${srcId}`, { headers: { 'Authorization': authToken } })).json();
            if (!srcGuild.icon) return false;
            const iconRes = await fetch(`https://cdn.discordapp.com/icons/${srcId}/${srcGuild.icon}.png?size=256`);
            if (!iconRes.ok) throw new Error('icon download');
            const blob = await iconRes.blob();
            if (blob.size > 262144) {
                log('иконка больше 256KB, пропущена', 'warning');
                return false;
            }
            const base64 = await new Promise(r => {
                const reader = new FileReader();
                reader.onloadend = () => r(reader.result);
                reader.readAsDataURL(blob);
            });
            const pureBase64 = base64.split(',')[1];
            await apiRequest(`${API}/guilds/${tgtId}`, {
                method: 'PATCH',
                body: JSON.stringify({ icon: pureBase64 })
            });
            log('иконка скопирована', 'success');
            return true;
        } catch (e) {
            log(`ошибка иконки: ${e.message}`, 'warning');
            return false;
        }
    }

    async function createChannelWithRetry(guildId, body, targetFeatures, maxAttempts = 2) {
        let lastError;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                const res = await apiRequest(`${API}/guilds/${guildId}/channels`, { method: 'POST', body: JSON.stringify(body) });
                return await res.json();
            } catch (e) {
                lastError = e;
                if ((e.message.includes('400') || e.message.includes('50024') || e.message.includes('50035')) && body.type !== 0) {
                    body.type = 0;
                    log(`ошибка типа канала, пробуем текстовый`, 'warning');
                    continue;
                }
                throw e;
            }
        }
        throw lastError;
    }

    function resetCloneState() {
        cloning = false;
        cancelFlag = false;
        controller = null;
        const cloneBtn = document.getElementById('cloneBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const statusDiv = document.getElementById('cloneStatus');
        if (cloneBtn) cloneBtn.disabled = false;
        if (cancelBtn) cancelBtn.disabled = true;
        if (statusDiv) statusDiv.classList.remove('active');
        document.getElementById('progressBar').style.width = '0%';
    }

    function cancelClone() {
        if (cloning) {
            cancelFlag = true;
            if (controller) controller.abort();
            log('процесс остановлен', 'warning');
            document.getElementById('cancelBtn').disabled = true;
        }
    }

    async function startClone() {
        if (cloning) return;
        const src = document.getElementById('sourceId').value.trim();
        const tgt = document.getElementById('targetId').value.trim();
        if (!/^\d{17,20}$/.test(src) || !/^\d{17,20}$/.test(tgt)) {
            log('неверный формат ID сервера', 'error');
            return;
        }
        if (src === tgt) {
            log('исходный и целевой серверы совпадают', 'error');
            return;
        }

        cloning = true;
        cancelFlag = false;
        controller = new AbortController();
        const cloneBtn = document.getElementById('cloneBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const statusDiv = document.getElementById('cloneStatus');
        const progressFill = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const statusText = document.getElementById('statusText');

        cloneBtn.disabled = true;
        cancelBtn.disabled = false;
        statusDiv.classList.add('active');
        progressFill.style.width = '0%';

        const stats = { roles: 0, channels: 0, errors: 0 };

        try {
            statusText.textContent = 'проверка прав';
            progressPercent.textContent = '0%';
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
            for (let i = 0; i < channels.length; i++) {
                if (cancelFlag) throw new Error('CANCELLED');
                try {
                    await apiRequest(`${API}/channels/${channels[i].id}`, { method: 'DELETE' });
                    log(`удалён канал: ${channels[i].name || channels[i].id}`, 'warning');
                } catch (e) { stats.errors++; log(`ошибка удаления: ${e.message}`, 'error'); }
                await sleep(200);
                const pct = Math.min(10, ((i + 1) / Math.max(channels.length, 1)) * 10);
                progressFill.style.width = pct + '%';
                progressPercent.textContent = Math.floor(pct) + '%';
                updateStats(stats);
            }

            statusText.textContent = 'очистка ролей';
            let roles = await (await apiRequest(`${API}/guilds/${tgt}/roles`)).json();
            const delRoles = roles.filter(r => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
            for (const r of delRoles) {
                if (cancelFlag) throw new Error('CANCELLED');
                try { await apiRequest(`${API}/guilds/${tgt}/roles/${r.id}`, { method: 'DELETE' }); } catch (e) {}
                await sleep(150);
            }
            progressFill.style.width = '15%';
            progressPercent.textContent = '15%';

            statusText.textContent = 'создание ролей';
            const srcRoles = await (await apiRequest(`${API}/guilds/${src}/roles`)).json();
            const rolesToCreate = srcRoles.filter(r => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
            const roleMap = {};
            for (let i = 0; i < rolesToCreate.length; i++) {
                if (cancelFlag) throw new Error('CANCELLED');
                const r = rolesToCreate[i];
                try {
                    const body = JSON.stringify({
                        name: r.name.slice(0, 100),
                        color: r.color || 0,
                        hoist: !!r.hoist,
                        mentionable: !!r.mentionable,
                        permissions: String(r.permissions || 0)
                    });
                    const resp = await apiRequest(`${API}/guilds/${tgt}/roles`, { method: 'POST', body });
                    const nr = await resp.json();
                    roleMap[r.id] = nr.id;
                    stats.roles++;
                    log(`роль создана: ${r.name}`, 'success');
                } catch (e) { stats.errors++; log(`ошибка роли ${r.name}: ${e.message}`, 'error'); }
                await sleep(250);
                const pct = 15 + ((i + 1) / Math.max(rolesToCreate.length, 1)) * 30;
                progressFill.style.width = pct + '%';
                progressPercent.textContent = Math.floor(pct) + '%';
                updateStats(stats);
            }

            statusText.textContent = 'создание каналов';
            const srcChannels = await (await apiRequest(`${API}/guilds/${src}/channels`)).json();
            const categories = srcChannels.filter(c => c.type === 4).sort((a, b) => a.position - b.position);
            const others = srcChannels.filter(c => c.type !== 4).sort((a, b) => a.position - b.position);
            const catMap = {};
            const allChannelMap = {};
            let created = 0;
            const total = categories.length + others.length;

            for (const cat of categories) {
                if (cancelFlag) throw new Error('CANCELLED');
                try {
                    const body = buildChannelData(cat, tgt, roleMap, catMap, srcGuild.id, targetFeatures);
                    const res = await apiRequest(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
                    const ch = await res.json();
                    catMap[cat.id] = ch.id;
                    allChannelMap[cat.id] = ch.id;
                    stats.channels++;
                    log(`категория создана: ${cat.name}`, 'success');
                } catch (e) { stats.errors++; log(`ошибка категории ${cat.name}: ${e.message}`, 'error'); }
                await sleep(250);
                updateStats(stats);
            }

            for (let i = 0; i < others.length; i++) {
                if (cancelFlag) throw new Error('CANCELLED');
                const ch = others[i];
                try {
                    let body = buildChannelData(ch, tgt, roleMap, catMap, srcGuild.id, targetFeatures);
                    const newCh = await createChannelWithRetry(tgt, body, targetFeatures);
                    allChannelMap[ch.id] = newCh.id;
                    stats.channels++;
                    log(`канал создан: ${ch.name}`, 'success');
                } catch (e) { stats.errors++; log(`ошибка канала ${ch.name}: ${e.message}`, 'error'); }
                await sleep(200);
                const pct = 45 + ((categories.length + i + 1) / Math.max(total, 1)) * 45;
                progressFill.style.width = pct + '%';
                progressPercent.textContent = Math.floor(pct) + '%';
                updateStats(stats);
            }

            statusText.textContent = 'применение настроек сервера';
            const patchBody = {
                name: srcGuild.name,
                verification_level: srcGuild.verification_level,
                default_message_notifications: srcGuild.default_message_notifications,
                explicit_content_filter: srcGuild.explicit_content_filter,
                preferred_locale: srcGuild.preferred_locale,
            };
            if (srcGuild.afk_channel_id && allChannelMap[srcGuild.afk_channel_id]) {
                patchBody.afk_channel_id = allChannelMap[srcGuild.afk_channel_id];
            }
            if (srcGuild.system_channel_id && allChannelMap[srcGuild.system_channel_id]) {
                patchBody.system_channel_id = allChannelMap[srcGuild.system_channel_id];
            }
            if (srcGuild.description) patchBody.description = srcGuild.description.slice(0, 1024);
            await apiRequest(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify(patchBody) });
            log('настройки сервера обновлены', 'success');

            progressFill.style.width = '100%';
            progressPercent.textContent = '100%';
            log('клонирование завершено', 'success');
            log(`статистика: ${stats.roles} ролей, ${stats.channels} каналов`, 'info');
            if (stats.errors) log(`ошибок: ${stats.errors}`, 'warning');
            notify('клонирование завершено', 'success');
        } catch (e) {
            if (e.message === 'CANCELLED') {
                log('процесс отменён', 'warning');
                notify('клонирование отменено', 'info');
            } else {
                log(`критическая ошибка: ${e.message}`, 'error');
                notify('ошибка клонирования', 'error');
            }
        } finally {
            resetCloneState();
        }
    }

    function togglePassword() {
        const input = document.getElementById('authToken');
        const icon = document.getElementById('eyeIcon');
        if (input.type === 'password') {
            input.type = 'text';
            icon.innerHTML = SVG.eyeOff;
        } else {
            input.type = 'password';
            icon.innerHTML = SVG.eye;
        }
    }

    async function authorize() {
        const input = document.getElementById('authToken');
        const token = input.value.trim();
        if (!token) {
            const errEl = document.getElementById('authError');
            input.classList.add('error');
            errEl.textContent = 'введите токен';
            errEl.style.display = 'block';
            setTimeout(() => { input.classList.remove('error'); errEl.style.display = 'none'; }, 3000);
            return;
        }
        const btn = document.getElementById('authBtn');
        const originalText = btn.textContent;
        btn.textContent = 'проверка...';
        btn.disabled = true;
        try {
            const res = await fetch(`${API}/users/@me`, { headers: { 'Authorization': token } });
            if (!res.ok) throw new Error(res.status === 401 ? 'неверный токен' : `ошибка ${res.status}`);
            const user = await res.json();
            authToken = token;
            currentUser = user;
            sessionStorage.setItem('dc_token', token);
            sessionStorage.setItem('dc_user', JSON.stringify(user));
            sessionStorage.setItem('dc_last_active', Date.now().toString());
            startKeepAlive();
            notify(`добро пожаловать, ${user.username}`, 'success');

            const authScreen = document.querySelector('.auth-screen');
            const mainScreen = document.querySelector('.main-screen');
            authScreen.style.opacity = '0';
            authScreen.style.transform = 'scale(0.98)';
            setTimeout(() => {
                authScreen.style.display = 'none';
                mainScreen.style.display = 'flex';
                mainScreen.style.opacity = '0';
                mainScreen.style.transform = 'translateY(10px)';
                requestAnimationFrame(() => {
                    mainScreen.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    mainScreen.style.opacity = '1';
                    mainScreen.style.transform = 'translateY(0)';
                });
                initMainUI();
            }, 400);
        } catch (e) {
            const errEl = document.getElementById('authError');
            input.classList.add('error');
            errEl.textContent = e.message;
            errEl.style.display = 'block';
            setTimeout(() => { input.classList.remove('error'); errEl.style.display = 'none'; }, 3000);
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    }

    function initMainUI() {
        document.getElementById('sourceId').value = localStorage.getItem('lastSrc') || '';
        document.getElementById('targetId').value = localStorage.getItem('lastTgt') || '';
        document.getElementById('cloneBtn').addEventListener('click', startClone);
        document.getElementById('cancelBtn').addEventListener('click', cancelClone);
        document.getElementById('clearLogsBtn').addEventListener('click', () => {
            const box = document.getElementById('mainLog');
            if (box) box.innerHTML = '';
        });
        document.getElementById('logoutBtn').addEventListener('click', logout);
        document.getElementById('sourceId').addEventListener('input', e => localStorage.setItem('lastSrc', e.target.value));
        document.getElementById('targetId').addEventListener('input', e => localStorage.setItem('lastTgt', e.target.value));
        if (currentUser) {
            renderUser(currentUser);
            log(`авторизация: ${currentUser.username}`, 'success', 'mainLog');
        }
    }

    function logout() {
        stopKeepAlive();
        sessionStorage.clear();
        localStorage.removeItem('lastSrc');
        localStorage.removeItem('lastTgt');
        notify('выход выполнен', 'success');
        setTimeout(() => location.reload(), 800);
    }

    function buildUI() {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="auth-screen">
                <a class="contact" href="https://t.me/xolirx" target="_blank">● @xolirx</a>
                <div class="auth-card">
                    <div class="auth-icon">🐱</div>
                    <div class="auth-title">discord cloner</div>
                    <div class="auth-subtitle">минималистичный клонер серверов</div>
                    <div class="field">
                        <label>токен авторизации</label>
                        <div class="input-row">
                            <input type="password" id="authToken" placeholder="введите discord токен">
                            <button class="toggle-pass" id="togglePasswordBtn">${SVG.eye}</button>
                        </div>
                        <div id="authError" style="color:#f44; font-size:0.7rem; margin-top:6px; display:none;"></div>
                    </div>
                    <button class="btn" id="authBtn">авторизоваться</button>
                    <div style="margin-top:28px; text-align:center; font-size:0.65rem; color:var(--text-dim);">
                        <p>разработчик: xolirx</p>
                        <p>версия 3.0</p>
                    </div>
                </div>
            </div>
            <div class="main-screen" style="display:none;">
                <a class="contact" href="https://t.me/xolirx" target="_blank">● @xolirx</a>
                <div class="main-grid">
                    <div class="panel">
                        <div class="user-row">
                            <div class="avatar">
                                <img id="userAvatarImg" style="display:none;">
                                <div id="userAvatarPlaceholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:600;"></div>
                            </div>
                            <div class="user-meta">
                                <div class="name" id="userName">загрузка...</div>
                                <div class="email" id="userEmail">загрузка...</div>
                                <div class="badge">авторизован</div>
                            </div>
                        </div>
                        <div class="stats">
                            <div class="stat"><div class="value" id="rolesCount">0</div><div class="label">ролей</div></div>
                            <div class="stat"><div class="value" id="channelsCount">0</div><div class="label">каналов</div></div>
                            <div class="stat"><div class="value" id="errorsCount">0</div><div class="label">ошибок</div></div>
                            <div class="stat"><div class="value" id="statusIcon">●</div><div class="label">статус</div></div>
                        </div>
                        <input class="input" id="sourceId" placeholder="id исходного сервера">
                        <input class="input" id="targetId" placeholder="id целевого сервера">
                        <div class="btn-row">
                            <button class="btn" id="cloneBtn">начать клонирование</button>
                            <button class="btn" id="cancelBtn" disabled>отмена</button>
                        </div>
                        <div class="status-bar" id="cloneStatus">
                            <div class="spinner"></div>
                            <span id="statusText">инициализация</span>
                            <div class="progress-track"><div class="progress-fill" id="progressBar"></div></div>
                            <span id="progressPercent" style="font-weight:600;font-size:0.8rem;min-width:35px;">0%</span>
                        </div>
                        <button class="btn danger" id="logoutBtn" style="margin-top:20px;">выйти</button>
                    </div>
                    <div class="panel log-panel">
                        <div class="log-header">
                            <span>логи</span>
                            <button id="clearLogsBtn">очистить</button>
                        </div>
                        <div id="mainLog" class="log-box"></div>
                    </div>
                </div>
            </div>
        `);
    }

    initParticles();
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
    } else if (savedToken) {
        sessionStorage.clear();
    }
})();
