import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket: Socket) => {
  console.log("A user connected", socket.id);

  socket.emit("message", "Welcome to the server!");

  socket.on("clientMessage", (message: string) => {
    console.log(`Received message from client: ${message}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
