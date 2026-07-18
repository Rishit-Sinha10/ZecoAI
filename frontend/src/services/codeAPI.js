/**
 * Code Execution API Service
 * Dynamic language support fetched from backend
 */

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;

let cachedLanguages = null;

/**
 * Fetch available languages from backend (proxies Judge0)
 */
export const fetchLanguages = async () => {
  if (cachedLanguages) return cachedLanguages;

  try {
    const response = await fetch(`${API_BASE}/languages`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    cachedLanguages = data.languages || [];
    return cachedLanguages;
  } catch (error) {
    return [];
  }
};

/**
 * Clear cached languages (for refresh)
 */
export const clearLanguageCache = () => {
  cachedLanguages = null;
};

/**
 * Find language ID by name from fetched languages
 */
export const getLanguageId = async (language) => {
  const languages = await fetchLanguages();
  const normalized = language?.toLowerCase();

  const match = languages.find(
    (l) =>
      l.name?.toLowerCase().includes(normalized) ||
      l.id?.toString() === normalized
  );

  return match?.id || null;
};

/**
 * Run code and get output
 */
export const executeCode = async (code, language, stdin = "") => {
  try {
    const languageId = await getLanguageId(language);

    if (!languageId) {
      return {
        success: false,
        output: "",
        error: `Language "${language}" is not supported by this Judge0 instance.`,
        exitCode: 1,
        executionTime: null,
        memory: null,
      };
    }

    const response = await fetch(`${API_BASE}/run-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        language_id: languageId,
        stdin,
      }),
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
      }

      throw new Error(`[${response.status}] ${errorMessage}`);
    }

    const data = await response.json();

    if (!data.success && data.error) {
      return {
        success: false,
        output: "",
        error: data.error,
        exitCode: data.exitCode ?? 1,
        executionTime: data.executionTime,
        memory: data.memory,
      };
    }

    return {
      success: data.success,
      output: data.output || "",
      error: data.error || "",
      exitCode: data.exitCode ?? 0,
      executionTime: data.executionTime || null,
      memory: data.memory || null,
    };
  } catch (error) {
    let userMessage = error.message;

    if (error.message.includes("Failed to fetch")) {
      userMessage = "Cannot connect to backend. Is the server running on port 3000?";
    } else if (error.message.includes("[400]")) {
      userMessage = "Invalid request. Check code syntax.";
    } else if (error.message.includes("[500]")) {
      userMessage = "Backend error. Check server configuration (JUDGE0_URL).";
    } else if (error.message.includes("[504]")) {
      userMessage = "Code execution timed out. Try with simpler code.";
    }

    return {
      success: false,
      output: "",
      error: userMessage,
      exitCode: 1,
      executionTime: null,
      memory: null,
    };
  }
};
