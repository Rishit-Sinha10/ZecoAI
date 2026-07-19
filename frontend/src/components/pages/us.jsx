import React, { useState, useEffect, useRef} from "react";
import {motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Sparkles,
  Zap,
  Bug,
  MessageSquare,
  FolderTree,
  Cloud,
  ShieldCheck,
  LayoutTemplate,
  Play,
  ChevronDown,
  Menu,
  X,
  Github,
  ArrowRight,
  TerminalSquare,
  Code2,
  GitBranch,
  CheckCircle2,
  FileCode2,
  Folder,
  Wand2,
  Rocket,
  Brain,
  Search,
  RefreshCw,
  MonitorSmartphone,
  Lock,
  Blocks,
  Check,
  ExternalLink,
  Mail,
} from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import favicon from "../../../public/favicon.svg";

/* ═══════════════════════════════════════════════════════════════════════
   SCOPED LANDING STYLES
   ═══════════════════════════════════════════════════════════════════════ */

const LANDING_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* reveal on scroll */
.landing .reveal{ opacity:0; transform:translateY(20px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
.landing .reveal.visible{ opacity:1; transform:translateY(0); }
.landing .reveal-delay-1{ transition-delay:.08s; }
.landing .reveal-delay-2{ transition-delay:.16s; }
.landing .reveal-delay-3{ transition-delay:.24s; }
.landing .reveal-delay-4{ transition-delay:.32s; }

/* hero grid */
.landing .hero-grid{
  background-image:
    linear-gradient(to right, var(--hero-grid-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--hero-grid-color) 1px, transparent 1px);
  background-size:44px 44px;
  -webkit-mask-image:radial-gradient(ellipse 70% 55% at 50% 20%, black 40%, transparent 85%);
  mask-image:radial-gradient(ellipse 70% 55% at 50% 20%, black 40%, transparent 85%);
}

/* text gradient */
.landing .text-grad{
  background:linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 50%, var(--accent-hover) 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}

/* glow orb */
.landing .glow-orb{
  position:absolute; border-radius:999px; filter:blur(90px); pointer-events:none; z-index:0;
}

/* IDE demo */
.landing .ide-shell{
  background:var(--ide-bg);
  border:1px solid var(--ide-border);
  border-radius:16px;
  box-shadow:0 30px 80px -30px rgba(0,0,0,.5), 0 0 0 1px var(--glass-border) inset;
  overflow:hidden;
}
.landing .ide-tab{ font-family:'JetBrains Mono',monospace; font-size:.72rem; }
.landing .ide-line{ font-family:'JetBrains Mono',monospace; font-size:.8rem; line-height:1.65; white-space:pre; }
.landing .caret{
  display:inline-block; width:2px; height:1em; background:var(--accent);
  vertical-align:text-bottom; animation:landingBlink 1s steps(1) infinite;
}
@keyframes landingBlink{ 50%{ opacity:0; } }
.landing .dot-flash{ animation:landingDotflash 1.2s ease-in-out infinite; }
.landing .dot-flash:nth-child(2){ animation-delay:.15s; }
.landing .dot-flash:nth-child(3){ animation-delay:.3s; }
@keyframes landingDotflash{ 0%,80%,100%{ opacity:.25; } 40%{ opacity:1; } }

.landing .kw{ color:var(--kw); }
.landing .fn{ color:var(--fn); }
.landing .str{ color:var(--str); }
.landing .cm{ color:var(--cm); }

/* buttons */
.landing .btn-primary{
  background:var(--accent);
  color:var(--text-inverse); font-weight:600;
  border:1px solid transparent;
  box-shadow:0 1px 0 rgba(255,255,255,.15) inset, 0 8px 24px -8px var(--glow-primary);
  transition:transform .18s ease, box-shadow .18s ease, filter .18s ease;
}
.landing .btn-primary:hover{ transform:translateY(-1px); filter:brightness(1.1); box-shadow:0 1px 0 rgba(255,255,255,.2) inset, 0 12px 30px -8px var(--glow-primary);}
.landing .btn-primary:active{ transform:translateY(0px) scale(.985); }

.landing .btn-ghost{
  background:var(--glass-bg); color:var(--text-primary);
  border:1px solid var(--glass-border);
  backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
  transition:background .18s ease, border-color .18s ease, transform .18s ease;
}
.landing .btn-ghost:hover{ background:var(--glass-bg-hover); border-color:var(--border-strong); transform:translateY(-1px); }

/* nav */
.landing .nav{
  position:sticky; top:0; z-index:50;
  transition:background .35s ease, border-color .35s ease, backdrop-filter .35s ease;
  border-bottom:1px solid transparent;
}
.landing .nav.scrolled{
  background:var(--glass-bg);
  backdrop-filter:blur(var(--glass-blur));
  -webkit-backdrop-filter:blur(var(--glass-blur));
  border-bottom:1px solid var(--glass-border);
}
.landing .nav-link{ color:var(--text-secondary); font-size:.875rem; transition:color .15s ease; }
.landing .nav-link:hover{ color:var(--text-primary); }

/* announcement */
.landing .announce{
  background:var(--accent-light);
  border-bottom:1px solid var(--glass-border);
}

/* bento card premium */
.landing .bento-card-premium{
  position:relative; border-radius:20px; overflow:hidden;
  background:var(--glass-bg);
  border:1px solid var(--glass-border);
  backdrop-filter:blur(var(--glass-blur));
  -webkit-backdrop-filter:blur(var(--glass-blur));
  transition: border-color .3s ease;
}
.landing .bento-card-premium:hover{ border-color:var(--border-strong); }

/* bento card glow */
.landing .bento-glow{
  position:absolute; inset:0; border-radius:20px; pointer-events:none; z-index:0;
  opacity:0; transition:opacity .4s ease;
}
.landing .bento-card-premium:hover .bento-glow{ opacity:1; }

/* bento card border gradient */
.landing .bento-card-premium::after{
  content:''; position:absolute; inset:0; border-radius:20px; padding:1px; pointer-events:none; z-index:1;
  background:linear-gradient(135deg, transparent, transparent);
  transition:background .4s ease;
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}
.landing .bento-card-premium:hover::after{
  background:linear-gradient(135deg, var(--accent), transparent 60%);
}

/* workflow */
.landing .wf-line{
  position:absolute; left:19px; top:8px; bottom:8px; width:2px;
  background:linear-gradient(180deg, var(--accent), var(--accent-hover), transparent);
  transform-origin:top; transform:scaleY(0); transition:transform 1.1s cubic-bezier(.16,1,.3,1);
}
.landing .wf-line.visible{ transform:scaleY(1); }
.landing .wf-dot{
  width:40px; height:40px; border-radius:999px; display:flex; align-items:center; justify-content:center;
  background:var(--bg-tertiary); border:1px solid var(--glass-border); flex-shrink:0; z-index:1;
}

/* accordion */
.landing .acc-panel{ display:grid; grid-template-rows:0fr; transition:grid-template-rows .35s ease; }
.landing .acc-panel.open{ grid-template-rows:1fr; }
.landing .acc-inner{ overflow:hidden; }
.landing .acc-chevron{ transition:transform .3s ease; }
.landing .acc-chevron.open{ transform:rotate(180deg); }

/* scrollbar */
.landing ::-webkit-scrollbar{ width:6px; height:6px; }
.landing ::-webkit-scrollbar-track{ background:transparent; }
.landing ::-webkit-scrollbar-thumb{ background:var(--scrollbar); border-radius:3px; }

/* focus */
.landing a:focus-visible, .landing button:focus-visible, .landing input:focus-visible{
  outline:2px solid var(--accent); outline-offset:2px; border-radius:6px;
}

/* floating icon animation */
@keyframes floatY {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
.landing .float-icon { animation: floatY 3s ease-in-out infinite; }
.landing .float-icon-delay-1 { animation-delay: 0.5s; }
.landing .float-icon-delay-2 { animation-delay: 1s; }
.landing .float-icon-delay-3 { animation-delay: 1.5s; }

/* shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* pulse ring */
@keyframes pulseRing {
  0% { transform: scale(0.8); opacity: 0.6; }
  100% { transform: scale(1.6); opacity: 0; }
}

@media (prefers-reduced-motion: reduce){
  .landing *{ animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; }
}
`;

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════ */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ as = "div", delay = 0, className = "", children, ...props }) {
  const [ref, visible] = useReveal();
  const Component = as;
  const revealClasses = [
    "reveal",
    visible ? "visible" : "",
    delay ? `reveal-delay-${Math.min(delay, 4)}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component ref={ref} className={revealClasses} {...props}>
      {children}
    </Component>
  );
}

function SectionHeading({ eyebrow, title, desc, center = true }) {
  return (
    <Reveal className={`mb-14 ${center ? "text-center max-w-2xl mx-auto" : ""}`}>
      <div
        className="font-mono text-xs tracking-widest uppercase mb-4"
        style={{ color: "var(--accent)" }}
      >
        {eyebrow}
      </div>
      <h2
        className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      {desc && (
        <p
          className="mt-4 text-lg leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {desc}
        </p>
      )}
    </Reveal>
  );
}
/* ═══════════════════════════════════════════════════════════════════════
   NAV
   ═══════════════════════════════════════════════════════════════════════ */

function Nav({ mobileOpen, setMobileOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Features", "Templates","Docs"];

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href="#hero"
          className="flex items-center gap-2 font-display font-semibold text-lg"
        >
          <img src={favicon} alt="ZecoAI" width={18} height={18} />
          Zeco<span style={{ color: "var(--accent)" }}>AI</span>
        </a>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">
              {l}
            </a>
          ))}
          <a
            href="https://github.com/Rishit-Sinha10/ZecoAI"
            className="nav-link flex items-center gap-1.5"
          >
            <Github size={15} /> GitHub
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <button className="nav-link cursor-pointer">Sign in</button>
            </SignInButton>
            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <button className="btn-primary text-sm px-4 py-2 rounded-lg cursor-pointer">
                Start coding free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="btn-primary text-sm px-4 py-2 rounded-lg"
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{ color: "var(--text-primary)" }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden px-4 py-4 flex flex-col gap-4"
          style={{
            borderTop: "1px solid var(--glass-border)",
            background: "var(--bg-secondary)",
          }}
        >
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {l}
            </a>
          ))}
          <a
            href="https://github.com/Rishit-Sinha10/ZecoAI"
            className="nav-link"
          >
            GitHub
          </a>
          <SignedOut>
            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <button className="nav-link cursor-pointer text-left">
                Sign in
              </button>
            </SignInButton>
            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <button className="btn-primary text-sm px-4 py-2.5 rounded-lg text-center cursor-pointer w-full">
                Start coding free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="btn-primary text-sm px-4 py-2.5 rounded-lg text-center"
            >
              Dashboard
            </Link>
          </SignedIn>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   IDE DEMO
   ═══════════════════════════════════════════════════════════════════════ */

