// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconOpen = document.getElementById('menu-icon-open');
    const menuIconClose = document.getElementById('menu-icon-close');

    if (mobileMenuButton && mobileMenu && menuIconOpen && menuIconClose) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); // Toggles visibility of the menu
            menuIconOpen.classList.toggle('hidden'); // Toggles visibility of the open icon
            menuIconClose.classList.toggle('hidden'); // Toggles visibility of the close icon
        });
    } else {
        console.warn("Mobile menu elements not found. Ensure IDs are correct: mobile-menu-button, mobile-menu, menu-icon-open, menu-icon-close.");
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute('href');
            // Ensure targetId is not just "#" to prevent errors
            if (targetId.length > 1) {
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth' // Enables smooth scrolling
                        });

                        // Close mobile menu after click if it's open and on a mobile device
                        if (mobileMenu && !mobileMenu.classList.contains('hidden') && menuIconOpen && menuIconClose) {
                            mobileMenu.classList.add('hidden');
                            menuIconOpen.classList.remove('hidden');
                            menuIconClose.classList.add('hidden');
                        }
                    } else {
                        console.warn(`Smooth scroll target element not found for href: ${targetId}`);
                    }
                } catch (error) {
                    // This can happen if targetId is not a valid selector, e.g. "#"
                    console.error(`Error finding element for smooth scroll with href: ${targetId}`, error);
                }
            }
        });
    });

    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    } else {
        console.warn("Element with ID 'currentYear' not found for footer.");
    }

    // Simple fade-in animation on scroll for elements with class 'fade-in-up'
    const observerOptions = {
        root: null, // Observes intersections relative to the document viewport
        rootMargin: '0px', // No margin around the root
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add 'visible' class to trigger animation
                observer.unobserve(entry.target); // Stop observing the element once it's visible
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToFadeIn = document.querySelectorAll('.fade-in-up');

    if (elementsToFadeIn.length > 0) {
        elementsToFadeIn.forEach(el => {
            observer.observe(el); // Start observing each element
        });
    }

    // All previous modal-specific JavaScript has been removed.
    // The hover effect for player stats is handled by CSS (Tailwind's group-hover).

}); // End of DOMContentLoaded