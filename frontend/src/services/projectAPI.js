const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;
const getAuthToken = async (getToken) => {
  try {
    return await getToken();
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
};
const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
export const createProjectAPI = async (name, description, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");
  const response = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) throw new Error("Failed to create project");
  return await response.json();
};
export const getUserProjectsAPI = async (getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");
  const response = await fetch(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch projects");
  return await response.json();
};
export const getProjectByIdAPI = async (projectId, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");
  const response = await fetch(`${API_BASE}/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch project");
  return await response.json();
};
export const updateProjectAPI = async (projectId, updates, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");
  const response = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update project");
  return await response.json();
};
export const deleteProjectAPI = async (projectId, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");
  const response = await fetch(`${API_BASE}/projects/${projectId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete project");
  return await response.json();
};
export const exportProjectsAPI = async (getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");
  const response = await fetch(`${API_BASE}/projects/export`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to export projects");
  return await response.json();
};

export const importProjectsAPI = async (projects, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/projects/import`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ projects }),
  });

  if (!response.ok) throw new Error("Failed to import projects");
  return await response.json();
};

export const shareProjectAPI = async (projectId, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/projects/${projectId}/share`, {
    method: "POST",
    headers: authHeaders(token),
  });

  if (!response.ok) throw new Error("Failed to share project");
  return await response.json();
};

export const unshareProjectAPI = async (projectId, getToken) => {
  const token = await getAuthToken(getToken);
  if (!token) throw new Error("Authentication failed");

  const response = await fetch(`${API_BASE}/projects/${projectId}/share`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error("Failed to revoke share");
  return await response.json();
};
export const getSharedProjectAPI = async (shareId) => {
  const response = await fetch(`${API_BASE}/share/${shareId}`);
  if (!response.ok) throw new Error("Shared project not found");
  return await response.json();
};
