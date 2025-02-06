import express from "express";
import cors from "cors";
import cloudinary from "cloudinary";
import multer from "multer";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import { sendMessage } from "./sendMessage.js";
import { sendGroupMessage } from "./sendGroupMessage.js";
import { validate, verifyOtp } from "./signup.js";
import { validateLogin } from "./login.js";
import { verifyTk } from "./middleware/verifytk.js";
import { verifyResTk } from "./middleware/verifytk-res.js";
import { validatePassReset, validatePassResetOtp } from "./forgetPass.js";
import {
  getUsrDetails,
  getParticipantDetails,
  getSenderDetails,
  getGroupDetails,
} from "./handleUsrReqs.js";
import {
  getMessages,
  getMessageById,
  getGroupMessages,
} from "./getMessages.js";
import cookieParser from "cookie-parser";
import { protectRoute } from "./middleware/protectRoute.js";
import { initSocket } from "./socket.js";
import { changeUsername } from "./changeUsername.js";
import { changeDisplayname } from "./changeDisplayname.js";
import { changeBio } from "./changeBio.js";
import { changePfp } from "./changePfp.js";
import { editMsg } from "./editMessage.js";
import { deleteMsg } from "./deleteMessage.js";
import { findUser } from "./findUser.js";
import { blockUser, unblockUser } from "./blockUser.js";
import { createGroup, participantsGroup } from "./createGroup.js";
import { addToGroup } from "./addToGroup.js";
import { removeFromGroup } from "./removeFromGroup.js";
import { changeGroupAvatar } from "./changeGroupAvatar.js";
import { changeGroupName } from "./changeGroupName.js";
import { leaveGroup } from "./leaveGroup.js";

dotenv.config();

const app = express();
const port = 3000;
const server = http.createServer(app);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // Your React app
    credentials: true,
  },
});

initSocket(io);

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

// Routes
app.post("/login", (req, res) => validateLogin(req, res));
app.post("/signup", (req, res) => validate(req, res));
app.post("/signup/otp", (req, res) => verifyOtp(req, res));
app.post("/forget-password", (req, res) => validatePassReset(req, res));
app.post("/forget-password/otp", (req, res) => validatePassResetOtp(req, res));
app.post("/messages/:id", (req, res) => getMessages(req, res));
app.post("/messages/group/:id", (req, res) => getGroupMessages(req, res));
app.post("/message/byId", (req, res) => getMessageById(req, res));
app.post("/messages/send/:id", upload.single("file"), (req, res) =>
  sendMessage(req, res, io)
);
app.post("/messages/group/send/:id", upload.single("file"), (req, res) =>
  sendGroupMessage(req, res, io)
);
app.post("/group/create", (req, res) => createGroup(req, res, io));
app.post("/group/add", (req, res) => addToGroup(req, res, io));
app.post("/group/remove", (req, res) => removeFromGroup(req, res, io));
app.post("/group/leave", (req, res) => leaveGroup(req, res, io));
app.post("/group/change/pfp", upload.single("groupPic"), (req, res, io) =>
  changeGroupAvatar(req, res)
);
app.post("/group/change/name", (req, res) => changeGroupName(req, res, io));
app.post("/group/participants", (req, res) => participantsGroup(req, res));
app.post("/message/edit", (req, res) => editMsg(req, res));
app.post("/message/delete", (req, res) => deleteMsg(req, res));
app.post("/finduser", (req, res) => findUser(req, res));
app.post("/verify-user", (req, res) => protectRoute(req, res));
app.post("/usr/details", (req, res) => getUsrDetails(req, res));
app.post("/participant/details", (req, res) => getParticipantDetails(req, res));
app.post("/participant/groups", (req, res) => getGroupDetails(req, res));
app.post("/sender/details", (req, res) => getSenderDetails(req, res));
app.post("/blockuser", (req, res) => blockUser(req, res));
app.post("/unblockuser", (req, res) => unblockUser(req, res));
app.post("/change/username", (req, res) => changeUsername(req, res));
app.post("/change/displayname", (req, res) => changeDisplayname(req, res));
app.post("/change/bio", (req, res) => changeBio(req, res));
app.post("/change/pfp", upload.single("profilePic"), (req, res) =>
  changePfp(req, res)
);
app.post("/verifytk", async (req, res) => verifyTk(req, res));
app.post("/verify-res-tk", async (req, res) => verifyResTk(req, res));

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
