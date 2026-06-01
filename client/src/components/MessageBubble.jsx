import { memo } from "react";

const MessageBubble = memo(({ message, currentUsername }) => {
  const { type, sender, text, timestamp } = message;
  const isSent = type === "chat" && sender === currentUsername;

  // Localized client-side timestamp formatting
  const formatTime = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  // Render system notifications (joins, leaves, welcomes)
  if (type === "system") {
    return (
      <div className="message-row system-row">
        <div className="system-pill">
          <span className="system-icon">ℹ️</span>
          <span className="system-text">{text}</span>
        </div>
      </div>
    );
  }

  // Render regular chat message bubbles
  return (
    <div className={`message-row ${isSent ? "sent-row" : "received-row"}`}>
      <div className="bubble-wrapper">
        {/* Only render sender username above received bubbles to keep UI clean */}
        {!isSent && <span className="bubble-sender">{sender}</span>}
        
        <div className={`message-bubble ${isSent ? "bubble-sent-style" : "bubble-received-style"}`}>
          <p className="bubble-text">{text}</p>
          <span className="bubble-time">{formatTime(timestamp)}</span>
        </div>
      </div>

      <style>{`
        .message-row {
          display: flex;
          width: 100%;
          margin-bottom: 16px;
          animation: fadeIn 0.25s ease-out;
        }

        .sent-row {
          justify-content: flex-end;
        }

        .received-row {
          justify-content: flex-start;
        }

        .system-row {
          justify-content: center;
          margin: 20px 0;
        }

        /* System notification pill styling */
        .system-pill {
          background-color: var(--bubble-system);
          border: 1px solid var(--border-glass);
          padding: 6px 16px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 8px;
          max-width: 85%;
        }

        .system-icon {
          font-size: 0.85rem;
        }

        .system-text {
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          text-align: center;
        }

        /* Bubble wrappers */
        .bubble-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 70%;
        }

        .sent-row .bubble-wrapper {
          align-items: flex-end;
        }

        .received-row .bubble-wrapper {
          align-items: flex-start;
        }

        .bubble-sender {
          color: var(--accent-secondary);
          font-size: 0.75rem;
          font-weight: 600;
          margin-left: 12px;
          margin-bottom: 4px;
          letter-spacing: 0.02em;
        }

        /* Core bubbles */
        .message-bubble {
          padding: 12px 16px;
          border-radius: var(--border-radius-lg);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
          word-break: break-word;
        }

        .bubble-sent-style {
          background: var(--bubble-sent);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .bubble-received-style {
          background-color: var(--bubble-received);
          color: var(--text-primary);
          border: 1px solid var(--border-glass);
          border-bottom-left-radius: 4px;
        }

        .bubble-text {
          font-size: 0.95rem;
          line-height: 1.45;
          font-weight: 400;
        }

        .bubble-time {
          font-size: 0.68rem;
          align-self: flex-end;
          opacity: 0.75;
          margin-top: 2px;
          font-weight: 500;
        }

        .bubble-sent-style .bubble-time {
          color: rgba(255, 255, 255, 0.8);
        }

        .bubble-received-style .bubble-time {
          color: var(--text-muted);
        }

        @media (max-width: 480px) {
          .bubble-wrapper {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
});

// Set display name for better debugging in React Developer Tools
MessageBubble.displayName = "MessageBubble";

export default MessageBubble;
