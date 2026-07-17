import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Play, Loader2 } from "lucide-react";
import Navbar from "../common/navbar";
import Sidebar from "../common/sidebar";
import FileExplorer from "./FileExplorer";
import FileTabs from "./FileTabs";
import CodeEditor from "./CodeEditor";
import StatusBar from "./StatusBar";
import FindInProject from "./FindInProject";
import AIChat from "../ai/AIChat";
import { useToast } from "../../context/ToastContext";
import useAuth from "../../hooks/useAuth";
import {
  getProjectByIdAPI,
  updateProjectAPI,
} from "../../services/projectAPI";

const GUEST_PROJECTS_KEY = "projects";

function Editor() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState(null);
  const [activeFileId, setActiveFileId] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [editorRef, setEditorRef] = useState(null);
  const [unsavedFiles, setUnsavedFiles] = useState([]);
  const [runTrigger, setRunTrigger] = useState(0);
  const { toast } = useToast();
  const { isSignedIn, getToken } = useAuth();
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    loadProject();
  }, [projectId, isSignedIn]);

  const loadProject = async () => {
    setLoading(true);
    setError(null);

    const loadFromLocal = () => {
      const projects = JSON.parse(localStorage.getItem(GUEST_PROJECTS_KEY)) || [];
      const foundProject = projects.find(
        (p) => p.id === projectId || p.id === Number(projectId)
      );
      if (foundProject) {
        if (!foundProject.files || foundProject.files.length === 0) {
          foundProject.files = [{
            id: Date.now(), name: "index.js",
            content: `// ${foundProject.name}\n\nfunction main() {\n  console.log('Hello from ${foundProject.name}');\n}\n\nmain();`,
            isMain: true,
          }];
        }
        return foundProject;
      }
      return null;
    };

    try {
      if (isSignedIn) {
        try {
          const foundProject = await getProjectByIdAPI(projectId, getToken);
          if (!foundProject) {
            const local = loadFromLocal();
            if (local) { initProject(local); }
            else { setError("Project not found"); }
            return;
          }
          initProject(foundProject);
        } catch (apiErr) {
          console.error("Backend load failed, trying localStorage:", apiErr.message);
          const local = loadFromLocal();
          if (local) { initProject(local); }
          else { setError("Error loading project: " + apiErr.message); }
        }
      } else {
        const foundProject = loadFromLocal();
        if (!foundProject) {
          setError("Project not found");
        } else {
          initProject(foundProject);
        }
      }
    } catch (err) {
      setError("Error loading project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const initProject = (foundProject) => {
    setProject(foundProject);
    if (foundProject.files && foundProject.files.length > 0) {
      const mainFile = foundProject.files.find((f) => f.isMain);
      const firstFile = mainFile || foundProject.files[0];
      setActiveFileId(firstFile._id || firstFile.id);
      setActiveFile(firstFile);
    }
  };

  const getFileId = (file) => file._id || file.id;

  const persistProject = useCallback(async (updatedProject) => {
    const saveToLocal = () => {
      const projects = JSON.parse(localStorage.getItem(GUEST_PROJECTS_KEY)) || [];
      const id = updatedProject._id || updatedProject.id;
      const idx = projects.findIndex((p) => (p._id || p.id) === id);
      if (idx !== -1) {
        projects[idx] = updatedProject;
      } else {
        projects.push(updatedProject);
      }
      localStorage.setItem(GUEST_PROJECTS_KEY, JSON.stringify(projects));
    };

    if (isSignedIn && updatedProject._id) {
      try {
        await updateProjectAPI(projectId, {
          name: updatedProject.name,
          files: updatedProject.files.map((f) => ({
            _id: f._id,
            name: f.name,
            content: f.content,
            isMain: f.isMain,
          })),
        }, getToken);
        return;
      } catch (err) {
        console.error("Backend save failed, saving locally:", err.message);
      }
    }
    saveToLocal();
  }, [isSignedIn, projectId, getToken, toast]);

  const debouncedSave = useCallback((updatedProject) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => persistProject(updatedProject), 500);
  }, [persistProject]);

  const handleSelectFile = (fileId) => {
    if (project && project.files) {
      const file = project.files.find((f) => getFileId(f) === fileId);
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
          getFileId(f) === getFileId(activeFile) ? updatedFile : f
        ),
      };
      setProject(updatedProject);
      debouncedSave(updatedProject);
      setUnsavedFiles((prev) => prev.filter((id) => id !== activeFileId));
    }
  };

  const handleAddFile = () => {
    const fileName = prompt("Enter file name (e.g., utils.js or src/utils/helper.js):");
    if (!fileName) return;

    const newFile = { id: Date.now(), name: fileName.trim(), content: `// ${fileName}\n` };
    const updatedProject = { ...project, files: [...project.files, newFile] };

    setProject(updatedProject);
    setActiveFileId(newFile.id);
    setActiveFile(newFile);
    persistProject(updatedProject);
  };

  const handleRenameFile = (fileId, newName) => {
    const updatedProject = {
      ...project,
      files: project.files.map((f) =>
        getFileId(f) === fileId ? { ...f, name: newName } : f
      ),
    };
    setProject(updatedProject);

    if (activeFileId === fileId) {
      const renamedFile = updatedProject.files.find((f) => getFileId(f) === fileId);
      if (renamedFile) setActiveFile(renamedFile);
    }

    persistProject(updatedProject);
  };

  const handleDeleteFile = (fileId) => {
    if (project.files.length === 1) {
      toast.warning("Cannot delete the last file");
      return;
    }

    const updatedProject = {
      ...project,
      files: project.files.filter((f) => getFileId(f) !== fileId),
    };
    setProject(updatedProject);

    if (activeFileId === fileId) {
      const firstFile = updatedProject.files[0];
      setActiveFileId(getFileId(firstFile));
      setActiveFile(firstFile);
    }

    persistProject(updatedProject);
  };

  const handleSetMainFile = (fileId) => {
    const updatedProject = {
      ...project,
      files: project.files.map((f) => ({ ...f, isMain: getFileId(f) === fileId })),
    };
    setProject(updatedProject);
    persistProject(updatedProject);
  };

  const handleRunMain = () => setRunTrigger((prev) => prev + 1);

  const handleCloseFileTab = (fileId) => {
    if (project.files.length === 1) return;
    if (activeFileId === fileId) {
      const nextFile = project.files.find((f) => getFileId(f) !== fileId);
      setActiveFileId(getFileId(nextFile));
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
          <div className="flex-1 flex overflow-hidden min-h-0">
            <FileExplorer
              project={project}
              activeFileId={activeFileId}
              onSelectFile={handleSelectFile}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
              onSetMainFile={handleSetMainFile}
              onRenameFile={handleRenameFile}
            />

            <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
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

              <FileTabs
                files={project?.files || []}
                activeFileId={activeFileId}
                onSelectFile={handleSelectFile}
                onCloseFile={handleCloseFileTab}
                unsavedFiles={unsavedFiles}
              />

              <CodeEditor
                activeFile={activeFile}
                project={project}
                onContentChange={handleFileContentChange}
                onOpenAI={() => setIsAIChatOpen(true)}
                runTrigger={runTrigger}
                onEditorMount={(ref) => setEditorRef(ref)}
                onFindInProject={() => setIsFindOpen(true)}
              />

              <StatusBar
                language={activeFile?.name?.split(".").pop()}
                editorRef={editorRef}
                isSaved={!unsavedFiles.includes(activeFileId)}
                isCompleting={false}
              />
            </div>
          </div>
        </div>

        {isAIChatOpen && (
          <div className="fixed bottom-6 right-6 w-96 h-[28rem] rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-primary)" }}>
            <AIChat
              activeFile={activeFile}
              isOpen={isAIChatOpen}
              onClose={() => setIsAIChatOpen(false)}
            />
          </div>
        )}

        <FindInProject
          isOpen={isFindOpen}
          onClose={() => setIsFindOpen(false)}
          project={project}
          onOpenFile={(fileName) => {
            const file = project?.files?.find((f) => f.name === fileName);
            if (file) handleSelectFile(getFileId(file));
          }}
        />
      </div>
    </div>
  );
}

export default Editor;
