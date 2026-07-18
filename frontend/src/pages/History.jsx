import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, MessageSquare } from "lucide-react";
import Navbar from "../components/common/navbar";
import { useToast } from "../context/ToastContext";
import "./History.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function History() {
  const { isLoaded, userId, getToken } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) { setError("Not logged in. Please sign in with Clerk."); setLoading(false); return; }

    const fetchChats = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) throw new Error("Failed to get Clerk token.");
        const res = await fetch(`${API_URL}/api/chats`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: res.statusText }));
          throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        setChats(Array.isArray(data?.chats) ? data.chats : []);
      } catch (err) {
        setError(err.message || "Failed to load chats");
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [isLoaded, userId, getToken]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short", day: "numeric",
      year: new Date(date).getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
      hour: "2-digit", minute: "2-digit",
    });
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this chat?")) return;
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete chat");
      setChats(chats.filter((chat) => chat._id !== chatId));
    } catch (err) {
      console.error("Error deleting chat:", err);
      toast.error("Failed to delete chat");
    }
  };

  const handleNewChat = () => navigate("/chat/new");

  if (!isLoaded) return <div className="history-container"><div className="loading">Loading...</div></div>;

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", accent: "var(--accent)",
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: t.bg }}>
      <Navbar />
      <div className="flex-4 flex overflow-hidden pt-16">
        <div className="history-container">
          <div className="history-header">
            <h1>Chat History</h1>
            <button className="new-chat-btn" onClick={handleNewChat}><Plus size={20} /> New Chat</button>
          </div>

          {loading && <div className="loading">Loading chats...</div>}
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && chats.length === 0 && (
            <div className="empty-state">
              <MessageSquare size={48} />
              <h2>No chats yet</h2>
              <p>Start a new conversation to begin</p>
              <button className="new-chat-btn" onClick={handleNewChat}><Plus size={20} /> Create First Chat</button>
            </div>
          )}

          {!loading && !error && chats.length > 0 && (
            <div className="chats-list">
              {chats.map((chat) => (
                <div key={chat._id} className="chat-item" onClick={() => navigate(`/chat/${chat._id}`)}>
                  <div className="chat-info">
                    <h3 className="chat-title">{chat.title}</h3>
                    <p className="chat-date">{formatDate(chat.createdAt)}</p>
                    <p className="chat-preview">{chat.messages.length} message{chat.messages.length !== 1 ? "s" : ""}</p>
                  </div>
                  <button className="delete-btn" onClick={(e) => handleDeleteChat(chat._id, e)}>
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
