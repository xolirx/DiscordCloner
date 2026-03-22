class APIPool {
    constructor(max = 5) {
        this.max = max;
        this.queue = [];
        this.active = 0;
        this.cache = new Map();
    }

    async request(url, options = {}) {
        const cacheKey = `${options.method || 'GET'}:${url}`;
        const cached = this.getFromCache(cacheKey);
        if (cached && options.method !== 'POST' && options.method !== 'PATCH' && options.method !== 'DELETE') {
            return cached;
        }

        return new Promise((resolve, reject) => {
            this.queue.push({ url, options, resolve, reject, cacheKey });
            this.process();
        });
    }

    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < window.CONFIG.cacheTTL) {
            return cached.data;
        }
        return null;
    }

    setToCache(key, data) {
        this.cache.set(key, { data, timestamp: Date.now() });
        setTimeout(() => this.cache.delete(key), window.CONFIG.cacheTTL);
    }

    async process() {
        if (this.active >= this.max || this.queue.length === 0) return;
        this.active++;
        const { url, options, resolve, reject, cacheKey } = this.queue.shift();

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), window.CONFIG.requestTimeout);
            
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeout);
            
            if (options.method !== 'POST' && options.method !== 'PATCH' && options.method !== 'DELETE' && response.ok) {
                const cloned = response.clone();
                cloned.json().then(data => {
                    this.setToCache(cacheKey, data);
                }).catch(() => {});
            }
            
            resolve(response);
        } catch (error) {
            reject(error);
        } finally {
            this.active--;
            this.process();
        }
    }
}

window.API = {
    pool: new APIPool(window.CONFIG.maxConcurrent),

    getFullUrl(endpoint) {
        return `${window.CONFIG.apiBase}${endpoint}`;
    },

    async fetchWithRetry(url, options, maxRetries = window.CONFIG.retryAttempts) {
        let lastError;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                const res = await this.pool.request(url, options);
                
                if (res.status === 429) {
                    const wait = parseInt(res.headers.get('Retry-After')) || 2;
                    await window.Utils.sleep(wait * 1000);
                    continue;
                }
                
                if (res.status === 401) {
                    throw new Error('UNAUTHORIZED: Invalid token or token expired');
                }
                
                if (res.status === 403) {
                    throw new Error('FORBIDDEN: Insufficient permissions');
                }
                
                if (res.status === 404) {
                    throw new Error('NOT_FOUND: Resource not found');
                }
                
                if (res.status === 400) {
                    const text = await res.text();
                    throw new Error(`HTTP 400: ${text.substring(0, 200)}`);
                }
                
                if (!res.ok && i === maxRetries - 1) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                
                if (!res.ok) {
                    await window.Utils.sleep(window.CONFIG.rateLimitDelay * (i + 1));
                    continue;
                }
                
                return res;
            } catch (error) {
                lastError = error;
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout - check your internet connection');
                }
                if (error.message === 'UNAUTHORIZED: Invalid token or token expired') {
                    throw error;
                }
                if (error.message === 'FORBIDDEN: Insufficient permissions') {
                    throw error;
                }
                if (i < maxRetries - 1) {
                    await window.Utils.sleep(window.CONFIG.rateLimitDelay * (i + 1));
                }
            }
        }
        
        throw lastError || new Error('Max retries exceeded');
    },

    async getUser(token) {
        const res = await this.fetchWithRetry(
            this.getFullUrl('/users/@me'),
            { 
                headers: { 
                    'Authorization': token,
                    'Content-Type': 'application/json'
                } 
            }
        );
        return res.json();
    },

    async getUserGuilds(token) {
        const res = await this.fetchWithRetry(
            this.getFullUrl('/users/@me/guilds'),
            { headers: { 'Authorization': token } }
        );
        return res.json();
    },

    async getGuild(token, guildId) {
        const res = await this.fetchWithRetry(
            this.getFullUrl(`/guilds/${guildId}`),
            { headers: { 'Authorization': token } }
        );
        return res.json();
    },

    async getGuildChannels(token, guildId) {
        const res = await this.fetchWithRetry(
            this.getFullUrl(`/guilds/${guildId}/channels`),
            { headers: { 'Authorization': token } }
        );
        return res.json();
    },

    async getGuildRoles(token, guildId) {
        const res = await this.fetchWithRetry(
            this.getFullUrl(`/guilds/${guildId}/roles`),
            { headers: { 'Authorization': token } }
        );
        return res.json();
    },

    async deleteChannel(token, channelId) {
        await this.fetchWithRetry(
            this.getFullUrl(`/channels/${channelId}`),
            { method: 'DELETE', headers: { 'Authorization': token } }
        );
    },

    async deleteRole(token, guildId, roleId) {
        await this.fetchWithRetry(
            this.getFullUrl(`/guilds/${guildId}/roles/${roleId}`),
            { method: 'DELETE', headers: { 'Authorization': token } }
        );
    },

    async updateGuild(token, guildId, data) {
        const res = await this.fetchWithRetry(
            this.getFullUrl(`/guilds/${guildId}`),
            {
                method: 'PATCH',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
        );
        return res.json();
    },

    async createRole(token, guildId, data) {
        const res = await this.fetchWithRetry(
            this.getFullUrl(`/guilds/${guildId}/roles`),
            {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
        );
        return res.json();
    },

    async createChannel(token, guildId, data) {
        const res = await this.fetchWithRetry(
            this.getFullUrl(`/guilds/${guildId}/channels`),
            {
                method: 'POST',
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }
        );
        return res.json();
    },

    async checkPermissions(token, guildId) {
        try {
            const guilds = await this.getUserGuilds(token);
            const guild = guilds.find(g => g.id === guildId);
            if (!guild) return false;
            return (BigInt(guild.permissions) & 0x8n) !== 0n;
        } catch (error) {
            return false;
        }
    },

    async fetchIcon(token, guildId, iconHash) {
        try {
            const url = `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png?size=256`;
            const res = await fetch(url);
            if (!res.ok) return null;
            const blob = await res.blob();
            if (blob.size > 256 * 1024) return null;
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            return null;
        }
    },

    async validateToken(token) {
        try {
            const res = await this.fetchWithRetry(
                this.getFullUrl('/users/@me'),
                { 
                    headers: { 'Authorization': token },
                    method: 'GET'
                },
                1
            );
            if (res.ok) {
                const user = await res.json();
                return { valid: true, user };
            }
            return { valid: false, error: `HTTP ${res.status}` };
        } catch (error) {
            let errorMessage = 'Invalid token';
            if (error.message.includes('UNAUTHORIZED')) {
                errorMessage = 'Invalid token - please check your Discord token';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Connection timeout - check your internet';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error - check your connection';
            }
            return { valid: false, error: errorMessage };
        }
    }
};
