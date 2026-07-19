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

   const prompt = `You are an inline code completion engine, like an IDE autocomplete. Complete ONLY the code at the cursor position.
Language: ${language || "javascript"}
Code before cursor:
${recentLines}
<CURSOR>
Code after cursor:
${afterLines}
RULES:
- Output ONLY the text that should be inserted at <CURSOR>. Do not repeat "before cursor" or "after cursor" content.
- Do not duplicate anything already present in "Code after cursor" — assume it stays exactly as-is following your insertion.
- Match the existing indentation, style, and naming conventions exactly.
- Keep the completion minimal and contextually appropriate — typically one line to a few lines, not an entire function or file, unless the immediate context clearly requires more (e.g., completing an open block).
- If the surrounding code is empty or gives no clear signal, return an empty string rather than guessing unrelated boilerplate.
- No markdown, no code fences, no explanations, no labels like "Completion:" — output raw code only.
Insert at <CURSOR>:`;

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

    const prompt = `You are an expert ${language || "javascript"} engineer. Generate a complete, production-ready file named "${filename || "generated"}" based on the specification below.
SPECIFICATION:
${specs}
OUTPUT CONTRACT (STRICT):
- Output raw source code only — no markdown, no triple backticks, no code fences, no JSON wrapping.
- No prose before or after the code: no "Here's the code", no explanations, no summaries.
- First character of your response = first character of the code. Last character = last character of the code. Nothing else.
- If you are about to add a closing remark or fence, delete it before responding.
CODE REQUIREMENTS:
- Fully working, self-contained code unless the spec explicitly requires multiple files.
- Include all necessary imports/dependencies.
- Follow idiomatic best practices and standard formatting/linting conventions for ${language || "javascript"}.
- Handle realistic edge cases and errors (invalid input, null/undefined, async failures) rather than only the happy path.
- Use the filename "${filename || "generated"}" for naming conventions where relevant (e.g., class/module name, exports).
- Add comments only where logic is non-obvious — do not narrate every line.
- If the specification is ambiguous or incomplete, make the most reasonable, minimal assumption and proceed — do not ask questions or leave TODOs/placeholders.
- Do not truncate. Output the entire file in full.`;
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

    const prompt = `You are a debugging assistant. Analyze the code below and fix all issues.

Language: ${language || "javascript"}

Code:
${code}

${runtimeError ? `Runtime Error:\n${runtimeError}` : "No runtime error was provided — check for logical, syntax, and best-practice issues."}

TASK:
1. Identify every bug: the runtime error above (if provided) AND any other logical, syntax, type, or edge-case issues you find.
2. Produce a fully corrected version of the entire file.

OUTPUT FORMAT (STRICT):
Return ONLY a single valid JSON object. No markdown, no code fences, no commentary before or after.

JSON schema:
{
  "errors": [
    {
      "line": <number, best estimate based on the original code above>,
      "message": "<concise description of the issue>",
      "severity": "error" | "warning",
      "fix": "<concise description of what was changed and why>"
    }
  ],
  "summary": "<1-2 sentence summary of what was wrong and what was fixed>",
  "fixedCode": "<the complete corrected file as a single string>"
}

CRITICAL JSON-SAFETY RULES for "fixedCode":
- Escape all double quotes as \\"
- Escape all newlines as \\n (do not use literal line breaks inside the string)
- Escape all backslashes as \\\\
- Do not wrap the code in markdown backticks inside the string
- The value must be valid, parseable JSON when the whole response is passed to JSON.parse()

If no errors are found, return "errors": [] and set "fixedCode" equal to the original code, unchanged.`;

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
