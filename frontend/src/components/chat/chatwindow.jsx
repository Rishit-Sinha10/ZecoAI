import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, MessageSquare, Brain, Loader2, ChevronRight } from "lucide-react";
import Navbar from "../common/navbar";
import MessageBubble from "../ai/MessageBubble";
import PromptInput from "../ai/PromptInput";
import useAuth from "../../hooks/useAuth";

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;

function ChatWindow() {
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (isSignedIn) fetchChats();
    else {
      setLoadingChats(false);
      const local = JSON.parse(localStorage.getItem("zeco_chats") || "[]");
      setChats(local);
    }
  }, [isSignedIn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const token = await getToken();
      if (!token) { setLoadingChats(false); return; }
      const res = await fetch(`${API_BASE}/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data.chats || []);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoadingChats(false);
    }
  };

  const createNewChat = async () => {
    const newChat = {
      _id: `local_${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };

    if (isSignedIn) {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/chats`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ messages: [] }),
        });
        if (res.ok) {
          const data = await res.json();
          newChat._id = data.chat._id;
          newChat.title = data.chat.title;
        }
      } catch (err) {
        console.error("Failed to create chat on server:", err);
      }
    }

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat);
    setMessages([]);
    if (!isSignedIn) {
      const updated = [newChat, ...chats];
      localStorage.setItem("zeco_chats", JSON.stringify(updated));
    }
  };

  const selectChat = async (chat) => {
    setActiveChat(chat);

    if (isSignedIn && !chat._id.startsWith("local_")) {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE}/chats/${chat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.chat.messages || []);
          return;
        }
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    }
    setMessages(chat.messages || []);
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm("Delete this chat?")) return;

    if (isSignedIn && !chatId.startsWith("local_")) {
      try {
        const token = await getToken();
        await fetch(`${API_BASE}/chats/${chatId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.error("Failed to delete on server:", err);
      }
    }

    setChats((prev) => prev.filter((c) => c._id !== chatId));
    if (activeChat?._id === chatId) {
      setActiveChat(null);
      setMessages([]);
    }
    if (!isSignedIn) {
      const updated = chats.filter((c) => c._id !== chatId);
      localStorage.setItem("zeco_chats", JSON.stringify(updated));
    }
  };

  const callAI = async (prompt) => {
    const res = await fetch(`${API_BASE}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "", prompt }),
    });
    const data = await res.json();
    if (data.success) return data.reply;
    return `Error: ${data.message || "AI request failed"}`;
  };

  const handleSubmitMessage = async (userInput) => {
    if (!userInput.trim() || !activeChat) return;

    const userMsg = { role: "user", content: userInput, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const aiResponse = await callAI(userInput);
      const aiMsg = { role: "assistant", content: aiResponse, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);

      const updatedMessages = [...messages, userMsg, aiMsg];

      if (isSignedIn && !activeChat._id.startsWith("local_")) {
        try {
          const token = await getToken();
          await fetch(`${API_BASE}/chats/${activeChat._id}/message`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ role: "user", content: userInput }),
          });
          await fetch(`${API_BASE}/chats/${activeChat._id}/message`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ role: "assistant", content: aiResponse }),
          });
        } catch (err) {
          console.error("Failed to persist messages:", err);
        }
      }

      const updatedChat = { ...activeChat, messages: updatedMessages, title: activeChat.title === "New Chat" ? userInput.substring(0, 50) : activeChat.title };
      setActiveChat(updatedChat);
      setChats((prev) => prev.map((c) => c._id === activeChat._id ? updatedChat : c));

      if (!isSignedIn) {
        const allChats = chats.map((c) => c._id === activeChat._id ? updatedChat : c);
        localStorage.setItem("zeco_chats", JSON.stringify(allChats));
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err.message}`, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", accent: "var(--accent)",
  };

  return (
    <div className="h-screen w-screen flex flex-col" style={{ backgroundColor: t.bg }}>
      <Navbar />
      <div className="flex-1 flex overflow-hidden pt-16">
        <div className="flex-1 flex overflow-hidden">
          {/* Chat list sidebar */}
          <div className="w-64 flex flex-col shrink-0" style={{ borderRight: `1px solid ${t.border}`, backgroundColor: t.bg2 }}>
            <div className="p-3" style={{ borderBottom: `1px solid ${t.border}` }}>
              <button onClick={createNewChat}
                className="w-full flex items-center justify-center gap-2 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "var(--accent)" }}>
                <Plus size={16} />New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {loadingChats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={16} className="animate-spin" style={{ color: t.text3 }} />
                </div>
              ) : chats.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <MessageSquare size={24} className="mx-auto mb-2" style={{ color: t.text3, opacity: 0.3 }} />
                  <p className="text-xs" style={{ color: t.text3 }}>No chats yet</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div key={chat._id}
                    onClick={() => selectChat(chat)}
                    className="flex items-center gap-2 px-3 py-2.5 mx-1 rounded-md cursor-pointer transition-colors group"
                    style={{
                      backgroundColor: activeChat?._id === chat._id ? "var(--accent-light)" : "transparent",
                      color: activeChat?._id === chat._id ? "var(--accent)" : "var(--text-secondary)",
                    }}
                    onMouseEnter={(e) => { if (activeChat?._id !== chat._id) e.currentTarget.style.backgroundColor = "var(--bg-tertiary)"; }}
                    onMouseLeave={(e) => { if (activeChat?._id !== chat._id) e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <MessageSquare size={14} className="shrink-0" />
                    <span className="text-sm truncate flex-1">{chat.title || "New Chat"}</span>
                    <button onClick={(e) => deleteChat(chat._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity"
                      style={{ color: t.text3 }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {!activeChat ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="rounded-full p-4 mb-4" style={{ backgroundColor: t.bg3 }}>
                  <Brain size={40} style={{ color: "#fbbf24" }} />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: t.text }}>ZecoAI Chat</h2>
                <p className="text-sm mb-6 max-w-md" style={{ color: t.text3 }}>
                  Ask questions, get code explanations, debug errors, or brainstorm ideas.
                </p>
                <button onClick={createNewChat}
                  className="flex items-center gap-2 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: "var(--accent)" }}>
                  <Plus size={18} />Start a Conversation
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <Brain size={32} className="mb-3" style={{ color: "#fbbf24", opacity: 0.5 }} />
                      <p className="text-sm" style={{ color: t.text3 }}>Ask me anything about code...</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, i) => (
                        <MessageBubble key={i} message={msg} isUser={msg.role === "user"} />
                      ))}
                      {isLoading && (
                        <div className="flex justify-start mb-4">
                          <div className="rounded-lg px-4 py-3" style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}` }}>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#fbbf24" }} />
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#fbbf24", animationDelay: "0.1s" }} />
                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#fbbf24", animationDelay: "0.2s" }} />
                              </div>
                              <span className="text-xs" style={{ color: t.text3 }}>Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
                <PromptInput onSubmit={handleSubmitMessage} isLoading={isLoading} placeholder="Ask ZecoAI something..." />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
