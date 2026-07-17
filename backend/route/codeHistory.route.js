import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getUserCodeRuns,
  deleteCodeRun,
} from "../controller/codeHistory.controller.js";

const router = express.Router();

router.use(requireAuth());

router.get("/", getUserCodeRuns);
router.delete("/:id", deleteCodeRun);

export default router;
