const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";

export const HandleLanguages = async (req, res) => {
  try {
    const response = await fetch(`${JUDGE0_URL}/languages`);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Judge0 returned status ${response.status}`,
      });
    }

    const languages = await response.json();
    res.json({ languages });
  } catch (err) {
    console.error("[LANGUAGES_ERROR]", err.message);

    if (err.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Cannot reach Judge0 server at " + JUDGE0_URL,
      });
    }

    res.status(500).json({
      error: err.message || "Failed to fetch languages",
    });
  }
};

export default HandleLanguages;
