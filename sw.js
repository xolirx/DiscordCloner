self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

let cloneInterval = null;

self.addEventListener('message', event => {
    if (event.data.type === 'START_CLONE') {
        startBackgroundClone(event.data.state);
    } else if (event.data.type === 'STOP_CLONE') {
        stopBackgroundClone();
    } else if (event.data.type === 'GET_STATUS') {
        sendStatus();
    }
});

function startBackgroundClone(state) {
    stopBackgroundClone();
    
    cloneInterval = setInterval(async () => {
        try {
            const savedState = await getCloneState();
            if (!savedState || !savedState.active) {
                stopBackgroundClone();
                return;
            }
            
            const result = await processCloneStep(savedState);
            
            await saveCloneState(result);
            
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'CLONE_PROGRESS',
                    progress: result.progress,
                    stage: result.stage
                });
            });
            
            if (result.progress >= 100) {
                stopBackgroundClone();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'CLONE_COMPLETE'
                    });
                });
            }
        } catch (error) {
            console.error('Background clone error:', error);
        }
    }, 5000);
}

function stopBackgroundClone() {
    if (cloneInterval) {
        clearInterval(cloneInterval);
        cloneInterval = null;
    }
}

async function processCloneStep(state) {
    const token = await getToken();
    if (!token) return state;
    
    try {
        switch (state.stage) {
            case 'cleaning':
                if (!state.channelsDeleted) {
                    await deleteAllChannels(state.targetId, token);
                    state.channelsDeleted = true;
                    state.progress = 20;
                } else if (!state.rolesDeleted) {
                    await deleteAllRoles(state.targetId, token);
                    state.rolesDeleted = true;
                    state.stage = 'info';
                    state.progress = 30;
                }
                break;
                
            case 'info':
                await updateGuildInfo(state.sourceId, state.targetId, token);
                state.stage = 'roles';
                state.progress = 40;
                break;
                
            case 'roles':
                if (!state.roleMap) {
                    const result = await createRoles(state.sourceId, state.targetId, token);
                    state.roleMap = result.roleMap;
                    state.rolesCount = result.count;
                    state.stage = 'channels';
                    state.progress = 60;
                }
                break;
                
            case 'channels':
                if (!state.channelsCreated) {
                    const count = await createChannels(state.sourceId, state.targetId, token, state.roleMap || {});
                    state.channelsCreated = true;
                    state.channelsCount = count;
                    state.progress = 100;
                }
                break;
        }
    } catch (error) {
        console.error('Step error:', error);
        state.error = error.message;
    }
    
    return state;
}

async function deleteAllChannels(guildId, token) {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
        headers: { 'Authorization': token }
    });
    const channels = await response.json();
    
    for (const channel of channels) {
        await fetch(`https://discord.com/api/v10/channels/${channel.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        await sleep(200);
    }
}

async function deleteAllRoles(guildId, token) {
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
        headers: { 'Authorization': token }
    });
    const roles = await response.json();
    
    for (const role of roles) {
        if (role.name === '@everyone' || role.managed) continue;
        await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles/${role.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': token }
        });
        await sleep(200);
    }
}

async function createRoles(sourceId, targetId, token) {
    const response = await fetch(`https://discord.com/api/v10/guilds/${sourceId}/roles`, {
        headers: { 'Authorization': token }
    });
    const roles = await response.json();
    let count = 0;
    const roleMap = {};
    
    const sortedRoles = roles
        .filter(r => r.name !== '@everyone' && !r.managed)
        .sort((a, b) => b.position - a.position);
    
    for (const role of sortedRoles) {
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
        await sleep(300);
    }
    
    return { count, roleMap };
}

function convertOverwrites(overwrites, targetGuildId, roleMap) {
    if (!overwrites) return [];
    
    return overwrites.map(ow => {
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
    }).filter(ow => ow !== null);
}

async function createChannels(sourceId, targetId, token, roleMap) {
    const response = await fetch(`https://discord.com/api/v10/guilds/${sourceId}/channels`, {
        headers: { 'Authorization': token }
    });
    const channels = await response.json();
    const categories = channels.filter(c => c.type === 4).sort((a, b) => a.position - b.position);
    const others = channels.filter(c => c.type !== 4).sort((a, b) => a.position - b.position);
    const categoryMap = {};
    let count = 0;
    
    for (const cat of categories) {
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
        await sleep(300);
    }
    
    for (const ch of others) {
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
        await sleep(300);
    }
    
    return count;
}

async function updateGuildInfo(sourceId, targetId, token) {
    const response = await fetch(`https://discord.com/api/v10/guilds/${sourceId}`, {
        headers: { 'Authorization': token }
    });
    const guild = await response.json();
    
    await fetch(`https://discord.com/api/v10/guilds/${targetId}`, {
        method: 'PATCH',
        headers: { 
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: guild.name })
    });
}

async function saveCloneState(state) {
    const cache = await caches.open('clone-state');
    await cache.put('/clone-state', new Response(JSON.stringify(state)));
}

async function getCloneState() {
    const cache = await caches.open('clone-state');
    const response = await cache.match('/clone-state');
    if (response) {
        return response.json();
    }
    return null;
}

async function getToken() {
    const cache = await caches.open('clone-data');
    const response = await cache.match('/token');
    if (response) {
        return response.text();
    }
    return null;
}

function sendStatus() {
    if (cloneInterval) {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'CLONE_ACTIVE'
                });
            });
        });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
