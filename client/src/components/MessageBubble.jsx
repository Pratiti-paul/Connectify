import { memo } from "react";

const MessageBubble = memo(({ message, currentUsername, onEdit, onDelete }) => {
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

          {/* Receipts for messages sent by the current user */}
          {isSent && (
            <>
              <div className="receipts">
                {message.deliveredBy && message.deliveredBy.length > 0 && (
                  <span className="receipt-item">✓ {message.deliveredBy.length} delivered</span>
                )}
                {message.readBy && message.readBy.length > 0 && (
                  <span className="receipt-item">✓✓ {message.readBy.length} read</span>
                )}
              </div>

              <div className="message-actions">
                <button className="action-btn" onClick={onEdit} aria-label="Edit message">✎</button>
                <button className="action-btn danger" onClick={onDelete} aria-label="Delete message">🗑</button>
              </div>
            </>
          )}
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

        .receipts {
          display: flex;
          gap: 8px;
          margin-top: 6px;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.8);
          opacity: 0.85;
        }

        .receipt-item {
          background: rgba(255,255,255,0.04);
          padding: 4px 8px;
          border-radius: 9999px;
          font-weight: 600;
        }

        .message-actions {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          justify-content: flex-end;
        }

        .action-btn {
          background: rgba(255,255,255,0.03);
          border: none;
          color: var(--text-secondary);
          padding: 6px 8px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
        }

        .action-btn:hover { filter: brightness(1.1); }

        .action-btn.danger { background: rgba(220,38,38,0.08); color: #fca5a5; }

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
