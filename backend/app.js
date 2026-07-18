import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

import aiRoutes from "./route/ai.route.js";
import chatRoutes from "./route/chat.route.js";
import projectRoutes from "./route/project.route.js";
import codeHistoryRoutes from "./route/codeHistory.route.js";
import formatRoutes from "./route/format.route.js";
import { HandleEdit } from "./controller/edit.controller.js";
import { HandleCode } from "./controller/code.controller.js";
import { HandleLanguages } from "./controller/languages.controller.js";
import { Upload } from "./controller/upload.controller.js";
import { getSharedProject } from "./controller/project.controller.js";

export const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://127.0.0.1:3000","https://zecoai.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use("/api/ai", aiRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/runs", codeHistoryRoutes);
app.use("/api/format", formatRoutes);
app.use("/api/edit", HandleEdit);
app.use("/api/run-code", HandleCode);
app.get("/api/languages", HandleLanguages);
app.use("/api/upload", Upload);
app.get("/api/share/:shareId", getSharedProject);