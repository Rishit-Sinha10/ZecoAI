import mongoose from "mongoose";
import Chat from "../model/chat.model.js";

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Extract first message as title
 * @param {string} text - First message text
 * @returns {string} - Title (max 50 chars)
 */
const generateTitle = (text) => {
  const maxLength = 50;
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

/**
 * Create a new chat
 * POST /api/chats
 * Auth: Required (Clerk token)
 */
export const createChat = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: "Database not connected. Please try again later." });
    }
    // ✅ userId comes from verified Clerk token, not from request body
    const userId = req.auth.userId;
    const { messages, title: customTitle } = req.body;

    if (!userId) {
      console.error("[CHAT] No userId in req.auth");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no valid session",
      });
    }

    // Generate title from first user message or use provided title
    let title = customTitle || "New Chat";
    const messagesArray = messages || [];
    if (!customTitle) {
      const firstUserMessage = messagesArray.find((msg) => msg.role === "user");
      if (firstUserMessage) {
        title = generateTitle(firstUserMessage.content);
      }
    }

    console.log(`[CHAT] Creating chat for user: ${userId}`);

    const chat = new Chat({
      userId,  // ← From verified Clerk token
      title,
      messages: messagesArray,
    });

    await chat.save();

    console.log(`[CHAT] Created chat: ${chat._id}`);

    res.status(201).json({
      success: true,
      message: "Chat created successfully",
      chat,
    });
  } catch (error) {
    console.error("[CHAT] Create Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create chat",
    });
  }
};

/**
 * Get all chats for a user
 * GET /api/chats
 * Auth: Required (Clerk token via requireAuth() middleware)
 */
export const getUserChats = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: "Database not connected. Please try again later." });
    }
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized - no valid session" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const [chats, total] = await Promise.all([
      Chat.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).select("_id title createdAt messages"),
      Chat.countDocuments({ userId }),
    ]);

    res.json({
      success: true,
      chats,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[CHAT] Get Chats Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch chats" });
  }
};

/**
 * Get a single chat by ID
 * GET /api/chats/:id
 * Auth: Required (Clerk token via requireAuth() middleware)
 */
export const getChatById = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: "Database not connected. Please try again later." });
    }
    const { id } = req.params;
    // ✅ userId from verified Clerk token
    const userId = req.auth.userId;

    if (!userId) {
      console.error("[CHAT] No userId in req.auth");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no valid session",
      });
    }

    console.log(`[CHAT] Fetching chat ${id} for user ${userId}`);

    // ✅ Query with BOTH id and userId to prevent accessing other users' chats
    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      console.warn(`[CHAT] Chat ${id} not found for user ${userId}`);
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("[CHAT] Get Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
    });
  }
};

/**
 * Add a message to an existing chat
 * PUT /api/chats/:id/message
 * Auth: Required (Clerk token via requireAuth() middleware)
 */
export const addMessageToChat = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: "Database not connected. Please try again later." });
    }
    const { id } = req.params;
    const { role, content } = req.body;
    // ✅ userId from verified Clerk token
    const userId = req.auth.userId;

    if (!userId) {
      console.error("[CHAT] No userId in req.auth");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no valid session",
      });
    }

    if (!role || !content) {
      return res.status(400).json({
        success: false,
        message: "role and content are required",
      });
    }

    console.log(`[CHAT] Adding message to chat ${id} for user ${userId}`);

    // ✅ Verify user owns this chat before adding message
    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      console.warn(`[CHAT] Chat ${id} not found for user ${userId}`);
      return res.status(404).json({
        success: false,
        message: "Chat not found or not owned by user",
      });
    }

    // Add message to chat
    chat.messages.push({
      role,
      content,
      timestamp: new Date(),
    });

    await chat.save();

    console.log(`[CHAT] Message added to chat ${id}`);

    res.json({
      success: true,
      message: "Message added successfully",
      chat,
    });
  } catch (error) {
    console.error("[CHAT] Add Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add message",
    });
  }
};

/**
 * Delete a chat
 * DELETE /api/chats/:id
 * Auth: Required (Clerk token via requireAuth() middleware)
 */
export const deleteChat = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, message: "Database not connected. Please try again later." });
    }
    const { id } = req.params;
    // ✅ userId from verified Clerk token
    const userId = req.auth.userId;

    if (!userId) {
      console.error("[CHAT] No userId in req.auth");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - no valid session",
      });
    }

    console.log(`[CHAT] Deleting chat ${id} for user ${userId}`);

    // ✅ Only delete if user owns the chat
    const result = await Chat.deleteOne({ _id: id, userId });

    if (result.deletedCount === 0) {
      console.warn(`[CHAT] Chat ${id} not found for user ${userId}`);
      return res.status(404).json({
        success: false,
        message: "Chat not found or not owned by user",
      });
    }

    console.log(`[CHAT] Chat ${id} deleted successfully`);

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error("[CHAT] Delete Chat Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
    });
  }
};
