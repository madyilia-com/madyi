/**
 * Main JS for Madyilia Ramos static site
 * Handles scroll-based navigation and section highlighting
 */

(function() {
    'use strict';

    const topNav = document.querySelector('.top-nav');
    const siteHead = document.getElementById('site-head');
    const navItems = document.querySelectorAll('.nav-item');
    const posts = document.querySelectorAll('.post');

    // Map section IDs to nav items
    const sectionMap = {};
    navItems.forEach(item => {
        const sectionId = item.getAttribute('data-section');
        if (sectionId) {
            sectionMap[sectionId] = item;
        }
    });

    // Handle scroll events
    function handleScroll() {
        const scrollTop = window.scrollY;
        const headerHeight = siteHead.offsetHeight;

        // Toggle nav background when at top
        if (scrollTop < headerHeight - 100) {
            topNav.classList.add('at-top');
        } else {
            topNav.classList.remove('at-top');
        }

        // Find active section
        let activeSection = null;
        const footer = document.querySelector('.site-footer');
        const footerHeight = footer ? footer.offsetHeight : 0;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        // Check if we're at the bottom of the page
        if ((windowHeight + scrollTop) > (documentHeight - footerHeight - 50)) {
            activeSection = posts[posts.length - 1].id;
        } else {
            // Find which section is currently in view
            posts.forEach((post) => {
                const rect = post.getBoundingClientRect();
                const navHeight = topNav.offsetHeight;

                // Section is active if its top is near the top of viewport (accounting for nav)
                if (rect.top <= navHeight + 100 && rect.bottom > navHeight + 100) {
                    activeSection = post.id;
                }
            });
        }

        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        if (activeSection && sectionMap[activeSection]) {
            sectionMap[activeSection].classList.add('active');
        }
    }

    // Smooth scroll for browsers that don't support CSS scroll-behavior
    function smoothScrollTo(element, duration = 800) {
        const navHeight = topNav.offsetHeight;
        const targetPosition = element.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Update URL hash after scroll completes
                if (element.id) {
                    history.pushState(null, null, '#' + element.id);
                }
            }
        }

        requestAnimationFrame(animation);
    }

    // Testimonials carousel
    function initCarousel() {
        const track = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        if (!track || !prevBtn || !nextBtn) return;

        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        let currentIndex = 0;

        function getVisibleCount() {
            return window.innerWidth <= 500 ? 1 : 3;
        }

        function updateCarousel() {
            const visible = getVisibleCount();
            const maxIndex = Math.max(0, totalCards - visible);
            currentIndex = Math.min(currentIndex, maxIndex);
            const offset = -(currentIndex * (100 / visible));
            track.style.transform = 'translateX(' + offset + '%)';
        }

        nextBtn.addEventListener('click', function() {
            const visible = getVisibleCount();
            const maxIndex = totalCards - visible;
            currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
            updateCarousel();
        });

        prevBtn.addEventListener('click', function() {
            const visible = getVisibleCount();
            const maxIndex = totalCards - visible;
            currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        // Set current year in footer
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

        // Set initial state
        handleScroll();

        // Init carousel
        initCarousel();

        // Add scroll listener with throttle for performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Setup smooth scroll fallback for older browsers
        if (!('scrollBehavior' in document.documentElement.style)) {
            navItems.forEach(function(item) {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('data-section');
                    const target = document.getElementById(targetId);
                    if (target) {
                        smoothScrollTo(target);
                    }
                });
            });

            // Header arrow
            const headerArrow = document.getElementById('header-arrow');
            if (headerArrow) {
                headerArrow.addEventListener('click', function(e) {
                    e.preventDefault();
                    const firstPost = document.querySelector('.post');
                    if (firstPost) {
                        smoothScrollTo(firstPost);
                    }
                });
            }

            // Brand link - scroll to top
            const brandLink = document.querySelector('.nav-brand a');
            if (brandLink) {
                brandLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }

            // Hero CTA button
            const heroCta = document.querySelector('#site-head .cta-button');
            if (heroCta) {
                heroCta.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.getElementById('contacto');
                    if (target) {
                        smoothScrollTo(target);
                    }
                });
            }
        }
    });
})();
