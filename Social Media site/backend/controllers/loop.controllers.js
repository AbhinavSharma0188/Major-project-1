import uploadOnCloudinary from "../config/cloudinary.js";
import Loop from "../models/loop.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { getIO, getSocketId } from "../socket.js";

// Upload a loop (reel)
export const uploadLoop = async (req, res) => {
  try {
    console.log("Loop upload started");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    const { caption, mediaType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Media is required" });
    }
    console.log("Starting Cloudinary upload...");

    const media = await uploadOnCloudinary(req.file.path);
    console.log("Cloudinary upload successful:", media); 

    const loop = await Loop.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.loops.push(loop._id);
    await user.save();

    const populatedLoop = await Loop.findById(loop._id).populate(
      "author",
      "name username profileImage"
    );

    return res.status(201).json(populatedLoop);
  } catch (error) {
    console.error("Upload loop error:", error);
    return res.status(500).json({ 
      message: "Upload loop error", 
      error: error.message
    });
  }
};

// Like or unlike a loop
export const like = async (req, res) => {
  try {
    const loopId = req.params.loopId;
    const loop = await Loop.findById(loopId);
    if (!loop) {
      return res.status(400).json({ message: "Loop not found" });
    }

    const alreadyLiked = loop.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyLiked) {
      loop.likes = loop.likes.filter((id) => id.toString() !== req.userId.toString());
    } else {
      loop.likes.push(req.userId);
      // ✅ FIXED: Compare ObjectId directly, not loop.author._id
      if (loop.author.toString() !== req.userId.toString()) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: loop.author, // ✅ FIXED: Use loop.author directly
          type: "like",
          loop: loop._id,
          message: "liked your loop"
        });
        const populatedNotification = await Notification.findById(notification._id).populate("sender receiver loop");
        
        const io = getIO();
        const receiverSocketId = getSocketId(loop.author.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newNotification", populatedNotification);
        }
      }
    }

    await loop.save();

    await loop.populate("author", "name username profileImage");
    
    // ✅ Get io instance properly
    const io = getIO();
    io.emit("likedLoop", {
      loopId: loop._id,
      likes: loop.likes
    });
    
    return res.status(200).json(loop);
  } catch (error) {
    console.error("Like loop error:", error);
    return res.status(500).json({ message: "Like loop error" });
  }
};

// Add a comment to a loop
export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const loopId = req.params.loopId;

    const loop = await Loop.findById(loopId);
    if (!loop) {
      return res.status(400).json({ message: "Loop not found" });
    }

    loop.comments.push({
      author: req.userId,
      message,
    });
    
    // ✅ FIXED: Compare ObjectId directly
    if (loop.author.toString() !== req.userId.toString()) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: loop.author, // ✅ FIXED: Use loop.author directly
        type: "comment",
        loop: loop._id,
        message: "commented on your loop"
      });
      const populatedNotification = await Notification.findById(notification._id).populate("sender receiver loop");
      
      const io = getIO();
      const receiverSocketId = getSocketId(loop.author.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }
    
    await loop.save();

    await loop.populate("author", "name username profileImage");
    await loop.populate("comments.author", "name username profileImage");
    
    // ✅ Get io instance properly
    const io = getIO();
    io.emit("commentedLoop", {
      loopId: loop._id,
      comments: loop.comments
    });

    return res.status(200).json(loop);
  } catch (error) {
    console.error("Loop comment error:", error);
    return res.status(500).json({ message: "Comment loop error" });
  }
};

export const getAllLoops = async (req, res) => {
  try {
    const loops = await Loop.find({
      media: { $regex: /\.mp4$/i }
    }).populate("author", "name username profileImage")
      .populate("comments.author");
    
    return res.status(200).json(loops);
  } catch (error) {
    console.error("Get all loops error:", error);
    return res.status(500).json({ message: "Get all loops error" });
  }
};