const CODE_LINES = [
  { t: [{ c: "kw", v: "function" }, { v: " " }, { c: "fn", v: "TodoApp" }, { v: "() {" }] },
  { t: [{ v: "  " }, { c: "kw", v: "const" }, { v: " [items, setItems] = " }, { c: "fn", v: "useState" }, { v: "([]);" }] },
  { t: [{ v: "  " }, { c: "kw", v: "const" }, { v: " " }, { c: "fn", v: "onDrop" }, { v: " = (from, to) => {" }] },
  { t: [{ v: "    " }, { c: "cm", v: "// reorder + persist instantly" }] },
  { t: [{ v: "    " }, { c: "fn", v: "reorder" }, { v: "(items, from, to);" }] },
  { t: [{ v: "  };" }] },
  { t: [{ v: "  " }, { c: "kw", v: "return" }, { v: " (" }] },
  { t: [{ v: "    " }, { c: "tag", v: "<DragList" }, { v: " items={items} " }, { c: "tag", v: "onDrop" }, { v: "={onDrop} />" }] },
  { t: [{ v: "  );" }] },
  { t: [{ v: "}" }] },
];

const TERMINAL_LINES = [
  "> npm run dev",
  "\u2713 compiled in 412ms",
  "\u2713 server ready on :3000",
];

