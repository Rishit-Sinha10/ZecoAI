import { useState, useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Brain,
  Code2,
  Zap,
  Shield,
  ArrowRight,
  Terminal,
  Layers,
  MessageSquare,
  Lock,
  Github,
  ChevronDown,
  Sparkles,
  FileCode,
} from "lucide-react";

const FAQ = [
  { q: "What is ZecoAI?", a: "ZecoAI is an AI-powered online code editor and IDE. It combines a professional code editor with AI assistance, code execution in 45+ languages, and project management — all in your browser." },
  { q: "Is ZecoAI free to use?", a: "Yes! ZecoAI offers a generous free tier. You get access to the code editor, AI chat, code execution, and basic project management. Premium features are available for power users." },
  { q: "What languages are supported?", a: "ZecoAI supports 45+ languages including JavaScript, Python, TypeScript, C/C++, Java, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, and many more via Judge0 integration." },
  { q: "How does the AI code generation work?", a: "Describe what you want in natural language, and ZecoAI uses advanced LLMs (Llama 3.3 70B) to generate complete, production-ready code. You can then edit, run, and iterate on it instantly." },
  { q: "Can I use ZecoAI without signing in?", a: "Yes! You can try the editor and run code without an account. Signing in unlocks project persistence, chat history, and advanced AI features." },
  { q: "Is my code secure?", a: "Absolutely. Code is encrypted in transit and at rest. We use Clerk for authentication, and your projects are private by default. We never use your code to train AI models." },
];

