/**
 * Middleware to verify Clerk authentication
 * Uses req.auth from Clerk middleware set by @clerk/express
 */
export const verifyAuth = async (req, res, next) => {
  try {
    // Clerk middleware populates req.auth with userId from Bearer token
    const userId = req.auth?.userId;

    if (!userId) {
      console.error("[AUTH] 401 - No userId found. req.auth:", req.auth);
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No valid session. Make sure you're logged in.",
      });
    }

    // ✅ Log successful authentication
    console.log(`[AUTH] ✓ Verified user: ${userId}`);

    // Attach userId to request for use in controllers
    req.userId = userId;
    next();
  } catch (error) {
    console.error("[AUTH] Authentication error:", error.message);
    res.status(401).json({
      success: false,
      message: "Unauthorized - Authentication failed",
    });
  }
};
