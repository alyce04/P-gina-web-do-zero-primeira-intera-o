// ============================================================
// script.js — Camada de inteligência, dados, renderização e interações
// ============================================================

// ---------- DADOS (arrays de objetos) ----------
const trajes = [
  { id: 1, nome: 'Clássico', imagem: '🕷️' },
  { id: 2, nome: 'Simbiose', imagem: '⚫' },
  { id: 3, nome: 'Aranha-Noir', imagem: '🕶️' },
  { id: 4, nome: 'Miles Morales', imagem: '⚡' },
  { id: 5, nome: 'Aranha-2099', imagem: '💠' },
  { id: 6, nome: 'Aranha-Stealth', imagem: '🌙' },
];

const poderes = [
  { titulo: 'Sentido-Aranha', descricao: 'Alerta sobre perigos iminentes e aumenta os reflexos.' },
  { titulo: 'Força sobre-humana', descricao: 'Capaz de levantar até 10 toneladas com facilidade.' },
  { titulo: 'Agilidade & escalada', descricao: 'Escala paredes e se move com agilidade felina.' },
  { titulo: 'Teias orgânicas', descricao: 'Dispara teias resistentes para se balançar ou prender inimigos.' },
];

const depoimentos = [
  { id: 1, texto: 'O verdadeiro herói da vizinhança. Sempre inspirador.', autor: 'Mary Jane' },
  { id: 2, texto: 'Ele me salvou de um assalto! É rápido e gentil.', autor: 'Tio Ben (memória)' },
  { id: 3, texto: 'Sua inteligência e coração são tão grandes quanto seus poderes.', autor: 'Tony Stark' },
];

// ---------- RENDERIZAÇÃO DINÂMICA ----------
// 1. Galeria
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
  galleryGrid.innerHTML = trajes.map(item => `
    <div class="gallery-card" role="listitem">
      <div style="font-size:3rem; line-height:1;">${item.imagem}</div>
      <h3>${item.nome}</h3>
    </div>
  `).join('');
}

// 2. Acordeão (Poderes)
const accordionContainer = document.getElementById('accordionPowers');
if (accordionContainer) {
  accordionContainer.innerHTML = poderes.map((p, index) => `
    <div class="accordion-item" role="tab" aria-expanded="${index === 0 ? 'true' : 'false'}" id="accordion-${index}">
      <div class="accordion-header" role="tab" aria-controls="content-${index}" tabindex="0">
        <span>${p.titulo}</span>
        <span class="icon" aria-hidden="true">▼</span>
      </div>
      <div class="accordion-content" role="tabpanel" id="content-${index}" aria-labelledby="accordion-${index}">
        <p>${p.descricao}</p>
      </div>
    </div>
  `).join('');

  // Eventos para acordeão
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function(e) {
      const item = this.closest('.accordion-item');
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      // Fecha outros (opcional) e alterna
      document.querySelectorAll('.accordion-item').forEach(el => el.setAttribute('aria-expanded', 'false'));
      if (!isExpanded) {
        item.setAttribute('aria-expanded', 'true');
      }
    });
    // Acessibilidade com teclado (Enter/Space)
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

// 3. Carrossel
const track = document.getElementById('carouselTrack');
let currentSlide = 0;

if (track) {
  track.innerHTML = depoimentos.map(d => `
    <div class="carousel-item" role="group" aria-label="Depoimento ${d.id}">
      <blockquote>${d.texto}</blockquote>
      <cite>— ${d.autor}</cite>
    </div>
  `).join('');

  const updateCarousel = () => {
    const total = depoimentos.length;
    if (currentSlide >= total) currentSlide = 0;
    if (currentSlide < 0) currentSlide = total - 1;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    // ARIA: atualizar atributos para leitores de tela (opcional)
    track.querySelectorAll('.carousel-item').forEach((el, i) => {
      el.setAttribute('aria-hidden', i === currentSlide ? 'false' : 'true');
    });
  };

  document.getElementById('prevBtn')?.addEventListener('click', () => {
    currentSlide--;
    updateCarousel();
  });
  document.getElementById('nextBtn')?.addEventListener('click', () => {
    currentSlide++;
    updateCarousel();
  });
  updateCarousel(); // inicializa
}

// ---------- ACESSIBILIDADE: FONTE GLOBAL ----------
let currentFontSize = 1; // fator multiplicador (1 = 100%)
const body = document.body;
const fontStep = 0.1;

function updateFontSize(factor) {
  currentFontSize = Math.min(1.8, Math.max(0.7, factor));
  body.style.fontSize = `${currentFontSize * 1}rem`; // 1rem base
}

document.getElementById('increaseFont')?.addEventListener('click', () => {
  updateFontSize(currentFontSize + fontStep);
});
document.getElementById('decreaseFont')?.addEventListener('click', () => {
  updateFontSize(currentFontSize - fontStep);
});

// ---------- ALTO CONTRASTE ----------
document.getElementById('toggleContrast')?.addEventListener('click', () => {
  body.classList.toggle('high-contrast');
  // Salvar preferência? (opcional)
});

// ---------- SCROLL REVEAL (entrada suave) ----------
const revealElements = document.querySelectorAll('.section, .hero, .gallery-card, .accordion-item, .carousel-item');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Aplicar opacity 1 para elementos já visíveis (após carregamento)
setTimeout(() => {
  revealElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}, 100);
