/**
 * Mangalam HDPE Pipes - Main Script
 * 
 * Features:
 * - Navigation: sticky header & logo home button
 * - Image carousel with auto-play and thumbnail navigation
 * - Interactive image zoom on hover
 * - FAQ accordion toggle
 * - Industry carousel navigation
 * - Form validation and submission
 * - Modal interactions
 * - Hamburger menu for mobile
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVIGATION =====
  // Logo click to scroll home
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.style.cursor = 'pointer';
    navLogo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Sticky header visibility on scroll
  const stickyHeader = document.getElementById('stickyHeader');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight * 0.8;

    if (scrollY > heroHeight) {
      stickyHeader.classList.add('visible');
    } else {
      stickyHeader.classList.remove('visible');
    }
  }, { passive: true });

  // ===== HERO CAROUSEL =====
  const slides = document.querySelectorAll('.carousel-slide');
  const thumbs = document.querySelectorAll('.thumb');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let currentSlide = 0;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    thumbs[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    thumbs[currentSlide].classList.add('active');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      goToSlide(parseInt(thumb.dataset.index));
    });
  });

  // Auto-advance carousel every 4.5 seconds
  setInterval(() => goToSlide(currentSlide + 1), 4500);

  // ===== IMAGE ZOOM EFFECT =====
  function initZoom(container) {
    const zoomPreview = container.querySelector('.zoom-preview');
    const zoomImg = container.querySelector('.zoom-img');
    const mainImg = container.querySelector('img:not(.zoom-img)');

    if (!zoomPreview || !zoomImg || !mainImg) return;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const xRatio = (e.clientX - rect.left) / rect.width;
      const yRatio = (e.clientY - rect.top) / rect.height;
      const previewSize = parseInt(getComputedStyle(zoomPreview).width) || 200;
      const posX = (e.clientX - rect.left) - previewSize / 2;
      const posY = (e.clientY - rect.top) - previewSize / 2;

      zoomPreview.style.left = posX + 'px';
      zoomPreview.style.top = posY + 'px';
      zoomPreview.style.marginLeft = '0';
      zoomPreview.style.marginTop = '0';

      // Offset the zoomed image to show the correct region
      const zoomFactor = 2.5; // magnification level
      const bgX = -xRatio * rect.width * (zoomFactor - 1) + previewSize * (0.5 - xRatio) * (zoomFactor - 1) / zoomFactor;
      const bgY = -yRatio * rect.height * (zoomFactor - 1) + previewSize * (0.5 - yRatio) * (zoomFactor - 1) / zoomFactor;

      // Use background-image approach for cleaner zoom
      zoomPreview.style.backgroundImage = `url(${mainImg.src})`;
      zoomPreview.style.backgroundSize = `${rect.width * zoomFactor}px ${rect.height * zoomFactor}px`;
      zoomPreview.style.backgroundPosition = `-${xRatio * rect.width * zoomFactor - previewSize / 2}px -${yRatio * rect.height * zoomFactor - previewSize / 2}px`;
      zoomPreview.style.backgroundRepeat = 'no-repeat';

      // Hide the inner img (we use background now)
      if (zoomImg) zoomImg.style.display = 'none';
    });
  }

  // Apply zoom to all .carousel-img-wrap and .ind-img-wrap
  document.querySelectorAll('.carousel-img-wrap, .ind-img-wrap').forEach(initZoom);

  // ===== FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const icon = item.querySelector('.faq-icon');

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(fi => {
        fi.classList.remove('active');
        const ic = fi.querySelector('.faq-icon');
        if (ic) ic.textContent = '+';
      });

      if (!isActive) {
        item.classList.add('active');
        if (icon) icon.textContent = '−';
      }
    });
  });

  // ===== INDUSTRY CAROUSEL =====
  const industryTrack = document.getElementById('industryTrack');
  const indPrev = document.getElementById('indPrev');
  const indNext = document.getElementById('indNext');

  if (industryTrack) {
    let indOffset = 0;

    function getCardWidth() {
      const card = industryTrack.querySelector('.industry-card');
      return card ? card.offsetWidth + 16 : 276;
    }

    function getMaxOffset() {
      const trackWidth = industryTrack.scrollWidth;
      const wrapWidth = industryTrack.parentElement.offsetWidth;
      return Math.max(0, trackWidth - wrapWidth);
    }

    function slideIndustry(dir) {
      indOffset += dir * (getCardWidth() * 2);
      indOffset = Math.max(0, Math.min(indOffset, getMaxOffset()));
      industryTrack.style.transform = `translateX(-${indOffset}px)`;
    }

    if (indPrev) indPrev.addEventListener('click', () => slideIndustry(-1));
    if (indNext) indNext.addEventListener('click', () => slideIndustry(1));

    // Touch drag support
    let dragStart = null;
    industryTrack.addEventListener('touchstart', e => { dragStart = e.touches[0].clientX; }, { passive: true });
    industryTrack.addEventListener('touchend', e => {
      if (dragStart === null) return;
      const diff = dragStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) slideIndustry(diff > 0 ? 1 : -1);
      dragStart = null;
    });
  }

  // ===== PROCESS TABS =====
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ===== HAMBURGER MENU =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      const isOpen = navLinks.classList.contains('open');
      
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // ===== SMOOTH SCROLL NAVIGATION =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== CATALOGUE FORM =====
  const catInput = document.querySelector('.cat-input');
  const catBtn = catInput ? catInput.nextElementSibling : null;

  if (catBtn) {
    catBtn.addEventListener('click', () => {
      const val = catInput.value.trim();
      if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        catInput.style.borderColor = '#ef4444';
        catInput.focus();
        setTimeout(() => catInput.style.borderColor = '', 2000);
      } else {
        catBtn.textContent = '✓ Sent!';
        catBtn.style.background = '#22c55e';
        catInput.value = '';
        setTimeout(() => {
          catBtn.textContent = 'Request Catalogue';
          catBtn.style.background = '';
        }, 3000);
      }
    });
  }

  // ===== BUTTON INTERACTIONS =====
  const modalButtons = document.querySelectorAll('.js-open-modal');
  modalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const learnMoreButtons = document.querySelectorAll('.btn-learn');
  learnMoreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const expertButton = document.querySelector('.btn-expert');
  if (expertButton) {
    expertButton.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ===== CONTACT FORM VALIDATION =====
  const submitBtn = document.querySelector('.btn-primary.full-width');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const nameInput = document.querySelector('.contact-form-box .form-input[placeholder="Full Name"]');
      const companyInput = document.querySelector('.contact-form-box .form-input[placeholder="Company Name"]');
      const emailInput = document.querySelector('.contact-form-box .form-input[placeholder="Email Address"]');
      const phoneInput = document.querySelector('.contact-form-box .form-input[placeholder="7003029618"]');
      
      let valid = true;
      const inputs = [nameInput, companyInput, emailInput, phoneInput];
      
      inputs.forEach(inp => {
        if (inp && !inp.value.trim()) {
          inp.style.borderColor = '#ef4444';
          valid = false;
          setTimeout(() => inp.style.borderColor = '', 2000);
        }
      });
      
      // Email validation
      if (emailInput && emailInput.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailInput.style.borderColor = '#ef4444';
        valid = false;
        setTimeout(() => emailInput.style.borderColor = '', 2000);
      }
      
      if (valid) {
        submitBtn.textContent = '✓ Request Submitted!';
        submitBtn.style.background = '#22c55e';
        submitBtn.style.color = 'white';
        
        // Clear form
        inputs.forEach(inp => {
          if (inp) inp.value = '';
        });
        
        setTimeout(() => {
          submitBtn.textContent = 'Request Custom Quote';
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 3000);
      }
    });
  }

}); // end DOMContentLoaded