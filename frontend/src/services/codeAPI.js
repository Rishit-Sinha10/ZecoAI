/**
 * Code Execution API Service
 * ✅ FIXED: Better error handling, detailed logging
 */

const API_BASE = "http://localhost:3000/api";

/**
 * Language ID mapping for Judge0 API
 */
export const LANGUAGE_IDS = {
  javascript: 63,
  js: 63,
  python: 71,
  py: 71,
  java: 62,
  cpp: 54,
  c: 50,
  csharp: 51,
  cs: 51,
  ruby: 72,
  rb: 72,
  go: 60,
  rs: 73,
  php: 68,
  swift: 83,
  kt: 78,
  sql: 82,
  html: 93,
  bash: 192,
  sh: 192,
  zsh: 192,
};

/**
 * Run code and get output
 * ✅ FIXED: Enhanced error handling and logging
 */
export const executeCode = async (code, language) => {
  try {
    const languageId = LANGUAGE_IDS[language?.toLowerCase()] || LANGUAGE_IDS.javascript;

    console.log(`[EXEC_CODE] Language: ${language}, ID: ${languageId}, Code length: ${code.length}`);

    const response = await fetch(`${API_BASE}/run-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language_id: languageId,
      }),
    });

    // ✅ FIX: Better error handling
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Could not parse error response
      }

      console.error(`[EXEC_CODE_ERROR] ${errorMessage}`);
      
      throw new Error(`[${response.status}] ${errorMessage}`);
    }

    const data = await response.json();

    // ✅ FIX: Check for API-level errors
    if (!data.success && data.error) {
      console.warn(`[EXEC_CODE] Execution failed: ${data.error}`);
      return {
        success: false,
        output: "",
        error: data.error,
        statusCode: data.statusCode || response.status,
        executionTime: data.executionTime,
      };
    }

    console.log(`[EXEC_CODE_SUCCESS] Output length: ${(data.output || "").length}`);

    return {
      success: data.success || (data.output !== undefined && !data.error),
      output: data.output || "",
      error: data.error || "",
      statusCode: data.statusCode || null,
      executionTime: data.executionTime || null,
    };
  } catch (error) {
    console.error("[EXEC_CODE_ERROR]", error);
    
    // ✅ FIX: More informative error messages
    let userMessage = error.message;
    
    if (error.message.includes("Failed to fetch")) {
      userMessage = "Cannot connect to backend. Is the server running on port 3000?";
    } else if (error.message.includes("[400]")) {
      userMessage = "Invalid request. Check code syntax.";
    } else if (error.message.includes("[401]")) {
      userMessage = "Authentication failed. Please login again.";
    } else if (error.message.includes("[403]")) {
      userMessage = "Access forbidden. Check API permissions.";
    } else if (error.message.includes("[500]")) {
      userMessage = "Backend error. Check server configuration (especially RAPID_API_KEY).";
    } else if (error.message.includes("[504]")) {
      userMessage = "Code execution timed out. Try with simpler code.";
    }

    return {
      success: false,
      output: "",
      error: userMessage,
      statusCode: null,
      executionTime: null,
    };
  }
};

/**
 * Get language ID for a given language name
 */
export const getLanguageId = (language) => {
  return LANGUAGE_IDS[language?.toLowerCase()] || LANGUAGE_IDS.javascript;
};

/**
 * Get supported languages list
 */
export const getSupportedLanguages = () => {
  return Object.keys(LANGUAGE_IDS)
    .filter((lang) => lang.length > 2)
    .sort();
};