function useIdeSequence() {
  const [phase, setPhase] = useState("prompt");
  const [promptText, setPromptText] = useState("");
  const [codeCount, setCodeCount] = useState(0);
  const [termCount, setTermCount] = useState(0);
  const mounted = useRef(true);
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  useEffect(() => {
    mounted.current = true;
    const full = "Build a todo app with drag and drop";
    async function run() {
      while (mounted.current) {
        setPhase("prompt"); setPromptText("");
        for (let i = 0; i <= full.length; i++) {
          if (!mounted.current) return;
          setPromptText(full.slice(0, i)); await wait(28);
        }
        await wait(500); if (!mounted.current) return;
        setPhase("thinking"); await wait(1100); if (!mounted.current) return;
        setPhase("code"); setCodeCount(0);
        for (let i = 1; i <= CODE_LINES.length; i++) {
          if (!mounted.current) return; setCodeCount(i); await wait(160);
        }
        await wait(400); if (!mounted.current) return;
        setPhase("run"); setTermCount(0);
        for (let i = 1; i <= TERMINAL_LINES.length; i++) {
          if (!mounted.current) return; setTermCount(i); await wait(420);
        }
        await wait(350); if (!mounted.current) return;
        setPhase("preview"); await wait(3200); if (!mounted.current) return;
      }
    }
    run();
    return () => { mounted.current = false; };
  }, []);

  return { phase, promptText, codeCount, termCount };
}

