/**
 * Execute code using self-hosted Judge0
 * Uses async submission + polling to avoid HTTP timeouts on Docker Desktop
 */
import CodeRun from "../model/code.model.js";

const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";
const POLL_INTERVAL_MS = 500;
const MAX_POLL_TIME_MS = 60000;

export const HandleCode = async (req, res) => {
  try {
    const { code, language_id, stdin = "" } = req.body;

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

    console.log(`[CODE_EXEC] Language ID: ${language_id}, Code length: ${code.length}...`);

    const submitResponse = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: parseInt(language_id),
          stdin: stdin,
        }),
      }
    );

    if (!submitResponse.ok) {
      const errorBody = await submitResponse.text();
      console.error(`[CODE_EXEC_ERROR] Judge0 submit failed ${submitResponse.status}: ${errorBody}`);
      return res.status(submitResponse.status).json({
        success: false,
        error: `Judge0 returned status ${submitResponse.status}`,
      });
    }

    const submitData = await submitResponse.json();
    const token = submitData.token;
    console.log(`[CODE_EXEC] Submitted, token: ${token}`);

    const startTime = Date.now();
    let result = null;

    while (Date.now() - startTime < MAX_POLL_TIME_MS) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

      const pollResponse = await fetch(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`
      );

      if (!pollResponse.ok) {
        continue;
      }

      const pollData = await pollResponse.json();
      const statusId = pollData.status?.id;

      if (statusId === 1 || statusId === 2) {
        continue;
      }

      result = pollData;
      break;
    }

    if (!result) {
      console.error(`[CODE_EXEC_ERROR] Polling timed out after ${MAX_POLL_TIME_MS}ms for token ${token}`);
      return res.status(504).json({
        success: false,
        error: "Code execution timed out. The sandbox may not support this language on your system.",
      });
    }

    const statusId = result.status_id || result.status?.id;
    const isSuccess = statusId === 3 || statusId === 4;
    const errorMsg = result.stderr || result.compile_output || result.message || "";
    const elapsed = Date.now() - startTime;

    console.log(`[CODE_EXEC_SUCCESS] Status: ${statusId} (${result.status?.description}), elapsed: ${elapsed}ms`);

    const responseData = {
      success: isSuccess,
      output: result.stdout || "",
      error: errorMsg,
      exitCode: result.exit_code || null,
      statusCode: statusId || null,
      statusText: result.status?.description || `Status: ${statusId}`,
      executionTime: result.time || null,
      memory: result.memory || null,
    };

    try {
      const languageName = result.language?.name || `lang_${language_id}`;
      await CodeRun.create({
        userId: req.auth?.userId || "anonymous",
        code,
        language: languageName,
        stdin,
        output: result.stdout || "",
        error: errorMsg,
        exitCode: result.exit_code || null,
        executionTime: result.time || null,
        memory: result.memory || null,
      });
    } catch (saveErr) {
      console.error("[CODE_EXEC_HISTORY_SAVE_ERROR]", saveErr.message);
    }

    res.json(responseData);
  } catch (err) {
    console.error("[CODE_EXEC_ERROR]", {
      message: err.message,
      code: err.code,
    });

    if (err.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        error: "Cannot reach Judge0 server. Is it running on " + JUDGE0_URL + "?",
      });
    }

    res.status(500).json({
      success: false,
      error: err.message || "Failed to execute code",
    });
  }
};

export default HandleCode;
