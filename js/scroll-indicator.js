document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const mainContent = document.querySelector('.main-content-wrapper');
    
    if (scrollIndicator) {
        // Check if we're in mobile view
        const isMobileView = window.innerWidth <= 632;
        
        if (isMobileView) {
            // In mobile view, auto-hide after 1.5 seconds
            setTimeout(() => {
                scrollIndicator.classList.add('hidden');
            }, 2000);
        } else {
            // In desktop view, keep original scroll detection
            const handleScroll = function() {
                const scrollAmount = mainContent.scrollTop;
                if (scrollAmount > 10) {
                    scrollIndicator.classList.add('hidden');
                } else {
                    scrollIndicator.classList.remove('hidden');
                }
            };

            if (mainContent) {
                mainContent.addEventListener('scroll', handleScroll);
            }
        }

        // Handle resize events to update view mode
        window.addEventListener('resize', () => {
            const nowMobileView = window.innerWidth <= 632;
            if (nowMobileView) {
                // Remove scroll listeners and auto-hide
                if (mainContent) {
                    mainContent.removeEventListener('scroll', handleScroll);
                }
                scrollIndicator.classList.add('hidden');
            }
        });
    }
}); 