function IdeDemo() {
  const { phase, promptText, codeCount, termCount } = useIdeSequence();
  const showCode = phase === "code" || phase === "run" || phase === "preview";
  const showTerminal = phase === "run" || phase === "preview";
  const showPreview = phase === "preview";

  return (
    <div className="ide-shell">
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid var(--ide-border)", background: "var(--glass-bg)" }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--text-tertiary)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--text-tertiary)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--text-tertiary)" }} />
        </div>
        <div className="ide-tab flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-md" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--ide-border)" }}>
          <FileCode2 size={12} style={{ color: "var(--accent)" }} /> TodoApp.jsx
        </div>
        <div className="ide-tab hidden sm:flex items-center gap-1.5 px-2.5 py-1" style={{ color: "var(--text-tertiary)" }}>
          <FileCode2 size={12} /> DragList.jsx
        </div>
        <div className="ml-auto flex items-center gap-1.5 ide-tab" style={{ color: "var(--text-tertiary)" }}>
          <GitBranch size={12} /> main
        </div>
      </div>

      <div className="grid md:grid-cols-[170px_1fr_240px]">
        <div className="hidden md:block px-3 py-4" style={{ borderRight: "1px solid var(--ide-border)" }}>
          <div className="ide-tab flex items-center gap-1.5 mb-2 px-1" style={{ color: "var(--text-tertiary)" }}>
            <Folder size={12} /> src
          </div>
          {["TodoApp.jsx", "DragList.jsx", "useState.js", "styles.css"].map((f, i) => (
            <div key={f} className="ide-tab flex items-center gap-1.5 pl-4 py-1 rounded"
              style={i === 0 ? { color: "var(--accent)", background: "var(--bg-tertiary)" } : { color: "var(--text-tertiary)" }}>
              <FileCode2 size={11} /> {f}
            </div>
          ))}
        </div>

        <div className="flex flex-col" style={{ borderRight: "1px solid var(--ide-border)" }}>
          <div className="px-4 py-4 min-h-[190px]">
            {phase === "prompt" || phase === "thinking" ? (
              <div className="flex items-start gap-2">
                <Wand2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--accent)" }} />
                <div className="ide-line" style={{ color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--code-text)" }}>{promptText}</span>
                  {phase === "prompt" && <span className="caret" />}
                  {phase === "thinking" && (
                    <div className="mt-2 flex items-center gap-1.5" style={{ color: "var(--accent)" }}>
                      <span className="dot-flash">&#9679;</span>
                      <span className="dot-flash">&#9679;</span>
                      <span className="dot-flash">&#9679;</span>
                      <span className="ml-1 text-xs" style={{ color: "var(--text-tertiary)" }}>generating</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {CODE_LINES.slice(0, codeCount).map((line, i) => (
                  <div key={i} className="ide-line" style={{ color: "var(--code-text)" }}>
                    {line.t.map((tok, j) => (
                      <span key={j} className={tok.c || ""}>{tok.v}</span>
                    ))}
                  </div>
                ))}
                {showCode && codeCount < CODE_LINES.length && <span className="caret" />}
              </div>
            )}
          </div>
          <div className="mt-auto px-4 py-3 min-h-[92px]" style={{ borderTop: "1px solid var(--ide-border)", background: "rgba(0,0,0,.15)" }}>
            <div className="ide-tab flex items-center gap-1.5 mb-1.5" style={{ color: "var(--text-tertiary)" }}>
              <TerminalSquare size={12} /> terminal
            </div>
            {showTerminal ? (
              TERMINAL_LINES.slice(0, termCount).map((l, i) => (
                <div key={i} className="ide-line" style={{ color: l.startsWith("\u2713") ? "var(--str)" : "var(--code-text)" }}>
                  {l}
                </div>
              ))
            ) : (
              <div className="ide-line" style={{ color: "var(--text-tertiary)" }}>waiting for run...</div>
            )}
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="ide-tab flex items-center gap-1.5 mb-2" style={{ color: "var(--text-tertiary)" }}>
            <Play size={11} /> preview
          </div>
          <div className="rounded-lg h-[220px] p-3 relative overflow-hidden" style={{ border: "1px solid var(--ide-border)", background: "var(--bg-tertiary)" }}>
            {showPreview ? (
              <div>
                <div className="text-xs font-medium mb-2" style={{ color: "var(--text-primary)" }}>My Todos</div>
                {["Design bento grid", "Wire up AI stream", "Ship it"].map((t, i) => (
                  <div key={t} className="flex items-center gap-2 text-[11px] mb-1.5 px-2 py-1.5 rounded-md"
                    style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
                    <span className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ border: "1px solid var(--text-tertiary)", background: i === 2 ? "var(--str)" : "transparent" }} />
                    <span style={i === 2 ? { textDecoration: "line-through", color: "var(--text-tertiary)" } : { color: "var(--text-primary)" }}>
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                no output yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════ */

function Hero() {
  return (
    <section id="hero" className="relative pt-20 pb-24 px-4 sm:px-6">
      <div className="absolute inset-0 hero-grid" />
      <div className="glow-orb w-[520px] h-[520px] -top-40 left-1/2 -translate-x-1/2"
        style={{ background: "radial-gradient(circle, var(--glow-primary), transparent 70%)" }} />
      <div className="glow-orb w-[420px] h-[420px] top-40 right-0"
        style={{ background: "radial-gradient(circle, var(--glow-secondary), transparent 70%)" }} />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <Reveal delay={1} as="h1"
          className="font-display font-semibold text-[2.6rem] leading-[1.05] sm:text-6xl sm:leading-[1.03] md:text-7xl md:leading-[.98]">
          Build. Run. Debug.
          <br className="hidden sm:block" /> <span className="text-grad">Ship.</span>
        </Reveal>
        <Reveal delay={2} as="p"
          className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}>
          Every part of your dev loop, in one browser tab. AI writes the code,
          explains it, and fixes what breaks — while you stay in flow.
        </Reveal>

        <Reveal delay={3} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SignedOut>
            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <button className="btn-primary px-6 py-3 rounded-xl text-sm w-full sm:w-auto text-center cursor-pointer">
                Start coding free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="btn-primary px-6 py-3 rounded-xl text-sm w-full sm:w-auto text-center">
              Go to Dashboard
            </Link>
          </SignedIn>
          <a href="#demo" className="btn-ghost px-6 py-3 rounded-xl text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2">
            <Play size={14} /> Watch demo
          </a>
        </Reveal>

        <Reveal delay={4} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
          style={{ color: "var(--text-secondary)" }}>
          <span>Zero install</span>
          <span className="hidden sm:inline" style={{ color: "var(--text-tertiary)" }}>·</span>
          <span>Browser native</span>
          <span className="hidden sm:inline" style={{ color: "var(--text-tertiary)" }}>·</span>
          <span>AI powered</span>
        </Reveal>
      </div>

      <Reveal delay={4} id="demo" className="max-w-5xl mx-auto mt-16 relative z-10">
        <IdeDemo />
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   BENTO GRID — Premium Redesign
   ═══════════════════════════════════════════════════════════════════════ */

function BentoCard({ children, className = "", delay = 0, span = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useSpring(x, { stiffness: 200, damping: 25 });
  const glowY = useSpring(y, { stiffness: 200, damping: 25 });

 

  return (
    <Reveal delay={delay}>
      <motion.div
        ref={ref}
        className={`bento-card-premium p-6 sm:p-8 flex flex-col ${span} ${className}`}
        whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      >
        <motion.div
          className="bento-glow"
          style={{
            left: glowX,
            top: glowY,
            x: "-50%",
            y: "-50%",
            background: "radial-gradient(circle 200px, var(--glow-primary), transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col h-full">{children}</div>
      </motion.div>
    </Reveal>
  );
}

const BENTO_FEATURES = [
  {
    icon: Wand2,
    title: "AI Pair Programmer",
    desc: "Generate production-ready applications, APIs, UI components, database models, and utilities with context-aware AI that understands your project.",
    span: "md:col-span-2 md:row-span-2",
    visual: "ai-generate",
    accentColor: "var(--accent)",
  },
  {
    icon: Bug,
    title: "Debug in Seconds",
    desc: "Instantly understand errors, identify root causes, and receive AI-generated fixes before opening Stack Overflow. and give inline suggestion for app to get correct approach or method to correct the code",
    visual: "debug",
    accentColor: "#ef4444",
  },
  {
    icon: MessageSquare,
    title: "Chat with Your Entire Project",
    desc: "Ask questions about any file, function, component, or architecture, and get intelligent, context-aware answers. ZecoAI analyzes your entire workspace to explain code, trace dependencies, and help you understand complex projects faster.",
    visual: "chat",
    accentColor: "#8b5cf6",
  },
  {
    icon: TerminalSquare,
    title: "Run Code Instantly",
    desc: "Execute JavaScript, Python, Java, C++, Go, Rust, PHP, and more inside secure isolated sandboxes with near-instant startup.",
    span: "md:col-span-2",
    visual: "terminal",
    accentColor: "var(--str)",
  },
  {
    icon: LayoutTemplate,
    title: "Launch from Templates",
    desc: "Go from idea to code instantly with production-ready starter templates. Launch React, Next.js, Express, Flask, Node.js, and other modern applications with optimized project structures, essential tooling, and best practices built in.",
    visual: "templates",
    accentColor: "#f59e0b",
  },
  {
    icon: FolderTree,
    title: "Everything Organized",
    desc: "Projects, folders, files, search, autosave, and workspace management designed for modern developers.",
    visual: "files",
    accentColor: "#06b6d4",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    desc: "Your projects are automatically saved and accessible from anywhere without manual backups.",
    visual: "cloud",
    accentColor: "#3b82f6",
  },
  {
    icon: ShieldCheck,
    title: "Secure Execution",
    desc: "Every execution happens inside isolated containers to ensure safety, reliability, and predictable environments.",
    visual: "security",
    accentColor: "#10b981",
  },
  {
    icon: Sparkles,
    title: "Edit Code with AI",
    desc: "Highlight any code and describe the change in plain English. ZecoAI intelligently rewrites, refactors, optimizes, documents, or fixes your code while preserving your project's style and context.",
    visual: "inline-edit",
    accentColor: "#14b8a6",
  },
];

/* Mini visual components for each bento card */
function AiGenerateVisual() {
  return (
    <div className="mt-4 flex-1 rounded-xl overflow-hidden relative" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 140 }}>
      <div className="px-3 py-2 flex items-center gap-1.5" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--text-tertiary)" }} />
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--text-tertiary)" }} />
        <span className="w-2 h-2 rounded-full" style={{ background: "var(--text-tertiary)" }} />
        <span className="ml-2 font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>ai-chat</span>
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-light)" }}>
            <Sparkles size={10} style={{ color: "var(--accent)" }} />
          </div>
          <div className="rounded-lg px-3 py-2 text-xs font-mono" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}>
            Build a REST API with auth and rate limiting
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)" }}>
            <Zap size={10} style={{ color: "var(--text-inverse)" }} />
          </div>
          <div className="rounded-lg px-3 py-2 text-[11px] font-mono space-y-1" style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
            <div><span style={{ color: "var(--kw)" }}>const</span> router = <span style={{ color: "var(--fn)" }}>express</span>.<span style={{ color: "var(--fn)" }}>Router</span>();</div>
            <div><span style={{ color: "var(--kw)" }}>const</span> limiter = <span style={{ color: "var(--fn)" }}>rateLimit</span>({`{ windowMs: 15*60*1000 }`});</div>
            <div style={{ color: "var(--cm)" }}>// Generated 12 routes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DebugVisual() {
  return (
    <div className="mt-4 flex-1 rounded-xl overflow-hidden" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 160 }}>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span style={{ color: "#ef4444" }}>TypeError</span>
          <span style={{ color: "var(--text-tertiary)" }}>Cannot read properties of undefined</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--str)" }} />
          <span className="text-[11px] font-mono" style={{ color: "var(--str)" }}>Fixed: Added null check on line 42</span>
        </div>
        <div className="rounded-lg px-2 py-1.5 text-[10px] font-mono" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
          <span style={{ color: "var(--cm)" }}>if</span> {"(data?.user)"} {"{"} <span style={{ color: "var(--kw)" }}>return</span> data.user; {"}"}
        </div>
      </div>
    </div>
  );
}

