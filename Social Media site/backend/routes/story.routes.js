import express from "express";
import { getAllStories, getStoryByusername, uploadStory, viewStory } from "../controllers/story.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const storyRouter = express.Router();

// Upload a story
storyRouter.post("/upload", isAuth, upload.single("media"), uploadStory);

// Get story by username
storyRouter.get("/getbyusername/:username", isAuth, getStoryByusername);
storyRouter.get("/getAll", isAuth, getAllStories);

// View / toggle a story
storyRouter.put("/view/:storyId", isAuth, viewStory);

export default storyRouter;
