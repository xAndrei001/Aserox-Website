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

    // Player Stats Modal Functionality
    const modalTriggers = document.querySelectorAll('.player-stats-trigger');
    const modals = document.querySelectorAll('.stats-modal');
    const closeButtons = document.querySelectorAll('.close-stats-modal');

    // Function to open a modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            // Add 'active' class after a tiny delay to allow CSS transition to work
            setTimeout(() => {
                modal.classList.add('active');
                document.body.classList.add('modal-open'); // Prevent background scroll
            }, 10); 
        } else {
            console.warn(`Modal with ID "${modalId}" not found.`);
        }
    }

    // Function to close a modal
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.classList.remove('modal-open'); // Allow background scroll
            // Add 'hidden' class after transition finishes
            // Ensure the timeout matches the transition duration in your CSS (0.3s = 300ms)
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300); 
        }
    }

    // Add click event listeners to player images (modal triggers)
    if (modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modalId = trigger.dataset.modalTarget;
                if (modalId) {
                    openModal(modalId);
                } else {
                    console.warn("Modal trigger does not have a data-modal-target attribute:", trigger);
                }
            });
        });
    } else {
        // console.info("No player stats triggers found with class 'player-stats-trigger'.");
    }

    // Add click event listeners to close buttons
    if (closeButtons.length > 0) {
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.stats-modal');
                if (modal) {
                    closeModal(modal);
                } else {
                    console.warn("Could not find parent modal for close button:", button);
                }
            });
        });
    }

    // Add click event listener to modal backdrops to close
    if (modals.length > 0) {
        modals.forEach(modal => {
            modal.addEventListener('click', (event) => {
                // If the click is directly on the modal backdrop (event.target is the modal itself)
                if (event.target === modal) {
                    closeModal(modal);
                }
            });
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.stats-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

}); // End of DOMContentLoaded