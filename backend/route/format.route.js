import express from "express";
import { requireAuth } from "@clerk/express";
import { handleFormat } from "../controller/format.controller.js";

const router = express.Router();
router.use(requireAuth());
router.post("/", handleFormat);

export default router;
