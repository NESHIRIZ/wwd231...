(() => {
    // Get DOM elements
    const yearEl = document.getElementById('year');
    const lastModifiedEl = document.getElementById('lastModified');

    // Format date helper
    function formatDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    // Set current year
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Set last modified date
    if (lastModifiedEl) {
        const lastMod = new Date(document.lastModified);
        lastModifiedEl.textContent = formatDate(lastMod);
    }
})();