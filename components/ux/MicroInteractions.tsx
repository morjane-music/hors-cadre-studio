"use client";

import { useEffect } from "react";
import { trackUxEvent } from "@/lib/ux-client";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function MicroInteractions() {
  useEffect(() => {
    const rootNode = document.querySelector<HTMLElement>(".site-root");
    if (!rootNode) return;
    const root = rootNode;

    const magnetics = root.querySelectorAll<HTMLElement>("[data-magnetic]");
    const parallax = root.querySelectorAll<HTMLElement>("[data-parallax]");
    const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const soundTargets = root.querySelectorAll<HTMLElement>("[data-sound]");
    const sections = root.querySelectorAll<HTMLElement>(".site-wrap > .site-hero, .site-wrap > .site-section");
    const icons = root.querySelectorAll<HTMLElement>(".site-icon");
    const glowCards = root.querySelectorAll<HTMLElement>(
      ".site-card, .site-video-card, .site-guarantee, .site-faq-item"
    );
    const flowGrids = root.querySelectorAll<HTMLElement>(".site-grid[data-flow]");
    const sectionWrap = root.querySelector<HTMLElement>(".site-wrap");

    const heroOrbit = root.querySelector<HTMLElement>(".site-hero-orbit");
    const heroLogo = root.querySelector<HTMLElement>(".site-hero-logo-float");
    const splitTitles = root.querySelectorAll<HTMLElement>(".site-section-title, .site-footer-title");

    splitTitles.forEach((el) => {
      if (el.dataset.splitReady === "1") return;
      const text = el.textContent?.trim();
      if (!text) return;
      el.dataset.splitReady = "1";
      el.setAttribute("aria-label", text);
      el.classList.add("site-split-title");
      const words = text.split(/\s+/);
      el.textContent = "";
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = "site-split-word";
        span.style.transitionDelay = `${index * 34}ms`;
        span.textContent = word;
        span.setAttribute("aria-hidden", "true");
        el.appendChild(span);
      });
      if (!el.closest(".site-reveal")) {
        requestAnimationFrame(() => el.classList.add("is-visible"));
      }
    });

    icons.forEach((icon, index) => {
      const text = icon.textContent?.trim() || "";
      const swapGlyph = index % 3 === 0 ? "\u25CF" : index % 3 === 1 ? "\u25C6" : "\u2713";
      icon.dataset.icon = text || "\u2022";
      icon.dataset.iconAlt = swapGlyph;
      icon.classList.add("is-swap");
    });

    let audioCtx: AudioContext | null = null;
    let soundEnabled =
      document.documentElement.dataset.sound === "on" ||
      localStorage.getItem("site-sound") === "on";

    function ensureAudio() {
      if (!soundEnabled) return null;
      if (!audioCtx) {
        audioCtx = new AudioContext();
      }
      if (audioCtx.state === "suspended") {
        void audioCtx.resume();
      }
      return audioCtx;
    }

    function playTick() {
      const ctx = ensureAudio();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 520;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.stop(ctx.currentTime + 0.09);
    }

    let pointerX = 0;
    let pointerY = 0;
    let pointerRaf = 0;

    function applyPointerMove() {
      pointerRaf = 0;
      root.style.setProperty("--pointer-x", `${pointerX}px`);
      root.style.setProperty("--pointer-y", `${pointerY}px`);

      magnetics.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const x = pointerX - rect.left - rect.width / 2;
        const y = pointerY - rect.top - rect.height / 2;
        const dx = clamp(x / 12, -5, 5);
        const dy = clamp(y / 12, -5, 5);
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      parallax.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const px = (pointerX - rect.left) / rect.width;
        const py = (pointerY - rect.top) / rect.height;
        const rx = clamp((0.5 - py) * 5.2, -5.2, 5.2);
        const ry = clamp((px - 0.5) * 5.2, -5.2, 5.2);
        el.style.setProperty("--rx", `${rx}deg`);
        el.style.setProperty("--ry", `${ry}deg`);
      });
    }

    function onMove(e: Event) {
      const pointer = e as MouseEvent;
      pointerX = pointer.clientX;
      pointerY = pointer.clientY;
      if (!pointerRaf) {
        pointerRaf = window.requestAnimationFrame(applyPointerMove);
      }
    }

    function onLeave() {
      if (pointerRaf) {
        window.cancelAnimationFrame(pointerRaf);
        pointerRaf = 0;
      }
      magnetics.forEach((el) => {
        el.style.transform = "";
      });
      parallax.forEach((el) => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    }

    const cleanupGlow: Array<() => void> = [];
    glowCards.forEach((card) => {
      function onCardMove(e: Event) {
        const pointer = e as MouseEvent;
        const rect = card.getBoundingClientRect();
        const x = ((pointer.clientX - rect.left) / rect.width) * 100;
        const y = ((pointer.clientY - rect.top) / rect.height) * 100;
        const normX = clamp((pointer.clientX - rect.left) / rect.width, 0, 1);
        const normY = clamp((pointer.clientY - rect.top) / rect.height, 0, 1);
        const tiltX = clamp((0.5 - normY) * 7.5, -4.5, 4.5);
        const tiltY = clamp((normX - 0.5) * 8.5, -5.5, 5.5);
        card.style.setProperty("--mx", `${clamp(x, 0, 100)}%`);
        card.style.setProperty("--my", `${clamp(y, 0, 100)}%`);
        card.style.setProperty("--tilt-x", `${tiltX}deg`);
        card.style.setProperty("--tilt-y", `${tiltY}deg`);
      }

      function onCardLeave() {
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      }

      card.addEventListener("mousemove", onCardMove);
      card.addEventListener("mouseleave", onCardLeave);
      cleanupGlow.push(() => {
        card.removeEventListener("mousemove", onCardMove);
        card.removeEventListener("mouseleave", onCardLeave);
      });
    });

    // Custom cursor disabled: it introduced visible latency on some devices.

    let heroRafId = 0;
    const cleanupHeroLogo: Array<() => void> = [];
    if (heroOrbit && heroLogo) {
      let manualMode = false;
      let dragging = false;
      let dragMoved = false;
      let pointerId: number | null = null;
      let offsetX = 0;
      let offsetY = 0;
      let posX = 0;
      let posY = 0;
      let velX = 0;
      let velY = 0;
      let driftT = 0;
      let lastX = 0;
      let lastY = 0;
      let lastT = 0;

      const clampWithinOrbit = () => {
        const maxX = Math.max(0, heroOrbit.clientWidth - heroLogo.offsetWidth);
        const maxY = Math.max(0, heroOrbit.clientHeight - heroLogo.offsetHeight);
        posX = clamp(posX, 0, maxX);
        posY = clamp(posY, 0, maxY);
      };

      const applyHeroPosition = () => {
        heroLogo.style.left = `${posX}px`;
        heroLogo.style.top = `${posY}px`;
      };

      const stopHeroPhysics = () => {
        if (!heroRafId) return;
        window.cancelAnimationFrame(heroRafId);
        heroRafId = 0;
      };

      const stepHeroPhysics = () => {
        if (dragging) {
          heroRafId = 0;
          return;
        }
        driftT += 0.016;
        velX += Math.sin(driftT * 0.9) * 0.06;
        velY += Math.cos(driftT * 0.75) * 0.05;
        posX += velX;
        posY += velY;

        const maxX = Math.max(0, heroOrbit.clientWidth - heroLogo.offsetWidth);
        const maxY = Math.max(0, heroOrbit.clientHeight - heroLogo.offsetHeight);
        if (posX <= 0 || posX >= maxX) {
          posX = clamp(posX, 0, maxX);
          velX *= -0.7;
        }
        if (posY <= 0 || posY >= maxY) {
          posY = clamp(posY, 0, maxY);
          velY *= -0.7;
        }

        velX *= 0.96;
        velY *= 0.96;
        applyHeroPosition();
        heroRafId = window.requestAnimationFrame(stepHeroPhysics);
      };

      const startHeroPhysics = () => {
        if (heroRafId) return;
        heroRafId = window.requestAnimationFrame(stepHeroPhysics);
      };

      const activateHeroManualMode = () => {
        if (manualMode) return;
        manualMode = true;
        const orbitRect = heroOrbit.getBoundingClientRect();
        const logoRect = heroLogo.getBoundingClientRect();
        posX = logoRect.left - orbitRect.left;
        posY = logoRect.top - orbitRect.top;
        clampWithinOrbit();
        heroLogo.classList.add("is-manual");
        heroLogo.style.transform = "none";
        applyHeroPosition();
      };

      const onHeroPointerDown = (event: Event) => {
        const e = event as PointerEvent;
        activateHeroManualMode();
        stopHeroPhysics();
        dragging = true;
        dragMoved = false;
        pointerId = e.pointerId;
        const logoRect = heroLogo.getBoundingClientRect();
        offsetX = e.clientX - logoRect.left;
        offsetY = e.clientY - logoRect.top;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = performance.now();
        velX = 0;
        velY = 0;
        heroLogo.classList.add("is-dragging");
        heroLogo.setPointerCapture?.(e.pointerId);
        e.preventDefault();
      };

      const onHeroPointerMove = (event: Event) => {
        const e = event as PointerEvent;
        if (!dragging || pointerId !== e.pointerId) return;

        const orbitRect = heroOrbit.getBoundingClientRect();
        posX = e.clientX - orbitRect.left - offsetX;
        posY = e.clientY - orbitRect.top - offsetY;
        clampWithinOrbit();
        applyHeroPosition();

        const now = performance.now();
        const dt = Math.max(16, now - lastT);
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        if (!dragMoved && Math.abs(dx) + Math.abs(dy) > 2) {
          dragMoved = true;
        }
        velX = dx / (dt / 16);
        velY = dy / (dt / 16);
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = now;
      };

      const endHeroDrag = () => {
        if (!dragging) return;
        dragging = false;
        if (pointerId !== null && heroLogo.hasPointerCapture?.(pointerId)) {
          heroLogo.releasePointerCapture?.(pointerId);
        }
        pointerId = null;
        heroLogo.classList.remove("is-dragging");
        startHeroPhysics();
      };

      const onHeroPointerUp = (event: Event) => {
        const e = event as PointerEvent;
        if (!dragging) return;
        if (pointerId !== null && pointerId !== e.pointerId) return;
        endHeroDrag();
      };

      const onHeroClick = (event: Event) => {
        const e = event as MouseEvent;
        if (dragMoved) return;
        activateHeroManualMode();
        const rect = heroLogo.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const relX = clamp((e.clientX - centerX) / (rect.width / 2), -1, 1);
        const relY = clamp((e.clientY - centerY) / (rect.height / 2), -1, 1);
        velX += relX * 6.5;
        velY += relY * 6.5;
        startHeroPhysics();
      };

      const onHeroResize = () => {
        if (!manualMode) return;
        clampWithinOrbit();
        applyHeroPosition();
      };

      heroLogo.addEventListener("pointerdown", onHeroPointerDown);
      window.addEventListener("pointermove", onHeroPointerMove);
      window.addEventListener("pointerup", onHeroPointerUp);
      window.addEventListener("pointercancel", onHeroPointerUp);
      heroLogo.addEventListener("click", onHeroClick);
      window.addEventListener("resize", onHeroResize);
      startHeroPhysics();

      cleanupHeroLogo.push(() => {
        stopHeroPhysics();
        heroLogo.removeEventListener("pointerdown", onHeroPointerDown);
        window.removeEventListener("pointermove", onHeroPointerMove);
        window.removeEventListener("pointerup", onHeroPointerUp);
        window.removeEventListener("pointercancel", onHeroPointerUp);
        heroLogo.removeEventListener("click", onHeroClick);
        window.removeEventListener("resize", onHeroResize);
      });
    }

    let rafId = 0;
    function updateActiveSection() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        if (!sections.length) return;

        const anchor = window.innerHeight * 0.42;
        let best: HTMLElement | null = null;
        let bestDistance = Number.POSITIVE_INFINITY;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const distance = Math.abs(center - anchor);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = section;
          }
        });

        sections.forEach((section) => {
          section.classList.toggle("is-active", section === best);
        });
        if (best) {
          const accent = getComputedStyle(best).getPropertyValue("--section-accent").trim();
          if (accent) {
            root.style.setProperty("--active-accent", accent);
          }
        }
      });
    }

    function ensureFlowSvg(container: HTMLElement) {
      let svg = container.querySelector<SVGSVGElement>("svg.site-flow-svg");
      if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("site-flow-svg");
        container.appendChild(svg);
      }
      return svg;
    }

    function drawFlow(container: HTMLElement) {
      const svg = ensureFlowSvg(container);
      const cards = Array.from(container.querySelectorAll<HTMLElement>(".site-card"));
      if (cards.length < 2 || window.innerWidth < 900) {
        svg.innerHTML = "";
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const width = Math.max(1, Math.round(containerRect.width));
      const height = Math.max(1, Math.round(containerRect.height));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.innerHTML = "";

      for (let i = 0; i < cards.length - 1; i += 1) {
        const from = cards[i].getBoundingClientRect();
        const to = cards[i + 1].getBoundingClientRect();
        const x1 = from.right - containerRect.left - 10;
        const y1 = from.top - containerRect.top + from.height / 2;
        const x2 = to.left - containerRect.left + 10;
        const y2 = to.top - containerRect.top + to.height / 2;
        if (Math.abs(y2 - y1) > 42 || x2 <= x1 + 8) {
          continue;
        }
        const cp1x = x1 + 26;
        const cp1y = y1;
        const cp2x = x2 - 26;
        const cp2y = y2;

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
          "d",
          `M ${x1.toFixed(2)} ${y1.toFixed(2)} C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}`
        );
        path.setAttribute("class", "site-flow-path");
        svg.appendChild(path);

        const node = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        node.setAttribute("cx", x2.toFixed(2));
        node.setAttribute("cy", y2.toFixed(2));
        node.setAttribute("r", "3.2");
        node.setAttribute("class", "site-flow-node");
        svg.appendChild(node);
      }
    }

    function updateFlow() {
      flowGrids.forEach((grid) => drawFlow(grid));
    }

    function ensureSectionFlowSvg(container: HTMLElement) {
      let svg = container.querySelector<SVGSVGElement>("svg.site-section-flow-svg");
      if (!svg) {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("site-section-flow-svg");
        container.appendChild(svg);
      }
      return svg;
    }

    function drawSectionFlow() {
      if (!sectionWrap) return;
      const svg = ensureSectionFlowSvg(sectionWrap);
      const stepSections = Array.from(
        sectionWrap.querySelectorAll<HTMLElement>(".site-section")
      );

      if (stepSections.length < 2 || window.innerWidth < 920) {
        svg.innerHTML = "";
        return;
      }

      const wrapRect = sectionWrap.getBoundingClientRect();
      const width = Math.max(1, Math.round(wrapRect.width));
      const height = Math.max(1, Math.round(sectionWrap.scrollHeight));
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.setAttribute("width", String(width));
      svg.setAttribute("height", String(height));
      svg.innerHTML = "";

      const laneX = 3;
      const yPoints = stepSections.map((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top - wrapRect.top + 22;
      });

      const rail = document.createElementNS("http://www.w3.org/2000/svg", "path");
      rail.setAttribute("d", `M ${laneX} ${yPoints[0].toFixed(2)} L ${laneX} ${yPoints[yPoints.length - 1].toFixed(2)}`);
      rail.setAttribute("class", "site-section-flow-path");
      svg.appendChild(rail);

      const glowRail = document.createElementNS("http://www.w3.org/2000/svg", "path");
      glowRail.setAttribute(
        "d",
        `M ${laneX} ${yPoints[0].toFixed(2)} L ${laneX} ${yPoints[yPoints.length - 1].toFixed(2)}`
      );
      glowRail.setAttribute("class", "site-section-flow-path-glow");
      svg.appendChild(glowRail);

      // Rail only: no dashes/arrows/dots.
    }

    function onSoundHover() {
      if (!soundEnabled) return;
      playTick();
    }

    function onTrackedClick(event: Event) {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-track], .site-btn, .site-cta-secondary, .site-nav a, .site-footer-nav-link"
      );
      if (!target) return;

      const explicit = target.getAttribute("data-track");
      const label = explicit || target.textContent?.trim() || "cta_click";
      const href = target instanceof HTMLAnchorElement ? target.getAttribute("href") : null;

      trackUxEvent("cta_click", {
        label,
        href: href ?? undefined,
        context: target.closest(".site-section")?.querySelector(".site-section-title")?.textContent?.trim() || "global",
      });
    }

    function onFirstPointer() {
      soundEnabled =
        document.documentElement.dataset.sound === "on" ||
        localStorage.getItem("site-sound") === "on";
      ensureAudio();
      document.removeEventListener("pointerdown", onFirstPointer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.revealDelay ?? 0);
          if (delay) {
            setTimeout(() => el.classList.add("is-visible"), delay);
          } else {
            el.classList.add("is-visible");
          }
          el.querySelectorAll<HTMLElement>(".site-split-title").forEach((title) => {
            title.classList.add("is-visible");
          });
          observer.unobserve(el);
        });
      },
      { threshold: 0.2 }
    );

    reveals.forEach((el) => observer.observe(el));
    updateActiveSection();
    updateFlow();
    drawSectionFlow();
    const timers = [
      window.setTimeout(() => {
        updateFlow();
        drawSectionFlow();
      }, 420),
      window.setTimeout(() => {
        updateFlow();
        drawSectionFlow();
      }, 980),
    ];

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("click", onTrackedClick);
    soundTargets.forEach((el) => el.addEventListener("mouseenter", onSoundHover));
    soundTargets.forEach((el) => el.addEventListener("click", onSoundHover));
    document.addEventListener("pointerdown", onFirstPointer);
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("resize", updateFlow);
    window.addEventListener("resize", drawSectionFlow);
    window.addEventListener("scroll", drawSectionFlow, { passive: true });

    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("click", onTrackedClick);
      soundTargets.forEach((el) => el.removeEventListener("mouseenter", onSoundHover));
      soundTargets.forEach((el) => el.removeEventListener("click", onSoundHover));
      document.removeEventListener("pointerdown", onFirstPointer);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("resize", updateFlow);
      window.removeEventListener("resize", drawSectionFlow);
      window.removeEventListener("scroll", drawSectionFlow);
      timers.forEach((timer) => window.clearTimeout(timer));
      cleanupGlow.forEach((off) => off());
      cleanupHeroLogo.forEach((off) => off());
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      if (pointerRaf) {
        window.cancelAnimationFrame(pointerRaf);
      }
      observer.disconnect();
    };
  }, []);

  return null;
}
