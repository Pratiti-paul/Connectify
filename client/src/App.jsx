import { useEffect } from "react";
import socket from "./socket";

function App() {
  useEffect(() => {
    console.log("Frontend Connected");

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <div>
      <h1>Connectify 💬</h1>
      <p>My first chat application</p>
    </div>
  );
}

export default App;