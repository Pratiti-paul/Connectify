import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function MessageList({ messages, currentUsername }) {
  const scrollEndRef = useRef(null);

  // Auto-scroll logic: triggered whenever a new message is appended
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="messages-viewport" aria-label="Conversation message history">
      {messages.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✨</span>
          <p className="empty-title">The workspace is clear</p>
          <p className="empty-subtitle">Send a message below to kickstart the conversation!</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            currentUsername={currentUsername}
          />
        ))
      )}
      
      {/* Scroll anchor element */}
      <div ref={scrollEndRef} className="scroll-anchor" aria-hidden="true" />

      <style>{`
        .messages-viewport {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          background-color: rgba(15, 23, 42, 0.25);
          /* Smooth scroll container behaviors */
          scroll-behavior: smooth;
        }

        .scroll-anchor {
          height: 1px;
          margin-top: -1px;
          pointer-events: none;
        }

        /* Empty state styling */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: auto;
          text-align: center;
          padding: 32px;
          animation: fadeIn 0.4s ease-out;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
          display: inline-block;
          animation: pulse 3s infinite ease-in-out;
        }

        .empty-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .empty-subtitle {
          font-size: 0.85rem;
          color: var(--text-secondary);
          max-width: 240px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}

export default MessageList;
