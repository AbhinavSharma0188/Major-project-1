import express from "express";
import {
    getAllMessages,
    getPreviousUserChats,
    sendMessage
} from "../controllers/message.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const messageRouter = express.Router();

// Send a message (with optional image)
messageRouter.post("/send/:receiverId", isAuth, upload.single("image"), sendMessage);

// Get previous user chats for logged-in user
messageRouter.get("/prevChats", isAuth, getPreviousUserChats);

// Get all messages between logged-in user and a receiver
messageRouter.get("/getall/:receiverId", isAuth, getAllMessages);

export default messageRouter;
