const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('global-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

const header = document.querySelector('.site-header');
let previousScroll = window.scrollY;

window.addEventListener('scroll', () => {
  if (!header) return;
  const current = window.scrollY;
  if (current > previousScroll && current > 140) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  previousScroll = current;
});

const slides = document.querySelectorAll('.slide');
let slideIndex = 0;

function showSlide(index) {
  if (!slides.length) return;
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

if (slides.length) {
  showSlide(slideIndex);

  const next = document.querySelector('[data-slide="next"]');
  const prev = document.querySelector('[data-slide="prev"]');

  if (next) {
    next.addEventListener('click', () => {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
    });
  }

  if (prev) {
    prev.addEventListener('click', () => {
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
      showSlide(slideIndex);
    });
  }

  setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }, 6000);
}

const faqButtons = document.querySelectorAll('.faq-q');
faqButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answer = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', String(!expanded));
    if (answer) {
      answer.hidden = expanded;
    }
  });
});

const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealTargets.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach((el) => observer.observe(el));
}

const contactForm = document.getElementById('contact-form');
const complete = document.getElementById('complete-message');
if (contactForm && complete) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    complete.hidden = false;
    contactForm.reset();
  });
}
