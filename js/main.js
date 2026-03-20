/* Main JavaScript — Nav, Animations, Mobile Menu, Form */

(function () {
  'use strict';

  // ── Nav Scroll Behavior ──
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ── Mobile Menu ──
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link, .btn');

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active');
    navToggle.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  navToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      toggleMenu();
    }
  });

  // ── Scroll Reveal ──
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ── Active Nav Link ──
  var sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            var navLinks = document.querySelectorAll('.nav__link');
            navLinks.forEach(function (link) {
              link.style.color = '';
            });
            var activeLink = document.querySelector('.nav__link[href="#' + id + '"]');
            if (activeLink) {
              activeLink.style.color = 'var(--color-accent)';
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  // ── Projects Sidebar ──
  var projectsSidebar = document.getElementById('projectsSidebar');
  var projectsSidebarCompact = document.getElementById('projectsSidebarCompact');
  var projectsSection = document.getElementById('projects');
  var projectCards = document.querySelectorAll('[id^="project-"]');
  var sidebarLinks = document.querySelectorAll('.projects__sidebar-link');
  var compactLinks = document.querySelectorAll('.projects__sidebar-compact-link');

  if ((projectsSidebar || projectsSidebarCompact) && 'IntersectionObserver' in window) {
    // Show sidebars as soon as user scrolls past the hero
    var heroSection = document.getElementById('hero');
    var sidebarVisibility = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (projectsSidebar) projectsSidebar.classList.remove('is-visible');
            if (projectsSidebarCompact) projectsSidebarCompact.classList.remove('is-visible');
          } else {
            if (projectsSidebar) projectsSidebar.classList.add('is-visible');
            if (projectsSidebarCompact) projectsSidebarCompact.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sidebarVisibility.observe(heroSection);

    // Highlight active project based on scroll position
    function updateActiveProject() {
      var scrollCenter = window.scrollY + window.innerHeight * 0.35;

      var activeCard = null;
      projectCards.forEach(function (card) {
        if (card.offsetTop <= scrollCenter) {
          activeCard = card;
        }
      });

      if (activeCard) {
        var id = activeCard.getAttribute('id');
        sidebarLinks.forEach(function (link) {
          link.classList.remove('is-active');
        });
        compactLinks.forEach(function (link) {
          link.classList.remove('is-active');
        });
        var activeLink = document.querySelector('.projects__sidebar-link[data-project="' + id + '"]');
        if (activeLink) {
          activeLink.classList.add('is-active');
        }
        var activeCompact = document.querySelector('.projects__sidebar-compact-link[data-project="' + id + '"]');
        if (activeCompact) {
          activeCompact.classList.add('is-active');
        }
      }
    }

    window.addEventListener('scroll', updateActiveProject, { passive: true });
    updateActiveProject();
  }

  // ── Contact Form ──
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      // If no Formspree ID is set, prevent default and show success
      var action = form.getAttribute('action');
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        e.preventDefault();
        // Demo mode: just show success
        form.style.display = 'none';
        formSuccess.style.display = 'block';
        return;
      }

      // With Formspree, handle via fetch for better UX
      e.preventDefault();
      var data = new FormData(form);

      fetch(action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
        .then(function (response) {
          if (response.ok) {
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            form.reset();
          }
        })
        .catch(function () {
          // Silently fail — form will submit normally as fallback
        });
    });
  }
})();
