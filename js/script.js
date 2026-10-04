/* ================================================================
   BIRTHDAY WEBSITE — SCRIPT.JS
   ------------------------------------------------------------------
   Cari komentar "GANTI DI SINI" untuk bagian yang paling sering
   ingin kamu kustomisasi (nama, umur, pesan, foto, warna tombol).
================================================================ */

(() => {
  'use strict';

  /* ============================================================
     0. CONFIG — GANTI DI SINI
     Ini adalah satu-satunya tempat yang perlu kamu ubah untuk
     data dasar. HTML akan otomatis mengikuti nilai ini lewat
     elemen [data-field="name"] dan #age-number.
  ============================================================= */
  const CONFIG = {
    name: 'Sayang',              // nama orang yang berulang tahun
    age: 24,                     // umur yang akan dirayakan
    photos: [                    // path foto (relatif ke index.html)
      'images/photo1.jpg',
      'images/photo2.jpg',
      'images/photo3.jpg',
      'images/photo4.jpg',
    ],
    musicSrc: 'music/birthday.mp3',

    // Strip foto ala photobooth (halaman "Photobooth Kenangan").
    // Tambah/kurangi array di dalam "strips" untuk menambah/mengurangi
    // jumlah strip, dan tambah/kurangi path foto di tiap strip untuk
    // mengubah jumlah foto per strip (idealnya 3-4 foto per strip).
    photobooth: {
      strips: [
        ['images/photo5.jpg', 'images/photo6.jpg', 'images/photo7.jpg'],
        ['images/photo8.jpg', 'images/photo9.jpg', 'images/photo10.jpg'],
      ],
    },

    theme: {
      // Dipakai untuk fireworks & confetti agar seirama dengan tema CSS
      colors: ['#E85D8C', '#E8C15C', '#C9A6E8', '#FFF9FB'],
    },
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isMobile: window.matchMedia('(max-width: 720px), (pointer: coarse)').matches,
  };

  // Terapkan nama & umur ke semua elemen bertanda data-field="name"
  document.querySelectorAll('[data-field="name"]').forEach(el => { el.textContent = CONFIG.name; });
  const ageNumberEl = document.getElementById('age-number');
  if (ageNumberEl) ageNumberEl.dataset.target = String(CONFIG.age);

  /* ============================================================
     1. PLACEHOLDER FOTO (jika file gambar belum ada / gagal dimuat)
     Membuat SVG gradient elegan sebagai pengganti, supaya tidak
     muncul ikon "gambar rusak" pada browser.
  ============================================================= */
  function makePlaceholderDataURI(label){
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#FBD9E8"/>
            <stop offset="100%" stop-color="#C9A6E8"/>
          </linearGradient>
        </defs>
        <rect width="400" height="400" fill="url(#g)"/>
        <text x="50%" y="50%" font-family="Poppins, sans-serif" font-size="26"
              fill="#7A5A6B" text-anchor="middle" dominant-baseline="middle">${label}</text>
      </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
  }
  function attachPlaceholderFallback(img, label){
    img.addEventListener('error', () => { img.src = makePlaceholderDataURI(label); }, { once: true });
  }
  document.querySelectorAll('#polaroid-grid img').forEach(img => {
    attachPlaceholderFallback(img, img.dataset.phLabel || 'Foto');
  });

  /* ============================================================
     1b. RENDER STRIP PHOTOBOOTH
     Membangun setiap strip dari CONFIG.photobooth.strips, lengkap
     dengan bingkai bunga (wreath) hasil clone dari <template>.
  ============================================================= */
  function renderPhotobooth(){
    const row = document.getElementById('photobooth-row');
    const wreathTemplate = document.getElementById('wreath-template');
    if (!row || !wreathTemplate) return;

    CONFIG.photobooth.strips.forEach((photos, stripIndex) => {
      const strip = document.createElement('div');
      strip.className = 'photobooth-strip';

      const photosWrap = document.createElement('div');
      photosWrap.className = 'photobooth-photos';
      photos.forEach((src, i) => {
        const img = document.createElement('img');
        img.className = 'photobooth-photo';
        img.src = src;
        img.alt = `Kenangan photobooth ${stripIndex + 1}-${i + 1}`;
        img.loading = 'lazy';
        attachPlaceholderFallback(img, `Foto ${stripIndex + 1}.${i + 1}`);
        photosWrap.appendChild(img);
      });
      strip.appendChild(photosWrap);

      const caption = document.createElement('div');
      caption.className = 'wreath-caption';
      caption.appendChild(wreathTemplate.content.cloneNode(true));
      strip.appendChild(caption);

      row.appendChild(strip);
    });

    // Terapkan nama ke caption wreath yang baru saja di-clone
    row.querySelectorAll('[data-field="name"]').forEach(el => { el.textContent = CONFIG.name; });
  }
  renderPhotobooth();

  /* ============================================================
     2. FLOATING HEARTS / STARS / SPARKLES DI HERO
  ============================================================= */
  const heroFloaters = document.getElementById('hero-floaters');
  const FLOAT_SYMBOLS = ['❤','✨','⭐'];
  function spawnFloaters(container, count){
    if (!container) return;
    const n = CONFIG.reducedMotion ? 0 : (CONFIG.isMobile ? Math.min(count, 8) : count);
    for (let i = 0; i < n; i++){
      const span = document.createElement('span');
      span.textContent = FLOAT_SYMBOLS[i % FLOAT_SYMBOLS.length];
      const size = 12 + Math.random() * 16;
      span.style.left = Math.random() * 100 + '%';
      span.style.fontSize = size + 'px';
      span.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      span.style.animationDuration = (10 + Math.random() * 10) + 's';
      span.style.animationDelay = (Math.random() * 10) + 's';
      span.style.color = Math.random() > 0.5 ? 'var(--c-rose)' : 'var(--c-gold)';
      container.appendChild(span);
    }
  }
  spawnFloaters(heroFloaters, 16);

  /* ============================================================
     3. KELOPAK BUNGA JATUH (petals)
  ============================================================= */
  const petalsLayer = document.getElementById('petals-hero');
  function spawnPetals(container, count){
    if (!container) return;
    const n = CONFIG.reducedMotion ? 0 : (CONFIG.isMobile ? Math.min(count, 10) : count);
    for (let i = 0; i < n; i++){
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.left = Math.random() * 100 + '%';
      petal.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
      petal.style.animationDuration = (7 + Math.random() * 8) + 's';
      petal.style.animationDelay = (Math.random() * 8) + 's';
      petal.style.background = Math.random() > 0.5 ? 'var(--c-pink-soft)' : 'var(--c-purple-soft)';
      container.appendChild(petal);
    }
  }
  spawnPetals(petalsLayer, 18);

  /* ============================================================
     4. ANIMASI PEMBUKAAN HADIAH
  ============================================================= */
  const openGiftBtn = document.getElementById('open-gift-btn');
  const giftOverlay = document.getElementById('gift-overlay');
  const giftBox = document.getElementById('gift-box');
  const mainContent = document.getElementById('main-content');
  const hero = document.getElementById('hero');

  openGiftBtn?.addEventListener('click', () => {
    hero.style.display = 'none';
    giftOverlay.hidden = false;
    // Kembang api langsung meletus begitu tombol "Buka Hadiah" dipencet
    introFireworks.launch();
    // sedikit delay biar terasa "diketuk" dulu sebelum terbuka
    requestAnimationFrame(() => {
      giftBox.classList.add('opening');
    });
    setTimeout(() => {
      giftOverlay.classList.add('hide-overlay');
      mainContent.hidden = false;
      initPager(); // mulai sistem halaman setelah konten tampil
      document.body.style.overflow = '';
    }, CONFIG.reducedMotion ? 200 : 1100);
  });

  /* ============================================================
     5. PAGER — navigasi "satu halaman, satu fokus"
     Berpindah lewat tombol panah, titik indikator, swipe, atau
     tombol panah keyboard — bukan scroll bersambungan.
  ============================================================= */
  const pagesWrap = document.getElementById('pages');
  const pageEls = pagesWrap ? Array.from(pagesWrap.querySelectorAll('.page')) : [];
  const pageDotsWrap = document.getElementById('page-dots');
  const prevBtn = document.getElementById('page-prev');
  const nextBtn = document.getElementById('page-next');
  let currentPageIndex = 0;
  let pagerReady = false;

  // Buat titik indikator otomatis, satu per halaman
  function buildDots(){
    if (!pageDotsWrap) return;
    pageEls.forEach((page, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'page-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      dot.setAttribute('aria-label', `Ke halaman ${i + 1}`);
      dot.addEventListener('click', () => goToPage(i));
      pageDotsWrap.appendChild(dot);
    });
  }
  buildDots();
  const dotEls = pageDotsWrap ? Array.from(pageDotsWrap.children) : [];

  function updateNavUI(){
    dotEls.forEach((dot, i) => dot.setAttribute('aria-current', i === currentPageIndex ? 'true' : 'false'));
    if (prevBtn) prevBtn.disabled = currentPageIndex === 0;
    if (nextBtn) nextBtn.disabled = currentPageIndex === pageEls.length - 1;
  }

  // Munculkan ulang animasi fade-up/timeline setiap kali sebuah halaman dikunjungi
  function revealPageContent(page){
    if (!page) return;
    const targets = page.querySelectorAll('.fade-up, .reveal-anim, .timeline-item');
    targets.forEach((el, i) => {
      el.classList.remove('in-view');
      void el.offsetWidth; // paksa reflow supaya animasi bisa diputar ulang
      const delay = CONFIG.reducedMotion ? 0 : i * 90;
      setTimeout(() => el.classList.add('in-view'), delay);
    });
    if (page.id === 'timeline') animateAgeCounter();
  }

  function goToPage(index){
    if (!pagerReady || index < 0 || index >= pageEls.length || index === currentPageIndex) return;
    const direction = index > currentPageIndex ? 1 : -1;
    const prevIndex = currentPageIndex;
    const oldPage = pageEls[prevIndex];
    const newPage = pageEls[index];

    newPage.dataset.state = direction === 1 ? 'next' : 'prev';
    void newPage.offsetWidth; // reflow supaya transisi mulai dari posisi ini

    requestAnimationFrame(() => {
      newPage.dataset.state = 'active';
      oldPage.dataset.state = direction === 1 ? 'prev' : 'next';
    });

    currentPageIndex = index;
    updateNavUI();
    revealPageContent(newPage);

    setTimeout(() => {
      if (oldPage.dataset.state !== 'active') oldPage.dataset.state = 'hidden';
    }, CONFIG.reducedMotion ? 50 : 600);
  }

  function initPager(){
    pagerReady = true;
    updateNavUI();
    revealPageContent(pageEls[currentPageIndex]);
  }

  prevBtn?.addEventListener('click', () => goToPage(currentPageIndex - 1));
  nextBtn?.addEventListener('click', () => goToPage(currentPageIndex + 1));

  window.addEventListener('keydown', (e) => {
    if (!pagerReady) return;
    if (e.key === 'ArrowRight') goToPage(currentPageIndex + 1);
    if (e.key === 'ArrowLeft') goToPage(currentPageIndex - 1);
  });

  // Swipe sentuh kiri/kanan untuk pindah halaman (tidak mengganggu scroll vertikal di dalam halaman)
  (function initSwipeNav(){
    if (!pagesWrap) return;
    let startX = 0, startY = 0, tracking = false;
    pagesWrap.addEventListener('touchstart', (e) => {
      if (!pagerReady) return;
      const t = e.touches[0];
      startX = t.clientX; startY = t.clientY; tracking = true;
    }, { passive: true });
    pagesWrap.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4){
        goToPage(currentPageIndex + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
  })();

  document.getElementById('scroll-to-message')?.addEventListener('click', () => {
    const idx = pageEls.findIndex(p => p.id === 'message');
    if (idx > -1) goToPage(idx);
  });

  function animateAgeCounter(){
    if (!ageNumberEl) return;
    const target = parseInt(ageNumberEl.dataset.target, 10) || 0;
    if (CONFIG.reducedMotion){ ageNumberEl.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      ageNumberEl.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ============================================================
     6. MUSIK
  ============================================================= */
  const musicToggle = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic) bgMusic.src = CONFIG.musicSrc;

  musicToggle?.addEventListener('click', () => {
    if (!bgMusic) return;
    if (bgMusic.paused){
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-pressed', 'true');
      }).catch(() => {
        // Browser memblokir autoplay/putar — beri tahu secara halus
        musicToggle.classList.remove('playing');
        musicToggle.title = 'Tidak bisa memutar musik (file belum tersedia atau diblokir browser)';
      });
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      musicToggle.setAttribute('aria-pressed', 'false');
    }
  });

  /* ============================================================
     7. TIUP LILIN
  ============================================================= */
  const blowBtn = document.getElementById('blow-candles-btn');
  const wishText = document.getElementById('wish-text');
  const candles = document.querySelectorAll('#cake-el .candle');

  blowBtn?.addEventListener('click', () => {
    candles.forEach((c, i) => {
      setTimeout(() => { c.dataset.lit = 'false'; }, i * 180);
    });
    setTimeout(() => {
      wishText.hidden = false;
      blowBtn.disabled = true;
      blowBtn.style.opacity = '.5';
    }, candles.length * 180 + 300);
  });

  /* ============================================================
     8. FIREWORKS (Canvas) — mesin yang bisa dipakai ulang
     Dipakai untuk 2 momen: (a) saat hadiah pertama kali dibuka,
     dan (b) saat tombol "Rayakan!" ditekan di bagian akhir.
  ============================================================= */
  function createFireworksEngine(canvas, { fullscreen = false } = {}){
    const ctx = canvas?.getContext('2d');
    let particles = [];
    let running = false;

    function resize(){
      if (!canvas) return;
      if (fullscreen){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      } else {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    }

    function burst(x, y){
      const color = CONFIG.theme.colors[Math.floor(Math.random() * CONFIG.theme.colors.length)];
      const count = CONFIG.isMobile ? 26 : 44; // batasi jumlah particle di mobile
      for (let i = 0; i < count; i++){
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 3.2;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.01,
          color,
          size: 2 + Math.random() * 2,
        });
      }
    }

    function loop(){
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035; // gravitasi ringan
        p.life -= p.decay;
        if (p.life > 0){
          ctx.beginPath();
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      particles = particles.filter(p => p.life > 0);

      if (particles.length > 0 && running){
        requestAnimationFrame(loop);
      } else {
        running = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function launch(){
      if (!canvas || CONFIG.reducedMotion) return;
      resize();
      const bursts = CONFIG.isMobile ? 4 : 7;
      for (let i = 0; i < bursts; i++){
        setTimeout(() => {
          const x = canvas.width * (0.2 + Math.random() * 0.6);
          const y = canvas.height * (0.15 + Math.random() * 0.4);
          burst(x, y);
          if (!running){
            running = true;
            loop();
          }
        }, i * 420);
      }
      setTimeout(() => { running = false; }, bursts * 420 + 2200);
    }

    function stop(){ running = false; particles = []; }

    return { launch, resize, stop };
  }

  const fwCanvas = document.getElementById('fireworks-canvas');
  const celebrateFireworks = createFireworksEngine(fwCanvas);
  function launchFireworks(){ celebrateFireworks.launch(); }

  // Mesin kembang api khusus untuk momen "hadiah baru dibuka"
  const introFwCanvas = document.getElementById('intro-fireworks-canvas');
  const introFireworks = createFireworksEngine(introFwCanvas, { fullscreen: true });

  /* ============================================================
     9. CONFETTI (Canvas)
  ============================================================= */
  const confettiCanvas = document.getElementById('confetti-canvas');
  const confCtx = confettiCanvas?.getContext('2d');
  let confParticles = [];
  let confRunning = false;

  function resizeConfettiCanvas(){
    if (!confettiCanvas) return;
    const rect = confettiCanvas.parentElement.getBoundingClientRect();
    confettiCanvas.width = rect.width;
    confettiCanvas.height = rect.height;
  }

  function launchConfetti(){
    if (!confettiCanvas || CONFIG.reducedMotion) return;
    resizeConfettiCanvas();
    const count = CONFIG.isMobile ? 60 : 130;
    confParticles = [];
    for (let i = 0; i < count; i++){
      confParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.4,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 8,
        vy: 2 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 2,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 8,
        color: CONFIG.theme.colors[Math.floor(Math.random() * CONFIG.theme.colors.length)],
        life: 1,
      });
    }
    if (!confRunning){
      confRunning = true;
      confettiLoop();
    }
  }

  function confettiLoop(){
    if (!confCtx) return;
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > confettiCanvas.height * 0.85) p.life -= 0.02;
      confCtx.save();
      confCtx.globalAlpha = Math.max(p.life, 0);
      confCtx.translate(p.x, p.y);
      confCtx.rotate((p.rot * Math.PI) / 180);
      confCtx.fillStyle = p.color;
      confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confCtx.restore();
    });
    confParticles = confParticles.filter(p => p.life > 0 && p.y < confettiCanvas.height + 40);
    if (confParticles.length > 0){
      requestAnimationFrame(confettiLoop);
    } else {
      confRunning = false;
      confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  /* ============================================================
     10. TOMBOL "RAYAKAN!" — final scene
  ============================================================= */
  const celebrateBtn = document.getElementById('celebrate-btn');
  const celebrateScreen = document.getElementById('celebrate');
  const finalMessage = document.getElementById('final-message');

  celebrateBtn?.addEventListener('click', () => {
    celebrateScreen.classList.add('is-dark');
    launchFireworks();
    launchConfetti();
    celebrateBtn.style.display = 'none';
    setTimeout(() => { finalMessage.hidden = false; }, 500);
  });

  window.addEventListener('resize', () => {
    celebrateFireworks.resize();
    introFireworks.resize();
    resizeConfettiCanvas();
  });

  // Hentikan animasi canvas ketika tab tidak aktif, demi performa & baterai
  document.addEventListener('visibilitychange', () => {
    if (document.hidden){
      celebrateFireworks.stop();
      introFireworks.stop();
      confParticles = [];
    }
  });

  /* ============================================================
     11. CURSOR SPARKLE (desktop saja, mati otomatis di mobile)
  ============================================================= */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && !CONFIG.isMobile && !CONFIG.reducedMotion){
    let raf = null;
    window.addEventListener('pointermove', (e) => {
      cursorGlow.classList.add('active');
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
      });
    });
    window.addEventListener('pointerleave', () => cursorGlow.classList.remove('active'));
  } else if (cursorGlow) {
    cursorGlow.remove(); // tidak dibutuhkan di mobile / reduced motion
  }

  /* ============================================================
     12. MICRO-INTERACTION KLIK TOMBOL (ripple sederhana)
  ============================================================= */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${(e.clientX ?? rect.left + rect.width/2) - rect.left - size/2}px;
        top:${(e.clientY ?? rect.top + rect.height/2) - rect.top - size/2}px;
        background: rgba(255,255,255,.55);
        transform: scale(0); opacity:1;
        transition: transform .5s ease, opacity .6s ease;
      `;
      this.style.position = this.style.position || 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1.6)';
        ripple.style.opacity = '0';
      });
      setTimeout(() => ripple.remove(), 650);
    });
  });

})();
