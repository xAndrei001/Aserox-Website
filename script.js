// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // Mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIconOpen = document.getElementById('menu-icon-open');
    const menuIconClose = document.getElementById('menu-icon-close');

    if (mobileMenuButton && mobileMenu && menuIconOpen && menuIconClose) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIconOpen.classList.toggle('hidden');
            menuIconClose.classList.toggle('hidden');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                try {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                            menuIconOpen.classList.remove('hidden');
                            menuIconClose.classList.add('hidden');
                        }
                    }
                } catch (error) {
                    console.error(`Error finding element for smooth scroll: ${targetId}`, error);
                }
            }
        });
    });

    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Simple fade-in animation on scroll
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // --- Generic Modal Functionality ---
    function initializeModals(triggerClass, modalClass, closeButtonClass) {
        const modalTriggers = document.querySelectorAll(`.${triggerClass}`);
        const modals = document.querySelectorAll(`.${modalClass}`);
        const closeButtons = document.querySelectorAll(`.${closeButtonClass}`);

        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => { // Allow display change before starting transition
                    modal.classList.add('active');
                    document.body.classList.add('modal-open');
                }, 10);
            } else {
                console.warn(`Modal with ID "${modalId}" not found.`);
            }
        }

        function closeModal(modal) {
            if (modal) {
                modal.classList.remove('active');
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300); // Must match CSS transition duration
            }
        }

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent click from bubbling up if trigger is inside another clickable element
                const modalId = trigger.dataset.modalTarget;
                if (modalId) {
                    openModal(modalId);
                } else {
                    console.warn("Modal trigger does not have a data-modal-target attribute:", trigger);
                }
            });
        });

        closeButtons.forEach(button => {
            // Check if this button belongs to the current type of modal
            if (button.closest(`.${modalClass}`)) {
                button.addEventListener('click', () => {
                    const modal = button.closest(`.${modalClass}`);
                    closeModal(modal);
                });
            }
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) { // Click on backdrop
                    closeModal(modal);
                }
            });
        });
        
        return { openModal, closeModal }; // Expose functions if needed elsewhere
    }

    // Initialize Settings Modals
    const settingsModalControls = initializeModals('player-settings-trigger', 'settings-modal', 'close-settings-modal');
    // If you had other types of modals, you could initialize them here too:
    // const otherModalControls = initializeModals('other-trigger-class', 'other-modal-class', 'other-close-button-class');


    // Close any active modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeSettingsModal = document.querySelector('.settings-modal.active');
            if (activeSettingsModal) {
                settingsModalControls.closeModal(activeSettingsModal);
            }
            // Add checks for other active modal types if you have them
            // const activeOtherModal = document.querySelector('.other-modal-class.active');
            // if (activeOtherModal) {
            // otherModalControls.closeModal(activeOtherModal);
            // }
        }
    });

}); // End of DOMContentLoaded