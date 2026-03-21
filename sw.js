const CACHE_VERSION = 'v2';
const CACHE_NAME = `discord-cloner-${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `discord-cloner-static-${CACHE_VERSION}`;
const API_CACHE_NAME = `discord-cloner-api-${CACHE_VERSION}`;

const STATIC_ASSETS = [
    '/',
    '/index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
            self.skipWaiting()
        ])
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(keys => {
                return Promise.all(
                    keys.filter(key => key !== STATIC_CACHE_NAME && key !== API_CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            }),
            clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    if (url.pathname === '/sw.js') {
        event.respondWith(fetch(event.request));
        return;
    }
    
    if (url.hostname === 'cdn.discordapp.com' || url.hostname === 'discord.com') {
        event.respondWith(networkFirst(event.request));
    } else {
        event.respondWith(cacheFirst(event.request));
    }
});

async function cacheFirst(request) {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch (error) {
        return new Response('Офлайн режим', { status: 503, statusText: 'Offline' });
    }
}

async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(API_CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cache = await caches.open(API_CACHE_NAME);
        const cached = await cache.match(request);
        return cached || new Response('Нет подключения к интернету', { status: 503 });
    }
}

let cloneInterval = null;
let activeCloneState = null;
let notificationPermissionGranted = false;

self.addEventListener('message', async event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'START_CLONE':
            await startBackgroundClone(data);
            break;
        case 'STOP_CLONE':
            await stopBackgroundClone();
            break;
        case 'GET_STATUS':
            sendStatus();
            break;
        case 'CHECK_NOTIFICATIONS':
            checkNotificationPermission();
            break;
    }
});

async function checkNotificationPermission() {
    if (Notification.permission === 'granted') {
        notificationPermissionGranted = true;
    } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        notificationPermissionGranted = permission === 'granted';
    }
}

async function startBackgroundClone(state) {
    await stopBackgroundClone();
    
    activeCloneState = {
        ...state,
        active: true,
        startTime: Date.now(),
        progress: 0,
        stage: 'cleaning',
        channelsDeleted: false,
        rolesDeleted: false,
        roleMap: null,
        channelsCreated: false,
        rolesCount: 0,
        channelsCount: 0,
        errors: []
    };
    
    await saveCloneState(activeCloneState);
    await saveToken(state.token);
    
    cloneInterval = setInterval(async () => {
        if (!activeCloneState || !activeCloneState.active) {
            await stopBackgroundClone();
            return;
        }
        
        try {
            const result = await processCloneStep(activeCloneState);
            activeCloneState = { ...activeCloneState, ...result };
            await saveCloneState(activeCloneState);
            
            await sendProgressUpdate();
            
            if (result.progress >= 100 || result.completed) {
                await completeClone();
            }
        } catch (error) {
            console.error('Background clone error:', error);
            activeCloneState.errors.push({ time: Date.now(), error: error.message });
            await saveCloneState(activeCloneState);
            
            if (activeCloneState.errors.length > 5) {
                await stopBackgroundClone();
                await sendErrorNotification(error.message);
            }
        }
    }, 3000);
}

async function stopBackgroundClone() {
    if (cloneInterval) {
        clearInterval(cloneInterval);
        cloneInterval = null;
    }
    
    if (activeCloneState) {
        activeCloneState.active = false;
        await saveCloneState(activeCloneState);
        activeCloneState = null;
    }
}

async function processCloneStep(state) {
    const token = await getToken();
    if (!token) throw new Error('Токен не найден');
    
    const result = { ...state };
    
    try {
        switch (state.stage) {
            case 'cleaning':
                if (!state.channelsDeleted) {
                    const deletedCount = await deleteAllChannels(state.targetId, token);
                    result.channelsDeleted = true;
                    result.progress = 20;
                    result.stage = 'cleaning_roles';
                    await sendNotification(`Удалено каналов: ${deletedCount}`);
                } else if (!state.rolesDeleted) {
                    const deletedCount = await deleteAllRoles(state.targetId, token);
                    result.rolesDeleted = true;
                    result.progress = 30;
                    result.stage = 'info';
                    await sendNotification(`Удалено ролей: ${deletedCount}`);
                }
                break;
                
            case 'cleaning_roles':
                if (!state.rolesDeleted) {
                    const deletedCount = await deleteAllRoles(state.targetId, token);
                    result.rolesDeleted = true;
                    result.progress = 30;
                    result.stage = 'info';
                    await sendNotification(`Удалено ролей: ${deletedCount}`);
                }
                break;
                
            case 'info':
                await updateGuildInfo(state.sourceId, state.targetId, token);
                const iconCopied = await copyGuildIcon(state.sourceId, state.targetId, token);
                result.stage = 'roles';
                result.progress = 40;
                if (iconCopied) await sendNotification('Иконка сервера скопирована');
                break;
                
            case 'roles':
                if (!state.roleMap) {
                    const { roleMap, count } = await createRoles(state.sourceId, state.targetId, token);
                    result.roleMap = roleMap;
                    result.rolesCount = count;
                    result.stage = 'channels';
                    result.progress = 60;
                    await sendNotification(`Создано ролей: ${count}`);
                }
                break;
                
            case 'channels':
                if (!state.channelsCreated) {
                    const count = await createChannels(state.sourceId, state.targetId, token, state.roleMap || {});
                    result.channelsCreated = true;
                    result.channelsCount = count;
                    result.progress = 100;
                    result.stage = 'complete';
                    result.completed = true;
                    await sendNotification(`Создано каналов: ${count}`);
                }
                break;
                
            case 'complete':
                result.completed = true;
                result.progress = 100;
                break;
        }
    } catch (error) {
        console.error('Step error:', error);
        result.errors = result.errors || [];
        result.errors.push({ time: Date.now(), error: error.message });
        throw error;
    }
    
    return result;
}

async function deleteAllChannels(guildId, token) {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
            headers: { 'Authorization': token }
        });
        if (!response.ok) return 0;
        
        const channels = await response.json();
        let deleted = 0;
        
        for (const channel of channels) {
            try {
                await fetch(`https://discord.com/api/v10/channels/${channel.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                });
                deleted++;
                await sleep(400);
            } catch (e) {
                console.error('Error deleting channel:', e);
            }
        }
        return deleted;
    } catch (e) {
        console.error('Error fetching channels:', e);
        return 0;
    }
}

