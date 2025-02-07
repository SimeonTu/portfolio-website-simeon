document.addEventListener('DOMContentLoaded', function() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const mainContent = document.querySelector('.main-content-wrapper');
    
    if (scrollIndicator && mainContent) {
        console.log('Scroll indicator found');
        mainContent.addEventListener('scroll', function() {
            if (mainContent.scrollTop > 10) { // Show after 10px of scroll
                scrollIndicator.classList.add('hidden');
            } else {
                scrollIndicator.classList.remove('hidden');
            }
        });
    }
}); 