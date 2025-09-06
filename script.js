// Selecteer de menu-toggle button en het nav-menu
const btn = document.querySelector('.header-nav--toggle');
const nav = document.getElementById('mainNav');

// Functie om het menu open/dicht te zetten
function setOpen(open) {
    document.body.classList.toggle('nav-open', open);   // Blokkeer scrollen als menu open is
    document.body.classList.toggle('nav-lock', open);   // Extra scroll lock class (optioneel)
    btn.setAttribute('aria-expanded', open ? 'true' : 'false'); // Voor toegankelijkheid
    nav.hidden = !open;         // Verberg menu voor iedereen (ook screenreaders)
    nav.inert = !open;          // Maakt menu niet-focusbaar als dicht
    btn.classList.toggle('is-open', open); // Zet hamburger/X animatie goed
}

// Start altijd met menu dicht
setOpen(false);

// Klik op de menu-toggle button opent/sluit menu
btn.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));

// Sluit menu bij klik op een nav-link
nav.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) setOpen(false); // Menu dicht
});

// Sluit menu met Escape-toets
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
});

/* -------------------- FORMSPREE AJAX & POPUP -------------------- */

// Selecteer het formulier (zorg dat je form id="contactForm" heeft)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Voorkom standaard versturen en redirect
        const form = e.target;

        // voorkom dubbel verzenden
        if (form.dataset.sending === '1') return;
        form.dataset.sending = '1';

        // disable submit-knop tijdens versturen
        const submitBtn = form.querySelector('[type="submit"]');
        const prevBtnText = submitBtn ? submitBtn.textContent : null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verzenden...';
        }

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method || 'POST',
                body: data,
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                // Toon de custom popup als het gelukt is
                const popup = document.getElementById('form-success-popup');
                if (popup) {
                    // zet eventueel een dynamisch bericht indien element bestaat
                    const msgEl = popup.querySelector('[data-popup-message]');
                    if (msgEl) {
                        msgEl.setAttribute('aria-live', 'polite');
                        msgEl.textContent = '✅ Bedankt! Je bericht is verstuurd. Ik antwoord binnen 24 uur.';
                    }
                    popup.style.display = 'flex';
                } else {
                    // fallback zonder popup
                    alert('✅ Bedankt! Je bericht is verstuurd. Ik antwoord binnen 24 uur.');
                }
                form.reset(); // Maak het formulier leeg
            } else {
                // probeer nette foutmelding van Formspree te lezen
                let msg = 'Er ging iets mis. Probeer later opnieuw of mail naar info@cncstudio.net';
                try {
                    const json = await response.json();
                    if (json && json.errors && Array.isArray(json.errors)) {
                        msg = json.errors.map(er => er.message).join('\n');
                    }
                } catch (_) { /* ignore JSON parse errors */ }
                alert(`❌ ${msg}`);
            }
        } catch (err) {
            alert('⚠️ Netwerkfout. Stuur anders rechtstreeks een mail naar info@cncstudio.net');
        } finally {
            // reset UI state
            if (submitBtn) {
                submitBtn.disabled = false;
                if (prevBtnText) submitBtn.textContent = prevBtnText;
            }
            delete form.dataset.sending;
        }
    });
}

// Popup sluiten als je op het kruisje of buiten de popup klikt
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('form-success-popup');
    const popupClose = document.getElementById('form-popup-close');

    if (popup && popupClose) {
        // Klik op het kruisje
        popupClose.addEventListener('click', () => {
            popup.style.display = 'none';
        });
        // Klik buiten de popup-content
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.style.display = 'none';
        });
        // Esc om popup te sluiten (kleine accessibility bonus, geen brekende change)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') popup.style.display = 'none';
        });
    }
});













