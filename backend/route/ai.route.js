import express from "express";
import { handleAI } from "../controller/gemini.controller.js";
import {
  handleCompletion,
  handleGeneration,
  handleDebug,
} from "../controller/ai.controller.js";

const router = express.Router();

// Existing AI analysis endpoint
router.post("/", handleAI);

// New AI endpoints
router.post("/complete", handleCompletion);
router.post("/generate", handleGeneration);
router.post("/debug", handleDebug);

export default router;