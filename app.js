(function() {
    let inactivityTimer = null;
    let currentUser = null;
    let userGuilds = [];

    function resetInactivityTimer() {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            if (window.state?.token) {
                window.UI.addLog('Автоматический выход по бездействию', 'warning');
                logout();
            }
        }, 30 * 60 * 1000);
    }

    async function loadServers() {
        if (!window.state?.token) return [];
        try {
            const guilds = await window.API.getUserGuilds(window.state.token);
            userGuilds = guilds.sort((a, b) => a.name.localeCompare(b.name));
            window.UI.addLog(`Загружено серверов: ${userGuilds.length}`, 'success');
            return userGuilds;
        } catch (e) {
            window.UI.addLog('Ошибка загрузки серверов', 'error');
            return [];
        }
    }

    async function showPreview() {
        const sourceId = window.UI.elements.sourceId.value.trim();
        const targetId = window.UI.elements.targetId.value.trim();
        
        if (!window.Utils.validateGuildId(sourceId)) {
            window.UI.showError(window.UI.elements.cloneError, 'Неверный формат ID исходного сервера');
            return false;
        }
        
        if (!window.Utils.validateGuildId(targetId)) {
            window.UI.showError(window.UI.elements.cloneError, 'Неверный формат ID целевого сервера');
            return false;
        }
        
        if (sourceId === targetId) {
            window.UI.showError(window.UI.elements.cloneError, 'Серверы не могут быть одинаковыми');
            return false;
        }
        
        try {
            window.UI.updateProgress(0, 'ПОЛУЧЕНИЕ ДАННЫХ...', 0, 0, 0, 0);
            const [sourceGuild, targetGuild, sourceRoles, sourceChannels] = await Promise.all([
                window.API.getGuild(window.state.token, sourceId),
                window.API.getGuild(window.state.token, targetId),
                window.API.getGuildRoles(window.state.token, sourceId),
                window.API.getGuildChannels(window.state.token, sourceId)
            ]);
            
            const rolesCount = sourceRoles.filter(r => r.name !== '@everyone' && !r.managed).length;
            const channelsCount = sourceChannels.length;
            
            window.UI.showPreviewModal(sourceGuild, targetGuild, rolesCount, channelsCount);
            return true;
        } catch (error) {
            window.UI.addLog(`Ошибка загрузки данных: ${error.message}`, 'error');
            window.UI.showError(window.UI.elements.cloneError, 'Не удалось загрузить данные серверов');
            return false;
        }
    }

    async function startCloneAfterPreview() {
        window.UI.closePreviewModal();
        
        const sourceId = window.UI.elements.sourceId.value.trim();
        const targetId = window.UI.elements.targetId.value.trim();
        const options = window.UI.getCloneOptions();
        
        const success = await window.Cloner.start(sourceId, targetId, window.state.token, options);
        
        if (success) {
            sessionStorage.setItem('last_source_id', sourceId);
            sessionStorage.setItem('last_target_id', targetId);
        }
    }

    async function validateServers() {
        const sourceId = window.UI.elements.sourceId.value.trim();
        const targetId = window.UI.elements.targetId.value.trim();
        
        if (!sourceId || !targetId) {
            window.UI.elements.serverValidationResult.style.display = 'flex';
            window.UI.elements.serverValidationResult.style.color = '#ff5555';
            window.UI.elements.serverValidationResult.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ВВЕДИТЕ ID';
            setTimeout(() => window.UI.elements.serverValidationResult.style.display = 'none', 3000);
            return;
        }
        
        if (!window.Utils.validateGuildId(sourceId) || !window.Utils.validateGuildId(targetId)) {
            window.UI.elements.serverValidationResult.style.display = 'flex';
            window.UI.elements.serverValidationResult.style.color = '#ff5555';
            window.UI.elements.serverValidationResult.innerHTML = '<i class="fas fa-exclamation-triangle"></i> НЕВЕРНЫЙ ФОРМАТ ID';
            setTimeout(() => window.UI.elements.serverValidationResult.style.display = 'none', 3000);
            return;
        }
        
        window.UI.elements.serverValidationResult.style.display = 'flex';
        window.UI.elements.serverValidationResult.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> ПРОВЕРКА...';
        
        try {
            const [src, tgt] = await Promise.all([
                window.API.getGuild(window.state.token, sourceId),
                window.API.getGuild(window.state.token, targetId)
            ]);
            
            window.UI.elements.serverValidationResult.style.color = '#88ff88';
            window.UI.elements.serverValidationResult.innerHTML = `<i class="fas fa-check-circle"></i> ${window.Utils.escapeHtml(src.name)} → ${window.Utils.escapeHtml(tgt.name)}`;
            if (sourceId === targetId) {
                window.UI.elements.serverValidationResult.innerHTML += ' <i class="fas fa-exclamation-triangle"></i> ОДИНАКОВЫЕ';
            }
            setTimeout(() => window.UI.elements.serverValidationResult.style.display = 'none', 5000);
        } catch (error) {
            window.UI.elements.serverValidationResult.style.color = '#ff5555';
            window.UI.elements.serverValidationResult.innerHTML = '<i class="fas fa-exclamation-circle"></i> СЕРВЕР НЕ НАЙДЕН';
            setTimeout(() => window.UI.elements.serverValidationResult.style.display = 'none', 5000);
        }
    }

    function showServerList(targetField) {
        if (userGuilds.length === 0) {
            loadServers().then(() => {
                window.UI.showServerList(userGuilds, targetField);
            });
        } else {
            window.UI.showServerList(userGuilds, targetField);
        }
    }

    async function testToken() {
        const token = window.UI.elements.tokenInput.value.trim();
        if (!token) {
            window.UI.showError(window.UI.elements.authError, 'ВВЕДИТЕ ТОКЕН');
            return;
        }
        
        window.UI.elements.testTokenBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span>';
        window.UI.elements.testTokenBtn.disabled = true;
        
        try {
            const user = await window.API.getUser(token);
            window.UI.showToast(`✓ ТОКЕН РАБОЧИЙ (${user.username})`);
            const warn = document.getElementById('tokenWarning');
            if (warn) {
                warn.style.display = 'flex';
                setTimeout(() => warn.style.display = 'none', 3000);
            }
        } catch (error) {
            window.UI.showError(window.UI.elements.authError, 'НЕВЕРНЫЙ ТОКЕН');
        } finally {
            window.UI.elements.testTokenBtn.innerHTML = '<i class="fas fa-check-circle"></i> ПРОВЕРИТЬ ТОКЕН';
            window.UI.elements.testTokenBtn.disabled = false;
        }
    }

    async function authorize() {
        const token = window.UI.elements.tokenInput.value.trim();
        if (!token) {
            window.UI.showError(window.UI.elements.authError, 'ВВЕДИТЕ ТОКЕН');
            return;
        }
        
        window.UI.elements.loginBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span>';
        window.UI.elements.loginBtn.disabled = true;
        
        try {
            const user = await window.API.getUser(token);
            
            window.state = { token, user };
            currentUser = user;
            
            sessionStorage.setItem('discord_token', token);
            sessionStorage.setItem('discord_user', JSON.stringify(user));
            
            window.UI.updateUserProfile(user);
            window.UI.elements.authView.classList.add('hidden');
            window.UI.elements.mainView.classList.remove('hidden');
            window.UI.addLog(`Авторизация: ${user.username}`, 'success');
            
            await loadServers();
            
            const lastSource = sessionStorage.getItem('last_source_id');
            const lastTarget = sessionStorage.getItem('last_target_id');
            if (lastSource) window.UI.elements.sourceId.value = lastSource;
            if (lastTarget) window.UI.elements.targetId.value = lastTarget;
            
            resetInactivityTimer();
        } catch (error) {
            window.UI.showError(window.UI.elements.authError, 'НЕВЕРНЫЙ ТОКЕН');
        } finally {
            window.UI.elements.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> ВОЙТИ';
            window.UI.elements.loginBtn.disabled = false;
        }
    }

    function logout() {
        window.state = null;
        currentUser = null;
        userGuilds = [];
        sessionStorage.clear();
        window.UI.elements.authView.classList.remove('hidden');
        window.UI.elements.mainView.classList.add('hidden');
        window.UI.addLog('Выход', 'info');
    }

    function toggleEmail() {
        if (!window.state?.user) return;
        const emailVisible = !window._emailVisible;
        window._emailVisible = emailVisible;
        window.UI.toggleEmail(window.state.user, emailVisible);
    }

    function setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                const section = link.dataset.section;
                
                window.UI.elements.mainContent.classList.add('hidden');
                window.UI.elements.updatesContent.classList.add('hidden');
                window.UI.elements.supportContent.classList.add('hidden');
                window.UI.elements.aboutContent.classList.add('hidden');
                
                if (section === 'main') {
                    window.UI.elements.mainContent.classList.remove('hidden');
                } else if (section === 'updates') {
                    window.UI.elements.updatesContent.classList.remove('hidden');
                } else if (section === 'support') {
                    window.UI.elements.supportContent.classList.remove('hidden');
                } else if (section === 'about') {
                    window.UI.elements.aboutContent.classList.remove('hidden');
                }
            });
        });
    }

    function setupEventListeners() {
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter' && window.state?.token && !window.Cloner.state.active) {
                showPreview();
            }
            if (e.key === 'Escape') {
                window.UI.closeModal();
                window.UI.closePreviewModal();
            }
        });
        
        window.UI.elements.rule1?.addEventListener('change', () => window.UI.checkAllRules());
        window.UI.elements.rule2?.addEventListener('change', () => window.UI.checkAllRules());
        window.UI.elements.rule3?.addEventListener('change', () => window.UI.checkAllRules());
        
        window.addEventListener('beforeunload', (e) => {
            if (window.Cloner.state.active && !window.Cloner.state.cancelled) {
                e.preventDefault();
                e.returnValue = 'Клонирование выполняется!';
                return e.returnValue;
            }
        });
    }

    function init() {
        window.UI.init();
        
        window.toggleTokenVisibility = () => window.UI.toggleTokenVisibility();
        window.toggleInstructions = () => window.UI.toggleInstructions();
        window.toggleTheme = () => window.UI.toggleTheme();
        window.toggleEmail = toggleEmail;
        window.testToken = testToken;
        window.authorize = authorize;
        window.logout = logout;
        window.showServerList = showServerList;
        window.validateServers = validateServers;
        window.showAgreement = () => window.UI.showAgreement();
        window.closeModal = () => window.UI.closeModal();
        window.confirmAllRules = () => {
            if (window.UI.elements.rule1.checked && window.UI.elements.rule2.checked && window.UI.elements.rule3.checked) {
                window.UI.closeModal();
                showPreview();
            }
        };
        window.cancelCloning = () => window.Cloner.cancel();
        window.clearLogs = () => window.UI.clearLogs();
        window.exportLogs = () => window.UI.exportLogs();
        window.closePreviewModal = () => window.UI.closePreviewModal();
        window.startCloneAfterPreview = startCloneAfterPreview;
        
        window.UI.loadTheme();
        setupNavigation();
        setupEventListeners();
        
        setTimeout(() => {
            if (window.UI.elements.loadingOverlay) {
                window.UI.elements.loadingOverlay.classList.add('fade-out');
            }
        }, 1200);
        
        window.UI.initSnow();
        window.UI.initDynamicBackground();
        
        document.querySelectorAll('.btn').forEach(btn => window.UI.addRippleEffect(btn));
        
        const savedToken = sessionStorage.getItem('discord_token');
        const savedUser = sessionStorage.getItem('discord_user');
        
        if (savedToken && savedUser) {
            try {
                const user = JSON.parse(savedUser);
                window.state = { token: savedToken, user };
                currentUser = user;
                window.UI.updateUserProfile(user);
                window.UI.elements.authView.classList.add('hidden');
                window.UI.elements.mainView.classList.remove('hidden');
                window.UI.addLog('Сессия восстановлена', 'success');
                loadServers();
                resetInactivityTimer();
            } catch (e) {
                console.error('Session restore error:', e);
            }
        }
        
        window.UI.addLog('DISCORD SERVER CLONER PRO by xolirx', 'info');
        window.UI.addLog('Версия 3.0 - Модульная архитектура с CORS прокси', 'success');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
