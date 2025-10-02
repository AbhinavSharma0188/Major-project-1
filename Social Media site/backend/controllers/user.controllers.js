import uploadOnCloudinary from "../config/cloudinary.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js"; // adjust path as needed

// Get current logged-in user
export const getcurrentUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "author",
          select: "username name profileImage _id"
        }
      })
      .populate({
        path: "loops",
        populate: {
          path: "author", 
          select: "username name profileImage _id"
        }
      }) .populate({
        path: "following",
        select: "name username profileImage _id", 
        options: { limit: 100 }
      })
      .populate({
        path: "saved",
        populate: {
          path: "author",
          select: "username name profileImage _id"
        }
      });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Get current user error", error });
  }
};

// Get suggested users
export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Get suggested users error", error });
  }
};

// Edit user profile
export const editProfile = async (req, res) => {
  try {
    const { name, username, bio, profession, gender } = req.body;

    // Find the user
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check if username is taken by another user
    const existingUser = await User.findOne({ username }).select("-password");
    if (existingUser && existingUser._id.toString() !== req.userId) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Handle profile image upload
    if (req.file) {
      try {
        const uploadedImageUrl = await uploadOnCloudinary(req.file.path);
        user.profileImage = uploadedImageUrl; // Save Cloudinary URL
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res
          .status(500)
          .json({ message: "Failed to upload profile image", error: err });
      }
    }

    // Update other fields
    user.name = name || user.name;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.profession = profession || user.profession;
    user.gender = gender || user.gender;

    await user.save();

    // Return updated user
    return res.status(200).json({
      message: "Profile updated successfully",
      user, // user.profileImage now contains Cloudinary URL
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Edit profile error", error });
  }
};

export const getProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .select("-password")
      .populate({
        path: "posts",
        populate: {
          path: "author",
          select: "username name profileImage _id"
        },
        options: { limit: 20, sort: { createdAt: -1 } }
      })
      .populate({
        path: "loops", 
        populate: {
          path: "author",
          select: "username name profileImage _id"
        },
        options: { limit: 20, sort: { createdAt: -1 } }
      })
      .populate({
        path: "followers",
        select: "name username profileImage", // Only get basic info
        options: { limit: 100 }
      })
      .populate({
        path: "following",
        select: "name username profileImage", // Only get basic info  
        options: { limit: 100 }
      })
      .populate({
        path: "saved",
        populate: {
          path: "author",
          select: "username name profileImage _id"
        }
      });

    if (!user) return res.status(400).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error); // Add this for debugging
    return res.status(500).json({ message: "Get profile error", error });
  }
};

export const follow = async (req, res) => {
  try {
    const currentUserId = req.userId
    const targetUserId = req.params.targetUserId

    if (!targetUserId) {
      return res.status(400).json({ message: "target user is not found" })
    }

    if (currentUserId == targetUserId) {
      return res.status(400).json({ message: "you can not follow yourself." })
    }

    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(targetUserId)

    const isFollowing = currentUser.following.includes(targetUserId)

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(id => id.toString() != targetUserId)
      targetUser.followers = targetUser.followers.filter(id => id.toString() != currentUserId)
      await currentUser.save()
      await targetUser.save()
      return res.status(200).json({
        following: false,
        message: "unfollow successfully"
      })
    } else {
      currentUser.following.push(targetUserId)
      targetUser.followers.push(currentUserId)
      if (currentUser._id !=  targetUser._id) {
                             const notification = await Notification.create({
                                 sender:currentUser._id,
                                 receiver: targetUser._id,
                                 type: "follow",
                                 message:"started following you"
                             })
                             const populatedNotification = await Notification.findById(notification._id).populate("sender receiver")
                             const receiverSocketId=getSocketId(targetUser._id)
                             if(receiverSocketId){
                                 io.to(receiverSocketId).emit("newNotification",populatedNotification)
                             }
                         
                         }

      await currentUser.save()
      await targetUser.save()
      return res.status(200).json({
        following: true,
        message: "follow successfully"
      })
    }

  } catch (error) {
    return res.status(500).json({ message: `follow error ${error}` })
  }
}
export const followingList=async (req,res)=>{
  try {
    const result =await User.findById(req.userId)
    return res.status(200).json(result?.following)
    
  } catch (error) {
    return res.status(500).json({ message: `followingList error ${error}` })

    
  }
}

export const search=async (req,res)=>{
  try {
    const keyWord=req.query.keyWord

    if(!keyWord){
      return res.status(400).json({message:"keyword is required"})
    }

    const users=await User.find({
      $or:[
        {userName:{$regex:keyWord,$options:"i"}},
        {name:{$regex:keyWord,$options:"i"}}
      ]
    }).select("-password")

    return res.status(200).json(users)

  } catch (error) {
    return res.status(500).json({message:`search error ${error}`})
  }
}
export const getAllNotifications=async (req,res)=>{
  try {
    const notifications=await Notification.find({
      receiver:req.userId
    }).populate("sender receiver post loop").sort({createdAt:-1})
    return res.status(200).json(notifications)
  } catch (error) {
     return res.status(500).json({message:`get notification error ${error}`})
  }
}

export const markAsRead=async (req,res)=>{
  try {
    const {notificationId}=req.body

   if (Array.isArray(notificationId)) {
      // bulk mark-as-read
      await Notification.updateMany(
        { _id: { $in: notificationId }, receiver: req.userId },
        { $set: { isRead: true } }
      );
    } else {
      // mark single notification as read
      await Notification.findOneAndUpdate(
        { _id: notificationId, receiver: req.userId },
        { $set: { isRead: true } }
      );
    }
    return res.status(200).json({message:"marked as read"})

  } catch (error) {
    return res.status(500).json({message:`read notification error ${error}`})
  }
}