async function deleteAllRoles(guildId, token) {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
            headers: { 'Authorization': token }
        });
        if (!response.ok) return 0;
        
        const roles = await response.json();
        let deleted = 0;
        
        const deletable = roles.filter(r => r.name !== '@everyone' && !r.managed)
            .sort((a, b) => b.position - a.position);
        
        for (const role of deletable) {
            try {
                await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles/${role.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                });
                deleted++;
                await sleep(400);
            } catch (e) {
                console.error('Error deleting role:', e);
            }
        }
        return deleted;
    } catch (e) {
        console.error('Error fetching roles:', e);
        return 0;
    }
}

async function copyGuildIcon(sourceId, targetId, token) {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${sourceId}`, {
            headers: { 'Authorization': token }
        });
        if (!response.ok) return false;
        
        const guild = await response.json();
        
        if (!guild.icon) return false;
        
        const iconUrl = `https://cdn.discordapp.com/icons/${sourceId}/${guild.icon}.png?size=256`;
        const iconResponse = await fetch(iconUrl);
        
        if (!iconResponse.ok) return false;
        
        const iconBlob = await iconResponse.blob();
        const reader = new FileReader();
        
        const iconData = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(iconBlob);
        });
        
        await fetch(`https://discord.com/api/v10/guilds/${targetId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ icon: iconData.split(',')[1] })
        });
        
        return true;
    } catch (e) {
        console.error('Error copying guild icon:', e);
        return false;
    }
}

async function createRoles(sourceId, targetId, token) {
    const roleMap = {};
    let count = 0;
    
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${sourceId}/roles`, {
            headers: { 'Authorization': token }
        });
        if (!response.ok) return { count, roleMap };
        
        const roles = await response.json();
        
        const sortedRoles = roles
            .filter(r => r.name !== '@everyone' && !r.managed)
            .sort((a, b) => b.position - a.position);
        
        for (const role of sortedRoles) {
            try {
                const create = await fetch(`https://discord.com/api/v10/guilds/${targetId}/roles`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: role.name,
                        color: role.color,
                        hoist: role.hoist || false,
                        mentionable: role.mentionable || false,
                        permissions: role.permissions?.toString() || '0'
                    })
                });
                
                if (create.ok) {
                    const newRole = await create.json();
                    roleMap[role.id] = newRole.id;
                    count++;
                }
                await sleep(600);
            } catch (e) {
                console.error('Error creating role:', e);
            }
        }
    } catch (e) {
        console.error('Error fetching source roles:', e);
    }
    
    return { count, roleMap };
}

function convertOverwrites(overwrites, targetGuildId, roleMap) {
    if (!overwrites || !Array.isArray(overwrites)) return [];
    
    return overwrites
        .map(ow => {
            if (!ow || !ow.id) return null;
            
            let id = ow.id;
            
            if (ow.type === 0) {
                if (roleMap && roleMap[ow.id]) {
                    id = roleMap[ow.id];
                } else {
                    return null;
                }
            } else if (ow.type === 1) {
                id = targetGuildId;
            }
            
            return {
                id: id,
                type: ow.type,
                allow: ow.allow?.toString() || '0',
                deny: ow.deny?.toString() || '0'
            };
        })
        .filter(ow => ow !== null);
}

