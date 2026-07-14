import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createChat,
  getUserChats,
  getChatById,
  addMessageToChat,
  deleteChat,
} from "../controller/chat.controller.js";

const router = express.Router();

// ✅ All routes require Clerk authentication
// This middleware checks req.auth.userId - if missing, returns 401
router.use(requireAuth());

/**
 * POST /api/chats
 * Create a new chat
 * Auth: Required
 */
router.post("/", createChat);

/**
 * GET /api/chats
 * Get all chats for logged-in user
 * Auth: Required
 */
router.get("/", getUserChats);

/**
 * GET /api/chats/:id
 * Get a single chat by ID
 * Auth: Required (and ownership verified)
 */
router.get("/:id", getChatById);

/**
 * PUT /api/chats/:id/message
 * Add a message to an existing chat
 * Auth: Required (and ownership verified)
 */
router.put("/:id/message", addMessageToChat);

/**
 * DELETE /api/chats/:id
 * Delete a chat
 * Auth: Required (and ownership verified)
 */
router.delete("/:id", deleteChat);

export default router;
