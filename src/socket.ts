import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on("message", (message) => {
  console.log("Server says:", message);
});

socket.on("notes", (notes) => {
  console.log("Received notes:", notes);
});

socket.emit("clientMessage", "Hello, server!");

export { socket };
