import Groq from "groq-sdk";
const getGroqClient = () => {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
};
/**
 * Inline code completion using Groq AI
 * POST /api/ai/complete
 */
export const handleCompletion = async (req, res) => {
  try {
    const { code, language, prefix, suffix } = req.body;
    if (!code && !prefix) {
      return res.status(400).json({
        success: false,
        message: "Code or prefix is required",
      });
    }
    const groq = getGroqClient();

    const contextLines = (prefix || "").split("\n");
    const recentLines = contextLines.slice(-30).join("\n");
    const afterLines = (suffix || "").split("\n").slice(0, 10).join("\n");

    const prompt = `Complete the code. Return ONLY the completion text, no explanations, no markdown, no backticks.

Language: ${language || "javascript"}

Before cursor:
${recentLines}

After cursor:
${afterLines}

Completion:`;

    const message = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 120,
      stop: ["\n\n\n", "```", "Explanation:", "Here's", "This code"],
    });

    let completion = message.choices[0].message.content.trim();
    completion = completion.replace(/^```[\w]*\n?/gm, "").replace(/```$/gm, "").trim();

    if (completion.length > 500) {
      completion = completion.substring(0, 500);
    }

    res.json({
      success: true,
      completion,
    });
  } catch (error) {
    console.error("Completion Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Completion failed",
      error: error.message,
    });
  }
};

/**
 * Code generation from natural language specs
 * POST /api/ai/generate
 */
export const handleGeneration = async (req, res) => {
  try {
    const { specs, language, filename } = req.body;

    if (!specs) {
      return res.status(400).json({
        success: false,
        message: "Specifications are required",
      });
    }

    const groq = getGroqClient();

    const prompt = `You are an expert code generator. Generate complete, production-ready code based on the following specifications.

Specifications: ${specs}
Language: ${language || "javascript"}
Filename: ${filename || "generated"}

Rules:
- Generate complete, working code
- Include proper imports if needed
- Add minimal comments for complex logic
- Follow best practices for the language
- Return ONLY the code, no explanations or markdown`;

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 2048,
    });

    const generatedCode = message.choices[0].message.content.trim();

    res.json({
      success: true,
      code: generatedCode,
      language: language || "javascript",
      filename: filename || "generated",
    });
  } catch (error) {
    console.error("Generation Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Code generation failed",
      error: error.message,
    });
  }
};

/**
 * AI debugging assistant
 * POST /api/ai/debug
 */
export const handleDebug = async (req, res) => {
  try {
    const { code, language, error: runtimeError } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const groq = getGroqClient();

    const prompt = `You are a debugging assistant. Fix the code based on the error.

Language: ${language || "javascript"}

Code:
\`\`\`
${code}
\`\`\`

${runtimeError ? `Runtime Error:\n${runtimeError}` : ""}

Return a JSON response with this exact structure:
{
  "errors": [
    {
      "line": <line_number>,
      "message": "<error description>",
      "severity": "error" | "warning",
      "fix": "<suggested fix>"
    }
  ],
  "summary": "<brief summary of issues found and fixed>",
  "fixedCode": "<the complete corrected code, fully working>"
}

IMPORTANT: "fixedCode" must contain the FULL corrected code, not a snippet. Return ONLY valid JSON, no other text.`;

    const message = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 4096,
    });

    const response = message.choices[0].message.content.trim();

    let analysis;
    try {
      analysis = JSON.parse(response);
    } catch {
      analysis = {
        errors: [],
        summary: response,
        fixedCode: null,
      };
    }

    res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Debug Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Debug analysis failed",
      error: error.message,
    });
  }
};

export default {
  handleCompletion,
  handleGeneration,
  handleDebug,
};