function ChatVisual() {
  return (
    <div className="mt-4 flex-1 rounded-xl overflow-hidden" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 140 }}>
      <div className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent-light)" }}>
            <MessageSquare size={8} style={{ color: "var(--accent)" }} />
          </div>
          <div className="text-[11px] rounded-lg px-2.5 py-1.5" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}>
            How does the auth middleware work?
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--accent)" }}>
            <Zap size={8} style={{ color: "var(--text-inverse)" }} />
          </div>
          <div className="text-[11px] rounded-lg px-2.5 py-1.5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
            The middleware in <span className="font-mono" style={{ color: "var(--accent)" }}>auth.middleware.js</span> validates JWT tokens...
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalVisual() {
  return (
    <div className="mt-4 flex-1 rounded-xl overflow-hidden" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 100 }}>
      <div className="px-3 py-2 flex items-center gap-1.5" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <TerminalSquare size={10} style={{ color: "var(--text-tertiary)" }} />
        <span className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>terminal</span>
      </div>
      <div className="p-3 font-mono text-[11px] space-y-1" style={{ color: "var(--text-secondary)" }}>
        <div><span style={{ color: "var(--accent)" }}>$</span> python main.py</div>
        <div style={{ color: "var(--str)" }}>{"\u2713"} Server running on port 8000</div>
        <div><span style={{ color: "var(--accent)" }}>$</span> node index.js</div>
        <div style={{ color: "var(--str)" }}>{"\u2713"} Compiled successfully (218ms)</div>
        <div><span style={{ color: "var(--accent)" }}>$</span> go run .</div>
        <div style={{ color: "var(--str)" }}>{"\u2713"} Binary built: ./app</div>
      </div>
    </div>
  );
}