async function createChannels(sourceId, targetId, token, roleMap) {
    const categoryMap = {};
    let count = 0;
    
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${sourceId}/channels`, {
            headers: { 'Authorization': token }
        });
        if (!response.ok) return count;
        
        const channels = await response.json();
        
        const categories = channels
            .filter(c => c.type === 4)
            .sort((a, b) => a.position - b.position);
        
        const others = channels
            .filter(c => c.type !== 4)
            .sort((a, b) => a.position - b.position);
        
        for (const cat of categories) {
            try {
                const create = await fetch(`https://discord.com/api/v10/guilds/${targetId}/channels`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: cat.name,
                        type: 4,
                        position: cat.position,
                        permission_overwrites: convertOverwrites(cat.permission_overwrites, targetId, roleMap)
                    })
                });
                
                if (create.ok) {
                    const newCat = await create.json();
                    categoryMap[cat.id] = newCat.id;
                    count++;
                }
                await sleep(600);
            } catch (e) {
                console.error('Error creating category:', e);
            }
        }
        
        for (const ch of others) {
            try {
                const chData = {
                    name: ch.name,
                    type: ch.type,
                    position: ch.position,
                    topic: ch.topic || '',
                    bitrate: ch.bitrate,
                    user_limit: ch.user_limit,
                    rate_limit_per_user: ch.rate_limit_per_user,
                    nsfw: ch.nsfw || false,
                    permission_overwrites: convertOverwrites(ch.permission_overwrites, targetId, roleMap)
                };
                
                if (ch.parent_id && categoryMap[ch.parent_id]) {
                    chData.parent_id = categoryMap[ch.parent_id];
                }
                
                const create = await fetch(`https://discord.com/api/v10/guilds/${targetId}/channels`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(chData)
                });
                
                if (create.ok) {
                    count++;
                }
                await sleep(500);
            } catch (e) {
                console.error('Error creating channel:', e);
            }
        }
    } catch (e) {
        console.error('Error fetching source channels:', e);
    }
    
    return count;
}

async function updateGuildInfo(sourceId, targetId, token) {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${sourceId}`, {
            headers: { 'Authorization': token }
        });
        if (!response.ok) return;
        
        const guild = await response.json();
        
        await fetch(`https://discord.com/api/v10/guilds/${targetId}`, {
            method: 'PATCH',
            headers: { 
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: guild.name })
        });
    } catch (e) {
        console.error('Error updating guild info:', e);
    }
}

async function saveCloneState(state) {
    try {
        const cache = await caches.open('clone-state');
        await cache.put('/clone-state', new Response(JSON.stringify(state), {
            headers: { 'Content-Type': 'application/json' }
        }));
    } catch (e) {
        console.error('Error saving clone state:', e);
    }
}

async function getCloneState() {
    try {
        const cache = await caches.open('clone-state');
        const response = await cache.match('/clone-state');
        if (response && response.ok) {
            return response.json();
        }
    } catch (e) {
        console.error('Error getting clone state:', e);
    }
    return null;
}

async function saveToken(token) {
    try {
        const cache = await caches.open('clone-data');
        await cache.put('/token', new Response(token, {
            headers: { 'Content-Type': 'text/plain' }
        }));
    } catch (e) {
        console.error('Error saving token:', e);
    }
}

async function getToken() {
    try {
        const cache = await caches.open('clone-data');
        const response = await cache.match('/token');
        if (response && response.ok) {
            return response.text();
        }
    } catch (e) {
        console.error('Error getting token:', e);
    }
    return null;
}

async function sendProgressUpdate() {
    const clients = await self.clients.matchAll();
    if (clients.length === 0) return;
    
    clients.forEach(client => {
        client.postMessage({
            type: 'CLONE_PROGRESS',
            progress: activeCloneState?.progress || 0,
            stage: activeCloneState?.stage || 'unknown',
            rolesCreated: activeCloneState?.rolesCount || 0,
            channelsCreated: activeCloneState?.channelsCount || 0,
            errors: activeCloneState?.errors || []
        });
    });
}

async function completeClone() {
    await stopBackgroundClone();
    
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
        clients.forEach(client => {
            client.postMessage({
                type: 'CLONE_COMPLETE',
                success: true,
                stats: {
                    roles: activeCloneState?.rolesCount || 0,
                    channels: activeCloneState?.channelsCount || 0,
                    duration: Date.now() - (activeCloneState?.startTime || Date.now())
                }
            });
        });
    }
    
    await sendNotification('✅ Клонирование завершено!', {
        body: `Создано ${activeCloneState?.rolesCount || 0} ролей и ${activeCloneState?.channelsCount || 0} каналов`,
        icon: '/icon-192.png'
    });
}

async function sendErrorNotification(errorMessage) {
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
        clients.forEach(client => {
            client.postMessage({
                type: 'CLONE_ERROR',
                error: errorMessage
            });
        });
    }
    
    await sendNotification('❌ Ошибка клонирования', {
        body: errorMessage,
        icon: '/icon-192.png'
    });
}

async function sendNotification(title, options = {}) {
    if (notificationPermissionGranted) {
        await self.registration.showNotification(title, {
            ...options,
            badge: '/icon-192.png',
            timestamp: Date.now()
        });
    }
}

async function sendStatus() {
    const clients = await self.clients.matchAll();
    if (clients.length === 0) return;
    
    clients.forEach(client => {
        client.postMessage({
            type: 'CLONE_STATUS',
            active: !!activeCloneState?.active,
            progress: activeCloneState?.progress || 0,
            stage: activeCloneState?.stage || 'idle'
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
