import express from "express";
import {
  editProfile,
  follow,
  followingList,
  getAllNotifications,
  getcurrentUsers,
  getProfile,
  markAsRead,
  search,
  suggestedUsers,
} from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js"; // ⬅️ make sure multer export is here

const userrouter = express.Router();

// Get current logged-in user
userrouter.get("/current", isAuth, getcurrentUsers);

// Get suggested users
userrouter.get("/suggested", isAuth, suggestedUsers);
userrouter.get("/getprofile/:username", isAuth, getProfile);
userrouter.get("/follow/:targetUserId", isAuth, follow);
userrouter.get("/following/", isAuth, followingList);
userrouter.get("/search",isAuth,search)
userrouter.get("/getAllNotifications",isAuth,getAllNotifications)
userrouter.post("/markAsRead/",isAuth,markAsRead)

// Edit profile (with profile picture upload)
userrouter.post(
  "/editprofile",
  isAuth,
  upload.single("profileImage"),
  editProfile
);

export default userrouter;
