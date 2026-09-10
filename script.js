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
            if (icon) icon.className = 'fas fa-moon';
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
            document.querySelectorAll('.dark-toggle i').forEach(i => i.className = 'fas fa-moon');
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

    // ---- Table Container Vertical Scroll Forwarding ----
    document.querySelectorAll('.overflow-x-auto').forEach(wrapper => {
        wrapper.addEventListener('wheel', e => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                window.scrollBy(0, e.deltaY);
            }
        }, { passive: true });
    });

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

    // ---- Hero Interactive Feature Selector Highlight ----
    window.highlightHeroWidget = function (type) {
        const pills = document.querySelectorAll('.hero-feature-pill');
        pills.forEach(pill => {
            const onclickAttr = pill.getAttribute('onclick') || '';
            if (onclickAttr.includes("'" + type + "'")) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });

        const widgetMap = {
            nutrition: document.getElementById('widget-nutrition'),
            rfid: document.getElementById('widget-rfid'),
            queue: document.getElementById('widget-queue')
        };

        Object.entries(widgetMap).forEach(([key, el]) => {
            if (!el) return;
            if (key === type) {
                el.classList.add('hero-widget-highlight');
                setTimeout(() => {
                    el.classList.remove('hero-widget-highlight');
                }, 2200);
            } else {
                el.classList.remove('hero-widget-highlight');
            }
        });
    };

    // ---- Bento RFID Tap Interactive Simulator ----
    window.simulateRfidTap = function () {
        const card = document.getElementById('bento-rfid-card');
        const statusText = document.getElementById('rfid-status-text');
        const balanceText = document.getElementById('rfid-balance-text');
        const hint = document.getElementById('rfid-tap-hint');
        if (!card) return;

        card.classList.add('tapped');
        if (statusText) {
            statusText.textContent = 'Processing...';
            statusText.className = 'text-xs font-bold text-white/80';
        }

        setTimeout(() => {
            if (statusText) {
                statusText.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Paid ₹180 in 0.8s';
                statusText.className = 'text-xs font-bold text-white';
            }
            if (balanceText) {
                balanceText.textContent = 'Balance: ₹1,240';
            }
            if (hint) {
                hint.innerHTML = '<i class="fas fa-check-circle text-white mr-1"></i> Tap verified!';
            }
            card.classList.remove('tapped');

            setTimeout(() => {
                if (hint) {
                    hint.innerHTML = '<i class="fas fa-hand-pointer text-white mr-1 animate-bounce"></i> Click card to tap demo';
                }
            }, 3000);
        }, 500);
    };

    // ---- Hero Auto Side Move Carousel (3 Slides) ----
    function initHeroCarousel() {
        const heroTrack = document.getElementById('hero-slider-track');
        const heroSlides = document.querySelectorAll('.hero-carousel-slide');
        const prevBtn = document.getElementById('hero-slider-prev');
        const nextBtn = document.getElementById('hero-slider-next');
        const indicatorPills = document.querySelectorAll('.hero-slide-pill');
        const slideCounter = document.getElementById('hero-slide-counter');
        const sliderContainer = document.getElementById('hero-slider-container');

        if (!heroTrack || heroSlides.length === 0) return;

        let currentIndex = 0;
        const totalSlides = heroSlides.length;
        const intervalTime = 5000;
        let slideTimer = null;

        function updateSlide(index) {
            currentIndex = (index + totalSlides) % totalSlides;
            heroTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            if (slideCounter) {
                slideCounter.textContent = `0${currentIndex + 1} / 0${totalSlides}`;
            }

            indicatorPills.forEach((pill, i) => {
                const progress = pill.querySelector('.hero-slide-pill-progress');
                if (i === currentIndex) {
                    pill.classList.add('active');
                    pill.style.width = '48px';
                    if (progress) {
                        progress.style.animation = 'none';
                        void progress.offsetWidth;
                        progress.style.animation = `heroSlideProgress ${intervalTime}ms linear forwards`;
                    }
                } else {
                    pill.classList.remove('active');
                    pill.style.width = '24px';
                    if (progress) {
                        progress.style.animation = 'none';
                        progress.style.width = '0%';
                    }
                }
            });
        }

        function nextSlide() {
            updateSlide(currentIndex + 1);
        }

        function prevSlide() {
            updateSlide(currentIndex - 1);
        }

        function startAutoPlay() {
            stopAutoPlay();
            slideTimer = setInterval(nextSlide, intervalTime);
            const currentPill = indicatorPills[currentIndex];
            if (currentPill) {
                const progress = currentPill.querySelector('.hero-slide-pill-progress');
                if (progress) {
                    progress.style.animation = 'none';
                    void progress.offsetWidth;
                    progress.style.animation = `heroSlideProgress ${intervalTime}ms linear forwards`;
                }
            }
        }

        function stopAutoPlay() {
            if (slideTimer) {
                clearInterval(slideTimer);
                slideTimer = null;
            }
            const currentPill = indicatorPills[currentIndex];
            if (currentPill) {
                const progress = currentPill.querySelector('.hero-slide-pill-progress');
                if (progress) {
                    progress.style.animationPlayState = 'paused';
                }
            }
        }

        function resumeAutoPlay() {
            const currentPill = indicatorPills[currentIndex];
            if (currentPill) {
                const progress = currentPill.querySelector('.hero-slide-pill-progress');
                if (progress) {
                    progress.style.animationPlayState = 'running';
                }
            }
            startAutoPlay();
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });

        indicatorPills.forEach((pill, i) => {
            pill.addEventListener('click', () => {
                updateSlide(i);
                startAutoPlay();
            });
        });

        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoPlay);
            sliderContainer.addEventListener('mouseleave', resumeAutoPlay);

            let startX = 0;
            let isSwiping = false;
            sliderContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isSwiping = true;
                stopAutoPlay();
            }, { passive: true });

            sliderContainer.addEventListener('touchend', (e) => {
                if (!isSwiping) return;
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) nextSlide();
                    else prevSlide();
                }
                isSwiping = false;
                startAutoPlay();
            }, { passive: true });
        }

        updateSlide(0);
        startAutoPlay();
    }

    // ---- Culinary Showcase Filtering & Add To Plate ----
    window.addDishToPlate = function (dishName) {
        const existing = document.getElementById('culinary-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'culinary-toast';
        toast.className = 'fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-[#0F172A] text-white border border-white/15 shadow-2xl flex items-center gap-3 animate-on-scroll visible';
        toast.style.animation = 'slideInRight 0.3s ease';
        toast.innerHTML = `<div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white"><i class="fas fa-check text-xs"></i></div><div><p class="text-xs font-medium leading-tight" style="font-weight:500;">${dishName}</p><p class="text-[11px] text-white/60" style="font-weight:400;">Added to your corporate meal plate!</p></div>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    function initCulinaryShowcase() {
        const dayTabs = document.querySelectorAll('.culinary-tab-btn');
        const dietPills = document.querySelectorAll('.culinary-filter-pill');
        const cards = document.querySelectorAll('.culinary-card');

        if (!dayTabs.length && !dietPills.length) return;

        dayTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                dayTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const grid = document.getElementById('culinary-dishes-grid');
                if (grid) {
                    grid.style.opacity = '0.5';
                    grid.style.transform = 'scale(0.99)';
                    grid.style.transition = 'all 0.2s ease';
                    setTimeout(() => {
                        grid.style.opacity = '1';
                        grid.style.transform = 'none';
                    }, 200);
                }
            });
        });

        dietPills.forEach(pill => {
            pill.addEventListener('click', () => {
                dietPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const selectedDiet = pill.getAttribute('data-diet');

                cards.forEach(card => {
                    const categories = card.getAttribute('data-category') || '';
                    if (selectedDiet === 'all' || categories.includes(selectedDiet)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'none';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 200);
                    }
                });
            });
        });
    }

    // ---- Interactive Campus Dining Concepts Hub ----
    function initCampusConcepts() {
        const conceptTabs = document.querySelectorAll('.concept-tab-btn');
        if (!conceptTabs.length) return;

        const conceptData = {
            campus: {
                kicker: "Signature Format 01",
                title: "Tech Park Food Hall",
                subtitle: "High-Throughput Culinary Arena for 1,000+ Daily Diners",
                desc: "Designed specifically for high-density technology campuses. Multiple live culinary stations, smart multi-lane queuing, and RFID contactless checkout keep lunch rushes flowing effortlessly with zero bottlenecks.",
                image: "assets/images/tech_park_food_hall.jpg",
                imageAlt: "Tech Park Corporate Food Hall",
                badgeTop: "1,800+ Daily Capacity",
                badgeBottomTitle: "Avg. Service Time: 3.2 Mins",
                badgeBottomSub: "Reduced from 22 mins with RFID express lane",
                stats: [
                    { val: "1,200/hr", label: "Throughput Flow" },
                    { val: "-78%", label: "Queue Reduction" },
                    { val: "+52", label: "Employee NPS" }
                ],
                features: [
                    { icon: "fa-bolt", title: "Sub-Second RFID Checkout", desc: "Scan tray and tap employee badge in under 8 seconds." },
                    { icon: "fa-fire-burner", title: "4 Rotating Live Stations", desc: "Live Asian wok, sizzlers, regional Indian, and salad bars." },
                    { icon: "fa-leaf", title: "Zero-Food-Waste Scheduling", desc: "AI forecasts meal quantities based on attendance patterns." },
                    { icon: "fa-shield-halved", title: "Live HACCP Hygiene Audit", desc: "Digital temperature monitoring and open kitchen sanitization." }
                ],
                primaryBtn: { text: "Book Campus Walkthrough", href: "contact.html", icon: "fa-calendar-check" },
                secondaryBtn: { text: "Explore Campus Menus", href: "menu-planning.html", icon: "fa-utensils" }
            },
            bistro: {
                kicker: "Signature Format 02",
                title: "Executive HQ Boutique Bistro",
                subtitle: "Plated Gastronomy & Barista Hospitality for Corporate HQs",
                desc: "Curated for corporate headquarters, client dining suites, and leadership hubs. White-glove plated presentations, artisanal single-origin coffee roasteries, and quiet meeting booths that leave a lasting impression.",
                image: "assets/images/executive_hq_bistro.jpg",
                imageAlt: "Executive HQ Boutique Bistro and Plated Dining",
                badgeTop: "Michelin-Inspired Chefs",
                badgeBottomTitle: "99.2% Executive Approval",
                badgeBottomSub: "Rated 4.9★ across 85+ boardroom banquets",
                stats: [
                    { val: "100%", label: "Chef Curated" },
                    { val: "4.92 / 5", label: "Client Rating" },
                    { val: "VIP Suites", label: "Boardroom Catering" }
                ],
                features: [
                    { icon: "fa-utensils", title: "Plated Multi-Course Menus", desc: "Table-side seasonal culinary creations by master chefs." },
                    { icon: "fa-mug-hot", title: "Artisanal Barista Lounge", desc: "Single-origin espresso, specialty teas, and pastry." },
                    { icon: "fa-calendar-check", title: "VIP Boardroom Catering", desc: "App-based VIP booking with dedicated butler service." },
                    { icon: "fa-award", title: "Certified Organic Sourcing", desc: "100% farm-traceable produce with micro-nutrient." }
                ],
                primaryBtn: { text: "Request Executive Tasting", href: "contact.html", icon: "fa-calendar-check" },
                secondaryBtn: { text: "View Bistro Menus", href: "menu-planning.html", icon: "fa-utensils" }
            },
            micromarket: {
                kicker: "Signature Format 03",
                title: "24/7 Smart Micro-Market & Shift Pantry",
                subtitle: "Autonomous Fresh Food Access for Hybrid & Round-the-Clock Teams",
                desc: "The modern answer to vending machines and late-night shift hunger. Automated, unattended micro-markets stocked twice daily with fresh salads, high-protein wraps, cold-pressed juices, and barista-grade automated coffee.",
                image: "assets/images/smart_micromarket_pantry.jpg",
                imageAlt: "24/7 Autonomous Smart Micro-Market and Fresh Pantry",
                badgeTop: "24/7/365 Always Open",
                badgeBottomTitle: "Restocked 2x Daily",
                badgeBottomSub: "Fresh wraps, parfaits, cold brew & healthy snacks",
                stats: [
                    { val: "99.9%", label: "Operational Uptime" },
                    { val: "Every 12h", label: "Fresh Restock" },
                    { val: "Tap & Go", label: "RFID & Digital Pay" }
                ],
                features: [
                    { icon: "fa-clock", title: "Always-Open Unattended Access", desc: "Grab-and-go convenience for night shifts and hybrid staff." },
                    { icon: "fa-apple-whole", title: "Nutrient-Dense Healthy Snacking", desc: "Macro-balanced bites, trail mixes, smoothies, and fruit cups." },
                    { icon: "fa-credit-card", title: "Frictionless Scan & Go", desc: "Zero cashier queues with AI weight-sensor smart fridges." },
                    { icon: "fa-rotate", title: "Intelligent Auto-Restock", desc: "IoT alerts our central kitchen the moment items run low." }
                ],
                primaryBtn: { text: "Deploy Micro-Market", href: "contact.html", icon: "fa-rocket" },
                secondaryBtn: { text: "View Pantry Catalog", href: "services.html", icon: "fa-box-open" }
            }
        };

        const imgEl = document.getElementById('concept-main-img');
        const badgeTopEl = document.getElementById('concept-badge-top');
        const badgeBottomTitleEl = document.getElementById('concept-badge-bottom-title');
        const badgeBottomSubEl = document.getElementById('concept-badge-bottom-sub');
        const kickerEl = document.getElementById('concept-kicker');
        const titleEl = document.getElementById('concept-title');
        const subtitleEl = document.getElementById('concept-subtitle');
        const descEl = document.getElementById('concept-desc');
        const featuresGridEl = document.getElementById('concept-features-grid');
        const primaryBtnEl = document.getElementById('concept-primary-btn');
        const secondaryBtnEl = document.getElementById('concept-secondary-btn');

        const statVal1 = document.getElementById('concept-stat-val-1');
        const statLabel1 = document.getElementById('concept-stat-label-1');
        const statVal2 = document.getElementById('concept-stat-val-2');
        const statLabel2 = document.getElementById('concept-stat-label-2');
        const statVal3 = document.getElementById('concept-stat-val-3');
        const statLabel3 = document.getElementById('concept-stat-label-3');

        function renderConcept(key) {
            const data = conceptData[key];
            if (!data) return;

            if (imgEl) {
                imgEl.style.opacity = '0.3';
                imgEl.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    imgEl.src = data.image;
                    imgEl.alt = data.imageAlt;
                    imgEl.style.opacity = '1';
                    imgEl.style.transform = 'scale(1)';
                }, 160);
            }

            if (badgeTopEl) badgeTopEl.textContent = data.badgeTop;
            if (badgeBottomTitleEl) badgeBottomTitleEl.textContent = data.badgeBottomTitle;
            if (badgeBottomSubEl) badgeBottomSubEl.textContent = data.badgeBottomSub;
            if (kickerEl) kickerEl.textContent = data.kicker;
            if (titleEl) titleEl.textContent = data.title;
            if (subtitleEl) subtitleEl.textContent = data.subtitle;
            if (descEl) descEl.textContent = data.desc;

            if (statVal1 && data.stats[0]) {
                statVal1.textContent = data.stats[0].val;
                statLabel1.textContent = data.stats[0].label;
            }
            if (statVal2 && data.stats[1]) {
                statVal2.textContent = data.stats[1].val;
                statLabel2.textContent = data.stats[1].label;
            }
            if (statVal3 && data.stats[2]) {
                statVal3.textContent = data.stats[2].val;
                statLabel3.textContent = data.stats[2].label;
            }

            if (featuresGridEl && data.features) {
                featuresGridEl.innerHTML = data.features.map(f => `
                    <div class="concept-amenity-card">
                        <div class="concept-amenity-icon">
                            <i class="fas ${f.icon}"></i>
                        </div>
                        <div>
                            <h4 class="text-xs font-semibold mb-0.5 text-neutral-800 dark:text-neutral-100" style="font-family:'Outfit',sans-serif;font-weight:600;">${f.title}</h4>
                            <p class="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed" style="font-weight:400;">${f.desc}</p>
                        </div>
                    </div>
                `).join('');
            }

            if (primaryBtnEl && data.primaryBtn) {
                primaryBtnEl.href = data.primaryBtn.href;
                primaryBtnEl.innerHTML = `<i class="fas ${data.primaryBtn.icon} text-xs mr-1.5"></i> ${data.primaryBtn.text}`;
            }

            if (secondaryBtnEl && data.secondaryBtn) {
                secondaryBtnEl.href = data.secondaryBtn.href;
                secondaryBtnEl.innerHTML = `<i class="fas ${data.secondaryBtn.icon} text-xs mr-1.5"></i> ${data.secondaryBtn.text}`;
            }
        }

        conceptTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                conceptTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const key = tab.getAttribute('data-concept');
                renderConcept(key);
            });
        });
    }

    // ===================================================
    // HOME 2: CULINARY STATIONS TOUR
    // ===================================================
    function initCulinaryStations() {
        const stationNavBtns = document.querySelectorAll('.station-nav-btn');
        if (!stationNavBtns.length) return;

        const stationData = {
            wok: {
                title: 'Asian Wok & Dim Sum',
                cuisine: 'Pan-Asian Sizzlers & Bowls',
                desc: 'High-heat wok tossing with fresh market greens, handcrafted dumplings, and authentic slow-simmered broths prepared live right in front of your employees in under 3 minutes.',
                img: 'assets/images/station_wok_asian.jpg',
                stationTag: 'Station 01',
                liveStatus: 'Live Station Active',
                prepTime: '2.5 mins',
                load: '120 bowls / 20m',
                temp: '320°C Flash Toss',
                signature: 'Teriyaki Glazed Soba Bowl with Charred Bok Choy',
                macroKcal: '480 kcal',
                macroProtein: '24g Protein',
                macroDiet: 'Vegan / Halal Opt.',
                chefName: 'Chef Marcus Chen',
                chefTitle: 'Executive Sous Chef • 12 yrs Five-Star Hospitality',
                chefImg: 'assets/images/chef_marcus_chen.jpg'
            },
            hearth: {
                title: 'Artisan Hearth & Tandoor',
                cuisine: 'Clay-Fired Breads & Slow Smoked Grills',
                desc: 'Live charcoal tandoors firing crisp garlic naans, slow-simmered rich dal makhani, and succulent paneer tikka skewers with bespoke spice levels.',
                img: 'assets/images/station_tandoor_hearth.jpg',
                stationTag: 'Station 02',
                liveStatus: 'Live Charcoal Active',
                prepTime: '3.0 mins',
                load: '160 rotis / 15m',
                temp: '480°C Clay Oven',
                signature: 'Smoked Kasundi Paneer Tikka with Saffron Laccha Paratha',
                macroKcal: '540 kcal',
                macroProtein: '28g Protein',
                macroDiet: 'Vegetarian / GF Opt.',
                chefName: 'Chef Vikram Singhania',
                chefTitle: 'Master Tandoor Specialist • 16 yrs Royal Heritage Dining',
                chefImg: 'assets/images/chef_vikram_singhania.jpg'
            },
            salad: {
                title: 'Hydroponic Salad & Deli',
                cuisine: 'Pesticide-Free Microgreens & Clean Bowls',
                desc: 'Fresh morning harvest from certified local hydroponic farms. Build-your-own cold-pressed bowls with organic quinoa, ancient seeds, avocado, and zero-sugar vinaigrettes.',
                img: 'assets/images/station_hydroponic_salad.jpg',
                stationTag: 'Station 03',
                liveStatus: 'Fresh Deli Bar Open',
                prepTime: '1.5 mins',
                load: '95 bowls / 15m',
                temp: '< 4°C Chilled Counter',
                signature: 'Crisp Kale & Edamame Bowl with Tahini Lemon Dressing',
                macroKcal: '380 kcal',
                macroProtein: '19g Protein',
                macroDiet: '100% Organic Vegan',
                chefName: 'Chef Natasha Rao',
                chefTitle: 'Wellness Nutrition Specialist • Certified Dietitian',
                chefImg: 'assets/images/chef_natasha_rao.jpg'
            },
            barista: {
                title: 'Barista Roastery & Bakery',
                cuisine: 'Single-Origin Espresso & Artisan Bakes',
                desc: 'Specialty Arabica roasts from Chikmagalur estates, stone-ground matcha lattes, and in-house baked sourdough croissants and gluten-free fruit tea cakes.',
                img: 'assets/images/station_barista_roastery.jpg',
                stationTag: 'Station 04',
                liveStatus: 'Brew Bar Steaming',
                prepTime: '2.0 mins',
                load: '180 cups / 30m',
                temp: '93.5°C Precision Pull',
                signature: 'Single-Origin Cold Brew Float with Pistachio Biscotti',
                macroKcal: '210 kcal',
                macroProtein: '8g Protein',
                macroDiet: 'Artisan Roasted',
                chefName: 'Barista Lead Rohan Sen',
                chefTitle: 'Q-Grader Certified • National Latte Art Finalist',
                chefImg: 'assets/images/barista_rohan_sen.jpg'
            }
        };

        const imgEl = document.getElementById('station-main-img');
        const titleEl = document.getElementById('station-title');
        const cuisineEl = document.getElementById('station-cuisine');
        const descEl = document.getElementById('station-desc');
        const tagEl = document.getElementById('station-tag-station');
        const statusEl = document.getElementById('station-live-status');
        const prepEl = document.getElementById('station-prep-time');
        const loadEl = document.getElementById('station-load');
        const tempEl = document.getElementById('station-temp');
        const sigEl = document.getElementById('station-signature');
        const kcalEl = document.getElementById('station-macro-kcal');
        const proteinEl = document.getElementById('station-macro-protein');
        const dietEl = document.getElementById('station-macro-diet');
        const chefNameEl = document.getElementById('station-chef-name');
        const chefTitleEl = document.getElementById('station-chef-title');
        const chefImgEl = document.getElementById('station-chef-img');

        stationNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-station');
                const data = stationData[key];
                if (!data) return;

                stationNavBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetImg = btn.getAttribute('data-img') || data.img;
                const targetChefImg = btn.getAttribute('data-chef-img') || data.chefImg;

                if (imgEl) {
                    imgEl.style.opacity = '0.3';
                    imgEl.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        imgEl.src = targetImg;
                        imgEl.alt = data.title;
                        imgEl.style.opacity = '1';
                        imgEl.style.transform = 'scale(1)';
                    }, 200);
                }

                if (titleEl) titleEl.textContent = data.title;
                if (cuisineEl) cuisineEl.textContent = data.cuisine;
                if (descEl) descEl.textContent = data.desc;
                if (tagEl) tagEl.textContent = data.stationTag;
                if (statusEl) statusEl.textContent = data.liveStatus;
                if (prepEl) prepEl.textContent = data.prepTime;
                if (loadEl) loadEl.textContent = data.load;
                if (tempEl) tempEl.textContent = data.temp;
                if (sigEl) sigEl.textContent = data.signature;
                if (kcalEl) kcalEl.innerHTML = `<i class="fas fa-fire-alt text-xs text-[#E11D48]"></i> ${data.macroKcal}`;
                if (proteinEl) proteinEl.innerHTML = `<i class="fas fa-dumbbell text-xs text-[#E11D48]"></i> ${data.macroProtein}`;
                if (dietEl) dietEl.innerHTML = `<i class="fas fa-leaf text-xs text-[#E11D48]"></i> ${data.macroDiet}`;
                if (chefNameEl) chefNameEl.textContent = data.chefName;
                if (chefTitleEl) chefTitleEl.textContent = data.chefTitle;
                if (chefImgEl && targetChefImg) chefImgEl.src = targetChefImg;
            });
        });
    }

    // ===================================================
    // HOME 2: ESG SUSTAINABILITY CALCULATOR
    // ===================================================
    function initEsgImpactCalculator() {
        const toggleTotal = document.getElementById('esg-toggle-total');
        const togglePer100 = document.getElementById('esg-toggle-per100');
        if (!toggleTotal || !togglePer100) return;

        const co2El = document.getElementById('esg-metric-co2');
        const landfillEl = document.getElementById('esg-metric-landfill');
        const waterEl = document.getElementById('esg-metric-water');
        const farmsEl = document.getElementById('esg-metric-farms');

        const metrics = {
            total: {
                co2: '18.4 Tons',
                landfill: '99.6%',
                water: '142,000 L',
                farms: '120+'
            },
            per100: {
                co2: '3.68 Tons',
                landfill: '99.6%',
                water: '28,400 L',
                farms: '24+'
            }
        };

        function setScope(scope) {
            if (scope === 'total') {
                toggleTotal.classList.add('active');
                togglePer100.classList.remove('active');
            } else {
                togglePer100.classList.add('active');
                toggleTotal.classList.remove('active');
            }

            const data = metrics[scope];
            const els = [co2El, landfillEl, waterEl, farmsEl].filter(Boolean);
            els.forEach(el => {
                el.style.opacity = '0.3';
                el.style.transform = 'scale(0.96)';
                el.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
            });

            setTimeout(() => {
                if (co2El) co2El.textContent = data.co2;
                if (landfillEl) landfillEl.textContent = data.landfill;
                if (waterEl) waterEl.textContent = data.water;
                if (farmsEl) farmsEl.textContent = data.farms;

                els.forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                });
            }, 120);
        }

        toggleTotal.addEventListener('click', () => setScope('total'));
        togglePer100.addEventListener('click', () => setScope('per100'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initHeroCarousel();
            initCulinaryShowcase();
            initCampusConcepts();
            initCulinaryStations();
            initEsgImpactCalculator();
        });
    } else {
        initHeroCarousel();
        initCulinaryShowcase();
        initCampusConcepts();
        initCulinaryStations();
        initEsgImpactCalculator();
    }

})();


