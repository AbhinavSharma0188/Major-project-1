import express from "express";

import {
    comment,
    getAllPosts,
    like,
    savedPost,
    uploadPost,
} from "../controllers/post.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const postRouter = express.Router();

// Upload a post
postRouter.post("/upload", isAuth, upload.single("media"), uploadPost);

// Get all posts
postRouter.get("/getAll", isAuth, getAllPosts);

// Like / Unlike a post
postRouter.get("/like/:postId", isAuth, like);

// Save / Unsave a post
postRouter.get("/saved/:postId", isAuth, savedPost);

// Comment on a post
postRouter.post("/comment/:postId", isAuth, comment);

export default postRouter;
