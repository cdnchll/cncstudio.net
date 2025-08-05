/*popup*/
document.addEventListener('DOMContentLoaded', function () {
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    if (isIndex) {
        const popup = document.getElementById('popup');
        const closeBtn = document.getElementById('close-popup-btn');

        // Laat de popup zien
        popup.style.display = 'flex';

        // Scroll blokkeren door class toe te voegen aan <body>
        document.body.classList.add('no-scroll');

        // Sluiten van de popup
        closeBtn.addEventListener('click', function () {
            popup.style.display = 'none';

            // Scroll weer toestaan door class te verwijderen
            document.body.classList.remove('no-scroll');
        });
    }
});

/* fade-in effect bij scrollen */
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

    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach(section => {
        observer.observe(section);
    });
});

/* menu toggle + scroll fix */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.header-nav');
    const navLinks = document.querySelectorAll('.header-nav_item');
    let scrollPosition = 0;

    menuToggle.addEventListener('click', () => {
        const navItems = document.querySelectorAll('.header-nav_item');

        if (!navMenu.classList.contains('active')) {
            // Menu gaat open
            scrollPosition = window.scrollY;
            document.body.style.top = `-${scrollPosition}px`;
            document.body.classList.add('no-scroll');

            navMenu.classList.add('active');
            menuToggle.classList.add('open');

            navItems.forEach((item, index) => {
                item.style.transitionDelay = `${index * 100}ms`;
            });
        } else {
            // Menu sluit
            document.body.classList.remove('no-scroll');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);

            navMenu.classList.remove('active');
            menuToggle.classList.remove('open');

            navItems.forEach((item) => {
                item.style.transitionDelay = '0ms';
            });
        }
    });

    // Menu sluit bij klikken op link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            navMenu.classList.remove('active');

            document.body.classList.remove('no-scroll');
            document.body.style.top = '';
            window.scrollTo(0, scrollPosition);
        });
    });
});



/*klaar*/