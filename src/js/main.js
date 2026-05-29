// 星野畳店 main.js

// ---------- ドロワーメニュー ----------
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawerClose');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  drawer.classList.add('is-open');
  drawerOverlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('is-open');
  drawerOverlay.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openDrawer);
if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

// ---------- ヒーロースライダー（ケンバーンズ） ----------
const slides = document.querySelectorAll('.hero__slide');
const dots = document.querySelectorAll('.hero__dot');
let current = 0;
let sliderTimer = null;

function goSlide(index) {
  slides[current].classList.remove('is-active');
  dots[current] && dots[current].classList.remove('is-active');
  current = index;
  slides[current].classList.add('is-active');
  dots[current] && dots[current].classList.add('is-active');
  // ケンバーンズ再起動
  const bg = slides[current].querySelector('.hero__bg');
  if (bg) {
    bg.style.animation = 'none';
    bg.offsetHeight; // reflow
    bg.style.animation = '';
  }
}

function nextSlide() {
  goSlide((current + 1) % slides.length);
}

if (slides.length > 0) {
  sliderTimer = setInterval(nextSlide, 5000);
}

// ---------- 料金表タブ ----------
const priceTabs = document.querySelectorAll('.price-tab');
const priceContents = document.querySelectorAll('.price-tab-content');

priceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    priceTabs.forEach(t => t.classList.remove('is-active'));
    priceContents.forEach(c => c.classList.remove('is-active'));
    tab.classList.add('is-active');
    document.getElementById(target).classList.add('is-active');
  });
});

// ---------- スクロールアニメーション ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
