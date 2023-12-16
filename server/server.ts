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

const PORT = 3000;

app.get("/", (_req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket: Socket) => {
  console.log("A user connected", socket.id);

  socket.emit("message", `Welcome to the server! - ${socket.id}`);

  socket.on("editor-changes", (content: string) => {
    socket.broadcast.emit("editor-changes", content);
  });

  socket.on("clientMessage", async (message: string) => {
    console.log(`Received message from client: ${message}`);

    // const client = await setupDb();

    try {
      // const res = await client.query("SELECT * FROM notes");
      // io.emit("notes", res.rows);
    } catch (error) {
      console.error("Error performing database operations:", error);
    } finally {
      // if (client) {
      //   client.release();
      // }
    }
  });
});

const handleShutdown = async () => {
  console.log("Shutting down gracefully...");

  // const client = await setupDb();

  try {
    // console.log("Stopping and removing Docker container...");
    // await new Promise<void>((resolve, reject) => {
    //   import("node:child_process").then(({ exec }) => {
    //     exec("pnpm docker-down", (error, stdout, stderr) => {
    //       if (error) {
    //         console.error(`exec error: ${error}`);
    //         reject();
    //       }
    //       resolve();
    //       console.log(`stdout: ${stdout}`);
    //       console.error(`stderr: ${stderr}`);
    //     });
    //   });
    // });
  } finally {
    // if (client) {
    //   client.release();
    // }
    console.log("Server shut down successfully.");

    process.exit(0);
  }

  // ...
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
