import Project from "../model/project.model.js";

export const createProject = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { name, description = "" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const project = await Project.create({
      userId,
      name: name.trim(),
      description,
      files: [{
        name: "index.js",
        content: `// ${name}\n// Welcome to ZecoAI\n\nfunction main() {\n  console.log('Hello from ${name}');\n}\n\nmain();`,
        isMain: true,
      }],
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("[PROJECT_CREATE_ERROR]", err.message);
    res.status(500).json({ error: "Failed to create project" });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error("[PROJECTS_FETCH_ERROR]", err.message);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const project = await Project.findOne({ _id: req.params.id, userId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("[PROJECT_FETCH_ERROR]", err.message);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { name, description, files, mainFileId } = req.body;

    const project = await Project.findOne({ _id: req.params.id, userId });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (name !== undefined) project.name = name.trim();
    if (description !== undefined) project.description = description;
    if (files !== undefined) {
      const existingIds = new Set(project.files.map((f) => f._id.toString()));
      const incomingIds = new Set(files.filter((f) => f._id).map((f) => f._id));

      project.files = project.files.filter((f) => incomingIds.has(f._id.toString()));

      for (const f of files) {
        if (f._id && existingIds.has(f._id)) {
          const doc = project.files.id(f._id);
          if (doc) {
            doc.name = f.name;
            doc.content = f.content;
            doc.isMain = f.isMain;
          }
        } else {
          project.files.push({ name: f.name, content: f.content, isMain: f.isMain });
        }
      }
    }
    if (mainFileId !== undefined) {
      project.files.forEach((f) => {
        f.isMain = f._id.toString() === mainFileId;
      });
    }

    await project.save();
    res.json(project);
  } catch (err) {
    console.error("[PROJECT_UPDATE_ERROR]", err.message);
    res.status(500).json({ error: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("[PROJECT_DELETE_ERROR]", err.message);
    res.status(500).json({ error: "Failed to delete project" });
  }
};

export const exportProject = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
    res.json({ projects, exportedAt: new Date().toISOString() });
  } catch (err) {
    console.error("[PROJECT_EXPORT_ERROR]", err.message);
    res.status(500).json({ error: "Failed to export projects" });
  }
};

export const importProjects = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { projects } = req.body;

    if (!Array.isArray(projects) || projects.length === 0) {
      return res.status(400).json({ error: "Invalid import data" });
    }

    const imported = [];
    for (const p of projects) {
      const project = await Project.create({
        userId,
        name: (p.name || "Imported Project").trim(),
        description: p.description || "",
        files: (p.files || []).map((f) => ({
          name: f.name || "untitled",
          content: f.content || "",
          isMain: f.isMain || false,
        })),
      });
      imported.push(project);
    }

    res.status(201).json({ imported: imported.length, projects: imported });
  } catch (err) {
    console.error("[PROJECT_IMPORT_ERROR]", err.message, err.stack);
    res.status(500).json({ error: "Failed to import projects" });
  }
};
