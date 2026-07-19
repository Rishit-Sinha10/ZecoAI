import express from "express";
import { requireAuth } from "@clerk/express";
import { handleAI } from "../controller/gemini.controller.js";
import {
  handleCompletion,
  handleGeneration,
  handleDebug,
  handleStreamChat,
} from "../controller/ai.controller.js";

const router = express.Router();

router.use(requireAuth());

router.post("/", handleAI);
router.post("/chat", handleStreamChat);
router.post("/complete", handleCompletion);
router.post("/generate", handleGeneration);
router.post("/debug", handleDebug);

export default router;