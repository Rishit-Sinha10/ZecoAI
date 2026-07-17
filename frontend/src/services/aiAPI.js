const BASE = import.meta.env.VITE_API_URL ;
/**
 * Get auth token from Clerk
 */
const getAuthToken = async (token) => {
  if (typeof token === "function") {
    try {
      return await token();
    } catch {
      return null;
    }
  }
  return token;
};

/**
 * Call AI API endpoint
 */
const callAiApi = async (path, body, token) => {
  const url = `${BASE}/ai${path}`;
  const authToken = await getAuthToken(token);

  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "AI request failed");
  }

  return res.json();
};

/**
 * Get inline code completion
 */
export const getCompletion = async (
  code,
  language,
  prefix,
  suffix,
  token
) => {
  return callAiApi(
    "/complete",
    { code, language, prefix, suffix },
    token
  );
};

/**
 * Generate code from natural language specs
 */
export const generateCode = async (specs, language, filename, token) => {
  return callAiApi(
    "/generate",
    { specs, language, filename },
    token
  );
};

/**
 * Analyze code for bugs and errors
 */
export const debugCode = async (code, language, runtimeError, token) => {
  return callAiApi(
    "/debug",
    { code, language, error: runtimeError },
    token
  );
};

/**
 * General AI analysis (existing endpoint)
 */
export const analyzeCode = async (code, prompt, token) => {
  return callAiApi(
    "/",
    { code, prompt },
    token
  );
};

export default {
  getCompletion,
  generateCode,
  debugCode,
  analyzeCode,
};
