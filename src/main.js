// Стили вставлены прямо в JS, чтобы избежать проблем с импортом CSS
const style = document.createElement('style');
style.textContent = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;background:#0b0b0b;color:#dcddde;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.container{width:100%;max-width:520px;background:#1e1f22;border-radius:16px;padding:24px;box-shadow:0 2px 10px rgba(0,0,0,0.5)}.logo{text-align:center;font-size:1.4rem;font-weight:600;letter-spacing:1px;margin-bottom:24px;color:#fff}.logo span{color:#b0b0b0;font-size:0.7rem;display:block}.hidden{display:none!important}input,button{width:100%;padding:12px;margin:8px 0;border-radius:8px;border:1px solid #3f4147;background:#2b2d31;color:#dcddde;font-size:0.9rem}input:focus{outline:none;border-color:#b0b0b0}button{cursor:pointer;background:#4e5058;border:none;font-weight:500;transition:0.2s}button:hover{background:#6d6f78}button.primary{background:#b0b0b0;color:#000;font-weight:600}button.primary:hover{background:#c0c0c0}button.danger{background:#ed4245;color:#fff}button.danger:hover{background:#c03537}.flex-row{display:flex;gap:10px}.flex-row button{flex:1}#log{background:#0b0b0b;border-radius:8px;height:200px;overflow-y:auto;padding:10px;font-size:0.7rem;font-family:monospace;margin:12px 0;color:#b0b0b0}.log-entry{margin:4px 0;border-bottom:1px solid #2b2d31;padding:2px 0}.log-success{color:#7fe07f}.log-error{color:#ff7b7b}.log-warning{color:#e6b450}.progress{height:4px;background:#3f4147;border-radius:2px;margin:12px 0;overflow:hidden}.progress-fill{height:100%;background:#b0b0b0;width:0%;transition:width 0.3s}.user-bar{display:flex;align-items:center;gap:10px;margin-bottom:16px}.avatar{width:40px;height:40px;border-radius:50%;background:#3f4147}.user-info{flex:1;font-size:0.8rem}.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1e1f22;border:1px solid #b0b0b0;padding:10px 24px;border-radius:20px;z-index:9999;font-size:0.8rem}.status{background:#2b2d31;border-radius:8px;padding:8px 12px;margin-bottom:12px;display:none;align-items:center;gap:8px}.status.active{display:flex}.spinner{width:16px;height:16px;border:2px solid #b0b0b0;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`;
document.head.appendChild(style);

