(() => {
  'use strict';

  const data = window.FLORA_DATA;
  const root = document.getElementById('root');
  const overlayRoot = document.getElementById('overlay-root');
  const state = {
    cart: [],
    modal: null,
    selectedDrink: null,
    temperature: 'iced',
    milk: 'oat-almond-whole',
    syrup: 'none',
    drinkQuantity: 1,
    searchQuery: '',
    eventId: 'mat-and-matcha',
    blogId: '',
    checkingOut: false,
    orderComplete: false,
    orderId: '',
    customerName: '',
    orderType: 'dine-in',
    table: data.PATIO_TABLES[0],
    mobileMenu: false,
    newsletterSubmitted: false
  };

  const e = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const money = (value) => `$${Number(value).toFixed(2)}`;
  const img = (src, alt, cls = 'photo') => `<img src="${e(src)}" alt="${e(alt)}" class="${cls}" />`;
  const wave = `<svg class="wave" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12 C 50 10, 100 14, 150 12 C 200 10, 250 14, 300 11 C 350 9, 400 15, 450 12 C 500 9, 550 14, 600 12 C 650 10, 700 13, 750 11 C 800 9, 850 14, 900 12 C 950 10, 1000 14, 1050 11 C 1100 8, 1150 15, 1200 12" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
  const icon = (name, cls = 'w-4 h-4') => {
    const paths = {
      search: '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path>',
      bag: '<path d="M5 8h14l1 13H4L5 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
      x: '<path d="m18 6-12 12M6 6l12 12"></path>',
      plus: '<path d="M12 5v14M5 12h14"></path>',
      minus: '<path d="M5 12h14"></path>',
      trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"></path>',
      arrow: '<path d="M5 12h14m-7-7 7 7-7 7"></path>',
      check: '<path d="m5 12 4 4L19 6"></path>',
      pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"></path><circle cx="12" cy="10" r="2.5"></circle>',
      cup: '<path d="M4 7h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V7Zm13 2h2a2 2 0 0 1 0 4h-2M7 3v2m4-2v2m4-2v2"></path>',
      calendar: '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path>',
      clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"></path>',
      heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"></path>'
    };
    return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ''}</svg>`;
  };
  const button = (text, action, cls = '') => `<button type="button" data-action="${e(action)}" class="${cls}">${text}</button>`;
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    state.mobileMenu = false;
    renderHeader();
  };

  function header() {
    return `<header class="sticky top-0 z-40 bg-[#F8F5EE]/95 backdrop-blur-xs border-b border-[#E8DEC9]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between">
        <div class="flex items-center gap-3 sm:gap-4 md:gap-5">
          <button data-action="home" class="brand text-left" aria-label="Flora Café Home">flora</button>
          <div class="hidden sm:block border-l border-[#C8B89F]/60 pl-3 md:pl-4 text-[13px] leading-tight text-[#4B3B34] font-serif-display italic">
            <p class="tracking-wide">Wellness looks good on you.</p><p class="text-[#7A6960] text-[12px]">Modesto; ESTD 2024</p>
          </div>
        </div>
        <nav class="hidden lg:flex items-center gap-8 xl:gap-10 text-[13px] tracking-[0.16em] uppercase font-medium text-[#4B3B34]">
          ${[['menu','MENU'],['about','ABOUT'],['events','EVENTS'],['blog','BLOG'],['instagram','INSTAGRAM']].map(([id,label]) => `<button data-action="nav" data-target="${id}" class="hover:text-[#B84233]">${label}</button>`).join('')}
        </nav>
        <div class="flex items-center gap-4 sm:gap-6 text-[13px] tracking-[0.16em] uppercase font-medium text-[#4B3B34]">
          <button data-action="search" class="flex items-center gap-1.5 hover:text-[#B84233]" aria-label="Search drinks and stories">${icon('search')}<span class="hidden sm:inline">SEARCH</span></button>
          <button data-action="cart" class="flex items-center gap-1.5 hover:text-[#B84233]" aria-label="Shopping Cart">${icon('bag')}<span class="hidden sm:inline">CART</span>${state.cart.length ? `<span class="ml-0.5 bg-[#B84233] text-white text-[11px] font-bold px-1.5 rounded-full">${state.cart.reduce((n, i) => n + i.quantity, 0)}</span>` : ''}</button>
          <button data-action="mobile-menu" class="lg:hidden p-1 text-[#4B3B34]" aria-label="Toggle navigation menu">${icon(state.mobileMenu ? 'x' : 'menu','w-6 h-6')}</button>
        </div>
      </div>
      <div class="mobile-nav lg:hidden bg-[#F8F5EE] border-b border-[#E8DEC9] px-6 py-5 shadow-lg" ${state.mobileMenu ? '' : 'hidden'}>
        <div class="flex flex-col gap-4 text-sm font-medium tracking-[0.16em] uppercase text-[#4B3B34]">
          ${[['menu','MENU'],['about','ABOUT'],['events','EVENTS'],['blog','BLOG'],['instagram','INSTAGRAM']].map(([id,label]) => `<button data-action="nav" data-target="${id}" class="text-left py-2 border-b border-[#EADFCB] hover:text-[#B84233]">${label}</button>`).join('')}
        </div><p class="mt-4 pt-4 border-t border-[#E5DEC9] text-xs font-serif-display italic text-[#7A6960]">Wellness looks good on you. — Modesto, CA</p>
      </div>
    </header>`;
  }

  function menuRow(item) {
    return `<div class="menu-row group flex items-baseline justify-between py-1 border-b border-dotted border-[#E2D7C5]/60 cursor-pointer hover:text-[#B84233]" data-action="drink" data-id="${e(item.id)}">
      <div class="flex items-center gap-2"><span class="font-body text-sm tracking-wide text-[#34241F] group-hover:text-[#B84233]">${e(item.name)}</span><button data-action="quick-add" data-id="${e(item.id)}" class="quick-add p-0.5 text-[#B84233] hover:bg-[#B84233]/10 rounded" title="Quick add to cart">${icon('plus','w-3.5 h-3.5')}</button></div>
      <span class="font-typewriter text-sm tracking-wider tabular-nums text-[#3A1812] ml-4">${money(item.price)}</span>
    </div>`;
  }

  function menuSection() {
    return `<section id="menu" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div class="lg:col-span-4 flex flex-col justify-between"><div><h2 class="font-serif-display text-4xl sm:text-5xl text-[#3A1812] italic mb-4">Explore Our Menu</h2><p class="font-body text-[#4B3B34] text-base leading-relaxed font-light mb-8 max-w-sm">Thoughtfully crafted coffee, ceremonial matcha, and seasonal drinks made with intentional ingredients that love you right back.</p></div>
          <div class="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm bg-[#EAE2D5] shadow-sm">${img('./src/assets/images/menu_latte_pour_1790356919535.jpeg','Barista pouring delicate latte art into ceramic mug')}</div>
        </div>
        <div class="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-10">
          <div class="space-y-6"><div><h3 class="font-serif-display text-2xl sm:text-3xl text-[#3A1812] italic mb-5 pb-1 border-b border-[#E2D7C5]">Coffee</h3><div class="space-y-4">${data.COFFEE_ITEMS.map(menuRow).join('')}</div></div>
            <div class="pt-4"><h3 class="font-serif-display text-2xl sm:text-3xl text-[#3A1812] italic mb-4 pb-1 border-b border-[#E2D7C5]">Milk Options</h3><div class="space-y-3.5">${data.MILK_OPTIONS.map((m) => `<div class="py-1 border-b border-dotted border-[#E2D7C5]/60"><div class="flex items-baseline justify-between"><span class="font-body text-[13px] tracking-wide text-[#34241F]">${e(m.name)}</span><span class="font-typewriter text-sm text-[#3A1812] ml-2">${m.price ? `+$${m.price.toFixed(2)}` : '+$0'}</span></div>${m.subtext ? `<p class="font-typewriter text-xs text-[#7A6960] mt-0.5">${e(m.subtext)}</p>` : ''}</div>`).join('')}</div></div>
          </div>
          <div class="space-y-6"><div><h3 class="font-serif-display text-2xl sm:text-3xl text-[#3A1812] italic mb-5 pb-1 border-b border-[#E2D7C5]">Tea</h3><div class="space-y-4">${data.TEA_ITEMS.map(menuRow).join('')}
              <div class="py-2 border-b border-dotted border-[#E2D7C5]/60"><div class="flex justify-between"><span class="font-body text-sm text-[#34241F]">SYRUPS</span><span class="font-typewriter text-sm">+$0.75</span></div><p class="font-typewriter text-xs text-[#6F5E56] mt-1">Vanilla, Caramel, Lavender, Strawberry, Cinnamon Roll, Banana Bread, Pistachio</p></div>
            </div></div><div class="pt-2"><h3 class="font-serif-display text-2xl sm:text-3xl text-[#3A1812] italic mb-4 pb-1 border-b border-[#E2D7C5]">Fall Specials</h3><div class="space-y-4">${data.FALL_SPECIALS.map(menuRow).join('')}</div></div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function mainSections() {
    const posts = data.BLOG_POSTS.slice(0, 2);
    return `<main class="flex-1">
      <section id="hero" class="w-full"><div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10"><div class="relative w-full hero-image overflow-hidden rounded-sm shadow-sm bg-[#E8DFD3]">${img('./src/assets/images/hero_flora_street_1790356906411.jpg','','photo grayscale contrast-[1.08] brightness-[0.98] transition-transform duration-700 hover:scale-[1.01]')}</div></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8"><div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div class="lg:col-span-6"><h1 class="font-serif-display text-4xl sm:text-5xl md:text-6xl text-[#3A1812] italic leading-[1.08]">More than just your <br class="hidden sm:inline"/>downtown café</h1></div><div class="lg:col-span-6"><p class="font-body text-[#4B3B34] text-base sm:text-lg leading-relaxed font-light mb-6">Flora Café is committed to reimagining your daily ritual through thoughtfully sourced ingredients, mindful preparation, and a welcoming space that inspires balance, connection and well-being.</p><div class="flex items-center gap-5 mt-2"><span class="text-4xl text-[#B84233]" aria-hidden="true">✿</span>${button('DISCOVER FLORA','about','bg-[#B84233] hover:bg-[#9E3326] text-white text-xs tracking-[0.18em] uppercase px-6 py-2.5 shadow-sm')}</div></div></div></div>${wave}
      </section>
      ${menuSection()}
      <section id="fridays" class="w-full relative py-6"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">${wave}<div class="relative w-full hero-image overflow-hidden rounded-sm bg-[#EAE2D5] shadow-sm">${img('./src/assets/images/flora_fridays_blooms_1790356933233.png','Flora to-go cups beside fresh bouquet of pink roses and blooms')}<div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div><div class="absolute bottom-0 left-0 max-w-2xl p-6 sm:p-10 md:p-14 text-white"><h2 class="font-serif-display text-4xl sm:text-5xl md:text-6xl italic mb-2">Flora Fridays</h2><p class="text-xs sm:text-sm tracking-[0.18em] uppercase mb-3">FRESH BLOOMS, FRESH RITUALS, EVERY FRIDAY</p><p class="text-sm sm:text-base leading-relaxed mb-5 max-w-xl">Every Friday at Flora means flower drop day — a weekly ritual filled with fresh seasonal blooms, cozy café moments, and little reminders to slow down and romanticize your routine. Stop by for your favorite drink, pick up a bouquet, and ease into the weekend with us.</p></div></div></div>${wave}</section>
      <section id="events" class="w-full relative py-6"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"><div class="lg:col-span-6"><div class="relative event-image w-full overflow-hidden rounded-sm bg-[#E8E0D2] shadow-sm">${img('./src/assets/images/event_patio_pilates_1790356975966.jpg','Mat & Matcha outdoor pilates wellness session on patio')}</div></div><div class="lg:col-span-6 py-2"><div class="text-xs tracking-[0.18em] uppercase mb-4"><p>UPCOMING EVENT</p><p class="font-semibold">2026.09.13 SUNDAY</p></div><h2 class="font-serif-display text-4xl sm:text-5xl md:text-6xl italic mb-4">Mat &amp; Matcha</h2><p class="text-base text-[#4B3B34] leading-relaxed font-light mb-8 max-w-lg">Movement, matcha &amp; meaningful connections on the patio. Mat &amp; Matcha brings together pilates &amp; your favorite flora matcha for the perfect wellness morning.</p>${button('VIEW EVENTS','events','bg-[#B84233] hover:bg-[#9E3326] text-white text-xs tracking-[0.18em] uppercase px-6 py-2.5')}<div class="flex justify-end pt-8 pr-4"><span class="text-4xl text-[#B84233]">☕</span></div></div></div></div>${wave}</section>
      <section id="blog" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14"><div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch"><div class="lg:col-span-4"><h2 class="font-serif-display text-4xl sm:text-5xl italic mb-4">The Daily Pour</h2><p class="text-base leading-relaxed font-light mb-8 max-w-sm">Explore behind-the-scenes stories from café life, wellness tips &amp; tricks, seasonal drink inspirations, and thoughtful reflections from the Flora community. Consider this your cozy corner of the internet — made to inspire balance, connection, and everyday rituals that feel good.</p>${button('GO TO BLOG','blog-first','bg-[#B84233] hover:bg-[#9E3326] text-white text-xs tracking-[0.18em] uppercase px-6 py-2.5')}<div class="pt-10 text-4xl text-[#B84233]">♧</div></div>${posts.map((post) => `<article class="lg:col-span-4 flex flex-col justify-between group"><div><button class="aspect-[4/5] w-full overflow-hidden rounded-sm bg-[#EAE2D5] shadow-sm cursor-pointer mb-5 block" data-action="blog" data-id="${e(post.id)}">${img(post.image,post.title,'photo transition-transform duration-700 group-hover:scale-105')}</button><div class="flex items-baseline justify-between gap-3 mb-2"><button data-action="blog" data-id="${e(post.id)}" class="font-serif-display text-2xl sm:text-3xl italic text-left hover:text-[#B84233]">${e(post.title)}</button><span class="text-xs tracking-[0.16em] uppercase text-[#7A6960]">${e(post.category)}</span></div><p class="text-sm font-light leading-relaxed mb-4 line-clamp-3">${e(post.summary)}</p></div>${button('READ MORE',`blog:${post.id}`,'bg-[#B84233] hover:bg-[#9E3326] text-white text-xs tracking-[0.18em] uppercase px-5 py-2 self-start')}</article>`).join('')}</div></section>
    </main>`;
  }

  function footer() {
    return `<footer class="w-full bg-[#581C16] text-[#F8F5EE] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#46140F]"><div class="max-w-7xl mx-auto relative z-10"><div class="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16"><div class="md:col-span-5 flex flex-col justify-between"><div><p class="font-serif-display text-xl sm:text-2xl font-light leading-snug mb-8 max-w-sm">Join our mailing list and be in the know about the latest events and creations.</p><form id="newsletter-form" class="mb-10 max-w-sm"><div class="relative flex items-center border-b border-[#F8F5EE]/40 pb-1"><input name="email" type="email" required placeholder="EMAIL ADDRESS" class="w-full bg-transparent text-sm text-[#F8F5EE] placeholder-[#F8F5EE]/50 tracking-[0.14em] py-1"/><button class="text-xs tracking-[0.18em] uppercase text-[#F8F5EE] pl-3 pr-1 py-1">SUBMIT</button></div><p id="newsletter-message" class="${state.newsletterSubmitted ? '' : 'hidden'} text-xs text-[#E8D4C8] mt-2">✓ Thank you for joining the Flora ritual.</p></form></div><button data-action="home" class="flex items-end gap-3 pt-6 text-left" aria-label="Back to top"><span class="text-xs leading-tight">B<br/>A<br/>C<br/>K<br/><br/>T<br/>O<br/><br/>T<br/>O<br/>P</span><span class="text-3xl">☕</span></button></div>
      <div class="md:col-span-4 space-y-6 text-sm text-[#F8F5EE]/90 font-light"><h3 class="text-xs tracking-[0.22em] uppercase font-semibold">CONTACT</h3><div class="space-y-1.5 leading-relaxed"><p class="text-white">Outdoor Patio of Galletto Ristorante</p><p>Mon-Fri 7am-3pm, Sat &amp; Sun 7am-1pm</p><p>1101 J St, Modesto, California 95354</p></div><a href="mailto:floracafemodesto@gmail.com" class="underline underline-offset-4">floracafemodesto@gmail.com</a><div class="pt-2 flex flex-col gap-1.5"><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a></div></div>
      <div class="md:col-span-3 flex flex-col justify-between"><div class="space-y-4"><h3 class="text-xs tracking-[0.22em] uppercase font-semibold">SITE MAP</h3><ul class="space-y-2 text-sm">${[['hero','Home'],['menu','Menu'],['about','About'],['events','Events'],['blog','Blog']].map(([id,label]) => `<li><button data-action="nav" data-target="${id}" class="hover:text-white">${label}</button></li>`).join('')}</ul></div><div class="pt-8 flex justify-end"><span class="text-5xl">✿</span></div></div></div><div class="mt-14 pt-8 border-t border-[#F8F5EE]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F8F5EE]/60 gap-4"><p>© ${new Date().getFullYear()} Flora Café Modesto. All rights reserved.</p><p class="font-serif-display italic text-sm text-[#F8F5EE]/80">Wellness looks good on you.</p></div></div></footer>`;
  }

  function renderHeader() {
    const headerEl = root.querySelector('header');
    if (headerEl) headerEl.outerHTML = header();
  }

  function renderPage() {
    root.innerHTML = `${header()}${mainSections()}${footer()}`;
    const sections = [...root.querySelectorAll('main > section')];
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        }
      }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

      sections.forEach((section) => {
        section.classList.add('reveal-on-scroll');
        const bounds = section.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) {
          section.classList.add('is-visible');
        } else {
          observer.observe(section);
        }
      });
    }
    renderOverlay();
  }

  function findDrink(id) {
    return [...data.COFFEE_ITEMS, ...data.TEA_ITEMS, ...data.FALL_SPECIALS].find((item) => item.id === id);
  }

  function addToCart(item, quantity = 1, customization = {}) {
    const cartId = customization.cartId || `${item.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    state.cart.push({ cartId, item, quantity, temperature: customization.temperature, milkOption: customization.milkOption, syrupOption: customization.syrupOption, totalPrice: customization.totalPrice ?? item.price * quantity });
    renderHeader();
    if (state.modal === 'cart') renderOverlay();
  }

  function openDrink(id) {
    state.modal = 'drink';
    state.selectedDrink = findDrink(id);
    state.temperature = 'iced';
    state.milk = 'oat-almond-whole';
    state.syrup = 'none';
    state.drinkQuantity = 1;
    renderOverlay();
  }

  function drinkModal() {
    const item = state.selectedDrink;
    if (!item) return '';
    const milk = data.MILK_OPTIONS.find((m) => m.id === state.milk);
    const syrup = data.SYRUPS.find((s) => s.id === state.syrup);
    const total = (item.price + (milk?.price || 0) + (syrup ? syrup.price : 0)) * state.drinkQuantity;
    return `<div class="modal-backdrop" data-action="backdrop-close"><div class="modal-panel max-w-2xl p-5 sm:p-7" role="dialog" aria-modal="true" aria-label="${e(item.name)}">
      <button data-action="close" class="absolute top-4 right-4 text-[#4B3B34] p-1.5 z-10" aria-label="Close dialog">${icon('x','w-5 h-5')}</button>
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-5 pb-5 border-b border-[#E2D7C5] items-center"><div class="sm:col-span-5"><div class="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[#EAE2D5] shadow-sm border border-[#DFCFC0]">${item.image ? img(item.image,item.name) : ''}${item.popular ? '<span class="absolute top-2 left-2 bg-[#B84233] text-white text-[10px] uppercase px-2 py-0.5">Flora Favorite</span>' : ''}</div></div><div class="sm:col-span-7 space-y-1.5"><span class="text-[11px] uppercase tracking-[0.2em] text-[#B84233] font-semibold">Flora Beverage Menu · ${e(item.category)}</span><h3 class="font-serif-display text-3xl sm:text-4xl italic">${e(item.name)}</h3><p class="font-typewriter text-lg">${money(item.price)}</p>${item.description ? `<p class="text-xs leading-relaxed pt-1">${e(item.description)}</p>` : ''}${item.subtext ? `<p class="font-typewriter text-[11px] pt-0.5">${e(item.subtext)}</p>` : ''}</div></div>
      <div class="space-y-5 pt-5"><div><label class="block text-xs uppercase tracking-[0.16em] mb-2">Preparation</label><div class="grid grid-cols-2 gap-3">${['iced','hot'].map((v) => `<button data-action="temperature" data-value="${v}" class="py-2 px-3 text-xs uppercase border ${state.temperature === v ? 'border-[#B84233] bg-[#B84233] text-white' : 'border-[#D9CFC4]'}">${v === 'iced' ? 'Iced (Signature Cold)' : 'Hot (Steamed Silky)'}</button>`).join('')}</div></div>
      <div><label class="block text-xs uppercase tracking-[0.16em] mb-2">Milk Selection</label><div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${data.MILK_OPTIONS.map((m) => `<label class="flex items-center justify-between p-2.5 border text-xs cursor-pointer ${state.milk === m.id ? 'border-[#B84233] bg-[#FAF2EB]' : 'border-[#E2D7C5]'}"><span><input type="radio" name="milk-option" value="${e(m.id)}" ${state.milk === m.id ? 'checked' : ''} /> ${e(m.name)}</span><span class="font-typewriter">${m.price ? `+$${m.price.toFixed(2)}` : '+$0'}</span></label>`).join('')}</div></div>
      <div><label class="block text-xs uppercase tracking-[0.16em] mb-1.5">Artisanal Syrup Flavor (+ $0.75)</label><select id="syrup-select" class="w-full bg-[#FAF6EE] border border-[#D9CFC4] text-xs p-2.5"><option value="none">None (Signature Standard Sweetness)</option>${data.SYRUPS.map((s) => `<option value="${e(s.id)}" ${state.syrup === s.id ? 'selected' : ''}>${e(s.name)} Syrup (+$0.75)</option>`).join('')}</select></div>
      <div class="flex items-center justify-between pt-2"><span class="text-xs uppercase tracking-[0.16em]">Order Quantity</span><div class="flex items-center border bg-white"><button data-action="drink-quantity" data-delta="-1" class="p-2">${icon('minus','w-3.5 h-3.5')}</button><span class="px-3 text-xs font-typewriter">${state.drinkQuantity}</span><button data-action="drink-quantity" data-delta="1" class="p-2">${icon('plus','w-3.5 h-3.5')}</button></div></div></div>
      <div class="mt-7 pt-4 border-t border-[#E2D7C5] flex items-center justify-between gap-4"><div><span class="text-[10px] uppercase font-typewriter block">Item Total</span><div class="font-typewriter text-xl font-bold">${money(total)}</div></div><button data-action="add-custom-drink" class="flex-1 max-w-xs bg-[#B84233] hover:bg-[#9E3326] text-white text-xs tracking-[0.18em] uppercase py-3.5 px-6">${'ADD TO ORDER · ' + money(total)}</button></div>
    </div></div>`;
  }

  function cartModal() {
    const subtotal = state.cart.reduce((n, item) => n + item.totalPrice, 0);
    const tax = subtotal * 0.0825;
    const total = subtotal + tax;
    const content = state.orderComplete
      ? `<div class="py-12 text-center space-y-4"><span class="text-5xl text-[#B84233]">${icon('check','w-12 h-12')}</span><span class="brand text-3xl block">flora</span><h3 class="font-serif-display text-3xl italic">Order Confirmed!</h3><div class="bg-[#EFE7D8] p-4 text-left border text-xs font-typewriter space-y-1.5 my-4"><p class="font-bold">ORDER ID: #${e(state.orderId)}</p><p>Guest: ${e(state.customerName || 'Valued Guest')}</p><p>Pickup Location: Outdoor Patio of Galletto Ristorante</p><p>1101 J St, Modesto CA</p><p class="text-[#B84233] font-semibold pt-1">Estimated Preparation: ~12-15 minutes</p></div><p class="text-xs leading-relaxed">We're crafting your order with mindful intention. Simply walk up to the patio counter when you arrive.</p>${button('RETURN TO MENU','finish-order','bg-[#B84233] text-white text-xs tracking-[0.18em] uppercase py-2.5 px-6 mt-4')}</div>`
      : state.checkingOut
        ? `<form id="checkout-form" class="space-y-4"><div class="border-b border-[#E2D7C5] pb-3 mb-4"><h3 class="font-serif-display text-2xl italic">Service &amp; Seat Details</h3><p class="text-xs text-[#7A6960]">Where should the barista deliver your handcrafted drink?</p></div><div><label class="block text-[11px] uppercase tracking-[0.14em] mb-1.5">Dining Mode</label><div class="grid grid-cols-2 gap-2">${[['dine-in','Dine-In Patio','cup'],['pickup','Counter Pickup','pin']].map(([v,label,ic]) => `<button type="button" data-action="order-type" data-value="${v}" class="py-2 px-2 text-xs uppercase border flex items-center justify-center gap-1.5 ${state.orderType === v ? 'border-[#B84233] bg-[#B84233] text-white' : 'border-[#D9CFC4]'}">${icon(ic)}${label}</button>`).join('')}</div></div>${state.orderType === 'dine-in' ? `<div class="bg-[#FAF2EB] border border-[#E8D4C8] p-3"><label class="block text-[11px] uppercase mb-1">Select Your Patio Table / Seat</label><select id="table-select" class="w-full bg-white border border-[#D9CFC4] p-2 text-xs">${data.PATIO_TABLES.map((t) => `<option ${state.table === t ? 'selected' : ''}>${e(t)}</option>`).join('')}</select></div>` : ''}<div><label class="block text-[11px] uppercase mb-1">Your Name</label><input name="customerName" type="text" required value="${e(state.customerName)}" placeholder="e.g. Hannah C." class="w-full bg-white border border-[#D9CFC4] p-2 text-xs"/></div><div><label class="block text-[11px] uppercase mb-1">Mobile Phone (Optional SMS alert)</label><input type="tel" placeholder="(209) 555-0192" class="w-full bg-white border border-[#D9CFC4] p-2 text-xs"/></div><div><label class="block text-[11px] uppercase mb-1">Special Notes / Allergies</label><textarea rows="2" placeholder="Extra ice, less sweet, etc." class="w-full bg-white border border-[#D9CFC4] p-2 text-xs"></textarea></div><div class="bg-[#FAF2EB] border border-[#E8D4C8] p-3 text-xs"><p class="font-semibold">Order Total: ${money(total)}</p><p class="text-[11px] text-[#7A6960]">Payment will be finalized upon pickup via Apple Pay, Tap to Pay, or Card.</p></div><div class="pt-2 flex gap-3"><button type="button" data-action="checkout-back" class="w-1/3 border border-[#D9CFC4] text-xs uppercase py-2.5">BACK</button><button class="w-2/3 bg-[#B84233] text-white text-xs uppercase tracking-[0.18em] py-2.5">PLACE ORDER ${icon('arrow')}</button></div></form>`
        : state.cart.length === 0
          ? `<div class="py-16 text-center space-y-3"><p class="font-serif-display text-2xl italic">Your cart is empty</p><p class="text-xs max-w-xs mx-auto">Discover our artisanal coffee, ceremonial grade matcha, or seasonal drinks to start your daily ritual.</p></div>`
          : `<div class="space-y-4 divide-y divide-[#E2D7C5]/60">${state.cart.map((ci) => `<div class="pt-4 first:pt-0 flex items-start gap-3">${ci.item.image ? `<div class="w-14 h-14 rounded-xs overflow-hidden bg-[#EAE2D5] border border-[#DFCFC0] shrink-0">${img(ci.item.image,ci.item.name)}</div>` : ''}<div class="flex-1"><div class="flex items-start justify-between gap-2"><h4 class="text-sm font-semibold">${e(ci.item.name)}</h4><span class="font-typewriter text-xs font-semibold">${money(ci.totalPrice)}</span></div>${ci.temperature ? `<p class="text-[11px] text-[#7A6960] capitalize mt-0.5">${e(ci.temperature)}${ci.milkOption ? ` · ${e(ci.milkOption)}` : ''}${ci.syrupOption ? ` · ${e(ci.syrupOption)}` : ''}</p>` : ''}<div class="flex items-center justify-between mt-2.5"><div class="flex items-center border bg-white text-xs"><button data-action="cart-qty" data-id="${e(ci.cartId)}" data-delta="-1" class="px-2 py-1">${icon('minus','w-3 h-3')}</button><span class="px-2 py-0.5">${ci.quantity}</span><button data-action="cart-qty" data-id="${e(ci.cartId)}" data-delta="1" class="px-2 py-1">${icon('plus','w-3 h-3')}</button></div><button data-action="remove-cart" data-id="${e(ci.cartId)}" class="text-xs text-[#7A6960] hover:text-[#B84233] flex items-center gap-1">${icon('trash','w-3.5 h-3.5')}Remove</button></div></div></div>`).join('')}</div>`;
    return `<div class="modal-backdrop drawer-backdrop" data-action="backdrop-close"><section class="modal-panel drawer-panel" role="dialog" aria-modal="true" aria-label="Your Flora ritual"><div class="p-6 border-b border-[#E2D7C5] flex items-center justify-between"><div class="flex items-center gap-2">${icon('bag','w-4 h-4 text-[#B84233]')}<h2 class="text-xs tracking-[0.2em] uppercase font-semibold">YOUR FLORA RITUAL</h2><span class="font-typewriter text-xs text-[#7A6960]">(${state.cart.length} ${state.cart.length === 1 ? 'item' : 'items'})</span></div><button data-action="close" aria-label="Close cart">${icon('x','w-5 h-5')}</button></div><div class="drawer-content p-6">${content}</div>${state.cart.length && !state.orderComplete && !state.checkingOut ? `<div class="p-6 border-t border-[#E2D7C5] bg-[#FAF6EE] space-y-3"><div class="space-y-1.5 text-xs"><div class="flex justify-between"><span>Subtotal</span><span class="font-typewriter">${money(subtotal)}</span></div><div class="flex justify-between text-[#7A6960]"><span>Modesto Tax (8.25%)</span><span class="font-typewriter">${money(tax)}</span></div><div class="flex justify-between text-sm font-semibold pt-2 border-t"><span>Total</span><span class="font-typewriter text-base">${money(total)}</span></div></div>${button(`CHECKOUT · ${money(total)} ${icon('arrow','w-3.5 h-3.5')}`,'checkout','w-full bg-[#B84233] hover:bg-[#9E3326] text-white text-xs tracking-[0.18em] uppercase py-3 px-4 flex items-center justify-center gap-2')}<p class="text-[11px] text-center font-typewriter text-[#7A6960]">Pickup: Galletto Ristorante Patio, 1101 J St</p></div>` : ''}</section></div>`;
  }

  function searchModal() {
    const q = state.searchQuery.trim().toLowerCase();
    const drinks = [...data.COFFEE_ITEMS, ...data.TEA_ITEMS, ...data.FALL_SPECIALS].filter((item) => q && `${item.name} ${item.description || ''} ${item.subtext || ''}`.toLowerCase().includes(q));
    const events = data.UPCOMING_EVENTS.filter((item) => q && `${item.title} ${item.description} ${item.tag}`.toLowerCase().includes(q));
    const posts = data.BLOG_POSTS.filter((item) => q && `${item.title} ${item.category} ${item.summary}`.toLowerCase().includes(q));
    const total = drinks.length + events.length + posts.length;
    return `<div class="modal-backdrop items-start pt-20" data-action="backdrop-close"><div class="modal-panel max-w-2xl p-6" role="dialog" aria-modal="true" aria-label="Search Flora Café"><div class="flex items-center border-b border-[#E2D7C5] pb-4">${icon('search','w-5 h-5 text-[#B84233] mr-3')}<input id="search-input" value="${e(state.searchQuery)}" placeholder="Search drinks, ceremonial matcha, patio events, stories..." class="w-full bg-transparent text-sm sm:text-base placeholder-[#7A6960]/70" autofocus/>${button(state.searchQuery ? 'CLEAR' : 'ESC',state.searchQuery ? 'clear-search' : 'close','text-xs uppercase tracking-widest text-[#7A6960]')}</div><div class="mt-4 max-h-[60vh] overflow-y-auto space-y-6 pr-1">${!q ? `<div class="py-8 text-center space-y-2"><p class="font-serif-display text-xl italic">Explore Flora Café</p><p class="text-xs text-[#7A6960]">Try searching for <span class="text-[#B84233]">"Matcha"</span>, <span class="text-[#B84233]">"Pilates"</span>, <span class="text-[#B84233]">"Cold Brew"</span>, or <span class="text-[#B84233]">"Hannah"</span></p></div>` : !total ? `<div class="py-8 text-center text-xs text-[#7A6960]">No results found for "${e(state.searchQuery)}". Try checking your spelling or search another ritual.</div>` : `${drinks.length ? `<div><p class="text-[11px] uppercase tracking-[0.18em] text-[#B84233] font-semibold mb-2">Beverages &amp; Specials (${drinks.length})</p>${drinks.map((d) => `<button data-action="drink" data-id="${e(d.id)}" class="w-full p-2.5 hover:bg-[#EFE8DC] flex items-center justify-between text-left"><span><b class="text-xs sm:text-sm">${e(d.name)}</b>${d.subtext ? `<small class="block">${e(d.subtext)}</small>` : ''}</span><span class="font-typewriter text-xs">${money(d.price)}</span></button>`).join('')}</div>` : ''}${events.length ? `<div><p class="text-[11px] uppercase tracking-[0.18em] text-[#B84233] font-semibold mb-2">Patio Events (${events.length})</p>${events.map((event) => `<button data-action="event" data-id="${e(event.id)}" class="w-full p-2.5 hover:bg-[#EFE8DC] text-left"><span class="font-serif-display italic">${e(event.title)}</span><span class="float-right text-[11px]">${e(event.date)}</span><small class="block">${e(event.description)}</small></button>`).join('')}</div>` : ''}${posts.length ? `<div><p class="text-[11px] uppercase tracking-[0.18em] text-[#B84233] font-semibold mb-2">Stories (${posts.length})</p>${posts.map((post) => `<button data-action="blog" data-id="${e(post.id)}" class="w-full p-2.5 hover:bg-[#EFE8DC] text-left"><span class="font-serif-display italic">${e(post.title)}</span><small class="block">${e(post.summary)}</small></button>`).join('')}</div>` : ''}`}</div></div></div>`;
  }

  function eventModal() {
    const event = data.UPCOMING_EVENTS.find((item) => item.id === state.eventId) || data.UPCOMING_EVENTS[0];
    return `<div class="modal-backdrop" data-action="backdrop-close"><div class="modal-panel max-w-3xl p-6 sm:p-8" role="dialog" aria-modal="true" aria-label="Events"><button data-action="close" class="absolute top-5 right-5" aria-label="Close dialog">${icon('x')}</button><div class="flex flex-wrap items-center gap-2 border-b border-[#E2D7C5] pb-4 mb-6">${data.UPCOMING_EVENTS.map((ev) => `<button data-action="event-tab" data-id="${e(ev.id)}" class="text-xs uppercase tracking-[0.16em] py-1.5 px-3 ${event.id === ev.id ? 'bg-[#B84233] text-white' : 'hover:bg-[#EFE8DC]'}">${e(ev.title)}</button>`).join('')}</div><div class="space-y-5"><div><span class="text-[11px] uppercase tracking-[0.2em] text-[#B84233] font-semibold">${e(event.tag)}</span><h2 class="font-serif-display text-3xl sm:text-4xl italic mt-1">${e(event.title)}</h2></div><div class="space-y-2 text-xs"><p>${icon('calendar','w-4 h-4 text-[#B84233] mr-2')}${e(event.date)}</p><p>${icon('clock','w-4 h-4 text-[#B84233] mr-2')}${e(event.time)}</p><p>${icon('pin','w-4 h-4 text-[#B84233] mr-2')}${e(event.location)}</p></div><p class="text-sm leading-relaxed">${e(event.description)}</p><div class="bg-[#FAF2EB] border border-[#E8D4C8] p-4 text-xs"><b class="uppercase tracking-wider">What's Included:</b><ul class="mt-2 space-y-1">${event.includes.map((i) => `<li>· ${e(i)}</li>`).join('')}</ul></div></div></div></div>`;
  }

  function aboutModal() {
    return `<div class="modal-backdrop" data-action="backdrop-close"><div class="modal-panel max-w-3xl p-6 sm:p-10" role="dialog" aria-modal="true" aria-label="About Flora Café"><button data-action="close" class="absolute top-5 right-5" aria-label="Close modal">${icon('x','w-5 h-5')}</button><div class="text-center max-w-xl mx-auto mb-8"><span class="brand block">flora</span><p class="font-serif-display text-sm italic text-[#7A6960]">Wellness looks good on you. — Modesto; ESTD 2024</p><h2 class="font-serif-display text-3xl sm:text-4xl italic pt-4">More than just your downtown café</h2></div><div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-8"><div class="md:col-span-6 space-y-4 text-sm sm:text-base leading-relaxed font-light"><p>Located on the sun-drenched outdoor patio of the historic Galletto Ristorante in downtown Modesto, Flora Café was born from a simple conviction: that your morning cup should be an act of genuine nourishment.</p><p>Founded in 2024 by Hannah Culver, Flora bridges the gap between third-wave craft coffee precision and holistic, intentional wellness. We believe that caring for yourself shouldn't feel clinical or rigid.</p></div><div class="md:col-span-6 aspect-[4/3] rounded-sm overflow-hidden bg-[#EAE2D5]">${img('./src/assets/images/blog_founder_street_1790356964654.jpg','Hannah Culver, founder of Flora Café')}</div></div><div class="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-t border-b border-[#E2D7C5]">${[['01','Ceremonial Matcha','Single-origin ceremonial Uji matcha prepared with bamboo chasen whisks for steady, jitter-free energy.'],['02','Patio Gathering','Outdoor greenery, stone fountains, and community pilates classes that turn an errand into an experience.'],['03','Flora Fridays','Weekly seasonal flower drops where Modesto locals pick up artisanal blooms and celebrate the weekend.']].map(([n,title,txt]) => `<div class="space-y-2"><span class="font-serif-display text-2xl italic text-[#B84233]">${n}</span><h3 class="text-xs uppercase tracking-wider font-semibold">${title}</h3><p class="text-xs leading-relaxed font-light">${txt}</p></div>`).join('')}</div><div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"><p class="text-xs font-serif-display italic">"Stop by for your favorite drink and romanticize your routine."</p>${button('EXPLORE THE DRINK MENU','about-menu','bg-[#B84233] text-white text-xs tracking-[0.18em] uppercase py-3 px-6')}</div></div></div>`;
  }

  function blogModal() {
    const post = data.BLOG_POSTS.find((item) => item.id === state.blogId) || data.BLOG_POSTS[0];
    const next = data.BLOG_POSTS.find((item) => item.id !== post.id);
    return `<div class="modal-backdrop" data-action="backdrop-close"><article class="modal-panel max-w-3xl p-6 sm:p-10" role="dialog" aria-modal="true" aria-label="${e(post.title)}"><button data-action="close" class="absolute top-5 right-5" aria-label="Close article">${icon('x','w-5 h-5')}</button><div class="flex flex-wrap gap-2 text-xs tracking-[0.16em] uppercase text-[#7A6960] mb-3"><span class="text-[#B84233] font-semibold">${e(post.category)}</span><span>· ${e(post.date)}</span><span>· ${e(post.readTime)}</span></div><h1 class="font-serif-display text-3xl sm:text-4xl md:text-5xl italic leading-tight mb-6">${e(post.title)}</h1><div class="relative w-full aspect-[16/9] overflow-hidden rounded-sm bg-[#EAE2D5] mb-8 shadow-sm">${img(post.image,post.title)}</div><div class="space-y-5 text-base sm:text-lg leading-relaxed font-light">${post.content.map((p) => `<p>${e(p)}</p>`).join('')}</div><div class="mt-10 pt-6 border-t border-[#E2D7C5] flex flex-col sm:flex-row items-center justify-between gap-6"><p class="font-serif-display text-lg italic">Written by ${e(post.author)}<small class="block text-xs not-italic">Flora Café, Downtown Modesto</small></p>${next ? button(`Next Article: ${e(next.title)} ${icon('arrow','w-4 h-4')}`,`blog:${next.id}`,'text-xs uppercase tracking-[0.16em] text-[#B84233]') : ''}</div></article></div>`;
  }

  function renderOverlay() {
    const views = {
      drink: drinkModal,
      cart: cartModal,
      search: searchModal,
      events: eventModal,
      about: aboutModal,
      blog: blogModal
    };
    overlayRoot.innerHTML = state.modal && views[state.modal] ? views[state.modal]() : '';
    if (state.modal === 'search') requestAnimationFrame(() => document.getElementById('search-input')?.focus());
  }

  function openModal(modal) {
    state.modal = modal;
    renderOverlay();
  }

  function handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (action === 'backdrop-close' && event.target !== target) return;
    if (action === 'home') { state.modal = null; renderOverlay(); scrollTo('hero'); }
    else if (action === 'about') openModal('about');
    else if (action === 'nav') {
      const destination = target.dataset.target;
      if (destination === 'about') openModal('about');
      else if (destination === 'instagram') window.open('https://instagram.com', '_blank', 'noopener');
      else scrollTo(destination);
    } else if (action === 'mobile-menu') { state.mobileMenu = !state.mobileMenu; renderHeader(); }
    else if (action === 'search') { state.searchQuery = ''; openModal('search'); }
    else if (action === 'cart') { state.checkingOut = false; openModal('cart'); }
    else if (action === 'close' || action === 'backdrop-close') { state.modal = null; renderOverlay(); }
    else if (action === 'drink') { openDrink(id); }
    else if (action === 'quick-add') {
      event.stopPropagation();
      const item = findDrink(id);
      if (item) { addToCart(item); state.modal = 'cart'; renderOverlay(); }
    } else if (action === 'temperature') { state.temperature = target.dataset.value; renderOverlay(); }
    else if (action === 'drink-quantity') { state.drinkQuantity = Math.max(1, state.drinkQuantity + Number(target.dataset.delta)); renderOverlay(); }
    else if (action === 'add-custom-drink') {
      const item = state.selectedDrink;
      const milk = data.MILK_OPTIONS.find((option) => option.id === state.milk);
      const syrup = data.SYRUPS.find((option) => option.id === state.syrup);
      const unit = item.price + (milk?.price || 0) + (syrup?.price || 0);
      addToCart(item, state.drinkQuantity, { temperature: state.temperature, milkOption: milk?.name, syrupOption: syrup?.name, totalPrice: unit * state.drinkQuantity });
      state.modal = 'cart';
      renderOverlay();
    } else if (action === 'cart-qty') {
      const item = state.cart.find((ci) => ci.cartId === id);
      if (item) {
        const unit = item.totalPrice / item.quantity;
        item.quantity += Number(target.dataset.delta);
        if (item.quantity < 1) state.cart = state.cart.filter((ci) => ci.cartId !== id);
        else item.totalPrice = unit * item.quantity;
      }
      renderHeader(); renderOverlay();
    } else if (action === 'remove-cart') { state.cart = state.cart.filter((ci) => ci.cartId !== id); renderHeader(); renderOverlay(); }
    else if (action === 'checkout') { state.checkingOut = true; renderOverlay(); }
    else if (action === 'checkout-back') { state.checkingOut = false; renderOverlay(); }
    else if (action === 'order-type') { state.orderType = target.dataset.value; renderOverlay(); }
    else if (action === 'finish-order') { state.orderComplete = false; state.modal = null; renderOverlay(); }
    else if (action === 'event' || action === 'events') { state.eventId = id || 'mat-and-matcha'; openModal('events'); }
    else if (action === 'event-tab') { state.eventId = id; renderOverlay(); }
    else if (action === 'about-menu') { state.modal = null; renderOverlay(); scrollTo('menu'); }
    else if (action === 'blog' || action.startsWith('blog:')) {
      state.blogId = action.startsWith('blog:') ? action.slice(5) : id;
      openModal('blog');
    } else if (action === 'blog-first') { state.blogId = data.BLOG_POSTS[0].id; openModal('blog'); }
    else if (action === 'clear-search') { state.searchQuery = ''; renderOverlay(); }
  }

  function handleInput(event) {
    if (event.target.id === 'search-input') {
      const position = event.target.selectionStart;
      state.searchQuery = event.target.value;
      renderOverlay();
      const input = document.getElementById('search-input');
      input?.focus();
      input?.setSelectionRange(position, position);
    } else if (event.target.name === 'customerName') state.customerName = event.target.value;
  }

  function handleChange(event) {
    if (event.target.name === 'milk-option') { state.milk = event.target.value; renderOverlay(); }
    else if (event.target.id === 'syrup-select') { state.syrup = event.target.value; renderOverlay(); }
    else if (event.target.id === 'table-select') state.table = event.target.value;
    else if (event.target.name === 'customerName') state.customerName = event.target.value;
  }

  function handleSubmit(event) {
    if (event.target.id === 'checkout-form') {
      event.preventDefault();
      state.customerName = new FormData(event.target).get('customerName')?.toString() || '';
      state.orderId = `FL-${Math.floor(1000 + Math.random() * 9000)}`;
      state.orderComplete = true;
      state.checkingOut = false;
      state.cart = [];
      renderHeader(); renderOverlay();
    } else if (event.target.id === 'newsletter-form') {
      event.preventDefault();
      state.newsletterSubmitted = true;
      event.target.reset();
      document.getElementById('newsletter-message')?.classList.remove('hidden');
      setTimeout(() => document.getElementById('newsletter-message')?.classList.add('hidden'), 5000);
    }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('input', handleInput);
  document.addEventListener('change', handleChange);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.modal) { state.modal = null; renderOverlay(); }
  });
  renderPage();
})();
