import { useState, useEffect } from "react";
import socket from "./socket";
import WelcomeScreen from "./components/WelcomeScreen";
import ChatScreen from "./components/ChatScreen";

function App() {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState({ count: 0, users: [] });

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