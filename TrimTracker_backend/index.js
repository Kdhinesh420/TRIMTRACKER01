//====
// index.js — Main Server Entry Point
// TrimTracker Backend with Socket.io Integration
//====

import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import http from "http";
import { Server } from "socket.io"; // Socket.io server logic!

// Load environment variables (.env file-la irukka data)
configDotenv()


// Create Express App
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL;

// ---- 1. CONNECT TO MONGODB ----
// client-a export pannuvom, so services-la use pannuvom
export const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Connected to MongoDB ✅");

// ---- 2. MIDDLEWARE ----
app.use(express.json()); // Body-la JSON-a parsu pannuvom
app.use(cors());         // All domains allow pannuvom (Frontend connection-ku!)

// ---- 3. SOCKET.IO SETUP ----
// http server create pannuvom based on express app
const server = http.createServer(app);

// Socket.io initialization with CORS allowed
const io = new Server(server, {
  cors: {
    origin: "*", // React frontend connection allow pannuvom
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// App level-la io-va register pannuvom — controllers-la use panna!
app.set("socketio", io);

// Socket.io Connection Event — Room join logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id} 📲`);

  // Room logic: "Join a room based on salon ID"
  // Example: socket.join('salon_abc123') — so only antha salon updates varum
  socket.on("joinSalon", (salonId) => {
    socket.join(salonId);
    console.log(`Socket ${socket.id} joined Salon Room: ${salonId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected ❌");
  });
});

// ---- 4. ROUTER INTEGRATION ----
import authRouter from "./routers/auth.router.js";
import salonRouter from "./routers/salon.router.js";
import queueRouter from "./routers/queue.router.js";
import { configDotenv } from "dotenv";

// Mount models to specific endpoints
app.use("/api/auth", authRouter);
app.use("/api/salons", salonRouter);
app.use("/api/queue", queueRouter);

// Basic Welcome Route
app.get("/", (req, res) => {
  return res.send({
    message: "TrimTracker SaaS Backend is Live! 💈✂️",
    status: "Running",
  });
});

// ---- 5. START SERVER ----
server.listen(PORT, () => {
  console.log(`Server is Running on port: ${PORT} 🚀`);
});
