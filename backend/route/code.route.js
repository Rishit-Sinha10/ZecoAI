import express from "express";
import { HandleCode } from "../controller/code.controller.js";

const router = express.Router();

// POST /api/run-code - Execute code
router.post("/", HandleCode);

export default router;
