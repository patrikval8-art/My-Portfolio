// script.js
console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  // ---------- About popup (keeps your behavior) ----------
  const aboutButton = document.getElementById("openAbout");
  if (aboutButton) {
    aboutButton.addEventListener("click", () => {
      const width = 1400;
      const height = 900;
      const left = Math.max(0, (screen.width / 2) - (width / 2));
      const top = Math.max(0, (screen.height / 2) - (height / 2));
      const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
      const newWin = window.open("about.html", "AboutMeWindow", features);

      if (!newWin) {
        alert("Popup blocked. Please allow popups for this site to see the About window (or open about.html manually).");
        return;
      }
      newWin.focus();
    });
  }

  // ---------- Skills toggle (keeps your behavior) ----------
  const showSkillsBtn = document.getElementById('showSkillsBtn');
  const skillsContent = document.querySelector('.skills-content');
  if (showSkillsBtn && skillsContent) {
    showSkillsBtn.addEventListener('click', () => {
      skillsContent.classList.toggle('expanded');
      showSkillsBtn.textContent = skillsContent.classList.contains('expanded') ? "Hide Skills" : "Show Skills";
    });
  }

  // ---------- Open project in a new window (one per project) ----------
  // Use data-url as window name (safe-ish) so each project gets its own dedicated window.
  document.querySelectorAll('.project-box').forEach((box, idx) => {
    box.addEventListener('click', (e) => {
      const projectUrl = box.getAttribute('data-url');
      if (!projectUrl) return;

      const width = 1200;
      const height = 800;
      const left = Math.max(0, (screen.width / 2) - (width / 2));
      const top = Math.max(0, (screen.height / 2) - (height / 2));
      const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

      // Use a unique window name for each project to ensure separate windows:
      const winName = `project_window_${idx}_${projectUrl.replace(/\W/g, '_')}`;

      const newWin = window.open(projectUrl, winName, features);
      if (!newWin) {
        alert("Popup blocked. Please allow popups for this site to view the project.");
      } else {
        newWin.focus();
      }
    });
  });

  // ---------- "My Work" button scroll ---------- (preserve your behavior)
  const myWorkBtn = document.querySelector('.mywork-button');
  if (myWorkBtn) {
    myWorkBtn.addEventListener('click', () => {
      const myWorkSection = document.getElementById('mywork');
      if (myWorkSection) myWorkSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------- Smooth nav link scrolling + prevent default jump ----------
  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        // scroll with offset to account for fixed nav
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 88;
        const top = target.getBoundingClientRect().top + window.scrollY - (navHeight - 12);
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---------- IntersectionObserver: reveal sections and highlight nav ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('a.nav-link');

  // Map section id -> nav link element
  const navMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      navMap[href.slice(1)] = link;
    }
  });

  // Observer options: trigger when section crosses roughly center of viewport
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px', // treat the middle of viewport as trigger
    threshold: 0
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      // Reveal animation: add class when at least partially visible
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // activate corresponding nav link
        if (navMap[id]) {
          navLinks.forEach(n => n.classList.remove('active'));
          navMap[id].classList.add('active');
        }
      } else {
        // Optionally remove reveal class when out of view (keeps subtle)
        // entry.target.classList.remove('in-view'); // commented to keep sections revealed once shown
      }
    });
  }, observerOptions);

  sections.forEach(s => io.observe(s));

  // run a quick activation on load to ensure correct link is active if page loaded mid-scroll
  setTimeout(() => {
    // find section closest to viewport center manually as fallback
    let closest = null;
    let minDistance = Infinity;
    const viewportCenter = window.scrollY + (window.innerHeight / 2);
    sections.forEach(s => {
      const rect = s.getBoundingClientRect();
      const sectionCenter = window.scrollY + rect.top + (rect.height / 2);
      const dist = Math.abs(sectionCenter - viewportCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closest = s;
      }
    });
    if (closest && navMap[closest.id]) {
      navLinks.forEach(n => n.classList.remove('active'));
      navMap[closest.id].classList.add('active');
      closest.classList.add('in-view');
    }
  }, 200);
});

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('nav ul');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });

  // Close menu on link click (for smoother UX)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('show');
    });
  });
}

