import { useState, useRef, useEffect } from "react";
import MessageList from "./MessageList";

function ChatScreen({ username, messages, onlineUsers, onSendMessage }) {
  const [typedMessage, setTypedMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const inputRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    const text = typedMessage.trim();
    if (!text) return;

    onSendMessage(text);
    setTypedMessage("");

    // Maintain focus on the input box after sending so user can keep typing immediately
    inputRef.current?.focus();
  };

  // Close sidebar drawer on screen resize if it crosses desktop threshold
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="chat-container">
      {/* Header section with glassmorphism */}
      <header className="chat-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle user list"
          >
            ☰
          </button>
          <span className="logo-icon">💬</span>
          <h2>Connectify</h2>
          <div className="live-pill">
            <span className="live-dot"></span>
            <span className="live-label">LIVE</span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="users-count-badge" onClick={() => setSidebarOpen(!sidebarOpen)}>
            👤 {onlineUsers.count} {onlineUsers.count === 1 ? "User" : "Users"} Online
          </div>
        </div>
      </header>

      {/* Main chat layout */}
      <div className="chat-body">
        {/* Sidebar displaying online users list */}
        <aside className={`chat-sidebar ${sidebarOpen ? "sidebar-mobile-open" : ""}`}>
          <div className="sidebar-header">
            <h3>Active Members</h3>
            <span className="count-pill">{onlineUsers.count}</span>
          </div>
          
          <ul className="users-list">
            {onlineUsers.users.map((user, idx) => {
              const isSelf = user === username;
              return (
                <li key={`user-${idx}`} className={`user-item ${isSelf ? "self-item" : ""}`}>
                  <span className="user-dot"></span>
                  <span className="user-name">
                    {user} {isSelf && <span className="self-tag">(You)</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Overlay backdrop when mobile drawer is open */}
        {sidebarOpen && (
          <div 
            className="sidebar-backdrop" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Message feed and input area */}
        <main className="chat-main">
          <MessageList messages={messages} currentUsername={username} />

          {/* Form container for inputs */}
          <form onSubmit={handleSend} className="chat-input-bar">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a secure message..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              className="chat-input-field"
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="chat-send-btn" 
              disabled={!typedMessage.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" className="send-icon">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </main>
      </div>

      <style>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          max-width: 1024px;
          background-color: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: var(--border-radius-lg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          animation: fadeIn 0.3s ease-out;
        }

        /* Header design */
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-glass);
          background-color: rgba(30, 41, 59, 0.4);
          z-index: 10;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-primary);
          font-size: 1.3rem;
          cursor: pointer;
          padding: 4px;
          border-radius: var(--border-radius-sm);
          transition: var(--transition-smooth);
        }

        .sidebar-toggle:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .logo-icon {
          font-size: 1.4rem;
        }

        .chat-header h2 {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .live-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #22c55e;
          box-shadow: 0 0 8px #22c55e;
          display: inline-block;
        }

        .live-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: #22c55e;
          letter-spacing: 0.05em;
        }

        .users-count-badge {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .users-count-badge:hover {
          background-color: rgba(255, 255, 255, 0.09);
          color: var(--text-primary);
        }

        /* Body container */
        .chat-body {
          display: flex;
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        /* Sidebar Styling */
        .chat-sidebar {
          width: 260px;
          border-right: 1px solid var(--border-glass);
          background-color: rgba(30, 41, 59, 0.25);
          display: flex;
          flex-direction: column;
          transition: var(--transition-smooth);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-glass);
        }

        .sidebar-header h3 {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .count-pill {
          background-color: var(--accent-glow);
          border: 1px solid var(--accent-glow);
          color: var(--accent-secondary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .users-list {
          list-style: none;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: var(--border-radius-sm);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
        }

        .user-item:hover {
          background-color: rgba(255, 255, 255, 0.03);
          color: var(--text-primary);
        }

        .self-item {
          background-color: rgba(99, 102, 241, 0.06);
          border: 1px solid rgba(99, 102, 241, 0.1);
        }

        .self-item .user-name {
          color: var(--text-primary);
          font-weight: 600;
        }

        .user-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #22c55e;
          border: 1.5px solid var(--bg-primary);
          display: inline-block;
        }

        .self-tag {
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 400;
          margin-left: 4px;
        }

        /* Overlay Backdrop */
        .sidebar-backdrop {
          display: none;
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: 8;
        }

        /* Chat Core layout */
        .chat-main {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        /* Message input bottom bar */
        .chat-input-bar {
          display: flex;
          padding: 16px 24px;
          border-top: 1px solid var(--border-glass);
          background-color: rgba(30, 41, 59, 0.2);
          gap: 12px;
          align-items: center;
        }

        .chat-input-field {
          flex: 1;
          padding: 14px 18px;
          background-color: rgba(15, 23, 42, 0.5);
          border: 1px solid var(--border-glass);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          outline: none;
          transition: var(--transition-smooth);
        }

        .chat-input-field:focus {
          border-color: var(--accent-primary);
          background-color: rgba(15, 23, 42, 0.75);
          box-shadow: 0 0 0 2px var(--accent-glow);
        }

        .chat-send-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          background: var(--bubble-sent);
          color: white;
          border: none;
          border-radius: var(--border-radius-md);
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-neon);
        }

        .chat-send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        .chat-send-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .chat-send-btn:disabled {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
          box-shadow: none;
          color: var(--text-muted);
          cursor: not-allowed;
        }

        .send-icon {
          transform: rotate(0deg);
        }

        /* Responsive breakpoints */
        @media (max-width: 768px) {
          .chat-container {
            border-radius: 0;
            border: none;
            height: 100vh;
            max-width: 100%;
          }

          .sidebar-toggle {
            display: inline-block;
          }

          .chat-sidebar {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 9;
            transform: translateX(-100%);
            box-shadow: none;
            background-color: var(--bg-secondary);
          }

          .sidebar-mobile-open {
            transform: translateX(0);
            box-shadow: 10px 0 25px rgba(0, 0, 0, 0.5);
          }

          .sidebar-backdrop {
            display: block;
          }

          .chat-header {
            padding: 12px 16px;
          }

          .chat-input-bar {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatScreen;
