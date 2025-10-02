import express from "express";
import { comment, getAllLoops, like, uploadLoop } from "../controllers/loop.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const loopRouter = express.Router();

// Upload a loop
loopRouter.post("/upload", isAuth, upload.single("media"), uploadLoop);

// Like / Unlike a loop
loopRouter.put("/like/:loopId", isAuth, like);

// Get all loops of logged-in user (or public feed if you want)
loopRouter.get("/getall", isAuth, getAllLoops);

// Comment on a loop
loopRouter.post("/comment/:loopId", isAuth, comment);

export default loopRouter;
