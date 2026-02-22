"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type FxMode = "soft" | "bold" | "high";
const fxOrder: FxMode[] = ["soft", "bold", "high"];
type A11yPrefs = {
  contrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  underlineLinks: boolean;
};

export default function Header() {
  const pathname = usePathname();
  const audioRef = useRef<AudioContext | null>(null);
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);
  const [a11y, setA11y] = useState<A11yPrefs>(() => {
    if (typeof window === "undefined") {
      return { contrast: false, largeText: false, reduceMotion: false, underlineLinks: false };
    }
    try {
      const raw = localStorage.getItem("site-a11y");
      if (!raw) return { contrast: false, largeText: false, reduceMotion: false, underlineLinks: false };
      const parsed = JSON.parse(raw) as Partial<A11yPrefs>;
      return {
        contrast: Boolean(parsed.contrast),
        largeText: Boolean(parsed.largeText),
        reduceMotion: Boolean(parsed.reduceMotion),
        underlineLinks: Boolean(parsed.underlineLinks),
      };
    } catch {
      return { contrast: false, largeText: false, reduceMotion: false, underlineLinks: false };
    }
  });
  const [soundOn, setSoundOn] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("site-sound") === "on";
  });
  const [fxMode, setFxMode] = useState<FxMode>(() => {
    if (typeof window === "undefined") return "soft";
    const value = localStorage.getItem("site-fx");
    if (value === "soft" || value === "bold" || value === "high") return value;
    return "soft";
  });

  useEffect(() => {
    document.documentElement.dataset.sound = soundOn ? "on" : "off";
  }, [soundOn]);

  useEffect(() => {
    document.documentElement.dataset.fx = fxMode;
  }, [fxMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.a11yContrast = a11y.contrast ? "on" : "off";
    root.dataset.a11yText = a11y.largeText ? "large" : "normal";
    root.dataset.a11yMotion = a11y.reduceMotion ? "reduce" : "normal";
    root.dataset.a11yLinks = a11y.underlineLinks ? "on" : "off";
    localStorage.setItem("site-a11y", JSON.stringify(a11y));
  }, [a11y]);

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 14);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function playUiBeep(frequency: number, length = 0.11) {
    if (!soundOn) return;
    if (!audioRef.current) audioRef.current = new AudioContext();
    const ctx = audioRef.current;
    if (ctx.state === "suspended") {
      void ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.value = 0.0001;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + length);
    osc.stop(ctx.currentTime + length + 0.02);
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    localStorage.setItem("site-sound", next ? "on" : "off");
    document.documentElement.dataset.sound = next ? "on" : "off";
    if (next) {
      if (!audioRef.current) audioRef.current = new AudioContext();
      if (audioRef.current.state === "suspended") {
        void audioRef.current.resume();
      }
      const ctx = audioRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 640;
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
      osc.stop(ctx.currentTime + 0.16);
    }
  }

  function cycleFxMode() {
    const index = fxOrder.indexOf(fxMode);
    const nextMode = fxOrder[(index + 1) % fxOrder.length];
    setFxMode(nextMode);
    localStorage.setItem("site-fx", nextMode);
    document.documentElement.dataset.fx = nextMode;
    playUiBeep(nextMode === "soft" ? 430 : nextMode === "bold" ? 580 : 760, 0.08);
  }

  function toggleA11y<K extends keyof A11yPrefs>(key: K) {
    setA11y((prev) => ({ ...prev, [key]: !prev[key] }));
    playUiBeep(480, 0.06);
  }

  function closeMenus() {
    setOpen(false);
    setA11yOpen(false);
  }

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
      <nav className="site-header-inner">
        <Link href="/" className="site-logo" aria-label="Hors Cadre Studio">
          <span className="site-logo-art" aria-hidden="true">
            <Image
              src="/brand/logo-full.png"
              alt=""
              fill
              priority
              className="site-logo-image"
              sizes="(max-width: 860px) 138px, 176px"
            />
          </span>
          <span className="site-logo-text" aria-hidden="true">
            <span className="site-logo-title">Hors Cadre Studio</span>
            <span className="site-logo-sub">Direction créative</span>
          </span>
          <span className="site-logo-screen">Hors Cadre Studio</span>
        </Link>

        <button
          type="button"
          className="site-burger"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Ouvrir le menu"
        >
          Menu
        </button>

        <div className={`site-nav ${open ? "site-nav-open" : ""}`}>
          <Link href="/prestations" onClick={closeMenus}>Prestations</Link>
          <Link href="/projets" onClick={closeMenus}>Projets</Link>
          <Link href="/processus" onClick={closeMenus}>Processus</Link>
          <Link href="/a-propos" onClick={closeMenus}>À propos</Link>
          <Link href="/contact" className="site-nav-cta" onClick={closeMenus}>
            Contact
          </Link>
          <button
            type="button"
            className="site-fx-toggle"
            onClick={cycleFxMode}
            suppressHydrationWarning
          >
            <span suppressHydrationWarning>
              FX {fxMode === "soft" ? "Soft" : fxMode === "high" ? "High" : "Bold"}
            </span>
          </button>
          <button
            type="button"
            className="site-sound-toggle"
            aria-pressed={soundOn}
            onClick={toggleSound}
            suppressHydrationWarning
          >
            <span suppressHydrationWarning>Son {soundOn ? "ON" : "OFF"}</span>
          </button>
          <div className="site-a11y-wrap">
            <button
              type="button"
              className="site-a11y-toggle"
              onClick={() => setA11yOpen((prev) => !prev)}
              aria-expanded={a11yOpen}
              aria-controls="site-a11y-panel"
            >
              Accessibilité
            </button>
            {a11yOpen ? (
              <div id="site-a11y-panel" className="site-a11y-panel" role="dialog" aria-label="Options d'accessibilité">
                <button type="button" className="site-a11y-option" aria-pressed={a11y.contrast} onClick={() => toggleA11y("contrast")}>
                  Contraste renforcé
                </button>
                <button type="button" className="site-a11y-option" aria-pressed={a11y.largeText} onClick={() => toggleA11y("largeText")}>
                  Texte agrandi
                </button>
                <button type="button" className="site-a11y-option" aria-pressed={a11y.reduceMotion} onClick={() => toggleA11y("reduceMotion")}>
                  Réduire les animations
                </button>
                <button type="button" className="site-a11y-option" aria-pressed={a11y.underlineLinks} onClick={() => toggleA11y("underlineLinks")}>
                  Souligner tous les liens
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}
