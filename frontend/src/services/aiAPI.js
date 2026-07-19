const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;
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
  const url = `${API_BASE}/ai${path}`;
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

/**
 * Stream chat with AI - returns an async iterator of chunks
 */
export const streamChat = async (messages, token, projectContext) => {
  const url = `${API_BASE}/ai/chat`;
  const authToken = await getAuthToken(token);

  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ messages, projectContext }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Chat request failed");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  return {
    async *[Symbol.asyncIterator]() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) return;
              if (data.error) throw new Error(data.error);
              if (data.chunk) yield data.chunk;
            } catch (e) {
              if (e.message === "Stream failed" || e.message.includes("Chat request")) throw e;
            }
          }
        }
      }
    }
  };
};

/**
 * Format code via backend (for languages needing Node-only Prettier plugins)
 */
export const formatCodeAPI = async (code, language, token) => {
  const authToken = await getAuthToken(token);
  const headers = { "Content-Type": "application/json" };
  if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}/format`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code, language }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Format request failed");
  }

  return res.json();
};

export default {
  getCompletion,
  generateCode,
  debugCode,
  analyzeCode,
  streamChat,
  formatCodeAPI,
};
