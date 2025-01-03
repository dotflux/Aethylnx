import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import http from "http";
import { sendMessage } from "./sendMessage.js";
import { validate, verifyOtp, verifyInProgress } from "./signup.js";
import { validateLogin } from "./login.js";
import {
  validatePassReset,
  resetPassInProgress,
  validatePassResetOtp,
} from "./forgetPass.js";
import {
  getUsrDetails,
  getParticipantDetails,
  getSenderDetails,
} from "./handleUsrReqs.js";
import { getMessages } from "./getMessages.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { protectRoute } from "./middleware/protectRoute.js";
import { userModel } from "./models/userModel.js";

dotenv.config();
const app = express();
const port = 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle receiving a new message
  socket.on("send_message", (data) => {
    io.emit("receive_message", data); // Broadcast to all connected clients
  });

  socket.on("user_online", async (userId) => {
    try {
      const user = await userModel.findById(userId);
      if (user) {
        await userModel.updateOne(
          { _id: userId },
          { $set: { isActive: true } }
        ); // Set isActive to true when online
        await user.save();
        console.log(`${user.username} is online`);
      }
    } catch (error) {
      console.log("Error updating user status:", error);
    }
  });

  socket.on("user_offline", async (userId) => {
    try {
      const user = await userModel.findById(userId);
      if (user) {
        await userModel.updateOne(
          { _id: userId },
          { $set: { isActive: false } }
        ); // Set isActive to false when offline
        await user.save();
        console.log(`${user.username} is offline`);
      }
    } catch (error) {
      console.log("Error updating user status:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.post("/login", (req, res) => {
  validateLogin(req, res);
});

app.post("/signup", (req, res) => {
  validate(req, res);
});

app.post("/signup/otp", (req, res) => {
  verifyOtp(req, res);
});

app.post("/forget-password", (req, res) => {
  validatePassReset(req, res);
});

app.post("/forget-password/otp", (req, res) => {
  validatePassResetOtp(req, res);
});

app.post("/messages/:id", (req, res) => {
  getMessages(req, res);
});

app.post("/messages/send/:id", (req, res) => {
  sendMessage(req, res);
});

app.post("/verify-user", (req, res) => {
  protectRoute(req, res);
});

app.post("/usr/details", (req, res) => {
  getUsrDetails(req, res);
});

app.post("/participant/details", (req, res) => {
  getParticipantDetails(req, res);
});

app.post("/sender/details", (req, res) => {
  getSenderDetails(req, res);
});

app.post("/verifytk", async (req, res) => {
  const token = req.cookies.signupToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const check = await verifyInProgress(decoded.id);
      if (check) {
        res.status(200).json({ valid: true, email: check.email });
        return;
      }
    } catch (err) {
      res.status(400).json({ valid: false, error: "Invalid Token" });
      return;
    }
  }
  res.status(404).json({ valid: false, error: "No Token" });
  return;
});

app.post("/verify-res-tk", async (req, res) => {
  const token = req.cookies.forgetpassToken;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const check = await resetPassInProgress(decoded.id);
      if (check) {
        res.status(200).json({ valid: true, email: check.email });
        return;
      }
    } catch (err) {
      res.status(400).json({ valid: false, error: "Invalid Token" });
      return;
    }
  }
  res.status(404).json({ valid: false, error: "No Token" });
  return;
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
