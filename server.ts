import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import pg from "pg";

const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const client = new pg.Client({
  user: "admin",
  host: "localhost",
  database: "notes",
  password: "admin1",
  port: 5432,
});

const PORT = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket: Socket) => {
  console.log("A user connected", socket.id);

  // Send a welcome message to the connected client
  socket.emit("message", `Welcome to the server! - ${socket.id}`);

  // Listen for messages from the client
  socket.on("clientMessage", async (message: string) => {
    console.log(`Received message from client: ${message}`);

    // Perform database operations here (e.g., save/update notes)
    // ...

    // Broadcast the updated notes to all connected clients
    const res = await client.query("SELECT * FROM notes");

    io.emit("notes", res.rows);
  });
});

async function setupDb() {
  try {
    await client.connect();

    console.log("Connected to database");
  } catch (error) {
    console.error("Error fetching notes from database", error);
    throw error;
  }
}

const handleShutdown = async () => {
  console.log("Shutting down gracefully...");

  await client.end();

  console.log("Stopping and removing Docker container...");
  await new Promise<void>((resolve, reject) => {
    import("node:child_process").then(({ exec }) => {
      exec("pnpm docker-down", (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          reject();
        }
        resolve();

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });
    });
  });

  console.log("Server shut down successfully.");
  process.exit(0);
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

server.listen(PORT, async () => {
  await setupDb();

  console.log(`Server is running on http://localhost:${PORT}`);
});