export default function AboutUs() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [openFaq, setOpenFaq] = useState(null);
  const [demoText, setDemoText] = useState("");
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    if (isSignedIn) navigate("/dashboard");
  }, [isSignedIn, navigate]);

  useEffect(() => {
    const demoCode = `function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nconsole.log(fibonacci(10)); // 55`;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= demoCode.length) {
        setDemoText(demoCode.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDemoStep(1), 600);
        setTimeout(() => setDemoStep(2), 1800);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", borderStrong: "var(--border-strong)", accent: "var(--accent)",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: t.bg, color: t.text }}>
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl" style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: `color-mix(in srgb, ${t.bg} 80%, transparent)` }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--accent)" }}>
              <Brain size={16} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight" style={{ color: t.text }}>ZecoAI</span>
          </div>
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium rounded-lg transition-colors" style={{ color: t.text2 }}>Log in</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors" style={{ backgroundColor: "var(--accent)" }}>Get Started</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px]" style={{ background: `radial-gradient(circle, var(--accent) 0%, transparent 70%)` }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8" style={{ backgroundColor: "var(--bg-tertiary)", border: `1px solid ${t.border}`, color: t.text2 }}>
            <Sparkles size={12} style={{ color: "var(--accent)" }} />
            AI-Powered Code Editor
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[0.95]" style={{ color: t.text }}>
            Code at the
            <br />
            <span style={{ color: "var(--accent)" }}>speed of thought</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: t.text3 }}>
            Write, run, and debug code in 45+ languages. AI-powered suggestions,
            instant execution, and a editor that feels like magic.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl text-sm transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: "var(--accent)" }}>
                  Start Coding Free <ArrowRight size={16} />
                </button>
              </SignInButton>
            </SignedOut>
            <a href="https://github.com/ramesh1234-ai/ZecoAI" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold rounded-xl text-sm transition-all hover:scale-105" style={{ border: `1px solid ${t.border}`, color: t.text2 }}>
              <Github size={16} /> View on GitHub
            </a>
          </div>

          {/* ── HERO VIDEO / DEMO SHOWCASE ── */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute -inset-4 rounded-2xl opacity-30 blur-xl" style={{ background: `linear-gradient(135deg, var(--accent), transparent 60%)` }} />

            <div className="relative rounded-2xl overflow-hidden" style={{ border: `1px solid ${t.border}`, backgroundColor: t.bg2, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: t.bg3, borderBottom: `1px solid ${t.border}` }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md text-xs font-mono" style={{ backgroundColor: t.bg, color: t.text3, border: `1px solid ${t.border}` }}>
                    zecoai.dev/editor
                  </div>
                </div>
                <div className="w-14" />
              </div>

              <div className="flex" style={{ minHeight: "380px" }}>
                <div className="hidden sm:flex flex-col gap-1 px-3 py-4 w-48" style={{ borderRight: `1px solid ${t.border}`, backgroundColor: t.bg }}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-2 px-2" style={{ color: t.text3 }}>Explorer</div>
                  {["index.js", "utils.js", "styles.css", "package.json"].map((f, i) => (
                    <div key={f} className="flex items-center gap-2 px-2 py-1 rounded text-xs" style={{
                      backgroundColor: i === 0 ? "var(--accent-light)" : "transparent",
                      color: i === 0 ? "var(--accent)" : t.text3,
                    }}>
                      <FileCode size={12} />
                      {f}
                    </div>
                  ))}
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex-1 p-5 font-mono text-sm leading-relaxed" style={{ backgroundColor: t.bg }}>
                    <pre className="whitespace-pre-wrap">
                      <code style={{ color: t.text }}>
                        {demoText.split('\n').map((line, i) => (
                          <div key={i} className="flex">
                            <span className="inline-block w-8 text-right mr-4 select-none" style={{ color: t.text3, opacity: 0.4 }}>{i + 1}</span>
                            <span>
                              {line.split(/(\bfunction\b|\breturn\b|\bif\b|\bconsole\b|\blog\b|\bvar\b|\bconst\b|\blet\b)/).map((part, j) => {
                                if (['function', 'return', 'if'].includes(part)) return <span key={j} style={{ color: "#c084fc" }}>{part}</span>;
                                if (['console'].includes(part)) return <span key={j} style={{ color: "#60a5fa" }}>{part}</span>;
                                if (part.startsWith('.')) return <span key={j} style={{ color: "#60a5fa" }}>{part}</span>;
                                return <span key={j}>{part}</span>;
                              })}
                            </span>
                          </div>
                        ))}
                        <span className="inline-block w-0.5 h-4 ml-0.5 animate-pulse" style={{ backgroundColor: "var(--accent)" }} />
                      </code>
                    </pre>

                    {demoStep >= 1 && (
                      <div className="mt-4 rounded-lg p-3 text-xs font-mono" style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, animation: "fadeUp 0.3s ease" }}>
                        <div className="flex items-center gap-2 mb-2" style={{ color: t.text3 }}>
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Terminal
                        </div>
                        <div style={{ color: "#4ade80" }}>$ node index.js</div>
                        {demoStep >= 2 && (
                          <div style={{ color: t.text, animation: "fadeUp 0.3s ease" }}>55</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: t.text }}>Everything you need</h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: t.text3 }}>One editor. All the tools. Zero setup.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">

            {/* AI Code Generation — spans 2 cols */}
            <div className="col-span-2 row-span-2 group p-6 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
              <div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#a78bfa15" }}>
                  <Sparkles size={20} style={{ color: "#a78bfa" }} />
                </div>
                <h3 className="text-base font-semibold mb-2" style={{ color: t.text }}>AI Code Generation</h3>
                <p className="text-sm leading-relaxed" style={{ color: t.text3 }}>Describe what you want in plain English. ZecoAI writes production-ready code with full context awareness.</p>
              </div>
              <div className="mt-4 p-3 rounded-xl font-mono text-xs" style={{ backgroundColor: t.bg, border: `1px solid ${t.border}` }}>
                <div style={{ color: t.text3 }}>{">"} <span style={{ color: "#a78bfa" }}>generate</span> "React login form with Google OAuth"</div>
                <div className="mt-1" style={{ color: "#4ade80" }}>// Generated 84 lines across 3 files</div>
              </div>
            </div>

            {/* Real-Time Execution */}
            <div className="col-span-1 row-span-1 group p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
              <div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "#fbbf2415" }}>
                  <Zap size={18} style={{ color: "#fbbf24" }} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: t.text }}>45+ Languages</h3>
                <p className="text-xs leading-relaxed" style={{ color: t.text3 }}>Instant execution via Judge0.</p>
              </div>
              <div className="flex gap-1 mt-3">
                {["JS", "PY", "TS", "C++", "GO"].map((l) => (
                  <span key={l} className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: t.bg3, color: t.text3 }}>{l}</span>
                ))}
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="col-span-1 row-span-1 group p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
              <div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "#60a5fa15" }}>
                  <Code2 size={18} style={{ color: "#60a5fa" }} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: t.text }}>Monaco Editor</h3>
                <p className="text-xs leading-relaxed" style={{ color: t.text3 }}>VS Code-grade editing power.</p>
              </div>
              <div className="font-mono text-[10px] mt-3 leading-relaxed" style={{ color: t.text3, opacity: 0.6 }}>
                IntelliSense<br/>Minimap<br/>Multi-cursor
              </div>
            </div>

            {/* AI Chat — spans 2 cols */}
            <div className="col-span-2 row-span-1 group p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-200 hover:scale-[1.01]" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#34d39915" }}>
                <MessageSquare size={18} style={{ color: "#34d399" }} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold mb-1" style={{ color: t.text }}>AI Chat Assistant</h3>
                <p className="text-xs leading-relaxed" style={{ color: t.text3 }}>Ask questions, debug errors, refactor code — all through natural conversation with context-aware AI.</p>
              </div>
            </div>

            {/* Project Management */}
            <div className="col-span-1 row-span-1 group p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
              <div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "#f472b615" }}>
                  <Layers size={18} style={{ color: "#f472b6" }} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: t.text }}>Projects</h3>
                <p className="text-xs leading-relaxed" style={{ color: t.text3 }}>Multi-file with persistence.</p>
              </div>
              <div className="flex gap-1 mt-3">
                <FileCode size={10} style={{ color: t.text3 }} />
                <span className="text-[10px]" style={{ color: t.text3 }}>src/ • 4 files</span>
              </div>
            </div>

            {/* Security */}
            <div className="col-span-1 row-span-1 group p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:scale-[1.02]" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
              <div>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: "#fb923c15" }}>
                  <Shield size={18} style={{ color: "#fb923c" }} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: t.text }}>Secure</h3>
                <p className="text-xs leading-relaxed" style={{ color: t.text3 }}>Encrypted, auth-protected.</p>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <Lock size={10} style={{ color: "#34d399" }} />
                <span className="text-[10px]" style={{ color: "#34d399" }}>E2E encrypted</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6" style={{ backgroundColor: t.bg2 }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: t.text }}>Frequently asked questions</h2>
            <p className="text-base" style={{ color: t.text3 }}>Everything you need to know about ZecoAI.</p>
          </div>

          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ backgroundColor: t.bg, border: `1px solid ${t.border}` }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-medium transition-colors"
                  style={{ color: t.text }}>
                  {f.q}
                  <ChevronDown size={16} className="shrink-0 transition-transform" style={{
                    color: t.text3,
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                  }} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: t.text3, animation: "fadeUp 0.2s ease" }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6" style={{ color: t.text }}>
            Ready to code <span style={{ color: "var(--accent)" }}>faster</span>?
          </h2>
          <p className="text-base max-w-lg mx-auto mb-10" style={{ color: t.text3 }}>
            Join thousands of developers using ZecoAI to write, run, and ship code at the speed of thought.
          </p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-2 px-10 py-4 text-white font-semibold rounded-xl text-sm transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: "var(--accent)" }}>
                Get Started Free <ArrowRight size={16} />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 px-10 py-4 text-white font-semibold rounded-xl text-sm transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: "var(--accent)" }}>
              Go to Dashboard <ArrowRight size={16} />
            </button>
          </SignedIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6" style={{ borderTop: `1px solid ${t.border}` }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: "var(--accent)" }}>
              <Brain size={12} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ color: t.text3 }}>ZecoAI</span>
          </div>
          <p className="text-xs" style={{ color: t.text3 }}>Built with passion for developers everywhere.</p>
          <div className="flex gap-4">
            <a href="#" className="text-xs transition-colors" style={{ color: t.text3 }}>Privacy</a>
            <a href="#" className="text-xs transition-colors" style={{ color: t.text3 }}>Terms</a>
            <a href="https://github.com/ramesh1234-ai/ZecoAI" target="_blank" rel="noreferrer" className="text-xs transition-colors flex items-center gap-1" style={{ color: t.text3 }}>
              <Github size={12} /> GitHub
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
