// Все стили внедряем сразу в JS
const style = document.createElement('style');
style.textContent = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:#0b0b0b;color:#dcddde;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
.wrapper{display:flex;gap:20px;width:100%;max-width:900px;height:80vh}
.left{flex:1;background:#1e1f22;border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:12px}
.right{flex:1;background:#1e1f22;border-radius:16px;padding:16px;display:flex;flex-direction:column}
.log-title{font-size:0.9rem;color:#b0b0b0;margin-bottom:8px}
.log-box{flex:1;background:#0b0b0b;border-radius:8px;padding:10px;overflow-y:auto;font-family:monospace;font-size:0.7rem;color:#b0b0b0}
.log-item{margin:2px 0;border-bottom:1px solid #2b2d31;padding:2px 0}
.log-success{color:#7fe07f}.log-error{color:#ff7b7b}.log-warning{color:#e6b450}
input,button{width:100%;padding:10px;margin:4px 0;border-radius:8px;border:1px solid #3f4147;background:#2b2d31;color:#dcddde;font-size:0.85rem}
input:focus{outline:none;border-color:#b0b0b0}
button{cursor:pointer;background:#4e5058;border:none;font-weight:500;transition:0.2s}
button:hover{background:#6d6f78}
button.primary{background:#b0b0b0;color:#000;font-weight:600}
button.primary:hover{background:#c0c0c0}
button.danger{background:#ed4245;color:#fff}
button.danger:hover{background:#c03537}
.row{display:flex;gap:8px}
.row button{flex:1}
.progress{height:4px;background:#3f4147;border-radius:2px;margin:8px 0;overflow:hidden}
.progress-fill{height:100%;background:#b0b0b0;width:0%;transition:width 0.3s}
.server-list{max-height:120px;overflow-y:auto;background:#2b2d31;border-radius:8px;margin-top:4px;display:none}
.server-item{padding:8px;cursor:pointer;border-bottom:1px solid #3f4147;font-size:0.8rem}
.server-item:hover{background:#3f4147}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e1f22;border:1px solid #b0b0b0;padding:10px 24px;border-radius:20px;z-index:9999;font-size:0.8rem}
.status{background:#2b2d31;border-radius:8px;padding:8px 12px;margin:8px 0;display:none;align-items:center;gap:8px}
.status.active{display:flex}
.spinner{width:16px;height:16px;border:2px solid #b0b0b0;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
`;
document.head.appendChild(style);

// ---------- основной код ----------
(function(){
    const API = 'https://discord.com/api/v10';
    let cloning = false, cancel = false, controller = null, guilds = [];

    const $ = id => document.getElementById(id);
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const toast = msg => {
        let t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
        document.body.appendChild(t); setTimeout(() => t.remove(), 1800);
    };

    const log = (msg, type = 'info') => {
        let box = $('logBox'); if (!box) return;
        let icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        let time = new Date().toLocaleTimeString('ru-RU');
        let div = document.createElement('div');
        div.className = `log-item log-${type}`;
        div.innerHTML = `<span>${time}</span> ${icons[type]||icons.info} ${msg}`;
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
        if (box.children.length > 200) box.removeChild(box.children[0]);
    };

    // безопасные параметры для разных типов каналов
    function buildChannelData(ch, targetId, roleMap, srcGuildId) {
        let data = {
            name: ch.name.substring(0, 100),
            type: ch.type,
            position: ch.position,
            permission_overwrites: sanitizeOverwrites(ch.permission_overwrites, targetId, roleMap, srcGuildId)
        };
        // текстовые и новости
        if (ch.type === 0 || ch.type === 5) {
            if (ch.topic) data.topic = ch.topic.substring(0, 1024);
            if (ch.rate_limit_per_user) data.rate_limit_per_user = Math.min(ch.rate_limit_per_user, 21600);
            if (ch.nsfw) data.nsfw = true;
        }
        // голосовые
        if (ch.type === 2) {
            data.bitrate = Math.min(Math.max(ch.bitrate || 64000, 8000), 96000);
            data.user_limit = ch.user_limit ? Math.min(Math.max(ch.user_limit, 0), 99) : 0;
        }
        // родительская категория
        if (ch.parent_id && roleMap[ch.parent_id]) {
            data.parent_id = roleMap[ch.parent_id];
        } else if (ch.parent_id && catMap && catMap[ch.parent_id]) {
            data.parent_id = catMap[ch.parent_id];
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

    async function loadGuilds() {
        let token = $('tokenInput').value.trim();
        if (!token) return;
        try {
            let r = await fetch(`${API}/users/@me/guilds`, { headers: { Authorization: token } });
            if (r.ok) {
                guilds = await r.json();
                guilds.sort((a, b) => a.name.localeCompare(b.name));
            }
        } catch (e) { /* тихо */ }
    }

    async function showServers() {
        if (!guilds.length) await loadGuilds();
        let list = $('serverList');
        if (!guilds.length) {
            list.innerHTML = '<div style="padding:8px;color:#b0b0b0">Нет серверов</div>';
            list.style.display = 'block';
            return;
        }
        list.innerHTML = guilds.slice(0, 20).map(g =>
            `<div class="server-item" data-id="${g.id}">${g.name} <span style="color:#b0b0b0;font-size:0.7rem">${g.id}</span></div>`
        ).join('');
        list.style.display = 'block';
        list.querySelectorAll('.server-item').forEach(el => {
            el.addEventListener('click', () => {
                $('sourceId').value = el.dataset.id;
                list.style.display = 'none';
            });
        });
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
                } catch (e) { log(`Ошибка удаления канала`, 'error'); }
                await sleep(200);
                let pct = Math.min(10, ((i + 1) / Math.max(channels.length, 1)) * 10);
                $('progressBar').style.width = pct + '%';
                $('progressPercent').textContent = Math.floor(pct) + '%';
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
            if (srcGuild.icon) {
                try {
                    let iconRes = await fetch(`https://cdn.discordapp.com/icons/${src}/${srcGuild.icon}.png?size=256`);
                    if (iconRes.ok) {
                        let blob = await iconRes.blob();
                        if (blob.size <= 262144) {
                            let base64 = await new Promise(r => { let reader = new FileReader(); reader.onloadend = () => r(reader.result); reader.readAsDataURL(blob); });
                            await api(`${API}/guilds/${tgt}`, { method: 'PATCH', body: JSON.stringify({ icon: base64.split(',')[1] }) });
                            log('Иконка скопирована', 'success');
                        }
                    }
                } catch (e) {}
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
                } catch (e) { log(`Ошибка роли ${r.name}: ${e.message}`, 'error'); }
                await sleep(250);
                let pct = 25 + ((i + 1) / Math.max(rolesToCreate.length, 1)) * 30;
                $('progressBar').style.width = pct + '%';
                $('progressPercent').textContent = Math.floor(pct) + '%';
            }
            $('statusText').textContent = 'Создание каналов';
            let srcChannels = await (await api(`${API}/guilds/${src}/channels`)).json();
            let categories = srcChannels.filter(c => c.type === 4).sort((a, b) => a.position - b.position);
            let others = srcChannels.filter(c => c.type !== 4).sort((a, b) => a.position - b.position);
            let catMap = {};
            let created = 0;
            let total = categories.length + others.length;
            for (let i = 0; i < categories.length; i++) {
                if (cancel) throw new Error('CANCELLED');
                let c = categories[i];
                try {
                    let body = buildChannelData(c, tgt, roleMap, srcGuild.id);
                    let resp = await api(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
                    let ch = await resp.json();
                    catMap[c.id] = ch.id;
                    created++;
                } catch (e) { log(`Ошибка категории: ${e.message}`, 'error'); }
                await sleep(250);
            }
            for (let i = 0; i < others.length; i++) {
                if (cancel) throw new Error('CANCELLED');
                let c = others[i];
                try {
                    let body = buildChannelData(c, tgt, roleMap, srcGuild.id);
                    if (c.parent_id && catMap[c.parent_id]) body.parent_id = catMap[c.parent_id];
                    await api(`${API}/guilds/${tgt}/channels`, { method: 'POST', body: JSON.stringify(body) });
                    created++;
                } catch (e) { log(`Ошибка канала ${c.name}: ${e.message}`, 'error'); }
                await sleep(200);
                let pct = 60 + ((categories.length + i + 1) / Math.max(total, 1)) * 40;
                $('progressBar').style.width = pct + '%';
                $('progressPercent').textContent = Math.floor(pct) + '%';
            }
            $('progressBar').style.width = '100%'; $('progressPercent').textContent = '100%';
            log(`Клонирование завершено! Ролей: ${rolesToCreate.length}, каналов: ${created}`, 'success');
            toast('Готово!');
        } catch (e) {
            if (e.message === 'CANCELLED') { log('Отменено', 'warning'); toast('Отменено'); }
            else { log(`Ошибка: ${e.message}`, 'error'); toast('Ошибка'); }
        } finally { resetClone(); }
    }

    function clearLogs() { $('logBox').innerHTML = ''; }

    function buildUI() {
        document.getElementById('app').innerHTML = `
        <div class="wrapper">
            <div class="left">
                <div style="font-size:1.2rem;font-weight:600;color:#fff;margin-bottom:4px">Discord Cloner</div>
                <div style="font-size:0.7rem;color:#b0b0b0;margin-bottom:12px">by xolirx</div>
                <input type="password" id="tokenInput" placeholder="Токен">
                <input id="sourceId" placeholder="Исходный сервер ID">
                <input id="targetId" placeholder="Целевой сервер ID">
                <button id="showServersBtn"><i class="fas fa-list"></i> Мои сервера</button>
                <div id="serverList" class="server-list"></div>
                <div class="row">
                    <button id="cloneBtn" class="primary"><i class="fas fa-copy"></i> Клонировать</button>
                    <button id="cancelBtn" class="danger" disabled><i class="fas fa-times"></i> Отмена</button>
                </div>
                <div id="cloneStatus" class="status">
                    <div class="spinner"></div>
                    <span id="statusText">Клонирование</span>
                    <span id="progressPercent" style="margin-left:auto">0%</span>
                </div>
                <div class="progress"><div class="progress-fill" id="progressBar"></div></div>
            </div>
            <div class="right">
                <div class="log-title"><i class="fas fa-terminal"></i> Логи</div>
                <div id="logBox" class="log-box"></div>
                <button id="clearLogsBtn" style="margin-top:8px;width:auto;padding:6px 12px;font-size:0.7rem"><i class="fas fa-eraser"></i> Очистить</button>
            </div>
        </div>`;
    }

    buildUI();
    $('cloneBtn').addEventListener('click', startClone);
    $('cancelBtn').addEventListener('click', cancelClone);
    $('showServersBtn').addEventListener('click', showServers);
    $('clearLogsBtn').addEventListener('click', clearLogs);
    // автоматически подгрузить сервера при вводе токена (необязательно)
    $('tokenInput').addEventListener('change', loadGuilds);
})();
