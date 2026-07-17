import express from "express";
import { handleFormat } from "../controller/format.controller.js";

const router = express.Router();
router.post("/", handleFormat);

export default router;
