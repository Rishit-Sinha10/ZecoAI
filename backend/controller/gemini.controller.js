import { z } from "zod";
import { getAIProvider } from "../services/ai/index.js";

const aiSchema = z.object({
  code: z.string().min(1, "Code is required").max(50000),
  prompt: z.string().max(10000).optional(),
  stream: z.boolean().optional(),
});

export const handleAI = async (req, res) => {
  try {
    const parsed = aiSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
    }
    const { code, prompt, stream } = parsed.data;
    const provider = await getAIProvider();

    const messages = [
      { role: "user", content: `${prompt || "Analyze and improve this code"}:\n\n\`\`\`\n${code}\n\`\`\`` },
    ];

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      try {
        for await (const chunk of provider.chatStream(messages, { temperature: 0.7, maxTokens: 2048 })) {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      } catch (err) {
        res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
      }
      res.end();
      return;
    }

    const reply = await provider.chat(messages, { temperature: 0.7, maxTokens: 2048 });
    res.json({ success: true, reply });
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ success: false, message: "AI processing failed" });
  }
};
