import { useState, useEffect, useRef } from "react";
import socket from "./socket";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatScreen from "./components/ChatScreen";

function App() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({ count: 0, users: [] });
  const readTimeoutsRef = useRef({});

  // Handle a user joining the chat space
  const handleJoin = (chosenUsername) => {
    setUsername(chosenUsername);
    socket.emit("join_chat", chosenUsername);
  };

  // Handle sending a regular chat message
  const handleSendMessage = (messageText) => {
    socket.emit("send_message", messageText);
  };

  useEffect(() => {
    // Listen for incoming messages (chat or system)
    socket.on("receive_message", (messagePayload) => {
      setMessages((prev) => [...prev, messagePayload]);
    });

    // Listen for live online user list updates
    socket.on("online_users", (usersData) => {
      setOnlineUsers(usersData);
    });

    // Clean up connections on unmount to prevent listener duplication
    return () => {
      socket.off("receive_message");
      socket.off("online_users");
    };
  }, []);

  // Listen for message delivery/read updates from server
  useEffect(() => {
    const onDelivered = ({ messageId, username: deliveredBy }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, deliveredBy: Array.from(new Set([...(m.deliveredBy || []), deliveredBy])) }
            : m
        )
      );
    };

    const onRead = ({ messageId, username: reader }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, readBy: Array.from(new Set([...(m.readBy || []), reader])) }
            : m
        )
      );
    };

    socket.on("message_delivered", onDelivered);
    socket.on("message_read", onRead);

    return () => {
      socket.off("message_delivered", onDelivered);
      socket.off("message_read", onRead);
    };
  }, []);

  // Emit delivered/read receipts for incoming messages
  useEffect(() => {
    if (!username) return;

    messages.forEach((m) => {
      if (m.type !== "chat") return;
      if (m.sender === username) return; // don't ack own messages

      // Emit delivered if we haven't already
      const alreadyDelivered = (m.deliveredBy || []).includes(username);
      if (!alreadyDelivered) {
        socket.emit("delivered", { messageId: m.id });
      }

      // Schedule a read receipt shortly after delivery (simulates user viewing)
      const alreadyRead = (m.readBy || []).includes(username);
      if (!alreadyRead && !readTimeoutsRef.current[m.id]) {
        readTimeoutsRef.current[m.id] = setTimeout(() => {
          socket.emit("read", { messageId: m.id });
          delete readTimeoutsRef.current[m.id];
        }, 800);
      }
    });

    return () => {
      // clear any scheduled read timeouts when messages change
      Object.values(readTimeoutsRef.current).forEach((t) => clearTimeout(t));
      readTimeoutsRef.current = {};
    };
  }, [messages, username]);

  return (
    <>
      {!username ? (
        <WelcomeScreen onJoin={handleJoin} />
      ) : (
        <ChatScreen
          username={username}
          messages={messages}
          onlineUsers={onlineUsers}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
}

export default App;