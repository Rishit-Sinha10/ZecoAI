import { useState, useEffect, useRef } from "react";
import { Brain, X } from "lucide-react";
import MessageBubble from "./MessageBubble";
import PromptInput from "./PromptInput";
const trimTo100Words = (text) => {
  const words = text.split(/\s+/);
  if (words.length > 100) return words.slice(0, 100).join(" ") + "...";
  return text;
};
function AIChat({ activeFile, onClose}) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const callAIApi = async (code, prompt) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, prompt }),
      });
      const data = await response.json();
      if (data.success) return data.reply;
      return `Error: ${data.message || "Failed to get AI response"}`;
    } catch (error) {
      return `Connection error: Unable to reach AI service. ${error.message}`;
    }
  };
  const handleSubmitMessage = async (userInput) => {
    if (!userInput.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: userInput, timestamp: new Date() }]);
    setIsLoading(true);
    const codeContent = activeFile?.content || "";
    const aiResponseText = await callAIApi(codeContent, userInput);
    const trimmedResponse = trimTo100Words(aiResponseText);
    setMessages((prev) => [...prev, { role: "ai", content: trimmedResponse, timestamp: new Date() }]);
    setIsLoading(false);
  };
  const handleAnalyzeCode = () => {
    if (!activeFile?.content) return;
    const prompt = `Please analyze this code from ${activeFile.name}:\n\n\`\`\`\n${activeFile.content}\n\`\`\`\n\nProvide suggestions for improvements, potential bugs, and best practices.`;
    handleSubmitMessage(prompt);
  };

  const t = {
    bg: "var(--bg-primary)", bg2: "var(--bg-secondary)", bg3: "var(--bg-tertiary)",
    text: "var(--text-primary)", text2: "var(--text-secondary)", text3: "var(--text-tertiary)",
    border: "var(--border)", borderStrong: "var(--border-strong)", accent: "var(--accent)",
  };

  return (
    <div className="flex flex-col h-full rounded overflow-hidden" style={{ backgroundColor: t.bg, border: `1px solid ${t.border}` }}>
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${t.border}`, backgroundColor: t.bg3 }}>
        <div className="flex items-center gap-2">
          <Brain size={20} style={{ color: "#fbbf24" }} />
          <div>
            <h3 className="text-sm font-semibold" style={{ color: t.text }}>ZecoAI Assistant</h3>
            <p className="text-xs" style={{ color: t.text3 }}>{activeFile ? `Analyzing ${activeFile.name}` : "Ready to help"}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg transition-colors" style={{ color: t.text3 }} title="Close chat">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="rounded-full p-3 mb-4" style={{ backgroundColor: t.bg3 }}>
              <Brain size={32} style={{ color: "#fbbf24" }} />
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: t.text }}>Welcome to ZecoAI</h2>
            <p className="text-sm mb-6 max-w-xs" style={{ color: t.text3 }}>Ask me anything about your code. I can help with:</p>
            <ul className="text-xs space-y-1 mb-6" style={{ color: t.text3 }}>
              <li>Code reviews and improvements</li>
              <li>Bug detection and fixes</li>
              <li>Performance optimization</li>
              <li>Best practices</li>
            </ul>
            {activeFile && (
              <button onClick={handleAnalyzeCode} className="mt-4 flex items-center gap-2 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium" style={{ backgroundColor: "var(--accent)" }}>
                <Brain size={16} />Analyze Current File
              </button>
            )}
          </div>
        ) : (
          <>
            {messages.map((message, index) => (<MessageBubble key={index} message={message} isUser={message.role === "user"} />))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="rounded-lg rounded-bl-none px-4 py-3" style={{ backgroundColor: t.bg3, border: `1px solid ${t.border}` }}>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#fbbf24" }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#fbbf24", animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#fbbf24", animationDelay: "0.2s" }} />
                    </div>
                    <span className="text-xs" style={{ color: t.text3 }}>ZecoAI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <PromptInput onSubmit={handleSubmitMessage} isLoading={isLoading}
        placeholder={activeFile ? `Ask about ${activeFile.name}...` : "Ask ZecoAI something..."} />
    </div>
  );
}

export default AIChat;
