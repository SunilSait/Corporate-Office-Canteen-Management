// ===== CULINACORP — UTILITY SCRIPTS =====
// Auth page interactions, dashboard toggles, animations, FAQ

(function () {
    'use strict';

    // ---- Password Toggle ----
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function () {
            const wrapper = this.closest('.input-wrapper');
            const input = wrapper ? wrapper.querySelector('input') : null;
            if (input) {
                const isText = input.type === 'text';
                input.type = isText ? 'password' : 'text';
                const icon = this.querySelector('i');
                if (icon) icon.className = isText ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
            }
        });
    });

    // ---- Auth Page Theme Toggle ----
    const darkToggles = document.querySelectorAll('.dark-toggle');
    darkToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const html = document.documentElement;
            const isDark = html.classList.toggle('dark');
            localStorage.setItem('cc-dark-mode', isDark ? 'true' : 'false');
            const icon = btn.querySelector('i');
            if (icon) icon.className = isDark ? 'fas fa-sun text-yellow-400' : 'fas fa-moon';
        });
    });

    // ---- Auth Page RTL Toggle ----
    const rtlToggles = document.querySelectorAll('.rtl-toggle');
    rtlToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const html = document.documentElement;
            const isRTL = html.getAttribute('dir') === 'rtl';
            html.setAttribute('dir', isRTL ? 'ltr' : 'rtl');
            localStorage.setItem('cc-rtl', isRTL ? 'false' : 'true');
        });
    });

    // ---- Restore settings ----
    (function restoreSettings() {
        const html = document.documentElement;
        if (localStorage.getItem('cc-dark-mode') === 'true' ||
            (!localStorage.getItem('cc-dark-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            html.classList.add('dark');
            document.querySelectorAll('.dark-toggle i').forEach(i => i.className = 'fas fa-sun text-yellow-400');
        }
        if (localStorage.getItem('cc-rtl') === 'true') {
            html.setAttribute('dir', 'rtl');
        }
    })();

    // ---- Animate on scroll ----
    document.addEventListener('DOMContentLoaded', () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        elements.forEach(el => observer.observe(el));
    });

    // ---- Dashboard Sidebar Toggle ----
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('show');
        });
    }

    if (overlay && sidebar) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // ---- Dashboard Notification Panel ----
    const notifBtn = document.getElementById('notif-btn');
    const notifPanel = document.getElementById('notif-panel');
    if (notifBtn && notifPanel) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifPanel.classList.toggle('hidden');
        });
        document.addEventListener('click', () => notifPanel.classList.add('hidden'));
        notifPanel.addEventListener('click', (e) => e.stopPropagation());
    }

    // ---- FAQ Accordion ----
    document.addEventListener('DOMContentLoaded', () => {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    const wasOpen = item.classList.contains('open');
                    // Close all
                    faqItems.forEach(fi => fi.classList.remove('open'));
                    // Open clicked if wasn't open
                    if (!wasOpen) item.classList.add('open');
                });
            }
        });
    });

    // ---- Tab Switching ----
    document.addEventListener('DOMContentLoaded', () => {
        const tabBars = document.querySelectorAll('.tab-bar');
        tabBars.forEach(bar => {
            const tabs = bar.querySelectorAll('.tab-btn');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const target = tab.getAttribute('data-tab');
                    if (target) {
                        const parent = bar.closest('section') || bar.parentElement;
                        const panels = parent.querySelectorAll('.tab-panel');
                        panels.forEach(p => {
                            p.style.display = p.id === target ? 'block' : 'none';
                        });
                    }
                });
            });
        });
    });

    // ---- Counter Animation ----
    document.addEventListener('DOMContentLoaded', () => {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-count'), 10);
                    const suffix = el.getAttribute('data-suffix') || '';
                    const prefix = el.getAttribute('data-prefix') || '';
                    const duration = 2000;
                    const startTime = performance.now();

                    function step(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * target);
                        el.textContent = prefix + current.toLocaleString() + suffix;
                        if (progress < 1) requestAnimationFrame(step);
                    }
                    requestAnimationFrame(step);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        counters.forEach(c => observer.observe(c));
    });

    // ---- Countdown Timer (Coming Soon) ----
    document.addEventListener('DOMContentLoaded', () => {
        const countdown = document.getElementById('countdown');
        if (!countdown) return;

        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);

        function updateCountdown() {
            const now = new Date();
            const diff = targetDate - now;
            if (diff <= 0) return;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('cd-days');
            const hoursEl = document.getElementById('cd-hours');
            const minsEl = document.getElementById('cd-mins');
            const secsEl = document.getElementById('cd-secs');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
            if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    });

})();
