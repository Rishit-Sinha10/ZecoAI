import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, FileCode, ArrowLeft, Loader2, Eye } from "lucide-react";
import Editor from "@monaco-editor/react";
import Navbar from "../common/navbar";
import templates from "../../data/templates";
import { useToast } from "../../context/ToastContext";
import useAuth from "../../hooks/useAuth";
import { createProjectAPI } from "../../services/projectAPI";

const detectLanguage = (filename) => {
  if (!filename) return "javascript";
  const ext = filename.split(".").pop()?.toLowerCase();
  const map = {
    js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
    py: "python", java: "java", cpp: "cpp", c: "c", cs: "csharp",
    rb: "ruby", go: "go", rs: "rust", php: "php", swift: "swift",
    kt: "kotlin", sql: "sql", html: "html", css: "css", scss: "scss",
    json: "json", xml: "xml", yaml: "yaml", yml: "yaml", md: "markdown",
    sh: "shell", bash: "shell",
  };
  return map[ext] || "javascript";
};

const GUEST_PROJECTS_KEY = "projects";

function Templates() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();
  const { isSignedIn, getToken } = useAuth();

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setPreviewFile(template.files[0]);
  };

  const handleCreateFromTemplate = async () => {
    if (!projectName.trim()) return;
    setCreating(true);

    const files = selectedTemplate.files.map((f) => ({
      name: f.name,
      content: f.content,
      isMain: f.isMain || false,
    }));

    if (isSignedIn) {
      try {
        const project = await createProjectAPI(projectName.trim(), `Created from "${selectedTemplate.name}" template`, getToken);

        const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;
        const token = await getToken();
        await fetch(`${API_BASE}/projects/${project._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ files }),
        });

        toast.success("Project created from template");
        navigate(`/editor/${project._id}`);
        return;
      } catch (err) {
        console.error("Backend create failed, saving locally:", err.message);
      }
    }

    const localProject = {
      id: Date.now().toString(),
      name: projectName.trim(),
      description: `Created from "${selectedTemplate.name}" template`,
      files: files.map((f, i) => ({ ...f, id: Date.now() + i })),
      language: selectedTemplate.language,
      lastModified: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem(GUEST_PROJECTS_KEY)) || [];
    const updated = [...existing, localProject];
    localStorage.setItem(GUEST_PROJECTS_KEY, JSON.stringify(updated));

    toast.success("Project created locally");
    navigate(`/editor/${localProject.id}`);
  };

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", borderStrong: "var(--border-strong)", accent: "var(--accent)",
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: t.bg }}>
      <Navbar />
      <div className="flex-1 flex overflow-hidden pt-14">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 py-6" style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg3 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: t.text }}>Templates</h1>
                <p className="text-sm mt-1" style={{ color: t.text3 }}>
                  Start with a pre-built project structure
                </p>
              </div>
              {selectedTemplate && (
                <button
                  onClick={() => { setSelectedTemplate(null); setPreviewFile(null); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}`, color: t.text2 }}
                >
                  <ArrowLeft size={16} />
                  Back to templates
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {!selectedTemplate ? (
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template)}
                      className="group text-left rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
                      style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="p-3 rounded-xl text-lg font-bold shrink-0"
                          style={{ backgroundColor: `${template.color}20`, color: template.color }}
                        >
                          {template.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold mb-1" style={{ color: t.text }}>
                            {template.name}
                          </h3>
                          <p className="text-sm mb-3" style={{ color: t.text3 }}>
                            {template.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: t.bg3, color: t.text3 }}>
                              {template.files.length} files
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: t.bg3, color: t.text3 }}>
                              {template.language}
                            </span>
                          </div>
                        </div>
                        <Eye size={18} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.text3 }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex overflow-hidden">
                <aside className="w-56 shrink-0 overflow-y-auto border-r" style={{ borderColor: t.border, backgroundColor: t.bg2 }}>
                  <div className="px-3 py-3">
                    <div className="flex items-center gap-2 mb-3 px-2">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${selectedTemplate.color}20` }}>
                        <span className="text-xs font-bold" style={{ color: selectedTemplate.color }}>{selectedTemplate.icon}</span>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: t.text }}>{selectedTemplate.name}</span>
                    </div>
                    <p className="text-[11px] mb-3 px-2" style={{ color: t.text3 }}>{selectedTemplate.description}</p>
                    <div className="space-y-0.5">
                      {selectedTemplate.files.map((file) => {
                        const isActive = previewFile?.name === file.name;
                        const ext = file.name.split(".").pop()?.toLowerCase();
                        const iconColor = {
                          js: "#fbbf24", jsx: "#61dafb", py: "#3776ab", html: "#e34f26",
                          css: "#1572b6", json: "#000000", md: "#ffffff",
                        }[ext] || t.text3;

                        return (
                          <button
                            key={file.name}
                            onClick={() => setPreviewFile(file)}
                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] text-left transition-colors"
                            style={{
                              backgroundColor: isActive ? "var(--accent-light)" : "transparent",
                              color: isActive ? "var(--accent)" : t.text2,
                            }}
                          >
                            <FileCode size={14} style={{ color: iconColor }} className="shrink-0" />
                            <span className="truncate">{file.name}</span>
                            {file.isMain && (
                              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: t.bg3, color: t.text3 }}>
                                main
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="px-3 pb-4">
                    <button
                      onClick={() => { setProjectName(selectedTemplate.name); setShowCreateModal(true); }}
                      className="w-full flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-[13px]"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      Use Template
                    </button>
                  </div>
                </aside>

                <main className="flex-1 min-w-0 flex flex-col">
                  <div className="h-10 min-h-[40px] shrink-0 flex items-center px-4 gap-2 border-b" style={{ borderColor: t.border, backgroundColor: t.bg2 }}>
                    <FileCode size={14} style={{ color: t.text3 }} />
                    <span className="text-[13px] font-medium" style={{ color: t.text }}>{previewFile?.name}</span>
                    <span className="text-[11px] ml-auto" style={{ color: t.text3 }}>Preview — read only</span>
                  </div>
                  <div className="flex-1 min-h-0">
                    <Editor
                      height="100%"
                      language={detectLanguage(previewFile?.name)}
                      value={previewFile?.content || ""}
                      theme="vs-dark"
                      options={{
                        readOnly: true,
                        domReadOnly: true,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        tabSize: 2,
                        fontSize: 14,
                        lineHeight: 22,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        automaticLayout: true,
                        padding: { top: 12, bottom: 12 },
                        renderLineHighlight: "all",
                        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                        overviewRulerLanes: 0,
                        hideCursorInOverviewRuler: true,
                        contextmenu: true,
                        copyWithSyntaxHighlighting: true,
                      }}
                    />
                  </div>
                </main>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="rounded-xl p-6 w-96 shadow-2xl" style={{ backgroundColor: t.bg2, border: `1px solid ${t.border}` }}>
            <h2 className="text-lg font-semibold mb-1" style={{ color: t.text }}>Create from Template</h2>
            <p className="text-[13px] mb-4" style={{ color: t.text3 }}>
              Based on "{selectedTemplate.name}" — {selectedTemplate.files.length} files
            </p>
            <input
              type="text"
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFromTemplate()}
              className="w-full rounded-lg px-4 py-2.5 mb-4 focus:outline-none text-sm"
              style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}`, color: t.text }}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowCreateModal(false); setProjectName(""); }}
                className="flex-1 px-4 py-2.5 rounded-lg transition-colors text-[13px] font-medium"
                style={{ backgroundColor: t.bg3, color: t.text2 }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFromTemplate}
                disabled={!projectName.trim() || creating}
                className="flex-1 flex items-center justify-center gap-2 text-white px-4 py-2.5 rounded-lg transition-colors font-medium text-[13px] disabled:opacity-50"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : null}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Templates;
