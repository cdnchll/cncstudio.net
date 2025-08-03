/*popup*/
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('close-popup-btn');

    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
    });
});
/*---------------------------------------------------------*/

/* -- MENU TOGGLE OPEN-CLOSE --*/
// Select the menu toggle button (the SVG)
const menuToggle = document.querySelector('.menu-toggle');
const mainMenu = document.querySelector('.main-menu');
const menuLinks = document.querySelectorAll('.main-menu a');
// Add a click event to toggle the "open" class
menuToggle.addEventListener('click', () => {
    console.log("Menu toggle clicked!");
    menuToggle.classList.toggle('open');
    mainMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open'); // ← block or allow scroll
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Close the menu
        document.querySelector('.main-menu').classList.remove('open');
        document.querySelector('.menu-toggle').classList.remove('open');
        document.body.classList.remove('menu-open');
    });
});


/*--scroll effect*/

document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".fade-in-on-scroll");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Verwijderen als je de animatie maar één keer wilt
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
});

// Delay click effect on .link-contact-btn
document.querySelectorAll('.link-contact-btn').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only delay for anchor links (e.g. #contact)
        if (href && href.startsWith('#')) {
            e.preventDefault(); // stop default jump
            this.classList.add('clicked'); // optional visual effect

            setTimeout(() => {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 200); // delay in ms (tweak if needed)
        }
    });
});




