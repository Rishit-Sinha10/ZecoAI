import express from "express";
import { Debug } from "../controller/debug.controller.js";
const router =express.Router();
router.post("/",Debug);
export default router;