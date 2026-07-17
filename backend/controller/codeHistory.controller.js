import CodeRun from "../model/code.model.js";

export const getUserCodeRuns = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const runs = await CodeRun.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-__v");

    res.json(runs);
  } catch (err) {
    console.error("[CODE_RUNS_FETCH_ERROR]", err.message);
    res.status(500).json({ error: "Failed to fetch execution history" });
  }
};

export const deleteCodeRun = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const run = await CodeRun.findOneAndDelete({ _id: req.params.id, userId });
    if (!run) {
      return res.status(404).json({ error: "Run not found" });
    }

    res.json({ message: "Run deleted" });
  } catch (err) {
    console.error("[CODE_RUN_DELETE_ERROR]", err.message);
    res.status(500).json({ error: "Failed to delete run" });
  }
};