// Основной код приложения
(function(){
    const API='https://discord.com/api/v10';
    let token=null, user=null, cloning=false, cancel=false, controller=null, guilds=[];
    const $=id=>document.getElementById(id);
    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    const log=(msg,type='info')=>{
        let l=$('log'); if(!l)return;
        let icons={success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'};
        let t=new Date().toLocaleTimeString('ru-RU');
        let e=document.createElement('div'); e.className=`log-entry log-${type}`; e.innerHTML=`<span>${t}</span> ${icons[type]||icons.info} ${msg}`;
        l.appendChild(e); l.scrollTop=l.scrollHeight;
        if(l.children.length>150) l.removeChild(l.children[0]);
    };
    const toast=m=>{let t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),1800);};
    const showErr=(el,m)=>{el.textContent=m;el.style.display='block';setTimeout(()=>el.style.display='none',3000)};
    async function api(url,opts={},retries=3){
        if(cancel)throw new Error('CANCELLED');
        let signal=controller?.signal;
        for(let i=0;i<retries;i++){
            if(cancel)throw new Error('CANCELLED');
            try{
                let headers={'Authorization':token,'Content-Type':'application/json',...opts.headers};
                let res=await fetch(url,{...opts,headers,signal});
                if(res.status===429){let r=parseInt(res.headers.get('Retry-After'))||2;await sleep(r*1000);continue}
                if(!res.ok&&i===retries-1)throw new Error(`HTTP ${res.status}`);
                if(!res.ok){await sleep(1000*(i+1));continue}
                return res;
            }catch(e){if(e.name==='AbortError')throw new Error('CANCELLED');if(i===retries-1)throw e;await sleep(1000*(i+1))}
        }
    }
    async function loadGuilds(){if(!token)return[];try{let r=await fetch(`${API}/users/@me/guilds`,{headers:{Authorization:token}});if(r.ok){guilds=await r.json();guilds.sort((a,b)=>a.name.localeCompare(b.name))}}catch(e){}return guilds}
    async function showServers(){
        if(!guilds.length)await loadGuilds();
        let list=$('serverList'); if(!list)return;
        if(!guilds.length){list.innerHTML='<div style="padding:8px;color:#b0b0b0">Нет серверов</div>';list.style.display='block';return}
        list.innerHTML=guilds.slice(0,20).map(g=>`<div style="padding:8px;cursor:pointer;border-bottom:1px solid #3f4147" data-id="${g.id}"><span>${g.name}</span> <span style="color:#b0b0b0;font-size:0.65rem">${g.id}</span></div>`).join('');
        list.style.display='block';
        list.querySelectorAll('div').forEach(d=>d.addEventListener('click',()=>{$('sourceId').value=d.dataset.id;list.style.display='none'}));
    }
    function resetClone(){
        cloning=false; controller=null;
        $('cloneBtn').disabled=false; $('cancelBtn').disabled=true;
        $('cloneStatus').classList.remove('active'); $('progressBar').style.width='0%';
    }
    function cancelClone(){if(cloning){cancel=true;controller?.abort();log('Отмена...','warning');$('cancelBtn').disabled=true}}
    function sanitizeOverwrites(overwrites, targetId, roleMap, srcGuildId) {
        if(!Array.isArray(overwrites)) return [];
        return overwrites.map(o => {
            if (!o || !o.id) return null;
            let id = o.id;
            if (o.type === 0) {
                if (o.id === srcGuildId) id = targetId;
                else if (roleMap[o.id]) id = roleMap[o.id];
                else return null;
            } else if (o.type === 1) id = targetId;
            return {id, type: o.type, allow: String(o.allow || 0), deny: String(o.deny || 0)};
        }).filter(o => o !== null);
    }
    async function startClone(){
        if(cloning)return;
        let src=$('sourceId').value.trim(), tgt=$('targetId').value.trim();
        if(!/^\d{17,20}$/.test(src)||!/^\d{17,20}$/.test(tgt)){log('Неверный ID','error');return}
        if(src===tgt){log('Одинаковые ID','error');return}
        cloning=true; cancel=false; controller=new AbortController();
        $('cloneBtn').disabled=true; $('cancelBtn').disabled=false;
        $('cloneStatus').classList.add('active'); $('progressBar').style.width='0%';
        try{
            $('statusText').textContent='Проверка прав'; $('progressPercent').textContent='0%';
            let meGuilds=await(await api(`${API}/users/@me/guilds`)).json();
            let tgtGuild=meGuilds.find(g=>g.id===tgt);
            if(!tgtGuild||!(BigInt(tgtGuild.permissions)&0x8n))throw new Error('Нет прав администратора на целевом сервере');
            let srcGuild=await(await api(`${API}/guilds/${src}`)).json();
            $('statusText').textContent='Очистка каналов';
            let channels=await(await api(`${API}/guilds/${tgt}/channels`)).json();
            for(let i=0;i<channels.length;i++){
                if(cancel)throw new Error('CANCELLED');
                try{await api(`${API}/channels/${channels[i].id}`,{method:'DELETE'});log(`Удалён канал: ${channels[i].name||channels[i].id}`,'warning')}catch(e){}
                await sleep(200);
                let pct=Math.min(10,((i+1)/Math.max(channels.length,1))*10);
                $('progressBar').style.width=pct+'%'; $('progressPercent').textContent=Math.floor(pct)+'%';
            }
            $('statusText').textContent='Очистка ролей';
            let roles=await(await api(`${API}/guilds/${tgt}/roles`)).json();
            let delRoles=roles.filter(r=>r.name!=='@everyone'&&!r.managed).sort((a,b)=>b.position-a.position);
            for(let i=0;i<delRoles.length;i++){
                if(cancel)throw new Error('CANCELLED');
                try{await api(`${API}/guilds/${tgt}/roles/${delRoles[i].id}`,{method:'DELETE'})}catch(e){}
                await sleep(150);
            }
            $('progressBar').style.width='15%'; $('progressPercent').textContent='15%';
            $('statusText').textContent='Название и иконка';
            await api(`${API}/guilds/${tgt}`,{method:'PATCH',body:JSON.stringify({name:srcGuild.name})});
            if(srcGuild.icon){
                try{
                    let iconRes=await fetch(`https://cdn.discordapp.com/icons/${src}/${srcGuild.icon}.png?size=256`);
                    if(iconRes.ok){
                        let blob=await iconRes.blob();
                        if(blob.size<=262144){
                            let base64=await new Promise(r=>{let reader=new FileReader();reader.onloadend=()=>r(reader.result);reader.readAsDataURL(blob)});
                            await api(`${API}/guilds/${tgt}`,{method:'PATCH',body:JSON.stringify({icon:base64.split(',')[1]})});
                            log('Иконка скопирована','success');
                        }
                    }
                }catch(e){}
            }
            $('progressBar').style.width='25%'; $('progressPercent').textContent='25%';
            $('statusText').textContent='Создание ролей';
            let srcRoles=await(await api(`${API}/guilds/${src}/roles`)).json();
            let rolesToCreate=srcRoles.filter(r=>r.name!=='@everyone'&&!r.managed).sort((a,b)=>b.position-a.position);
            let roleMap={};
            for(let i=0;i<rolesToCreate.length;i++){
                if(cancel)throw new Error('CANCELLED');
                let r=rolesToCreate[i];
                try{
                    let body=JSON.stringify({name:r.name.substring(0,100),color:r.color||0,hoist:!!r.hoist,mentionable:!!r.mentionable,permissions:String(r.permissions||0)});
                    let resp=await api(`${API}/guilds/${tgt}/roles`,{method:'POST',body});
                    let newRole=await resp.json();
                    roleMap[r.id]=newRole.id;
                }catch(e){log(`Ошибка роли ${r.name}: ${e.message}`,'error')}
                await sleep(250);
                let pct=25+((i+1)/Math.max(rolesToCreate.length,1))*30;
                $('progressBar').style.width=pct+'%'; $('progressPercent').textContent=Math.floor(pct)+'%';
            }
            $('statusText').textContent='Создание каналов';
            let srcChannels=await(await api(`${API}/guilds/${src}/channels`)).json();
            let categories=srcChannels.filter(c=>c.type===4).sort((a,b)=>a.position-b.position);
            let others=srcChannels.filter(c=>c.type!==4).sort((a,b)=>a.position-b.position);
            let catMap={}, created=0, total=categories.length+others.length;
            for(let i=0;i<categories.length;i++){
                if(cancel)throw new Error('CANCELLED');
                let c=categories[i];
                try{
                    let body={name:c.name.substring(0,100),type:4,position:c.position,permission_overwrites:sanitizeOverwrites(c.permission_overwrites,tgt,roleMap,srcGuild.id)};
                    let resp=await api(`${API}/guilds/${tgt}/channels`,{method:'POST',body:JSON.stringify(body)});
                    let ch=await resp.json();
                    catMap[c.id]=ch.id; created++;
                }catch(e){log(`Ошибка категории: ${e.message}`,'error')}
                await sleep(250);
            }
            for(let i=0;i<others.length;i++){
                if(cancel)throw new Error('CANCELLED');
                let c=others[i];
                try{
                    let body={
                        name:c.name.substring(0,100), type:c.type, position:c.position,
                        permission_overwrites:sanitizeOverwrites(c.permission_overwrites,tgt,roleMap,srcGuild.id)
                    };
                    if(c.type===0||c.type===5){
                        if(c.topic)body.topic=c.topic.substring(0,1024);
                        if(c.rate_limit_per_user)body.rate_limit_per_user=Math.min(c.rate_limit_per_user,21600);
                        if(c.nsfw)body.nsfw=true;
                    }
                    if(c.type===2){
                        if(c.bitrate)body.bitrate=Math.min(Math.max(c.bitrate,8000),96000);
                        if(c.user_limit)body.user_limit=Math.min(Math.max(c.user_limit,0),99);
                    }
                    if(c.parent_id&&catMap[c.parent_id])body.parent_id=catMap[c.parent_id];
                    await api(`${API}/guilds/${tgt}/channels`,{method:'POST',body:JSON.stringify(body)});
                    created++;
                }catch(e){log(`Ошибка канала ${c.name}: ${e.message}`,'error')}
                await sleep(200);
                let pct=60+((categories.length+i+1)/Math.max(total,1))*40;
                $('progressBar').style.width=pct+'%'; $('progressPercent').textContent=Math.floor(pct)+'%';
            }
            $('progressBar').style.width='100%'; $('progressPercent').textContent='100%';
            log(`Клонирование завершено! Ролей: ${rolesToCreate.length}, каналов: ${created}`,'success');
            toast('Готово!');
        }catch(e){
            if(e.message==='CANCELLED'){log('Отменено','warning');toast('Отменено')}
            else{log(`Ошибка: ${e.message}`,'error');toast('Ошибка')}
        }finally{resetClone()}
    }
    async function login(){
        let t=$('tokenInput').value.trim();
        if(!t)return showErr($('authError'),'Введите токен');
        try{
            let r=await fetch(`${API}/users/@me`,{headers:{Authorization:t}});
            if(!r.ok)return showErr($('authError'),'Неверный токен');
            let u=await r.json();
            token=t; user=u;
            sessionStorage.setItem('token',t); sessionStorage.setItem('user',JSON.stringify(u));
            $('userName').textContent=u.global_name||u.username;
            $('userId').textContent='ID: '+u.id;
            if(u.avatar)$('userAvatar').src=`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=64`;
            $('authBlock').classList.add('hidden'); $('mainBlock').classList.remove('hidden');
            log(`Вход: ${u.username}`,'success');
            loadGuilds();
        }catch(e){showErr($('authError'),'Ошибка подключения')}
    }
    async function testToken(){
        let t=$('tokenInput').value.trim();
        if(!t)return showErr($('authError'),'Введите токен');
        try{
            let r=await fetch(`${API}/users/@me`,{headers:{Authorization:t}});
            if(r.ok){let u=await r.json();toast(`Токен рабочий (${u.username})`)}
            else showErr($('authError'),'Неверный токен');
        }catch(e){showErr($('authError'),'Ошибка')}
    }
    function logout(){token=null;user=null;sessionStorage.clear();$('authBlock').classList.remove('hidden');$('mainBlock').classList.add('hidden');$('tokenInput').value='';log('Выход','info')}
    function clearLogs(){$('log').innerHTML=''}
    function buildUI(){
        document.getElementById('app').innerHTML = `
        <div class="container">
            <div class="logo">Discord Cloner<span>by xolirx</span></div>
            <div id="authBlock">
                <input type="password" id="tokenInput" placeholder="Токен">
                <div class="flex-row"><button id="testTokenBtn"><i class="fas fa-check"></i> Проверить</button><button id="loginBtn" class="primary"><i class="fas fa-key"></i> Войти</button></div>
                <div id="authError" style="color:#ed4245;font-size:0.7rem;margin-top:4px;display:none"></div>
            </div>
            <div id="mainBlock" class="hidden">
                <div class="user-bar"><img id="userAvatar" class="avatar" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%233f4147' width='40' height='40'/%3E%3C/svg%3E"><div class="user-info"><div id="userName"></div><div id="userId" style="font-size:0.6rem;color:#b0b0b0"></div></div><button id="logoutBtn" style="width:auto;padding:6px 12px;font-size:0.7rem"><i class="fas fa-sign-out-alt"></i></button></div>
                <div id="cloneStatus" class="status"><div class="spinner"></div><span id="statusText">Клонирование</span><span id="progressPercent" style="margin-left:auto">0%</span></div>
                <input id="sourceId" placeholder="Исходный сервер ID">
                <input id="targetId" placeholder="Целевой сервер ID">
                <button id="showServersBtn"><i class="fas fa-list"></i> Мои сервера</button>
                <div id="serverList" style="max-height:150px;overflow-y:auto;background:#2b2d31;border-radius:8px;margin:4px 0;display:none"></div>
                <div class="flex-row"><button id="cloneBtn" class="primary"><i class="fas fa-copy"></i> Клонировать</button><button id="cancelBtn" class="danger" disabled><i class="fas fa-times"></i> Отмена</button></div>
                <div class="progress"><div class="progress-fill" id="progressBar"></div></div>
                <div id="log"></div>
                <button id="clearLogsBtn" style="width:auto;padding:6px 12px;font-size:0.7rem;margin-top:4px"><i class="fas fa-eraser"></i> Очистить</button>
            </div>
        </div>`;
    }
    buildUI();
    $('loginBtn').addEventListener('click',login);
    $('testTokenBtn').addEventListener('click',testToken);
    $('logoutBtn').addEventListener('click',logout);
    $('showServersBtn').addEventListener('click',showServers);
    $('cloneBtn').addEventListener('click',startClone);
    $('cancelBtn').addEventListener('click',cancelClone);
    $('clearLogsBtn').addEventListener('click',clearLogs);
    let st=sessionStorage.getItem('token'),su=sessionStorage.getItem('user');
    if(st&&su){
        token=st; user=JSON.parse(su);
        $('userName').textContent=user.global_name||user.username;
        $('userId').textContent='ID: '+user.id;
        if(user.avatar)$('userAvatar').src=`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`;
        $('authBlock').classList.add('hidden'); $('mainBlock').classList.remove('hidden');
        loadGuilds();
    }
})();
