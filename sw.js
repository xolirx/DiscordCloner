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
            if (clients.length > 0) {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'CLONE_PROGRESS',
                        progress: result.progress,
                        stage: result.stage
                    });
                });
            }
            
            if (result.progress >= 100) {
                stopBackgroundClone();
                const clients = await self.clients.matchAll();
                if (clients.length > 0) {
                    clients.forEach(client => {
                        client.postMessage({ type: 'CLONE_COMPLETE' });
                    });
                }
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
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
            headers: { 'Authorization': token }
        });
        if (!response.ok) return;
        
        const channels = await response.json();
        
        for (const channel of channels) {
            try {
                await fetch(`https://discord.com/api/v10/channels/${channel.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                });
                await sleep(300);
            } catch (e) {
                console.error('Error deleting channel:', e);
            }
        }
    } catch (e) {
        console.error('Error fetching channels:', e);
    }
}

async function deleteAllRoles(guildId, token) {
    try {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
            headers: { 'Authorization': token }
        });
        if (!response.ok) return;
        
        const roles = await response.json();
        
        for (const role of roles) {
            if (role.name === '@everyone' || role.managed) continue;
            try {
                await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles/${role.id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': token }
                });
                await sleep(300);
            } catch (e) {
                console.error('Error deleting role:', e);
            }
        }
    } catch (e) {
        console.error('Error fetching roles:', e);
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
                await sleep(500);
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
                await sleep(500);
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

function sendStatus() {
    self.clients.matchAll().then(clients => {
        if (clients.length > 0) {
            clients.forEach(client => {
                client.postMessage({ type: 'CLONE_ACTIVE' });
            });
        }
    }).catch(e => console.error('Error sending status:', e));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
