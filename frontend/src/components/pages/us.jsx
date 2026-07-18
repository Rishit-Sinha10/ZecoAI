import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import useTheme from "../../hooks/useTheme";
import { Link } from "react-router-dom";
import favicon from "../../../public/favicon.svg"
/* ── Scoped landing styles ── */

const LANDING_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

/* reveal on scroll */
.landing .reveal{ opacity:0; transform:translateY(18px); transition:opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
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
  background:linear-gradient(90deg, var(--text-primary) 0%, var(--accent) 100%);
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
.landing .tag{ color:var(--tag); }

/* bento cards */
.landing .bento-card{
  background:var(--glass-bg);
  border:1px solid var(--glass-border);
  backdrop-filter:blur(var(--glass-blur));
  -webkit-backdrop-filter:blur(var(--glass-blur));
  border-radius:18px; position:relative; overflow:hidden;
  transition:border-color .25s ease, transform .25s ease, background .25s ease;
}
.landing .bento-card:hover{
  border-color:var(--border-strong);
  transform:translateY(-3px);
  background:var(--glass-bg-hover);
}
.landing .bento-card::before{
  content:''; position:absolute; inset:0; border-radius:18px; padding:1px;
  background:linear-gradient(135deg, transparent, transparent);
  transition:background .3s ease; pointer-events:none;
}
.landing .bento-card:hover::before{
  background:linear-gradient(135deg, var(--accent), transparent);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}

/* icon badge */
.landing .icon-badge{
  width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center;
  background:var(--accent-light);
  border:1px solid var(--glass-border);
}

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

@media (prefers-reduced-motion: reduce){
  .landing *{ animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; }
}
`;

/* ── Helpers ── */

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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  children,
  ...rest
}) {
  const [ref, visible] = useReveal();
  const delayClass = delay ? `reveal-delay-${delay}` : "";
  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} ${delayClass} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function SectionHeading({ eyebrow, title, desc, center = true }) {
  return (
    <Reveal
      className={`mb-12 ${center ? "text-center max-w-2xl mx-auto" : ""}`}
    >
      <div
        className="font-mono text-xs tracking-wide mb-3"
        style={{ color: "var(--accent)" }}
      >
        {eyebrow.toUpperCase()}
      </div>
      <h2
        className="font-display font-semibold text-3xl sm:text-4xl"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      {desc && (
        <p
          className="mt-3 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {desc}
        </p>
      )}
    </Reveal>
  );
}

/* ── Announcement Bar ── */

function AnnouncementBar({ onClose }) {
  return (
    <div className="announce">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm relative">
        <span
          className="font-mono text-xs px-2 py-0.5 rounded-full"
          style={{
            background: "var(--accent-light)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-primary)",
          }}
        >
          NEW
        </span>
        <span style={{ color: "var(--text-secondary)" }}>
          AI Project Generation is live — describe an app, get a working repo.
        </span>
        <a
          href="#hero"
          className="font-medium inline-flex items-center gap-1 hover:underline"
          style={{ color: "var(--accent)" }}
        >
          Try now <ArrowRight size={14} />
        </a>
        <button
          onClick={onClose}
          aria-label="Dismiss announcement"
          className="absolute right-4 transition-colors"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Nav ── */

function Nav({ mobileOpen, setMobileOpen }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Features", "Templates", "Pricing", "Docs"];

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
          <a href="#" className="nav-link flex items-center gap-1.5">
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
            <a
              href="/dashboard"
              className="btn-primary text-sm px-4 py-2 rounded-lg"
            >
              Dashboard
            </a>
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
          <a href="#" className="nav-link">
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

/* ── IDE Demo ── */

const CODE_LINES = [
  {
    t: [
      { c: "kw", v: "function" },
      { v: " " },
      { c: "fn", v: "TodoApp" },
      { v: "() {" },
    ],
  },
  {
    t: [
      { v: "  " },
      { c: "kw", v: "const" },
      { v: " [items, setItems] = " },
      { c: "fn", v: "useState" },
      { v: "([]);" },
    ],
  },
  {
    t: [
      { v: "  " },
      { c: "kw", v: "const" },
      { v: " " },
      { c: "fn", v: "onDrop" },
      { v: " = (from, to) => {" },
    ],
  },
  { t: [{ v: "    " }, { c: "cm", v: "// reorder + persist instantly" }] },
  {
    t: [{ v: "    " }, { c: "fn", v: "reorder" }, { v: "(items, from, to);" }],
  },
  { t: [{ v: "  };" }] },
  { t: [{ v: "  " }, { c: "kw", v: "return" }, { v: " (" }] },
  {
    t: [
      { v: "    " },
      { c: "tag", v: "<DragList" },
      { v: " items={items} " },
      { c: "tag", v: "onDrop" },
      { v: "={onDrop} />" },
    ],
  },
  { t: [{ v: "  );" }] },
  { t: [{ v: "}" }] },
];

const TERMINAL_LINES = [
  "> npm run dev",
  "✓ compiled in 412ms",
  "✓ server ready on :3000",
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
        setPhase("prompt");
        setPromptText("");
        for (let i = 0; i <= full.length; i++) {
          if (!mounted.current) return;
          setPromptText(full.slice(0, i));
          await wait(28);
        }
        await wait(500);
        if (!mounted.current) return;

        setPhase("thinking");
        await wait(1100);
        if (!mounted.current) return;

        setPhase("code");
        setCodeCount(0);
        for (let i = 1; i <= CODE_LINES.length; i++) {
          if (!mounted.current) return;
          setCodeCount(i);
          await wait(160);
        }
        await wait(400);
        if (!mounted.current) return;

        setPhase("run");
        setTermCount(0);
        for (let i = 1; i <= TERMINAL_LINES.length; i++) {
          if (!mounted.current) return;
          setTermCount(i);
          await wait(420);
        }
        await wait(350);
        if (!mounted.current) return;

        setPhase("preview");
        await wait(3200);
        if (!mounted.current) return;
      }
    }
    run();
    return () => {
      mounted.current = false;
    };
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
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{
          borderBottom: "1px solid var(--ide-border)",
          background: "var(--glass-bg)",
        }}
      >
        <div className="flex gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--text-tertiary)" }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--text-tertiary)" }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "var(--text-tertiary)" }}
          />
        </div>
        <div
          className="ide-tab flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-md"
          style={{
            background: "var(--bg-tertiary)",
            border: "1px solid var(--ide-border)",
          }}
        >
          <FileCode2 size={12} style={{ color: "var(--accent)" }} /> TodoApp.jsx
        </div>
        <div
          className="ide-tab hidden sm:flex items-center gap-1.5 px-2.5 py-1"
          style={{ color: "var(--text-tertiary)" }}
        >
          <FileCode2 size={12} /> DragList.jsx
        </div>
        <div
          className="ml-auto flex items-center gap-1.5 ide-tab"
          style={{ color: "var(--text-tertiary)" }}
        >
          <GitBranch size={12} /> main
        </div>
      </div>

      <div className="grid md:grid-cols-[170px_1fr_240px]">
        <div
          className="hidden md:block px-3 py-4"
          style={{ borderRight: "1px solid var(--ide-border)" }}
        >
          <div
            className="ide-tab flex items-center gap-1.5 mb-2 px-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Folder size={12} /> src
          </div>
          {["TodoApp.jsx", "DragList.jsx", "useState.js", "styles.css"].map(
            (f, i) => (
              <div
                key={f}
                className="ide-tab flex items-center gap-1.5 pl-4 py-1 rounded"
                style={
                  i === 0
                    ? {
                        color: "var(--accent)",
                        background: "var(--bg-tertiary)",
                      }
                    : { color: "var(--text-tertiary)" }
                }
              >
                <FileCode2 size={11} /> {f}
              </div>
            ),
          )}
        </div>

        <div
          className="flex flex-col"
          style={{ borderRight: "1px solid var(--ide-border)" }}
        >
          <div className="px-4 py-4 min-h-[190px]">
            {phase === "prompt" || phase === "thinking" ? (
              <div className="flex items-start gap-2">
                <Wand2
                  size={14}
                  className="mt-0.5 flex-shrink-0"
                  style={{ color: "var(--accent)" }}
                />
                <div
                  className="ide-line"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span style={{ color: "var(--code-text)" }}>
                    {promptText}
                  </span>
                  {phase === "prompt" && <span className="caret" />}
                  {phase === "thinking" && (
                    <div
                      className="mt-2 flex items-center gap-1.5"
                      style={{ color: "var(--accent)" }}
                    >
                      <span className="dot-flash">&#9679;</span>
                      <span className="dot-flash">&#9679;</span>
                      <span className="dot-flash">&#9679;</span>
                      <span
                        className="ml-1 text-xs"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        generating
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {CODE_LINES.slice(0, codeCount).map((line, i) => (
                  <div
                    key={i}
                    className="ide-line"
                    style={{ color: "var(--code-text)" }}
                  >
                    {line.t.map((tok, j) => (
                      <span key={j} className={tok.c || ""}>
                        {tok.v}
                      </span>
                    ))}
                  </div>
                ))}
                {showCode && codeCount < CODE_LINES.length && (
                  <span className="caret" />
                )}
              </div>
            )}
          </div>

          <div
            className="mt-auto px-4 py-3 min-h-[92px]"
            style={{
              borderTop: "1px solid var(--ide-border)",
              background: "rgba(0,0,0,.15)",
            }}
          >
            <div
              className="ide-tab flex items-center gap-1.5 mb-1.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              <TerminalSquare size={12} /> terminal
            </div>
            {showTerminal ? (
              TERMINAL_LINES.slice(0, termCount).map((l, i) => (
                <div
                  key={i}
                  className="ide-line"
                  style={{
                    color: l.startsWith("✓")
                      ? "var(--str)"
                      : "var(--code-text)",
                  }}
                >
                  {l}
                </div>
              ))
            ) : (
              <div
                className="ide-line"
                style={{ color: "var(--text-tertiary)" }}
              >
                waiting for run...
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-4">
          <div
            className="ide-tab flex items-center gap-1.5 mb-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            <Play size={11} /> preview
          </div>
          <div
            className="rounded-lg h-[220px] p-3 relative overflow-hidden"
            style={{
              border: "1px solid var(--ide-border)",
              background: "var(--bg-tertiary)",
            }}
          >
            {showPreview ? (
              <div>
                <div
                  className="text-xs font-medium mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  My Todos
                </div>
                {["Design bento grid", "Wire up AI stream", "Ship it"].map(
                  (t, i) => (
                    <div
                      key={t}
                      className="flex items-center gap-2 text-[11px] mb-1.5 px-2 py-1.5 rounded-md"
                      style={{
                        background: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          border: "1px solid var(--text-tertiary)",
                          background: i === 2 ? "var(--str)" : "transparent",
                        }}
                      />
                      <span
                        style={
                          i === 2
                            ? {
                                textDecoration: "line-through",
                                color: "var(--text-tertiary)",
                              }
                            : { color: "var(--text-primary)" }
                        }
                      >
                        {t}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                no output yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ── */

function Hero() {
  return (
    <section id="hero" className="relative pt-20 pb-24 px-4 sm:px-6">
      <div className="absolute inset-0 hero-grid" />
      <div
        className="glow-orb w-[520px] h-[520px] -top-40 left-1/2 -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, var(--glow-primary), transparent 70%)",
        }}
      />
      <div
        className="glow-orb w-[420px] h-[420px] top-40 right-0"
        style={{
          background:
            "radial-gradient(circle, var(--glow-secondary), transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <Reveal
          className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1.5 rounded-full mb-7"
          style={{
            border: "1px solid var(--glass-border)",
            background: "var(--glass-bg)",
            color: "var(--text-secondary)",
          }}
        >
          <Sparkles size={12} style={{ color: "var(--accent)" }} /> AI-NATIVE
          CODING WORKSPACE
        </Reveal>

        <Reveal
          delay={1}
          as="h1"
          className="font-display font-semibold text-[2.6rem] leading-[1.05] sm:text-6xl sm:leading-[1.03] md:text-7xl md:leading-[.98]"
        >
          Build. Run. Debug.
          <br className="hidden sm:block" />{" "}
          <span className="text-grad">Ship.</span>
        </Reveal>

        <Reveal
          delay={2}
          as="p"
          className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Every part of your dev loop, in one browser tab. AI writes the code,
          explains it, and fixes what breaks — while you stay in flow.
        </Reveal>

        <Reveal
          delay={3}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <SignedOut>
            <SignInButton mode="modal" afterSignInUrl="/dashboard">
              <button className="btn-primary px-6 py-3 rounded-xl text-sm w-full sm:w-auto text-center cursor-pointer">
                Start coding free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="btn-primary px-6 py-3 rounded-xl text-sm w-full sm:w-auto text-center"
            >
              Go to Dashboard
            </Link>
          </SignedIn>
          <a
            href="#demo"
            className="btn-ghost px-6 py-3 rounded-xl text-sm w-full sm:w-auto text-center flex items-center justify-center gap-2"
          >
            <Play size={14} /> Watch demo
          </a>
        </Reveal>

        <Reveal
          delay={4}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>Zero install</span>
          <span
            className="hidden sm:inline"
            style={{ color: "var(--text-tertiary)" }}
          >
            ·
          </span>
          <span>Browser native</span>
          <span
            className="hidden sm:inline"
            style={{ color: "var(--text-tertiary)" }}
          >
            ·
          </span>
          <span>AI powered</span>
        </Reveal>
      </div>

      <Reveal
        delay={4}
        id="demo"
        className="max-w-5xl mx-auto mt-16 relative z-10"
      >
        <IdeDemo />
      </Reveal>
    </section>
  );
}

/* ── Features (bento) ── */

const FEATURES = [
  {
    icon: Wand2,
    title: "AI code generation",
    desc: "Describe the feature, get production-ready code wired into your project.",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    icon: Bug,
    title: "AI debugging",
    desc: "Errors get explained and patched before you finish reading the stack trace.",
  },
  {
    icon: MessageSquare,
    title: "AI chat",
    desc: "Ask questions about any file — Zeco reads the whole project for context.",
  },
  {
    icon: Zap,
    title: "Instant execution",
    desc: "20+ languages run in a warm sandbox with sub-second startup.",
    span: "md:col-span-2",
  },
  {
    icon: LayoutTemplate,
    title: "Templates",
    desc: "Start from a working app, not a blank file.",
  },
  {
    icon: FolderTree,
    title: "Project manager",
    desc: "Every project, organized and searchable in one workspace.",
  },
  {
    icon: Cloud,
    title: "Cloud storage",
    desc: "Autosaves as you type. Nothing lives only on your machine.",
  },
  {
    icon: ShieldCheck,
    title: "Secure sandbox",
    desc: "Isolated containers per run — your code never touches shared infra.",
  },
];

function FeatureCard({ f, delay }) {
  return (
    <Reveal
      delay={delay}
      className={`bento-card p-6 flex flex-col ${f.span || ""}`}
    >
      <div className="icon-badge mb-4">
        <f.icon size={18} style={{ color: "var(--accent)" }} />
      </div>
      <h3
        className="font-display font-semibold text-lg"
        style={{ color: "var(--text-primary)" }}
      >
        {f.title}
      </h3>
      <p
        className="text-sm mt-2 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {f.desc}
      </p>
    </Reveal>
  );
}

function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="Features"
          title="One workspace, the whole loop"
          desc="No context-switching between an editor, a terminal, a browser tab, and a chat window."
        />
        <div className="grid md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} f={f} delay={(i % 4) + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Workflow ── */

const WORKFLOW = [
  {
    icon: MessageSquare,
    title: "Prompt",
    desc: "Describe what you want to build, in plain language.",
  },
  {
    icon: Sparkles,
    title: "AI thinks",
    desc: "Zeco reads your project for context before writing anything.",
  },
  {
    icon: Code2,
    title: "Writes code",
    desc: "Complete, working code lands directly in your editor.",
  },
  {
    icon: MessageSquare,
    title: "Explains",
    desc: "Ask why — get a walkthrough of every decision made.",
  },
  {
    icon: Play,
    title: "Runs",
    desc: "Execute instantly in a warm sandbox, no config required.",
  },
  {
    icon: Bug,
    title: "Debugs",
    desc: "Errors are caught, explained, and fixed automatically.",
  },
  {
    icon: CheckCircle2,
    title: "Ready",
    desc: "Preview updates live. Ship whenever you're happy with it.",
  },
];

function Workflow() {
  const [wrapRef, visible] = useReveal();
  return (
    <section
      className="py-24 px-4 sm:px-6"
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="How it works"
          title="From prompt to running app"
        />
        <div ref={wrapRef} className="relative pl-[52px]">
          <div className={`wf-line ${visible ? "visible" : ""}`} />
          <div className="flex flex-col gap-8">
            {WORKFLOW.map((s, i) => (
              <Reveal
                key={s.title}
                delay={Math.min((i % 4) + 1, 4)}
                className="flex items-start gap-4 -ml-[52px]"
              >
                <div className="wf-dot">
                  <s.icon size={17} style={{ color: "var(--accent)" }} />
                </div>
                <div className="pt-1.5">
                  <div
                    className="font-display font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.title}
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.desc}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */

const FAQS = [
  {
    q: "Do I need to install anything?",
    a: "No. ZecoAI runs entirely in your browser — editor, terminal, and sandbox included. Open a tab and you're coding.",
  },
  {
    q: "What languages are supported?",
    a: "20+ languages and runtimes, including JavaScript, TypeScript, Python, Java, C, C++, Go, Rust, PHP, and Ruby.",
  },
  {
    q: "Is my code private?",
    a: "Every run happens in an isolated sandbox scoped to your project. Your code isn't shared across users.",
  },
  {
    q: "Can I bring an existing project?",
    a: "Yes — import from a repository or upload files directly, and Zeco indexes it for AI context immediately.",
  },
  {
    q: "What happens on the free plan?",
    a: "You get full access to AI generation, debugging, and execution, with generous monthly limits — no credit card required.",
  },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <SectionHeading eyebrow="FAQ" title="Good to know" />
        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal
                key={f.q}
                delay={Math.min(i + 1, 4)}
                className="bento-card px-5"
              >
                <button
                  className="w-full flex items-center justify-between py-4 text-left"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span
                    className="font-medium text-sm sm:text-base"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {f.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`acc-chevron flex-shrink-0 ml-3 ${isOpen ? "open" : ""}`}
                    style={{ color: "var(--text-secondary)" }}
                  />
                </button>
                <div className={`acc-panel ${isOpen ? "open" : ""}`}>
                  <div className="acc-inner">
                    <p
                      className="text-sm leading-relaxed pb-4 pr-6"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {f.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Final CTA ── */

function FinalCta() {
  return (
    <section
      className="relative py-28 px-4 sm:px-6 overflow-hidden"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div
        className="glow-orb w-[600px] h-[400px] top-0 left-1/2 -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse, var(--glow-primary), transparent 70%)",
        }}
      />
      <Reveal className="max-w-2xl mx-auto text-center relative z-10">
        <h2
          className="font-display font-semibold text-3xl sm:text-5xl"
          style={{ color: "var(--text-primary)" }}
        >
          Start building with AI today
        </h2>
        <p className="mt-4" style={{ color: "var(--text-secondary)" }}>
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
            <a
              href="/dashboard"
              className="btn-primary px-7 py-3.5 rounded-xl text-sm w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <Rocket size={15} /> Go to Dashboard
            </a>
          </SignedIn>
          <a
            href="#features"
            className="btn-ghost px-7 py-3.5 rounded-xl text-sm w-full sm:w-auto"
          >
            Explore features
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ── Footer ── */

function Footer() {
  const cols = [
    {
      title: "Product",
      links: ["Features", "Templates", "Pricing", "Changelog"],
    },
    {
      title: "Resources",
      links: ["Docs", "GitHub", "API reference", "Status"],
    },
    { title: "Company", links: ["About", "Blog", "Contact", "Careers"] },
    { title: "Legal", links: ["Privacy", "Terms"] },
  ];
  return (
    <footer
      className="px-4 sm:px-6 pt-16 pb-8"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-6 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display font-semibold text-lg mb-3">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
              }}
            >
              <Zap
                size={15}
                style={{ color: "var(--text-inverse)" }}
                fill="var(--text-inverse)"
              />
            </span>
            Zeco<span style={{ color: "var(--accent)" }}>AI</span>
          </div>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            The fastest AI-powered coding workspace in your browser.
          </p>
          <div className="mt-5">
            <label
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
              htmlFor="newsletter"
            >
              Get product updates
            </label>
            <div className="flex gap-2 mt-2">
              <input
                id="newsletter"
                type="email"
                placeholder="you@domain.com"
                className="rounded-lg px-3 py-2 text-sm flex-1 min-w-0"
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--glass-border)",
                  color: "var(--text-primary)",
                }}
              />
              <button className="btn-primary px-3 py-2 rounded-lg text-sm flex-shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div
              className="font-mono text-xs mb-3"
              style={{ color: "var(--text-tertiary)" }}
            >
              {col.title.toUpperCase()}
            </div>
            <div className="flex flex-col gap-2.5">
              {col.links.map((l) => (
                <a key={l} href="#" className="nav-link text-sm">
                  {l}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        className="max-w-5xl mx-auto mt-14 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        style={{
          borderTop: "1px solid var(--border)",
          color: "var(--text-tertiary)",
        }}
      >
        <span>
          &copy; {new Date().getFullYear()} ZecoAI. All rights reserved.
        </span>
        <a
          href="#"
          className="flex items-center gap-1.5 hover:underline"
          style={{ color: "var(--text-secondary)" }}
        >
          <Github size={14} /> github.com/zecoai
        </a>
      </div>
    </footer>
  );
}

/* ── App ── */

export default function AboutUs() {
  const [showAnnounce, setShowAnnounce] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="landing">
      <style>{LANDING_CSS}</style>
      {showAnnounce && (
        <AnnouncementBar onClose={() => setShowAnnounce(false)} />
      )}
      <Nav mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Hero />
      <Features />
      <Workflow />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}
