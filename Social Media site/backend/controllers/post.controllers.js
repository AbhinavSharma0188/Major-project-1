import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getIO } from "../socket.js";

// Upload a post
export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Media is required" });

    const media = await uploadOnCloudinary(req.file.path);

    const post = await Post.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "name username profileImage");

    return res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Upload post error:", error);
    return res.status(500).json({ message: "Upload post error" });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name username profileImage")
      .populate("comments.author", "name username profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Get all posts error:", error);
    return res.status(500).json({ message: "Get all posts error" });
  }
};

// ✅ Like / Unlike
export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log(postId);
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);
      // ✅ FIXED: Compare ObjectId directly, not post.author._id
      if (post.author.toString() !== req.userId.toString()) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: post.author, // ✅ FIXED: Use post.author directly
          type: "like",
          post: post._id,
          message: "liked your post",
        });

        const populatedNotification = await Notification.findById(
          notification._id
        ).populate("sender receiver post");
        
        // ✅ FIXED: Get io instance and use getSocketId properly
        const io = getIO();
        const { getSocketId } = await import("../socket.js");
        const receiverSocketId = getSocketId(post.author.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification
          );
        }
      }
    }

    await post.save();
    await post.populate("author", "name username profileImage");
    
    // ✅ Get io instance properly
    const io = getIO();
    io.emit("likedPost", {
      postId: post._id,
      likes: post.likes
    });
    
    return res.status(200).json(post);
  } catch (error) {
    console.error("Like post error:", error);
    return res.status(500).json({ message: "Like post error" });
  }
};

// Add a comment
export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      author: req.userId,
      message,
    });
    // ✅ FIXED: Compare ObjectId directly
    if (post.author.toString() !== req.userId.toString()) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: post.author, // ✅ FIXED: Use post.author directly
        type: "comment",
        post: post._id,
        message: "commented on your post",
      });
      const populatedNotification = await Notification.findById(
        notification._id
      ).populate("sender receiver post");
      
      // ✅ FIXED: Get io instance and getSocketId properly
      const io = getIO();
      const { getSocketId } = await import("../socket.js");
      const receiverSocketId = getSocketId(post.author.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    await post.save();
    await post.populate("author", "name username profileImage");
    await post.populate("comments.author");
    
    // ✅ Get io instance properly
    const io = getIO();
    io.emit("commentedPost", {
      postId: post._id,
      comments: post.comments
    });

    return res.status(200).json(post);
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ message: "Comment post error" });
  }
};

// Save / Unsave - Fixed version
export const savedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadySaved = user.saved.some(
      (id) => id.toString() === postId.toString()
    );

    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() !== postId.toString()
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Saved post error:", error);
    return res.status(500).json({ message: "Saved post error" });
  }
};