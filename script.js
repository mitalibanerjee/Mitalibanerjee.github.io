document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list'); // Corrected selector
    const mainNav = document.getElementById('mainNav'); // For sticky check and height calc
    const navLinks = document.querySelectorAll('#mainNav .nav-list a[href^="#"]'); // Target links within nav list
    const goTopBtn = document.getElementById('goTopBtn');
    const footerYearSpan = document.getElementById('footer-year');
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    // Select sections to track for active link highlighting
    const sections = document.querySelectorAll('main section[id]'); // Target sections within main with an ID

    // --- Mobile Menu Toggle ---
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');

            // Toggle hamburger/close icon
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                // Optional: Prevent body scroll when menu is open
                // document.body.classList.add('no-scroll');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // Optional: Allow body scroll when menu is closed
                // document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Smooth Scroll & Close Mobile Menu on Link Click ---
    if (navLinks.length > 0 && mainNav) {
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navHeight = mainNav.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 15; // Adjusted offset (offsetTop)

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if it's open after clicking a link
                if (navList && navList.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navList.classList.remove('active');
                    // Reset icon
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    // document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // --- Close Mobile Menu on Click Outside ---
    if (menuToggle && navList && mainNav) {
        document.addEventListener('click', (e) => {
            // Check if the click is outside the nav element AND the menu is active
            if (!mainNav.contains(e.target) && navList.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
                // Reset icon
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                // document.body.classList.remove('no-scroll');
            }
        });
    }

    // --- Active Navigation Link Highlighting on Scroll ---
    const activateNavLink = () => {
        if (!mainNav || sections.length === 0 || navLinks.length === 0) return;

        let currentSectionId = '';
        const scrollPosition = window.pageYOffset;
        const navHeight = mainNav.offsetHeight;
        const offsetThreshold = navHeight + 60; // Adjust threshold as needed

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offsetThreshold;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

         // Handle reaching the bottom of the page
         if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50 && sections.length > 0) {
             const lastSection = sections[sections.length - 1];
             if (lastSection) { // Check if lastSection exists
                currentSectionId = lastSection.getAttribute('id');
             }
         }


        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    };

    // Attach scroll listener if sections exist
    if (sections.length > 0) {
        window.addEventListener('scroll', activateNavLink);
        activateNavLink(); // Initial check
    }


    // --- Go Top Button Logic ---
    if (goTopBtn) {
        const showGoTopButton = () => {
            const triggerHeight = window.innerHeight * 0.6; // Show earlier
            if (window.pageYOffset > triggerHeight) {
                goTopBtn.classList.add('show');
            } else {
                goTopBtn.classList.remove('show');
            }
        };

        window.addEventListener('scroll', showGoTopButton);
        goTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        showGoTopButton(); // Initial check
    }


    // --- Scroll Animations using Intersection Observer ---
    if ('IntersectionObserver' in window && elementsToAnimate.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger animation when 10% is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        elementsToAnimate.forEach(el => observer.observe(el));

    } else {
        // Fallback for older browsers: just make elements visible
        elementsToAnimate.forEach(el => el.classList.add('animated'));
    }


    // --- Update Footer Year ---
    if (footerYearSpan) {
        footerYearSpan.textContent = new Date().getFullYear();
    }

    // --- Schema Injection (already handled inline, but log confirms script load) ---
    console.log("Mitali Banerjee Portfolio Script Loaded Successfully.");

}); // End of DOMContentLoaded