function TemplatesVisual() {
  const tpls = [
    { name: "Next.js", color: "#000" },
    { name: "Express", color: "#37D67A" },
    { name: "Flask", color: "#37D67A" },
    { name: "React", color: "#4C8DFF" },
  ];
  return (
    <div className="mt-4 flex-1 rounded-xl overflow-hidden" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 140 }}>
      <div className="p-3 grid grid-cols-2 gap-2">
        {tpls.map((t) => (
          <div key={t.name} className="rounded-lg px-3 py-2.5 text-[11px] font-mono font-medium flex items-center gap-2"
            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
            {t.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function FilesVisual() {
  const files = ["src/", "  components/", "    Header.jsx", "    Footer.jsx", "  utils/", "    api.js", "package.json"];
  return (
    <div className="mt-4 flex-1 rounded-xl overflow-hidden" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 140 }}>
      <div className="px-3 py-2 flex items-center gap-1.5" style={{ borderBottom: "1px solid var(--glass-border)" }}>
        <Folder size={10} style={{ color: "var(--text-tertiary)" }} />
        <span className="font-mono text-[10px]" style={{ color: "var(--text-tertiary)" }}>explorer</span>
      </div>
      <div className="p-2 font-mono text-[10px] space-y-0.5">
        {files.map((f, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded"
            style={i === 4 ? { background: "var(--glass-bg)", color: "var(--accent)" } : { color: "var(--text-secondary)" }}>
            {f.includes(".") ? <FileCode2 size={9} /> : <Folder size={9} />}
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

function CloudVisual() {
  return (
    <div className="mt-4 flex-1 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 100 }}>
      <div className="flex items-center gap-4">
        <div className="float-icon">
          <Cloud size={24} style={{ color: "var(--accent)" }} />
        </div>
        <div className="float-icon float-icon-delay-1">
          <RefreshCw size={18} style={{ color: "var(--str)" }} />
        </div>
        <div className="float-icon float-icon-delay-2">
          <MonitorSmartphone size={20} style={{ color: "#8b5cf6" }} />
        </div>
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="mt-4 flex-1 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 100 }}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full" style={{ border: "2px solid var(--str)", animation: "pulseRing 2s ease-out infinite", width: 56, height: 56, top: -8, left: -8 }} />
        <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10" style={{ background: "var(--accent-light)", border: "1px solid var(--glass-border)" }}>
          <Lock size={16} style={{ color: "var(--accent)" }} />
        </div>
      </div>
    </div>
  );
}
function editcodewithai(){
  return(
     <div className="mt-4 flex-1 rounded-xl overflow-hidden flex items-center justify-center" style={{ background: "var(--bg-tertiary)", border: "1px solid var(--glass-border)", minHeight: 200 }}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full" style={{ border: "2px solid var(--str)", animation: "pulseRing 2s ease-out infinite", width: 56, height: 56, top: -8, left: -8 }} />
        <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10" style={{ background: "var(--accent-light)", border: "1px solid var(--glass-border)" }}>
          <Lock size={16} style={{ color: "var(--accent)" }} />
        </div>
      </div>
    </div>
  )
}

const VISUAL_MAP = {
  "ai-generate": AiGenerateVisual,
  debug: DebugVisual,
  chat: ChatVisual,
  terminal: TerminalVisual,
  templates: TemplatesVisual,
  files: FilesVisual,
  cloud: CloudVisual,
  security: SecurityVisual,
  "Edit Code with AI": editcodewithai,
};

function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Features"
          title="Everything You Need to Build Faster"
          desc="One workspace. Every developer tool. No context-switching."
        />
        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
          {BENTO_FEATURES.map((f, i) => {
            const Visual = VISUAL_MAP[f.visual];
            return (
              <BentoCard key={f.title} delay={(i % 4) + 1} span={f.span || ""}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.accentColor}18`, border: `1px solid ${f.accentColor}25` }}>
                  <f.icon size={20} style={{ color: f.accentColor }} />
                </div>
                <h3 className="font-display font-semibold text-xl" style={{ color: "var(--text-primary)" }}>
                  {f.title}
                </h3>
                <p className="text-sm mt-2.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {f.desc}
                </p>
                {Visual && <Visual />}
              </BentoCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   WHY DEVELOPERS LOVE ZECOAI
   ═══════════════════════════════════════════════════════════════════════ */

const WHY_CARDS = [
  {
    icon: Zap,
    title: "Zero Setup",
    desc: "Open your browser and start coding immediately. No installs, no configuration, no environment issues.",
  },
  {
    icon: Brain,
    title: "AI That Understands Context",
    desc: "Unlike basic autocomplete, ZecoAI understands your project and generates meaningful solutions.",
  },
  {
    icon: Blocks,
    title: "Multi-Language Runtime",
    desc: "Run code across multiple programming languages from one workspace with isolated sandboxes.",
  },
  {
    icon: Rocket,
    title: "From Idea to Deployment",
    desc: "Generate, debug, execute, and manage projects without switching tools.",
  },
];

function WhyZecoAI() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Why ZecoAI"
          title="Why Developers Love ZecoAI"
          desc="Built for developers who value speed, simplicity, and smart tooling."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {WHY_CARDS.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) + 1}>
              <motion.div
                className="bento-card-premium p-6 sm:p-7 h-full flex flex-col"
                whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "var(--accent-light)", border: "1px solid var(--glass-border)" }}>
                  <c.icon size={20} style={{ color: "var(--accent)" }} />
                </div>
                <h3 className="font-display font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                  {c.title}
                </h3>
                <p className="text-sm mt-2.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.desc}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   WORKFLOW
   ═══════════════════════════════════════════════════════════════════════ */

const WORKFLOW = [
  { icon: MessageSquare, title: "Prompt", desc: "Describe what you want to build, in plain language." },
  { icon: Sparkles, title: "AI thinks", desc: "Zeco reads your project for context before writing anything." },
  { icon: Code2, title: "Writes code", desc: "Complete, working code lands directly in your editor." },
  { icon: MessageSquare, title: "Explains", desc: "Ask why — get a walkthrough of every decision made." },
  { icon: Play, title: "Runs", desc: "Execute instantly in a warm sandbox, no config required." },
  { icon: Bug, title: "Debugs", desc: "Errors are caught, explained, and fixed automatically." },
  { icon: CheckCircle2, title: "Ready", desc: "Preview updates live. Ship whenever you're happy with it." },
];

function Workflow() {
  const [wrapRef, visible] = useReveal();
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="How it works" title="From prompt to running app" />
        <div ref={wrapRef} className="relative pl-[52px]">
          <div className={`wf-line ${visible ? "visible" : ""}`} />
          <div className="flex flex-col gap-8">
            {WORKFLOW.map((s, i) => (
              <Reveal key={s.title} delay={Math.min((i % 4) + 1, 4)} className="flex items-start gap-4 -ml-[52px]">
                <div className="wf-dot">
                  <s.icon size={17} style={{ color: "var(--accent)" }} />
                </div>
                <div className="pt-1.5">
                  <div className="font-display font-semibold" style={{ color: "var(--text-primary)" }}>{s.title}</div>
                  <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{s.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════════════════════ */

const FAQS = [
  { q: "Do I need to install anything?", a: "No. ZecoAI runs entirely in your browser — editor, terminal, and sandbox included. Open a tab and you're coding." },
  { q: "What languages are supported?", a: "20+ languages and runtimes, including JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, PHP, and Ruby." },
  { q: "Is my code private?", a: "Every run happens in an isolated sandbox scoped to your project. Your code isn't shared across users." },
  { q: "Can I bring an existing project?", a: "Yes — import from a repository or upload files directly, and Zeco indexes it for AI context immediately." },
  { q: "What happens on the free plan?", a: "You get full access to AI generation, debugging, and execution, with generous monthly limits — no credit card required." },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="pricing" className="py-24 sm:py-32 px-4 sm:px-6" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-2xl mx-auto">
        <SectionHeading eyebrow="FAQ" title="Good to know" />
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i + 1, 4)}>
                <motion.div
                  className="bento-card-premium px-5"
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                >
                  <button
                    className="w-full flex items-center justify-between py-4 text-left"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-sm sm:text-base" style={{ color: "var(--text-primary)" }}>{f.q}</span>
                    <ChevronDown size={18}
                      className={`acc-chevron flex-shrink-0 ml-3 ${isOpen ? "open" : ""}`}
                      style={{ color: "var(--text-secondary)" }} />
                  </button>
                  <div className={`acc-panel ${isOpen ? "open" : ""}`}>
                    <div className="acc-inner">
                      <p className="text-sm leading-relaxed pb-4 pr-6" style={{ color: "var(--text-secondary)" }}>{f.a}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════════════════════ */

function FinalCta() {
  return (
    <section className="relative py-28 px-4 sm:px-6 overflow-hidden">
      <div className="glow-orb w-[600px] h-[400px] top-0 left-1/2 -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse, var(--glow-primary), transparent 70%)" }} />
      <Reveal className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className="font-display font-semibold text-3xl sm:text-5xl" style={{ color: "var(--text-primary)" }}>
          Start building with AI today
        </h2>
        <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
          No installs, no config — a full AI coding workspace, one tab away.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <SignedOut>
            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <button className="btn-primary px-7 py-3.5 rounded-xl text-sm w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer">
                <Rocket size={15} /> Launch ZecoAI
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="btn-primary px-7 py-3.5 rounded-xl text-sm w-full sm:w-auto flex items-center justify-center gap-2">
              <Rocket size={15} /> Go to Dashboard
            </Link>
          </SignedIn>
          <a href="#features" className="btn-ghost px-7 py-3.5 rounded-xl text-sm w-full sm:w-auto">
            Explore features
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FOOTER — Premium Vercel/Supabase Style
   ═══════════════════════════════════════════════════════════════════════ */

const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Templates", href: "#templates" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "SDKs", href: "#", badge: "Coming Soon" },
      { label: "GitHub", href: "https://github.com/Rishit-Sinha10/ZecoAI" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Examples", href: "#" },
      { label: "FAQs", href: "#pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    href: "https://github.com/Rishit-Sinha10/ZecoAI",
    label: "GitHub",
  },
  { icon: Mail, href: "mailto:hello@zecoai.dev", label: "Email" },
];

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-40 pt-16 pb-12 flex ">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-4">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 mb-4 lg:mb-0">
            <a href="#hero" className="flex items-center gap-2 font-display font-semibold text-lg mb-3">
              <img src={favicon} alt="ZecoAI" width={20} height={20} />
              Zeco<span style={{ color: "var(--accent)" }}>AI</span>
            </a>
            <p className="text-sm leading-relaxed max-w-[240px] mb-6" style={{ color: "var(--text-secondary)" }}>
              The fastest AI-powered coding workspace in your browser.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
                  <s.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: "var(--text-tertiary)" }}>
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}
                      className="text-sm inline-flex items-center gap-1.5 transition-colors"
                      style={{ color: "var(--text-secondary)" }}
                      >
                      {link.label}
                      {link.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{ background: "var(--accent-light)", color: "var(--accent)", border: "1px solid var(--glass-border)" }}>
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>    
    </footer>
  );
}
/* ═══════════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════════ */
export default function AboutUs() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="landing">
      <style>{LANDING_CSS}</style>
      <Nav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Hero />
      <Features />
      <WhyZecoAI />
      <Workflow />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
