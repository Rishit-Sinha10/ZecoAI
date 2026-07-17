import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createProject,
  getUserProjects,
  getProjectById,
  updateProject,
  deleteProject,
  exportProject,
  importProjects,
} from "../controller/project.controller.js";

const router = express.Router();

router.use(requireAuth());

router.post("/", createProject);
router.get("/", getUserProjects);
router.get("/export", exportProject);
router.post("/import", importProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
