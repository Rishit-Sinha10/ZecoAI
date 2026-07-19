import express from "express";
import { requireAuth } from "@clerk/express";
import { HandleCode } from "../controller/code.controller.js";

const router = express.Router();
router.use(requireAuth());
router.post("/", HandleCode);

export default router;
