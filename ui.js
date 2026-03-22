window.UI = {
    elements: {},

    init() {
        this.elements = {
            loadingOverlay: document.getElementById('loadingOverlay'),
            snowCanvas: document.getElementById('snowCanvas'),
            authView: document.getElementById('authView'),
            mainView: document.getElementById('mainView'),
            tokenInput: document.getElementById('tokenInput'),
            authError: document.getElementById('authError'),
            loginBtn: document.getElementById('loginBtn'),
            testTokenBtn: document.getElementById('testTokenBtn'),
            userAvatar: document.getElementById('userAvatar'),
            userName: document.getElementById('userName'),
            userId: document.getElementById('userId'),
            userEmail: document.getElementById('userEmail'),
            sourceId: document.getElementById('sourceId'),
            targetId: document.getElementById('targetId'),
            cloneBtn: document.getElementById('cloneBtn'),
            cancelCloneBtn: document.getElementById('cancelCloneBtn'),
            progressFill: document.getElementById('progressFill'),
            backgroundStatus: document.getElementById('backgroundStatus'),
            backgroundProgress: document.getElementById('backgroundProgress'),
            backgroundStage: document.getElementById('backgroundStage'),
            serverListContainer: document.getElementById('serverListContainer'),
            serverValidationResult: document.getElementById('serverValidationResult'),
            cloneError: document.getElementById('cloneError'),
            log: document.getElementById('log'),
            themeBtn: document.querySelector('.control-btn'),
            agreementModal: document.getElementById('agreementModal'),
            previewModal: document.getElementById('previewModal'),
            rule1: document.getElementById('rule1'),
            rule2: document.getElementById('rule2'),
            rule3: document.getElementById('rule3'),
            confirmBtn: document.getElementById('confirmBtn'),
            mainContent: document.getElementById('mainContent'),
            updatesContent: document.getElementById('updatesContent'),
            supportContent: document.getElementById('supportContent'),
            aboutContent: document.getElementById('aboutContent'),
            progressDetails: document.getElementById('progressDetails'),
            rolesProgressBar: document.getElementById('rolesProgressBar'),
            channelsProgressBar: document.getElementById('channelsProgressBar'),
            rolesCount: document.getElementById('rolesCount'),
            channelsCount: document.getElementById('channelsCount'),
            cloneRoles: document.getElementById('cloneRoles'),
            cloneChannels: document.getElementById('cloneChannels'),
            cloneIcon: document.getElementById('cloneIcon'),
            previewContent: document.getElementById('previewContent')
        };
    },

    addLog(msg, type = 'info') {
        if (!this.elements.log) return;
        const t = window.Utils.formatTime(new Date());
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        const e = document.createElement('div');
        e.className = `log-entry log-${type}`;
        e.innerHTML = `<span class="log-time">${t}</span><span class="log-msg">${icons[type] || icons.info} ${window.Utils.escapeHtml(msg)}</span>`;
        this.elements.log.appendChild(e);
        this.elements.log.scrollTop = this.elements.log.scrollHeight;
        if (this.elements.log.children.length > window.CONFIG.maxLogs) {
            this.elements.log.removeChild(this.elements.log.children[0]);
        }
    },

    showToast(msg) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 2000);
    },

    showError(element, msg) {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        if (el) {
            el.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${window.Utils.escapeHtml(msg)}`;
            el.classList.add('show');
            setTimeout(() => el.classList.remove('show'), 3000);
        }
    },

    updateProgress(percent, stage, rolesProgress, channelsProgress, rolesTotal, channelsTotal) {
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${percent}%`;
        }
        if (this.elements.backgroundProgress) {
            this.elements.backgroundProgress.textContent = `ПРОГРЕСС: ${Math.floor(percent)}%`;
        }
        if (this.elements.backgroundStage && stage) {
            this.elements.backgroundStage.textContent = `ЭТАП: ${stage}`;
        }
        if (this.elements.rolesProgressBar && rolesProgress !== undefined) {
            this.elements.rolesProgressBar.style.width = `${rolesProgress}%`;
        }
        if (this.elements.channelsProgressBar && channelsProgress !== undefined) {
            this.elements.channelsProgressBar.style.width = `${channelsProgress}%`;
        }
        if (this.elements.rolesCount && rolesTotal !== undefined) {
            this.elements.rolesCount.textContent = `${Math.floor(rolesProgress * rolesTotal / 100) || 0}/${rolesTotal}`;
        }
        if (this.elements.channelsCount && channelsTotal !== undefined) {
            this.elements.channelsCount.textContent = `${Math.floor(channelsProgress * channelsTotal / 100) || 0}/${channelsTotal}`;
        }
    },

    showServerList(guilds, targetField) {
        if (!guilds || guilds.length === 0) {
            this.showToast('Нет доступных серверов');
            return;
        }

        let html = '<div><input type="text" class="server-search" id="serverSearch" placeholder="Поиск сервера..."></div>';
        html += '<div id="serverListItems">';
        guilds.slice(0, window.CONFIG.maxGuilds).forEach(g => {
            html += `<div class="server-item" data-id="${g.id}" data-name="${window.Utils.escapeHtml(g.name)}">
                        <span>${window.Utils.escapeHtml(g.name)}</span>
                        <span class="server-id">${g.id}</span>
                    </div>`;
        });
        html += '</div>';

        this.elements.serverListContainer.innerHTML = html;
        this.elements.serverListContainer.classList.remove('hidden');
        this.elements.serverListContainer.dataset.target = targetField;

        const searchInput = document.getElementById('serverSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const search = e.target.value.toLowerCase();
                const items = document.querySelectorAll('#serverListItems .server-item');
                items.forEach(item => {
                    const name = item.dataset.name.toLowerCase();
                    item.style.display = name.includes(search) ? 'flex' : 'none';
                });
            });
        }

        document.querySelectorAll('#serverListItems .server-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const target = this.elements.serverListContainer.dataset.target;
                if (target === 'source') {
                    this.elements.sourceId.value = id;
                } else {
                    this.elements.targetId.value = id;
                }
                this.elements.serverListContainer.classList.add('hidden');
                this.addLog(`ВСТАВЛЕН ID: ${id}`, 'info');
            });
        });
    },

    createConfetti() {
        const colors = ['#9ca3af', '#ffffff', '#6b7280'];
        for (let i = 0; i < 40; i++) {
            const p = document.createElement('div');
            p.className = 'confetti';
            p.style.left = Math.random() * window.innerWidth + 'px';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            p.style.width = Math.random() * 8 + 4 + 'px';
            p.style.height = p.style.width;
            document.body.appendChild(p);
            p.addEventListener('animationend', () => p.remove());
        }
    },

    showPreviewModal(sourceGuild, targetGuild, rolesCount, channelsCount) {
        if (!this.elements.previewContent) return;
        
        this.elements.previewContent.innerHTML = `
            <div class="preview-stats">
                <p><strong>Исходный сервер:</strong> ${window.Utils.escapeHtml(sourceGuild.name)} (${sourceGuild.id})</p>
                <p><strong>Целевой сервер:</strong> ${window.Utils.escapeHtml(targetGuild.name)} (${targetGuild.id})</p>
                <p><strong>Будет скопировано:</strong></p>
                <p>• Ролей: ${rolesCount}</p>
                <p>• Каналов: ${channelsCount}</p>
                <p>${this.elements.cloneIcon.checked ? '• Иконка сервера' : ''}</p>
                <hr style="margin: 1rem 0; border-color: var(--border);">
                <p style="color: var(--warning);"><i class="fas fa-exclamation-triangle"></i> Все существующие роли и каналы на целевом сервере будут удалены!</p>
            </div>
        `;
        
        this.elements.previewModal.classList.add('active');
    },

    closePreviewModal() {
        if (this.elements.previewModal) {
            this.elements.previewModal.classList.remove('active');
        }
    },

    updateUserProfile(user) {
        this.elements.userName.textContent = user.global_name || user.username;
        this.elements.userId.textContent = `ID: ${user.id}`;
        if (user.email) {
            this.elements.userEmail.textContent = user.email.replace(/./g, '•');
        }
        if (user.avatar) {
            this.elements.userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        }
    },

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        const icon = this.elements.themeBtn.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            const icon = this.elements.themeBtn.querySelector('i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    },

    toggleTokenVisibility() {
        const inp = this.elements.tokenInput;
        const icon = inp.nextElementSibling.querySelector('i');
        if (inp.type === 'password') {
            inp.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            inp.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    },

    toggleInstructions() {
        const cont = document.getElementById('instructionContent');
        const head = document.querySelector('.instruction-header');
        if (cont) cont.classList.toggle('show');
        if (head) head.classList.toggle('active');
    },

    toggleEmail(user, emailVisible) {
        const span = this.elements.userEmail;
        const icon = document.querySelector('.email-toggle i');
        if (emailVisible && user?.email) {
            span.textContent = user.email;
            span.classList.add('unblur');
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else if (user?.email) {
            span.textContent = user.email.replace(/./g, '•');
            span.classList.remove('unblur');
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    },

    clearLogs() {
        this.elements.log.innerHTML = '';
        this.addLog('ЛОГИ ОЧИЩЕНЫ', 'info');
    },

    exportLogs() {
        const logs = Array.from(this.elements.log.children).map(entry => {
            const t = entry.querySelector('.log-time')?.textContent;
            const m = entry.querySelector('.log-msg')?.textContent;
            return `[${t}] ${m}`;
        }).join('\n');
        
        const blob = new Blob([
            `DISCORD CLONER LOGS\n${new Date().toLocaleString()}\n${'='.repeat(50)}\n${logs}`
        ], { type: 'text/plain' });
        
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `clone_logs_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
        this.showToast('ЛОГИ ЭКСПОРТИРОВАНЫ');
    },

    showAgreement() {
        this.elements.agreementModal.classList.add('active');
    },

    closeModal() {
        this.elements.agreementModal.classList.remove('active');
    },

    checkAllRules() {
        this.elements.confirmBtn.disabled = !(
            this.elements.rule1.checked &&
            this.elements.rule2.checked &&
            this.elements.rule3.checked
        );
    },

    getCloneOptions() {
        return {
            cloneRoles: this.elements.cloneRoles?.checked ?? true,
            cloneChannels: this.elements.cloneChannels?.checked ?? true,
            cloneIcon: this.elements.cloneIcon?.checked ?? true
        };
    },

    initSnow() {
        const canvas = this.elements.snowCanvas;
        if (!canvas) return;
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
        
        const snowflakes = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.3,
            speed: Math.random() * 0.4 + 0.2,
            opacity: Math.random() * 0.2 + 0.1
        }));
        
        let animationFrame;
        const draw = () => {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            snowflakes.forEach(f => {
                ctx.beginPath();
                ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
                ctx.fill();
                f.y += f.speed;
                if (f.y > canvas.height) {
                    f.y = 0;
                    f.x = Math.random() * canvas.width;
                }
            });
            animationFrame = requestAnimationFrame(draw);
        };
        draw();
        
        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    },

    initDynamicBackground() {
        const bgCanvas = document.createElement('canvas');
        bgCanvas.style.position = 'fixed';
        bgCanvas.style.top = '0';
        bgCanvas.style.left = '0';
        bgCanvas.style.width = '100%';
        bgCanvas.style.height = '100%';
        bgCanvas.style.zIndex = '-2';
        bgCanvas.style.opacity = '0.4';
        document.body.insertBefore(bgCanvas, document.body.firstChild);
        
        const ctx = bgCanvas.getContext('2d');
        let t = 0;
        
        const animate = () => {
            const w = window.innerWidth, h = window.innerHeight;
            bgCanvas.width = w;
            bgCanvas.height = h;
            t += 0.002;
            
            const grad = ctx.createLinearGradient(
                w / 2 + Math.sin(t) * 60,
                h / 2 + Math.cos(t * 0.7) * 60,
                w / 2 + Math.cos(t) * 60,
                h / 2 + Math.sin(t * 0.5) * 60
            );
            
            if (document.body.classList.contains('light-theme')) {
                grad.addColorStop(0, '#f5f7fa');
                grad.addColorStop(0.5, '#eef2f6');
                grad.addColorStop(1, '#f5f7fa');
            } else {
                grad.addColorStop(0, '#000000');
                grad.addColorStop(0.5, '#111111');
                grad.addColorStop(1, '#000000');
            }
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
            requestAnimationFrame(animate);
        };
        
        animate();
    },

    addRippleEffect(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    }
};
