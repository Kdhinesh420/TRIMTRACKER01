// index.js — Fixed Version
import { configDotenv } from "dotenv";
configDotenv(); // ← FIRST LINE — env load aaganum

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routers/auth.router.js";
import salonRouter from "./routers/salon.router.js";
import queueRouter from "./routers/queue.router.js";

const app = express();
const PORT = process.env.PORT || 8000; // ← ONE PORT only
const MONGO_URL = process.env.MONGO_URL;

// MongoDB Connect
export const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Connected to MongoDB ✅");

// Middleware
app.use(express.json());
app.use(cors());

// Socket.io Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] },
});
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id} 📲`);
  socket.on("joinSalon", (salonId) => {
    socket.join(salonId);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected ❌");
  });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/salons", salonRouter);
app.use("/api/queue", queueRouter);

app.get("/", (req, res) => {
  res.send({ message: "TrimTracker Backend is Live! 💈✂️", status: "Running" });
});

// ← ONE LISTEN only
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT} 🚀`);
});

export default app; // ← ESM export, not module.exports
