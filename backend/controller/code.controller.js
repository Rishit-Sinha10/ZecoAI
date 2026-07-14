import axios from "axios";

/**
 * Judge0 API Language IDs
 */
const LANGUAGE_IDS = {
  63: "javascript",
  71: "python",
  62: "java",
  54: "cpp",
  50: "c",
  51: "csharp",
  72: "ruby",
  60: "go",
  73: "rust",
  68: "php",
  83: "swift",
  78: "kotlin",
  82: "sql",
  93: "html",
  192: "bash",
};

/**
 * Execute code using Judge0 API
 * ✅ FIXED: Added API key validation, better error handling, detailed logging
 */
export const HandleCode = async (req, res) => {
  try {
    // ✅ FIX: Validate API key exists
    if (!process.env.RAPID_API_KEY || !process.env.RAPID_API_KEY.trim()) {
      console.error("❌ [CODE_EXEC] RAPID_API_KEY is not set in .env");
      return res.status(500).json({
        success: false,
        error: "Server configuration error: Missing RAPID_API_KEY. Contact admin.",
      });
    }

    const { code, language_id, stdin = "" } = req.body;

    // ✅ FIX: Better validation log
    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        error: "Code cannot be empty",
      });
    }

    if (!language_id) {
      return res.status(400).json({
        success: false,
        error: "Language ID is required",
      });
    }

    // ✅ FIX: Detailed logging
    console.log(`[CODE_EXEC] Language ID: ${language_id}, Code length: ${code.length}...`);

    // ✅ FIX: API key is trimmed to remove whitespace
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: parseInt(language_id), // Ensure integer
        stdin: stdin,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPID_API_KEY.trim(), // ✅ Trimmed
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        timeout: 30000,
      }
    );

    const result = response.data;

    // ✅ FIX: Better status checking (Judge0 can return status_id or status.id)
    const statusId = result.status_id || result.status?.id;
    const isSuccess = statusId === 3 || statusId === 4;

    // ✅ FIX: More complete response
    res.json({
      success: isSuccess,
      output: result.stdout || "",
      error: result.stderr || result.compile_output || "",
      exitCode: result.exit_code || null,
      statusCode: statusId || null,
      statusText: result.status?.description || `Status: ${statusId}`,
      executionTime: result.time || null,
      memory: result.memory || null,
    });

    console.log(`[CODE_EXEC_SUCCESS] Returned status: ${statusId}`);

  } catch (err) {
    // ✅ FIX: Detailed error logging
    console.error("[CODE_EXEC_ERROR]", {
      message: err.message,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      code: err.code,
    });

    // ✅ FIX: Specific error handling for different API errors
    if (err.response?.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Judge0 API Authentication failed. Check RAPID_API_KEY in .env",
      });
    }

    if (err.response?.status === 403) {
      return res.status(403).json({
        success: false,
        error: "Judge0 API Access forbidden. Check API key permissions.",
      });
    }

    if (err.code === "ECONNABORTED") {
      return res.status(504).json({
        success: false,
        error: "Code execution timed out (30s). Try simpler code.",
      });
    }

    if (err.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        error: "Cannot reach Judge0 API. Service may be down.",
      });
    }

    if (err.code === "ENOTFOUND") {
      return res.status(503).json({
        success: false,
        error: "Network error: Cannot resolve Judge0 API domain.",
      });
    }

    // ✅ FIX: Generic error handler with details
    res.status(500).json({
      success: false,
      error: err.message || "Failed to execute code",
    });
  }
};

export default HandleCode;