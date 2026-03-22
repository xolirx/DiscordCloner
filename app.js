async function testToken() {
    const token = window.UI.elements.tokenInput.value.trim();
    if (!token) {
        window.UI.showError(window.UI.elements.authError, 'ВВЕДИТЕ ТОКЕН');
        return;
    }
    
    window.UI.elements.testTokenBtn.innerHTML = '<span class="spinner" style="width:16px;height:16px;"></span>';
    window.UI.elements.testTokenBtn.disabled = true;
    
    try {
        window.UI.addLog('Проверка токена...', 'info');
        
        const result = await window.API.validateToken(token);
        
        if (result.valid) {
            window.UI.showToast(`✓ ТОКЕН РАБОЧИЙ (${result.user.username}#${result.user.discriminator || '0'})`);
            window.UI.addLog(`Токен валиден. Пользователь: ${result.user.username}`, 'success');
            const warn = document.getElementById('tokenWarning');
            if (warn) {
                warn.style.display = 'flex';
                setTimeout(() => warn.style.display = 'none', 5000);
            }
            window.UI.elements.authError.classList.remove('show');
        } else {
            window.UI.addLog(`Ошибка проверки токена: ${result.error}`, 'error');
            window.UI.showError(window.UI.elements.authError, result.error);
        }
    } catch (error) {
        window.UI.addLog(`Критическая ошибка: ${error.message}`, 'error');
        window.UI.showError(window.UI.elements.authError, `Ошибка: ${error.message}`);
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
        window.UI.addLog('Авторизация...', 'info');
        
        const result = await window.API.validateToken(token);
        
        if (!result.valid) {
            window.UI.addLog(`Ошибка авторизации: ${result.error}`, 'error');
            window.UI.showError(window.UI.elements.authError, result.error);
            return;
        }
        
        const user = result.user;
        
        window.state = { token, user };
        currentUser = user;
        
        sessionStorage.setItem('discord_token', token);
        sessionStorage.setItem('discord_user', JSON.stringify(user));
        
        window.UI.updateUserProfile(user);
        window.UI.elements.authView.classList.add('hidden');
        window.UI.elements.mainView.classList.remove('hidden');
        window.UI.addLog(`Авторизация успешна: ${user.username}#${user.discriminator || '0'}`, 'success');
        
        await loadServers();
        
        const lastSource = sessionStorage.getItem('last_source_id');
        const lastTarget = sessionStorage.getItem('last_target_id');
        if (lastSource) window.UI.elements.sourceId.value = lastSource;
        if (lastTarget) window.UI.elements.targetId.value = lastTarget;
        
        resetInactivityTimer();
    } catch (error) {
        window.UI.addLog(`Критическая ошибка авторизации: ${error.message}`, 'error');
        window.UI.showError(window.UI.elements.authError, `Ошибка: ${error.message}`);
    } finally {
        window.UI.elements.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> ВОЙТИ';
        window.UI.elements.loginBtn.disabled = false;
    }
}
