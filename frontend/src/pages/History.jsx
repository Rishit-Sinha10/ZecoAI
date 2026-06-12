import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, MessageSquare } from "lucide-react";
import Navbar from "../components/common/navbar";
import Sidebar from "../components/common/sidebar";
import "./History.css";
function History() {
  const { isLoaded, userId, getToken } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Fetch all chats
  useEffect(() => {
    if (!isLoaded) {
      console.log("[CHAT_HISTORY] Auth not loaded yet");
      return;
    }

    if (!userId) {
      console.error("[CHAT_HISTORY] ❌ No userId! User not logged in");
      setError("Not logged in. Please sign in with Clerk.");
      setLoading(false);
      return;
    }

    const fetchChats = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("[CHAT_HISTORY] ---------- STARTING FETCH ----------");
        console.log("[CHAT_HISTORY] Frontend userId:", userId);
        
        // Get token
        console.log("[CHAT_HISTORY] Getting Clerk token...");
        const token = await getToken();
        
        if (!token) {
          throw new Error("Failed to get Clerk token. You may not be logged in.");
        }
        
        console.log("[CHAT_HISTORY] ✅ Token received");
        console.log("[CHAT_HISTORY] Token (first 50 chars):", token.substring(0, 50) + "...");

        // Make request
        const fetchUrl = `http://localhost:3000/api/chats`;
        console.log("[CHAT_HISTORY] Making request to:", fetchUrl);
        console.log("[CHAT_HISTORY] Authorization header:", `Bearer ${token.substring(0, 50)}...`);

        const res = await fetch(fetchUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("[CHAT_HISTORY] Response received");
        console.log("[CHAT_HISTORY] Status code:", res.status);
        console.log("[CHAT_HISTORY] Status text:", res.statusText);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: res.statusText }));
          console.error("[CHAT_HISTORY] ❌ Server returned error:", errorData);
          throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("[CHAT_HISTORY] ✅ Response parsed successfully");
        console.log("[CHAT_HISTORY] Chats received:", data.chats?.length || 0);

        // Set chats from response
        const chatsList = Array.isArray(data?.chats) ? data.chats : [];
        setChats(chatsList);
        setLoading(false);
        console.log("[CHAT_HISTORY] ---------- FETCH COMPLETE ✅ ----------");
      } catch (err) {
        console.error("[CHAT_HISTORY] ---------- FETCH FAILED ❌ ----------");
        console.error("[CHAT_HISTORY] Error message:", err.message);
        console.error("[CHAT_HISTORY] Full error object:", err);
        setError(err.message || "Failed to load chats");
        setLoading(false);
        setChats([]);
      }
    };

    fetchChats();
  }, [isLoaded, userId, getToken]);

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: new Date(date).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Delete chat
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat?")) return;

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:3000/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete chat");

      setChats(chats.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error("Error deleting chat:", err);
      alert("Failed to delete chat");
    }
  };

  // Create new chat
  const handleNewChat = () => {
    navigate("/chat/new");
  };

  if (!isLoaded) {
    return (
      <div className="history-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-zinc-950">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-4 flex overflow-hidden pt-16">
        {/* Sidebar */}
        <Sidebar />
        <div className="history-container">
          <div className="history-header">
            <h1>Chat History</h1>
            <button className="new-chat-btn" onClick={handleNewChat}>
              <Plus size={20} /> New Chat
            </button>
          </div>

          {loading && <div className="loading">Loading chats...</div>}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && chats.length === 0 && (
            <div className="empty-state">
              <MessageSquare size={48} />
              <h2>No chats yet</h2>
              <p>Start a new conversation to begin</p>
              <button className="new-chat-btn" onClick={handleNewChat}>
                <Plus size={20} /> Create First Chat
              </button>
            </div>
          )}

          {!loading && !error && chats.length > 0 && (
            <div className="chats-list">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className="chat-item"
                  onClick={() => navigate(`/chat/${chat._id}`)}
                >
                  <div className="chat-info">
                    <h3 className="chat-title">{chat.title}</h3>
                    <p className="chat-date">{formatDate(chat.createdAt)}</p>
                    <p className="chat-preview">
                      {chat.messages.length} message{chat.messages.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDeleteChat(chat._id, e)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default History;
