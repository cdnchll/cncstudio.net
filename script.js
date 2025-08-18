// ───────────────────────────────────────────────────────────────────────────────
// NAV + SUBLIST + HAMBURGER TOGGLE (met bestaande top/middle/bottom bar classes)
// ───────────────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    // Vind de nav (jij gebruikt <nav class="site-nav">)
    const nav =
        document.querySelector('nav.site-nav') ||
        document.getElementById('site-nav') ||
        document.querySelector('nav');

    // Eén hamburger SVG met class .menu-toggle
    const toggles = document.querySelectorAll('.menu-toggle');

    // Submenu’s dichtklappen wanneer hele nav sluit
    const closeAllSublists = () => {
        document.querySelectorAll('.has-sublist.open').forEach((li) => {
            const link = li.querySelector('.over-toggle') || li.querySelector('a');
            const sub = li.querySelector('.over-sublist');
            if (sub) {
                if (getComputedStyle(sub).maxHeight === 'none') {
                    sub.style.maxHeight = sub.scrollHeight + 'px';
                }
                requestAnimationFrame(() => {
                    sub.style.maxHeight = '0px';
                    sub.style.opacity = '0';
                });
            }
            li.classList.remove('open');
            if (link) link.setAttribute('aria-expanded', 'false');
        });
    };

    // Globale open/close state
    const setNavState = (open, toggleEl) => {
        document.body.classList.toggle('nav-open', open);
        document.body.classList.toggle('no-scroll', open);

        // Sync .open op de SVG (stuurt X-animatie aan via CSS)
        if (toggleEl) {
            toggleEl.classList.toggle('open', open);
            toggleEl.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        if (!toggleEl && toggles.length === 1) {
            const one = toggles[0];
            one.classList.toggle('open', open);
            one.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        if (!open) closeAllSublists();
    };

    // Buiten-klik sluit nav
    document.addEventListener('click', (e) => {
        if (!document.body.classList.contains('nav-open')) return;
        const clickedInsideNav = nav && nav.contains(e.target);
        const clickedToggle = [...toggles].some((t) => t.contains(e.target));
        if (!clickedInsideNav && !clickedToggle) setNavState(false, null);
    });

    // ESC sluit nav
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
            setNavState(false, null);
        }
    });

    // Init elke .menu-toggle (we voegen GEEN classes toe aan <path> – jij hebt ze al)
    toggles.forEach((svg) => {
        // Toegankelijk maken
        if (!svg.hasAttribute('tabindex')) svg.setAttribute('tabindex', '0');
        svg.setAttribute('role', 'button');
        svg.setAttribute('aria-label', 'Menu');
        svg.setAttribute('aria-expanded', 'false');

        // aria-controls koppelen aan nav
        if (nav) {
            const navId = nav.id || 'site-nav';
            if (!nav.id) nav.id = navId;
            if (!svg.hasAttribute('aria-controls')) svg.setAttribute('aria-controls', navId);
        }

        // Klik toggelt open/dicht
        svg.addEventListener('click', () => {
            const willOpen = !document.body.classList.contains('nav-open');
            setNavState(willOpen, svg);
        });

        // Enter/Spatie ondersteunt toetsenbord
        svg.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const willOpen = !document.body.classList.contains('nav-open');
                setNavState(willOpen, svg);
            }
        });
    });

    // ────────────────────────────────────────────────────────────────────────────
    // Links gedrag
    // - Klik op OVER (top-level in .has-sublist) => nav blijft open, alleen sublist toggelt
    // - Klik op item ín .over-sublist  of andere top-level links => nav sluit
    // ────────────────────────────────────────────────────────────────────────────
    if (nav) {
        nav.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            // Niet sluiten bij ctrl/⌘-klik, middenklik, etc.
            const modifiedClick = e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;
            if (modifiedClick) return;

            const inSublist = !!link.closest('.over-sublist');
            const inHasSub = !!link.closest('.has-sublist');
            const hasClass = link.classList.contains('over-toggle');
            const isOverToggle = hasClass || (inHasSub && !inSublist);

            if (isOverToggle) {
                // alleen sublist behandelen (zie blok hieronder)
                return;
            }

            // Alles anders sluit nav
            if (document.body.classList.contains('nav-open')) {
                setNavState(false, null);
            }
        });
    }

    // ────────────────────────────────────────────────────────────────────────────
    // OVER sublist (slide/fade)
    // ────────────────────────────────────────────────────────────────────────────
    const overItem = document.querySelector('.has-sublist');
    if (overItem) {
        const overLink = overItem.querySelector('.over-toggle') || overItem.querySelector('a');
        const sublist = overItem.querySelector('.over-sublist');

        if (overLink && sublist) {
            overLink.setAttribute('aria-expanded', 'false');
            sublist.setAttribute('role', 'group');

            overLink.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpening = !overItem.classList.contains('open');

                if (isOpening) {
                    sublist.style.maxHeight = sublist.scrollHeight + 'px';
                    sublist.style.opacity = '1';
                    overItem.classList.add('open');
                    overLink.setAttribute('aria-expanded', 'true');
                } else {
                    if (getComputedStyle(sublist).maxHeight === 'none') {
                        sublist.style.maxHeight = sublist.scrollHeight + 'px';
                    }
                    requestAnimationFrame(() => {
                        sublist.style.maxHeight = '0px';
                        sublist.style.opacity = '0';
                    });
                    overItem.classList.remove('open');
                    overLink.setAttribute('aria-expanded', 'false');
                }
            });

            sublist.addEventListener('transitionend', (e) => {
                if (e.propertyName === 'max-height' && overItem.classList.contains('open')) {
                    sublist.style.maxHeight = 'none';
                }
            });
        }
    }
});



// --- SCROLL FADE-IN ---
const revealEls = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('is-visible');   // triggert de fade-in

        // optionele stagger voor eventuele child-elementen
        const kids = el.querySelectorAll('[data-reveal-child]');
        kids.forEach((kid, i) => {
            kid.style.transitionDelay = `${i * 80}ms`;
        });

        obs.unobserve(el); // éénmalig animeren
    });
}, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

revealEls.forEach(el => io.observe(el));





/*popup*/

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("popup-close");
    const title = document.getElementById("popup-title");
    const message = document.getElementById("popup-message");

    // Detect language from page
    let lang = document.documentElement.lang; // "nl-BE" or "en-GB"

    if (lang.startsWith("nl")) {
        title.textContent = "Belangrijk bericht";
        message.textContent = "Deze website is momenteel geoptimaliseerd voor mobiele apparaten. De desktopversie is in ontwikkeling.";
    } else {
        title.textContent = "Important Notice";
        message.textContent = "This website is currently optimized for mobile devices. A desktop version is under development.";
    }

    // Show popup only on first visit
    if (!localStorage.getItem("popupSeen")) {
        popup.style.display = "flex";
        localStorage.setItem("popupSeen", "true");
    }

    // Close popup
    closeBtn.addEventListener("click", () => {
        popup.style.display = "none";
    });
});




