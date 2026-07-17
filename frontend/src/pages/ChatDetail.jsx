import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageSquare, ArrowLeft } from "lucide-react";
import Navbar from "../components/common/navbar";
import Sidebar from "../components/common/sidebar";
import { useToast } from "../context/ToastContext";
import "./ChatDetail.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ChatDetail() {
  const { id } = useParams();
  const { isLoaded, userId, getToken } = useAuth();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoaded || !userId) return;
    if (id === "new") { setChat({ _id: "new", title: "New Chat", messages: [] }); setLoading(false); return; }

    const fetchChat = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await fetch(`${API_URL}/api/chats/${id}?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch chat");
        const data = await response.json();
        setChat(data.chat);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchChat();
  }, [isLoaded, userId, id, getToken]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      setSending(true);
      const token = await getToken();

      if (id === "new" || !chat._id || chat._id === "new") {
        const createResponse = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userId, messages: [{ role: "user", content: newMessage }] }),
        });
        if (!createResponse.ok) throw new Error("Failed to create chat");
        const createData = await createResponse.json();
        setChat(createData.chat);
        navigate(`/chat/${createData.chat._id}`, { replace: true });
        setNewMessage("");
        setSending(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/chats/${id}/message`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, role: "user", content: newMessage }),
      });
      if (!response.ok) throw new Error("Failed to add message");
      const data = await response.json();
      setChat(data.chat);
      setNewMessage("");
      setTimeout(() => {
        const mc = document.querySelector(".messages-container");
        if (mc) mc.scrollTop = mc.scrollHeight;
      }, 100);
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    } finally { setSending(false); }
  };

  if (!isLoaded) return <div className="chat-detail-container">Loading...</div>;
  if (loading) return <div className="chat-detail-container">Loading chat...</div>;
  if (error) return (
    <div className="chat-detail-container">
      <div className="error-state"><p>{error}</p><button onClick={() => navigate("/history")}>Back to History</button></div>
    </div>
  );
  if (!chat) return (
    <div className="chat-detail-container">
      <div className="error-state"><p>Chat not found</p><button onClick={() => navigate("/history")}>Back to History</button></div>
    </div>
  );

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text3: "var(--text-tertiary)", border: "var(--border)", accent: "var(--accent)",
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: t.bg }}>
      <Navbar />
      <div className="flex-1 flex overflow-hidden pt-16">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ backgroundColor: t.bg }}>
          <div className="chat-header">
            <button className="back-btn" onClick={() => navigate("/history")} title="Back to history"><ArrowLeft size={20} /></button>
            <h1>{chat.title}</h1>
            <div style={{ width: "40px" }} />
          </div>
          <div className="messages-container">
            {chat.messages.length === 0 ? (
              <div className="empty-messages"><MessageSquare size={48} /><p>No messages yet</p></div>
            ) : (
              <div className="messages">
                {chat.messages.map((msg, idx) => (
                  <div key={idx} className={`message message-${msg.role}`}>
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">{new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <form className="message-input-form" onSubmit={handleSendMessage}>
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." disabled={sending} className="message-input" />
            <button type="submit" disabled={sending || !newMessage.trim()} className="send-btn">
              {sending ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatDetail;
