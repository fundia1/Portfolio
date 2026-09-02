/* ==========================================================================
   Navigation & UI Event Controls
   ========================================================================== */

/* Scroll Navigation Effects */
function initScrollNav() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function scrollToSection(id) {
  const elem = document.getElementById(id);
  if (elem) {
    elem.scrollIntoView({ behavior: 'smooth' });
  }
}

function initMetricsAnimation() {
  // Metric counter placeholders initialized
}

/* Interactive Demo Tab Switcher */
function switchDemo(panelId, btnElem) {
  document.querySelectorAll('.demo-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.querySelectorAll('.demo-tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetPanel = document.getElementById(panelId);
  if (targetPanel) targetPanel.classList.add('active');
  if (btnElem) btnElem.classList.add('active');

  setTimeout(() => {
    if (panelId === 'demo-robot' && window.robotResize) window.robotResize();
    if (panelId === 'demo-ekf' && (window.armResize || window.ekfResize)) {
      if (window.armResize) window.armResize();
      else window.ekfResize();
    }
    if (panelId === 'demo-bt' && window.btResize) window.btResize();
  }, 10);
}

window.addEventListener('resize', () => {
  if (window.robotResize) window.robotResize();
  if (window.armResize) window.armResize();
  else if (window.ekfResize) window.ekfResize();
  if (window.btResize) window.btResize();
});

/* Category Filter for Project Matrix */
function filterProjects(category, btnElem) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  if (btnElem) btnElem.classList.add('active');

  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (category === 'all' || cardCat === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}
