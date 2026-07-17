const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;

const getAuthToken = async (getToken) => {
  try {
    return await getToken();
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
};

export const getUserRunsAPI = async (getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/runs`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to fetch runs");
  return await response.json();
};

export const deleteRunAPI = async (runId, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/runs/${runId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to delete run");
  return await response.json();
};
