import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Play, Loader2 } from "lucide-react";
import Navbar from "../common/navbar";
import Sidebar from "../common/sidebar";
import FileExplorer from "./FileExplorer";
import FileTabs from "./FileTabs";
import CodeEditor from "./CodeEditor";
import AIChat from "../ai/AIChat";
import { useToast } from "../../context/ToastContext";

function Editor() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [unsavedFiles, setUnsavedFiles] = useState([]);
  const [runTrigger, setRunTrigger] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const projects = JSON.parse(localStorage.getItem("projects")) || [];
      const foundProject = projects.find(
        (p) => p.id === projectId || p.id === Number(projectId)
      );

      if (!foundProject) {
        setError("Project not found");
        setLoading(false);
        return;
      }

      if (!foundProject.files || foundProject.files.length === 0) {
        foundProject.files = [
          {
            id: Date.now(),
            name: "index.js",
            content: `// ${foundProject.name}\n\nfunction main() {\n  console.log('Hello from ${foundProject.name}');\n}\n\nmain();`,
            isMain: true,
          },
        ];
        const idx = projects.findIndex(
          (p) => p.id === projectId || p.id === Number(projectId)
        );
        projects[idx] = foundProject;
        localStorage.setItem("projects", JSON.stringify(projects));
      }

      setProject(foundProject);

      if (foundProject.files && foundProject.files.length > 0) {
        const mainFile = foundProject.files.find((f) => f.isMain);
        const firstFile = mainFile || foundProject.files[0];
        setActiveFileId(firstFile.id);
        setActiveFile(firstFile);
      }

      setLoading(false);
    } catch (err) {
      setError("Error loading project: " + err.message);
      setLoading(false);
    }
  }, [projectId]);

  const handleSelectFile = (fileId) => {
    if (project && project.files) {
      const file = project.files.find((f) => f.id === fileId);
      if (file) {
        setActiveFileId(fileId);
        setActiveFile(file);
      }
    }
  };

  const handleFileContentChange = (newContent) => {
    if (activeFile) {
      const updatedFile = { ...activeFile, content: newContent };
      setActiveFile(updatedFile);

      if (!unsavedFiles.includes(activeFileId)) {
        setUnsavedFiles((prev) => [...prev, activeFileId]);
      }

      const updatedProject = {
        ...project,
        files: project.files.map((f) =>
          f.id === activeFile.id ? updatedFile : f
        ),
      };
      setProject(updatedProject);

      const projects = JSON.parse(localStorage.getItem("projects")) || [];
      const idx = projects.findIndex((p) => p.id === project.id);
      if (idx !== -1) {
        projects[idx] = updatedProject;
        localStorage.setItem("projects", JSON.stringify(projects));
        setUnsavedFiles((prev) => prev.filter((id) => id !== activeFileId));
      }
    }
  };

  const handleAddFile = () => {
    const fileName = prompt("Enter file name (e.g., utils.js):");
    if (!fileName) return;

    const newFile = { id: Date.now(), name: fileName, content: `// ${fileName}\n` };
    const updatedProject = { ...project, files: [...project.files, newFile] };

    setProject(updatedProject);
    setActiveFileId(newFile.id);
    setActiveFile(newFile);

    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx !== -1) {
      projects[idx] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  };

  const handleDeleteFile = (fileId) => {
    if (project.files.length === 1) {
      toast.warning("Cannot delete the last file");
      return;
    }

    const updatedProject = {
      ...project,
      files: project.files.filter((f) => f.id !== fileId),
    };
    setProject(updatedProject);

    if (activeFileId === fileId) {
      setActiveFileId(updatedProject.files[0].id);
      setActiveFile(updatedProject.files[0]);
    }

    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx !== -1) {
      projects[idx] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  };

  const handleSetMainFile = (fileId) => {
    const updatedProject = {
      ...project,
      files: project.files.map((f) => ({ ...f, isMain: f.id === fileId })),
    };
    setProject(updatedProject);

    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx !== -1) {
      projects[idx] = updatedProject;
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  };

  const handleRunMain = () => setRunTrigger((prev) => prev + 1);

  const handleCloseFileTab = (fileId) => {
    if (project.files.length === 1) return;
    if (activeFileId === fileId) {
      const nextFile = project.files.find((f) => f.id !== fileId);
      setActiveFileId(nextFile.id);
      setActiveFile(nextFile);
    }
    setUnsavedFiles((prev) => prev.filter((id) => id !== fileId));
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--text-tertiary)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>Loading project...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const mainFile = project?.files?.find((f) => f.isMain);

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />

      <div className="flex-1 flex overflow-hidden pt-14">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* File Explorer + Editor */}
          <div className="flex-1 flex overflow-hidden min-h-0">
            <FileExplorer
              project={project}
              activeFileId={activeFileId}
              onSelectFile={handleSelectFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              onSetMainFile={handleSetMainFile}
            />

            <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
              {/* Main file indicator bar */}
              {mainFile && (
                <div className="h-7 min-h-[28px] shrink-0 px-4 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
                  <span className="text-[10px] font-medium tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
                    Main
                  </span>
                  <span className="text-[11px] font-mono" style={{ color: "var(--text-secondary)" }}>
                    {mainFile.name}
                  </span>
                  <button
                    onClick={handleRunMain}
                    className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-500/80 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    title="Run main file"
                    aria-label="Run main file"
                  >
                    <Play size={9} fill="currentColor" />
                    Run
                  </button>
                </div>
              )}

              {/* File Tabs */}
              <FileTabs
                files={project?.files || []}
                activeFileId={activeFileId}
                onSelectFile={handleSelectFile}
                onCloseFile={handleCloseFileTab}
                unsavedFiles={unsavedFiles}
              />

              {/* Code Editor — flex-1 fills remaining space */}
              <CodeEditor
                activeFile={activeFile}
                project={project}
                onContentChange={handleFileContentChange}
                onOpenAI={() => setIsAIChatOpen(true)}
                runTrigger={runTrigger}
              />
            </div>
          </div>
        </div>

        {/* AI Chat Floating Modal */}
        {isAIChatOpen && (
          <div className="fixed bottom-6 right-6 w-96 h-[28rem] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-primary)" }}>
            <AIChat
              activeFile={activeFile}
              isOpen={isAIChatOpen}
              onClose={() => setIsAIChatOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;
