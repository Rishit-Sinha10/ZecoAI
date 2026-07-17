import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

import aiRoutes from "./route/ai.route.js";
import chatRoutes from "./route/chat.route.js";
import projectRoutes from "./route/project.route.js";
import { HandleEdit } from "./controller/edit.controller.js";
import { HandleCode } from "./controller/code.controller.js";
import { HandleLanguages } from "./controller/languages.controller.js";
import { register } from "./controller/register.controller.js";
import { login } from "./controller/login.controller.js";
import { Debug } from "./controller/debug.controller.js";
import { Upload } from "./controller/upload.controller.js";
export const app = express();
// ✅ FIX: CORS MUST be FIRST, before all other middleware
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// ✅ Handle preflight OPTIONS requests explicitly
app.options("*", cors(corsOptions));
// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ✅ Clerk middleware (after CORS)
app.use(clerkMiddleware());
// 🔍 DEBUG: Log what Clerk middleware extracted
app.use((req, res, next) => {
  if (req.path.startsWith("/api/chats") || req.path === "/api/debug-auth") {
    console.log("[CLERK-DEBUG]", {
      path: req.path,
      method: req.method,
      hasAuth: !!req.auth,
      userId: req.auth?.userId,
      sessionId: req.auth?.sessionId,
      authHeader: req.headers.authorization ? `Bearer ${req.headers.authorization.substring(0, 50)}...` : "NONE"
    });
  }
  next();
});
// DEBUG: Test Clerk middleware
app.get("/api/debug-auth", (req, res) => {
  res.json({
    clerkAuth: req.auth || null,
    hasUserId: !!req.auth?.userId,
    userId: req.auth?.userId,
    sessionId: req.auth?.sessionId,
    authHeader: req.headers.authorization ? "Present" : "Missing"
  });
});
// Routes
app.use("/api/auth/register", register);
app.use("/api/auth/login", login);
app.use("/api/ai", aiRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/edit", HandleEdit);
app.use("/api/run-code", HandleCode);
app.get("/api/languages", HandleLanguages);
app.use("/api/debug-code", Debug);
app.use("/api/upload", Upload);