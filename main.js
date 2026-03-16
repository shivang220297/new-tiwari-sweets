/**
 * NEW TIWARI SWEETS — main.js
 * ─────────────────────────────────────────────────────
 * 1. Body js-ready class for scroll reveal
 * 2. IntersectionObserver scroll reveal (threshold: 0)
 * 3. Custom cursor (pointer:fine + !ontouchstart + maxTouchPoints===0)
 * 4. WhatsApp bubble visibility
 * 5. Nav scroll shadow
 * ─────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════
     1. JS-READY — activates CSS-gated reveal states
     ═══════════════════════════════════════════════════ */
  document.body.classList.add('js-ready');


  /* ═══════════════════════════════════════════════════
     2. SCROLL REVEAL
     threshold:0  — triggers as soon as even 1px enters view
     rootMargin   — slight offset so content reveals just before
     ═══════════════════════════════════════════════════ */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealEls.forEach(function (el, i) {
      // Stagger siblings in the same group (mod 4 keeps delay small)
      el.style.transitionDelay = (i % 4) * 0.1 + 's';
      revealObserver.observe(el);
    });
  } else {
    // Fallback — just show everything
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }


  /* ═══════════════════════════════════════════════════
     3. CUSTOM CURSOR
     Only on fine-pointer desktops with no touch support
     Two elements: c-dot (snaps) + c-ring (lags)
     ═══════════════════════════════════════════════════ */
  var isFinePointer =
    window.matchMedia('(pointer: fine)').matches &&
    !('ontouchstart' in window) &&
    navigator.maxTouchPoints === 0;

  if (isFinePointer) {
    var dot  = document.getElementById('cDot');
    var ring = document.getElementById('cRing');

    if (dot && ring) {
      // Show cursor elements
      dot.style.display  = 'block';
      ring.style.display = 'block';

      // Hide native cursor on whole page
      document.body.style.cursor = 'none';

      var mouseX = 0, mouseY = 0;
      var ringX  = 0, ringY  = 0;
      var isRAFRunning = false;

      document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isRAFRunning) {
          isRAFRunning = true;
          requestAnimationFrame(animateCursor);
        }
      });

      function animateCursor() {
        // Dot snaps exactly to pointer
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';

        // Ring follows with easing (lerp)
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';

        requestAnimationFrame(animateCursor);
      }

      // Hover state on interactive elements
      var interactiveEls = document.querySelectorAll(
        'a, button, [role="button"], .svc-card, .rcard, .btn'
      );

      interactiveEls.forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          el.style.cursor = 'none';
          dot.style.transform  = 'translate(-50%, -50%) scale(2.5)';
          dot.style.background = 'var(--clr-gold)';
          ring.style.transform = 'translate(-50%, -50%) scale(1.6)';
          ring.style.borderColor = 'var(--clr-saffron)';
        });
        el.addEventListener('mouseleave', function () {
          dot.style.transform  = 'translate(-50%, -50%) scale(1)';
          dot.style.background = 'var(--clr-saffron)';
          ring.style.transform = 'translate(-50%, -50%) scale(1)';
          ring.style.borderColor = 'var(--clr-gold)';
        });
      });

      // Hide on mouse leave window
      document.addEventListener('mouseleave', function () {
        dot.style.opacity  = '0';
        ring.style.opacity = '0';
      });
      document.addEventListener('mouseenter', function () {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
      });
    }
  }


  /* ═══════════════════════════════════════════════════
     4. WHATSAPP FLOAT — always visible after 300px scroll
     ═══════════════════════════════════════════════════ */
  var waBtn = document.querySelector('.wa-float');

  if (waBtn) {
    // Start slightly faded, full opacity on scroll
    waBtn.style.opacity = '0.8';
    waBtn.style.transition = 'opacity 0.4s ease, transform 0.3s cubic-bezier(0.4,0,0.2,1)';

    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 300) {
          waBtn.style.opacity = '1';
        } else {
          waBtn.style.opacity = '0.8';
        }
      },
      { passive: true }
    );
  }


  /* ═══════════════════════════════════════════════════
     5. NAV SHADOW ON SCROLL
     ═══════════════════════════════════════════════════ */
  var nav = document.querySelector('.nav');

  if (nav) {
    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 50) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
      },
      { passive: true }
    );
  }


  /* ═══════════════════════════════════════════════════
     6. SMOOTH ACTIVE LINK HIGHLIGHT ON SCROLL
        (highlights nav link for section in view)
     ═══════════════════════════════════════════════════ */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__links li a[href^="#"]');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var activeId = '';

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            activeId = '#' + entry.target.id;
            navLinks.forEach(function (link) {
              if (link.getAttribute('href') === activeId) {
                link.style.color = 'var(--clr-saffron)';
              } else {
                link.style.color = '';
              }
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach(function (sec) {
      sectionObserver.observe(sec);
    });
  }

})();
