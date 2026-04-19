/* =========================================================
   Hillary Ness Borabo — Portfolio JS
   Lusion-style bells & whistles
   ========================================================= */

(() => {
  const doc = document;
  const body = doc.body;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader (kitchen opening sequence) ---------- */
  const loader = doc.getElementById("loader");
  const counter = doc.getElementById("loaderCount");
  const bar = doc.getElementById("loaderBar");
  const phaseEl = doc.getElementById("loaderPhase");
  const tickEls = [...doc.querySelectorAll(".loader__ticks span")];

  const phases = [
    { at: 0,   text: "Lighting the flame." },
    { at: 18,  text: "Mise en place." },
    { at: 38,  text: "Sharpening the knives." },
    { at: 58,  text: "Warming the stations." },
    { at: 78,  text: "Plating — final checks." },
    { at: 96,  text: "Service — open." },
  ];
  let currentPhase = null;
  const setPhase = (p) => {
    const cur = phases.filter(ph => ph.at <= p).pop();
    if (!cur || currentPhase === cur.text) return;
    currentPhase = cur.text;
    if (phaseEl) {
      phaseEl.classList.add("is-changing");
      setTimeout(() => {
        phaseEl.textContent = cur.text;
        phaseEl.classList.remove("is-changing");
      }, 180);
    }
  };

  const setTicks = (p) => {
    // 5 ticks, activate at 0, 25, 50, 75, 100
    tickEls.forEach((el, i) => {
      el.classList.toggle("is-on", p >= i * 25);
    });
  };

  body.classList.add("locked");

  let pct = 0;
  const duration = prefersReduced ? 300 : 5000;
  const start = performance.now();
  const pad = n => String(n).padStart(3, "0");

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    pct = Math.floor((1 - Math.pow(1 - t, 3)) * 100);
    counter.textContent = pad(pct);
    bar.style.width = pct + "%";
    setPhase(pct);
    setTicks(pct);
    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = "100";
      setPhase(100);
      setTicks(100);
      setTimeout(() => {
        loader.classList.add("is-done");
        body.classList.remove("locked");
        doc.querySelector(".hero").classList.add("is-ready", "is-in");
      }, 900);
    }
  }
  requestAnimationFrame(tick);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !prefersReduced) {
    lenis = new window.Lenis({
      lerp: 0.09,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
    });
    function rafLenis(time) {
      lenis.raf(time);
      requestAnimationFrame(rafLenis);
    }
    requestAnimationFrame(rafLenis);

    // Route anchor clicks through Lenis
    doc.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || href === "#") return;
        const target = doc.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: 0, duration: 1.6 });
        }
      });
    });
  }

  function scrollTo(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Split text for [data-split] ---------- */
  doc.querySelectorAll("[data-split]").forEach(el => {
    const text = el.textContent;
    el.textContent = "";
    const words = text.trim().split(/\s+/);
    words.forEach((w, i) => {
      const word = doc.createElement("span");
      word.className = "word";
      const inner = doc.createElement("span");
      inner.textContent = w;
      inner.style.transitionDelay = (i * 40) + "ms";
      word.appendChild(inner);
      el.appendChild(word);
      if (i < words.length - 1) el.appendChild(doc.createTextNode(" "));
    });
  });

  /* ---------- Intersection reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -10% 0px" });

  doc.querySelectorAll("[data-split], [data-fade], .skill, .contact__title, .about, .work, .skills, .edu, .contact, .stat, .disc, .gphoto, .homebase, .hbphoto")
    .forEach(el => io.observe(el));

  /* ---------- Now serving clock (Zamboanga/Manila time) ---------- */
  const nowTime = doc.getElementById("nowTime");
  if (nowTime) {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit", minute: "2-digit", hour12: false,
      timeZone: "Asia/Manila",
    });
    const tick = () => { nowTime.textContent = fmt.format(new Date()) + " PHT"; };
    tick();
    setInterval(tick, 15000);
  }

  /* ---------- Magnetic CTA ---------- */
  doc.querySelectorAll(".nav__cta, .contact__mail, .back-to-top").forEach(m => {
    m.addEventListener("mousemove", (e) => {
      const r = m.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      m.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
    });
    m.addEventListener("mouseleave", () => {
      m.style.transform = "";
    });
  });

  /* ---------- Hero parallax ---------- */
  const title = doc.querySelector(".hero__title");
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (title && y < window.innerHeight) {
      title.style.transform = `translateY(${y * 0.15}px)`;
      title.style.opacity = String(1 - (y / window.innerHeight) * 0.8);
    }
  }, { passive: true });

  /* ---------- Nav auto-hide ---------- */
  const nav = doc.querySelector(".nav");
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    nav.style.transform = (y > lastY && y > 200) ? "translateY(-110%)" : "translateY(0)";
    lastY = y;
  }, { passive: true });
  nav.style.transition = "transform .5s cubic-bezier(.7,0,.2,1)";

  /* ---------- Scroll progress ---------- */
  const scrollBar = doc.getElementById("scrollBar");
  function updateProgress() {
    const max = doc.documentElement.scrollHeight - window.innerHeight;
    const p = Math.max(0, Math.min(1, window.scrollY / max));
    scrollBar.style.width = (p * 100) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- Section indicator dots ---------- */
  const dotsList = [...doc.querySelectorAll(".page-nav a")];
  const sections = dotsList.map(a => {
    const id = a.getAttribute("data-section");
    return id === "top" ? { id: "top", el: doc.querySelector("#top") || doc.querySelector(".hero") }
                        : { id, el: doc.getElementById(id) };
  }).filter(s => s.el);

  function updateActiveDot() {
    const mid = window.scrollY + window.innerHeight * 0.35;
    let activeId = sections[0]?.id;
    for (const s of sections) {
      const top = s.el.getBoundingClientRect().top + window.scrollY;
      if (top <= mid) activeId = s.id;
    }
    dotsList.forEach(a => {
      a.classList.toggle("is-active", a.getAttribute("data-section") === activeId);
    });
  }
  window.addEventListener("scroll", updateActiveDot, { passive: true });
  updateActiveDot();

  /* ---------- Back to top ---------- */
  const btt = doc.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    btt.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.8);
  }, { passive: true });
  btt.addEventListener("click", () => scrollTo(0));

  /* ---------- Letter scramble on hover ---------- */
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*+/?@$%&";
  function scramble(el) {
    if (el.__scrambling) return;
    el.__scrambling = true;
    el.classList.add("is-scrambling");
    const original = el.__origText || (el.__origText = el.textContent);
    const chars = original.split("");
    const frames = 14;
    let frame = 0;
    const step = () => {
      const out = chars.map((c, i) => {
        if (c === " ") return " ";
        const locked = i < Math.floor((frame / frames) * chars.length);
        return locked ? c : glyphs[Math.floor(Math.random() * glyphs.length)];
      }).join("");
      el.textContent = out;
      frame++;
      if (frame <= frames) {
        setTimeout(step, 22);
      } else {
        el.textContent = original;
        el.classList.remove("is-scrambling");
        el.__scrambling = false;
      }
    };
    step();
  }
  doc.querySelectorAll("[data-scramble]").forEach(el => {
    el.addEventListener("mouseenter", () => scramble(el));
  });

  /* ---------- Card tilt (3D) ---------- */
  doc.querySelectorAll("[data-tilt]").forEach(card => {
    const max = 6; // degrees
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const cxp = (e.clientX - r.left) / r.width;
      const cyp = (e.clientY - r.top) / r.height;
      const rx = (0.5 - cyp) * max;
      const ry = (cxp - 0.5) * max;
      card.style.transform =
        `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1200px) rotateX(0) rotateY(0)";
    });
  });

  /* ---------- Image parallax (scroll-linked) ---------- */
  const parallaxEls = [...doc.querySelectorAll("[data-parallax]")].map(el => ({
    el,
    speed: parseFloat(el.getAttribute("data-parallax")) || 0.15,
    depth: parseFloat(el.getAttribute("data-depth")) || 1,
  }));

  function updateParallax() {
    const vh = window.innerHeight;
    for (const p of parallaxEls) {
      const r = p.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      const centerOffset = (r.top + r.height / 2) - vh / 2;
      const y = centerOffset * p.speed * -1;
      const z = (p.depth - 1) * 80;
      p.el.style.transform = `translate3d(0, ${y.toFixed(2)}px, ${z.toFixed(1)}px)`;
    }
  }
  window.addEventListener("scroll", updateParallax, { passive: true });
  window.addEventListener("resize", updateParallax);
  updateParallax();

  /* ---------- Gallery mouse tilt ---------- */
  const galleryStrip = doc.getElementById("galleryStrip");
  if (galleryStrip) {
    galleryStrip.addEventListener("mousemove", (e) => {
      const r = galleryStrip.getBoundingClientRect();
      const cxp = (e.clientX - r.left) / r.width - 0.5;
      const cyp = (e.clientY - r.top) / r.height - 0.5;
      galleryStrip.style.transform = `rotateX(${(-cyp * 2).toFixed(2)}deg) rotateY(${(cxp * 2).toFixed(2)}deg)`;
    });
    galleryStrip.addEventListener("mouseleave", () => {
      galleryStrip.style.transform = "";
    });
    galleryStrip.style.transition = "transform .8s cubic-bezier(.16,1,.3,1)";
  }

  /* ---------- Horizontal disciplines ---------- */
  const discWrap = doc.querySelector(".disciplines-h");
  const discTrack = doc.getElementById("discTrack");
  const discProg = doc.getElementById("discProgress");
  let discDist = 0;

  function measureDisc() {
    if (!discTrack || !discWrap) return;
    if (window.innerWidth <= 860) { discTrack.style.transform = ""; return; }
    // distance to translate = trackWidth - viewportWidth + padding
    discDist = Math.max(0, discTrack.scrollWidth - window.innerWidth);
  }
  function updateDisc() {
    if (!discWrap || !discTrack || discDist <= 0) return;
    if (window.innerWidth <= 860) return;
    const r = discWrap.getBoundingClientRect();
    const total = discWrap.offsetHeight - window.innerHeight;
    const scrolled = Math.max(0, Math.min(total, -r.top));
    const p = total > 0 ? scrolled / total : 0;
    discTrack.style.transform = `translate3d(${-p * discDist}px, 0, 0)`;
    if (discProg) discProg.style.width = (p * 100) + "%";
  }
  window.addEventListener("resize", () => { measureDisc(); updateDisc(); });
  window.addEventListener("scroll", updateDisc, { passive: true });
  window.addEventListener("load", () => { measureDisc(); updateDisc(); });
  if (doc.fonts && doc.fonts.ready) {
    doc.fonts.ready.then(() => { measureDisc(); updateDisc(); });
  }
  measureDisc();
  updateDisc();

  /* ---------- Audio toggle (on by default, with autoplay fallback) ---------- */
  const audioBtn = doc.getElementById("audioToggle");
  const audioLbl = doc.getElementById("audioLabel");
  const bgm = doc.getElementById("bgm");
  if (audioBtn && bgm) {
    bgm.volume = 0;
    let playing = false;
    const targetVol = 0.35;

    const fadeTo = (to, ms = 600) => {
      const from = bgm.volume;
      const t0 = performance.now();
      (function step(now) {
        const t = Math.min(1, (now - t0) / ms);
        bgm.volume = from + (to - from) * t;
        if (t < 1) requestAnimationFrame(step);
      })(performance.now());
    };

    const startPlayback = async () => {
      try {
        await bgm.play();
        playing = true;
        audioBtn.classList.add("is-playing");
        audioBtn.setAttribute("aria-pressed", "true");
        if (audioLbl) audioLbl.textContent = "Sound on";
        fadeTo(targetVol);
        return true;
      } catch (err) {
        return false;
      }
    };

    const stopPlayback = () => {
      fadeTo(0, 400);
      setTimeout(() => {
        bgm.pause();
        playing = false;
        audioBtn.classList.remove("is-playing");
        audioBtn.setAttribute("aria-pressed", "false");
        if (audioLbl) audioLbl.textContent = "Sound off";
      }, 420);
    };

    audioBtn.addEventListener("click", () => {
      if (!playing) startPlayback();
      else stopPlayback();
    });

    // Try to autoplay immediately; fall back to the first sign of activity.
    // Browsers block unmuted autoplay until the user has engaged with the page,
    // so mousemove / scroll / click / touch / keypress all trigger it.
    const gestureEvents = [
      "pointerdown", "pointermove", "mousedown", "mousemove",
      "click", "touchstart", "touchmove", "keydown",
      "wheel", "scroll",
    ];
    const onFirstGesture = async () => {
      if (playing) return;
      const ok = await startPlayback();
      if (ok) {
        gestureEvents.forEach(ev =>
          window.removeEventListener(ev, onFirstGesture, true)
        );
      }
    };

    // Immediate attempt
    startPlayback().then(ok => {
      if (!ok) {
        gestureEvents.forEach(ev =>
          window.addEventListener(ev, onFirstGesture, { capture: true, passive: true })
        );
      }
    });

    // reveal the toggle
    setTimeout(() => audioBtn.classList.add("is-visible"), prefersReduced ? 300 : 1600);

    // duck audio when tab is hidden
    doc.addEventListener("visibilitychange", () => {
      if (!playing) return;
      if (doc.hidden) fadeTo(0, 300);
      else fadeTo(targetVol, 600);
    });
  }

  /* ---------- Stats count-up ---------- */
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseInt(el.getAttribute("data-count"), 10) || 0;
      const dur = 1400;
      const t0 = performance.now();
      function run(now) {
        const t = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(end * eased);
        if (t < 1) requestAnimationFrame(run);
        else el.textContent = end;
      }
      requestAnimationFrame(run);
      statIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  doc.querySelectorAll("[data-count]").forEach(el => statIO.observe(el));

})();
