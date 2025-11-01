// Navigation: accessible mobile toggle, outside-click close, ESC to close, active-link highlight, smooth scroll for anchors

(function () {
  const nav = document.querySelector('.main-nav');
  const hamburger = nav?.querySelector('.hamburger');
  const menu = nav?.querySelector('ul');

  if (!nav || !hamburger || !menu) return;

  // Toggle menu state
  function toggleMenu(open) {
    hamburger.setAttribute('aria-expanded', open);
    menu.classList.toggle('show', open);

    if (open) {
      // Trap focus in menu when open
      menu.querySelector('a')?.focus();
    }
  }

  // Event Listeners
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    toggleMenu(!isExpanded);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('show')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && menu.classList.contains('show')) {
      toggleMenu(false);
    }
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });

        // Close mobile menu if open
        if (menu.classList.contains('show')) {
          toggleMenu(false);
        }
      }
    });
  });

  // Mark current section in navigation
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.main-nav a').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
  });
})();