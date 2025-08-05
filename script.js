document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.1 // 10% van het element moet in beeld zijn
    });

    // Alles selecteren wat moet animeren
    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach(section => {
        observer.observe(section);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.header-nav');
    const navLinks = document.querySelectorAll('.header-nav_item');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('active');

        const navItems = document.querySelectorAll('.header-nav_item');

        if (navMenu.classList.contains('active')) {
            // Scroll blokkeren
            document.body.classList.add('no-scroll');

            // Fade-in effect per item
            navItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 100}ms`;
            });
        } else {
            // Scroll weer toestaan
            document.body.classList.remove('no-scroll');

            // Reset delays
            navItems.forEach((item) => {
                item.style.transitionDelay = '0ms';
            });
        }
    });


    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            navMenu.classList.remove('active');
        });
    });
});

window.onbeforeunload = function () {
    window.scrollTo(0, 0);

};