window.Cloner = {
    state: {
        active: false,
        cancelled: false,
        sourceId: null,
        targetId: null,
        token: null,
        roleMap: {},
        categoryMap: {},
        stats: {
            rolesCreated: 0,
            channelsCreated: 0,
            categoriesCreated: 0
        }
    },

    async start(sourceId, targetId, token, options) {
        if (this.state.active) {
            window.UI.addLog('Клонирование уже выполняется', 'warning');
            return false;
        }

        this.state = {
            active: true,
            cancelled: false,
            sourceId,
            targetId,
            token,
            roleMap: {},
            categoryMap: {},
            stats: { rolesCreated: 0, channelsCreated: 0, categoriesCreated: 0 },
            options
        };

        window.UI.elements.cloneBtn.disabled = true;
        window.UI.elements.cancelCloneBtn.disabled = false;
        window.UI.elements.backgroundStatus.classList.add('show');
        window.UI.elements.progressDetails.style.display = 'block';

        try {
            await this.validatePermissions();
            await this.cleanTarget();
            await this.copyGuildInfo();
            if (options.cloneRoles) await this.copyRoles();
            if (options.cloneChannels) await this.copyChannels();
            await this.finalize();
            return true;
        } catch (error) {
            if (error.message === 'CANCELLED') {
                window.UI.addLog('Клонирование отменено', 'warning');
            } else {
                window.UI.addLog(`Ошибка: ${error.message}`, 'error');
                window.UI.showError(window.UI.elements.cloneError, error.message);
            }
            return false;
        } finally {
            this.state.active = false;
            window.UI.elements.cloneBtn.disabled = false;
            window.UI.elements.cancelCloneBtn.disabled = true;
            window.UI.elements.backgroundStatus.classList.remove('show');
            setTimeout(() => {
                if (window.UI.elements.progressDetails) {
                    window.UI.elements.progressDetails.style.display = 'none';
                }
            }, 3000);
        }
    },

    cancel() {
        if (this.state.active) {
            this.state.cancelled = true;
            window.UI.addLog('Отмена клонирования...', 'warning');
        }
    },

    async validatePermissions() {
        if (this.state.cancelled) throw new Error('CANCELLED');
        
        window.UI.updateProgress(5, 'ПРОВЕРКА ПРАВ ДОСТУПА', 0, 0, 0, 0);
        
        const hasSourcePerms = await window.API.checkPermissions(this.state.token, this.state.sourceId);
        const hasTargetPerms = await window.API.checkPermissions(this.state.token, this.state.targetId);
        
        if (!hasSourcePerms) {
            throw new Error('Нет прав администратора на исходном сервере');
        }
        if (!hasTargetPerms) {
            throw new Error('Нет прав администратора на целевом сервере');
        }
        
        window.UI.addLog('Права администратора подтверждены', 'success');
    },

    async cleanTarget() {
        if (this.state.cancelled) throw new Error('CANCELLED');
        
        window.UI.updateProgress(10, 'ОЧИСТКА КАНАЛОВ', 0, 0, 0, 0);
        
        const channels = await window.API.getGuildChannels(this.state.token, this.state.targetId);
        for (let i = 0; i < channels.length; i++) {
            if (this.state.cancelled) throw new Error('CANCELLED');
            try {
                await window.API.deleteChannel(this.state.token, channels[i].id);
                window.UI.addLog(`Удален канал: ${channels[i].name}`, 'warning');
            } catch (e) {
                window.UI.addLog(`Не удалось удалить канал: ${channels[i].name}`, 'error');
            }
            await window.Utils.sleep(300);
            window.UI.updateProgress(10 + (i / channels.length) * 10, 'ОЧИСТКА КАНАЛОВ', 0, 0, 0, 0);
        }
        
        window.UI.updateProgress(20, 'ОЧИСТКА РОЛЕЙ', 0, 0, 0, 0);
        
        const roles = await window.API.getGuildRoles(this.state.token, this.state.targetId);
        const deletable = roles.filter(r => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
        
        for (let i = 0; i < deletable.length; i++) {
            if (this.state.cancelled) throw new Error('CANCELLED');
            try {
                await window.API.deleteRole(this.state.token, this.state.targetId, deletable[i].id);
                window.UI.addLog(`Удалена роль: ${deletable[i].name}`, 'warning');
            } catch (e) {
                window.UI.addLog(`Не удалось удалить роль: ${deletable[i].name}`, 'error');
            }
            await window.Utils.sleep(300);
            window.UI.updateProgress(20 + (i / deletable.length) * 10, 'ОЧИСТКА РОЛЕЙ', 0, 0, 0, 0);
        }
        
        window.UI.updateProgress(30, 'ОЧИСТКА ЗАВЕРШЕНА', 0, 0, 0, 0);
    },

    async copyGuildInfo() {
        if (this.state.cancelled) throw new Error('CANCELLED');
        
        window.UI.updateProgress(35, 'КОПИРОВАНИЕ ИНФОРМАЦИИ СЕРВЕРА', 0, 0, 0, 0);
        
        const sourceGuild = await window.API.getGuild(this.state.token, this.state.sourceId);
        await window.API.updateGuild(this.state.token, this.state.targetId, { name: sourceGuild.name });
        window.UI.addLog(`Название скопировано: ${sourceGuild.name}`, 'success');
        
        if (this.state.options.cloneIcon && sourceGuild.icon) {
            const iconData = await window.API.fetchIcon(this.state.token, this.state.sourceId, sourceGuild.icon);
            if (iconData) {
                const base64 = iconData.split(',')[1];
                await window.API.updateGuild(this.state.token, this.state.targetId, { icon: base64 });
                window.UI.addLog('Иконка скопирована', 'success');
            } else {
                window.UI.addLog('Не удалось скопировать иконку', 'warning');
            }
        }
        
        window.UI.updateProgress(40, 'ИНФОРМАЦИЯ СКОПИРОВАНА', 0, 0, 0, 0);
    },

    async copyRoles() {
        if (this.state.cancelled) throw new Error('CANCELLED');
        
        window.UI.updateProgress(45, 'ПОЛУЧЕНИЕ СПИСКА РОЛЕЙ', 0, 0, 0, 0);
        
        const sourceRoles = await window.API.getGuildRoles(this.state.token, this.state.sourceId);
        const rolesToCreate = sourceRoles
            .filter(r => r.name !== '@everyone' && !r.managed)
            .sort((a, b) => b.position - a.position);
        
        const total = rolesToCreate.length;
        window.UI.updateProgress(50, 'СОЗДАНИЕ РОЛЕЙ', 0, 0, total, 0);
        
        for (let i = 0; i < total; i++) {
            if (this.state.cancelled) throw new Error('CANCELLED');
            
            const role = rolesToCreate[i];
            try {
                const newRole = await window.API.createRole(this.state.token, this.state.targetId, {
                    name: window.Utils.truncate(role.name, 100),
                    color: role.color || 0,
                    hoist: role.hoist || false,
                    mentionable: role.mentionable || false,
                    permissions: role.permissions?.toString() || '0'
                });
                this.state.roleMap[role.id] = newRole.id;
                this.state.stats.rolesCreated++;
                window.UI.addLog(`Создана роль: ${role.name}`, 'success');
            } catch (e) {
                window.UI.addLog(`Ошибка создания роли ${role.name}: ${e.message}`, 'error');
            }
            
            await window.Utils.sleep(400);
            const progress = (i + 1) / total;
            window.UI.updateProgress(
                50 + progress * 20,
                `СОЗДАНИЕ РОЛЕЙ ${Math.floor(progress * 100)}%`,
                progress * 100,
                0,
                total,
                0
            );
        }
        
        window.UI.updateProgress(70, 'РОЛИ СОЗДАНЫ', 100, 0, total, 0);
        window.UI.addLog(`Создано ролей: ${this.state.stats.rolesCreated}`, 'success');
    },

    convertOverwrites(overwrites) {
        if (!overwrites || !Array.isArray(overwrites)) return [];
        
        return overwrites
            .map(ow => {
                if (!ow || !ow.id) return null;
                
                let id = ow.id;
                if (ow.type === 0) {
                    if (this.state.roleMap[ow.id]) {
                        id = this.state.roleMap[ow.id];
                    } else {
                        return null;
                    }
                } else if (ow.type === 1) {
                    id = this.state.targetId;
                }
                
                return {
                    id: id,
                    type: ow.type,
                    allow: ow.allow?.toString() || '0',
                    deny: ow.deny?.toString() || '0'
                };
            })
            .filter(ow => ow !== null);
    },

    async copyChannels() {
        if (this.state.cancelled) throw new Error('CANCELLED');
        
        window.UI.updateProgress(75, 'ПОЛУЧЕНИЕ СПИСКА КАНАЛОВ', 0, 0, 0, 0);
        
        const sourceChannels = await window.API.getGuildChannels(this.state.token, this.state.sourceId);
        const categories = sourceChannels.filter(c => c.type === 4).sort((a, b) => a.position - b.position);
        const others = sourceChannels.filter(c => c.type !== 4).sort((a, b) => a.position - b.position);
        
        const total = categories.length + others.length;
        let processed = 0;
        
        window.UI.updateProgress(80, 'СОЗДАНИЕ КАТЕГОРИЙ', 0, 0, 0, total);
        
        for (const cat of categories) {
            if (this.state.cancelled) throw new Error('CANCELLED');
            
            try {
                const newCat = await window.API.createChannel(this.state.token, this.state.targetId, {
                    name: window.Utils.truncate(cat.name, 100),
                    type: 4,
                    position: cat.position,
                    permission_overwrites: this.convertOverwrites(cat.permission_overwrites)
                });
                this.state.categoryMap[cat.id] = newCat.id;
                this.state.stats.categoriesCreated++;
                window.UI.addLog(`Создана категория: ${cat.name}`, 'success');
            } catch (e) {
                window.UI.addLog(`Ошибка создания категории ${cat.name}: ${e.message}`, 'error');
            }
            
            processed++;
            const progress = processed / total;
            window.UI.updateProgress(
                80 + progress * 10,
                `СОЗДАНИЕ КАТЕГОРИЙ ${Math.floor(progress * 100)}%`,
                0,
                progress * 100,
                0,
                total
            );
            await window.Utils.sleep(400);
        }
        
        window.UI.updateProgress(85, 'СОЗДАНИЕ КАНАЛОВ', 0, 0, 0, total);
        
        for (const ch of others) {
            if (this.state.cancelled) throw new Error('CANCELLED');
            
            try {
                const channelData = {
                    name: window.Utils.truncate(ch.name, 100),
                    type: ch.type,
                    position: ch.position,
                    permission_overwrites: this.convertOverwrites(ch.permission_overwrites)
                };
                
                if (ch.type === 0 || ch.type === 5) {
                    if (ch.topic) channelData.topic = window.Utils.truncate(ch.topic, 1024);
                    if (ch.rate_limit_per_user) channelData.rate_limit_per_user = Math.min(ch.rate_limit_per_user, 21600);
                    if (ch.nsfw) channelData.nsfw = ch.nsfw;
                }
                
                if (ch.type === 2) {
                    if (ch.bitrate) channelData.bitrate = Math.min(ch.bitrate, 384000);
                    if (ch.user_limit) channelData.user_limit = Math.min(ch.user_limit, 99);
                }
                
                if (ch.parent_id && this.state.categoryMap[ch.parent_id]) {
                    channelData.parent_id = this.state.categoryMap[ch.parent_id];
                }
                
                await window.API.createChannel(this.state.token, this.state.targetId, channelData);
                this.state.stats.channelsCreated++;
                window.UI.addLog(`Создан канал: ${ch.name}`, 'success');
            } catch (e) {
                window.UI.addLog(`Ошибка создания канала ${ch.name}: ${e.message}`, 'error');
            }
            
            processed++;
            const progress = processed / total;
            window.UI.updateProgress(
                85 + progress * 15,
                `СОЗДАНИЕ КАНАЛОВ ${Math.floor(progress * 100)}%`,
                0,
                progress * 100,
                0,
                total
            );
            await window.Utils.sleep(400);
        }
        
        window.UI.updateProgress(100, 'КАНАЛЫ СОЗДАНЫ', 0, 100, 0, total);
        window.UI.addLog(`Создано каналов: ${this.state.stats.channelsCreated}`, 'success');
    },

    async finalize() {
        window.UI.updateProgress(100, 'ЗАВЕРШЕНИЕ', 0, 0, 0, 0);
        window.UI.addLog('Клонирование успешно завершено!', 'success');
        window.UI.addLog(
            `Итог: ${this.state.stats.rolesCreated} ролей, ${this.state.stats.channelsCreated} каналов, ${this.state.stats.categoriesCreated} категорий`,
            'success'
        );
        window.UI.createConfetti();
        window.UI.showToast('Клонирование завершено!');
    }
};
