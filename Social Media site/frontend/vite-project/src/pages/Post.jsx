import axios from "axios";
import { useEffect, useState } from "react";
import { GoBookmarkFill, GoHeart, GoHeartFill } from "react-icons/go";
import { IoSendSharp } from "react-icons/io5";
import { MdOutlineBookmarkBorder, MdOutlineComment } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";
import FollowButton from "../components/FollowButton";
import VideoPlayer from "../components/VideoPlayer";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/userSlice";

function Post({ post, onSaveUpdate }) {
  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const actualUser = userData?.user || userData;
  const { postData } = useSelector((state) => state.post);
  const [message, setMessage] = useState("");
  const [showComment, setShowComment] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Debug logging
  console.log("🔍 Post component received:", post);
  console.log("🔍 Post author:", post?.author);
  console.log("🔍 Post author username:", post?.author?.username);
  
  // Socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;
    
    const handleLikedPost = (updatedData) => {
      dispatch(setPostData(
        postData.map((p) =>
          p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p
        )
      ));
    };

    const handleCommentedPost = (updatedData) => {
      dispatch(setPostData(
        postData.map((p) =>
          p._id === updatedData.postId
            ? { ...p, comments: updatedData.comments }
            : p
        )
      ));
    };

    socket.on("likedPost", handleLikedPost);
    socket.on("commentedPost", handleCommentedPost);

    return () => {
      socket.off("likedPost", handleLikedPost);
      socket.off("commentedPost", handleCommentedPost);
    };
  }, [socket, dispatch, postData]);

  if (!userData || !post) {
    console.log("⚠️ Missing userData or post:", { userData: !!userData, post: !!post });
    return <div>Loading...</div>;
  }

  if (!post.author) {
    console.log("⚠️ Post missing author:", post);
    return <div className="w-[90%] bg-white p-4 rounded-2xl">Post data incomplete</div>;
  }
  
  if (!post.author.username) {
    console.log("⚠️ Post author missing username:", post.author);
    return <div className="w-[90%] bg-white p-4 rounded-2xl">Author data incomplete</div>;
  }

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {
        withCredentials: true,
      });
      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        {
          withCredentials: true,
        }
      );
      const updatedPost = result.data;
      const updatedPosts = postData.map((p) =>
        p._id === post._id ? updatedPost : p
      );
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        {
          withCredentials: true,
        }
      );

      const updatedUserData = {
        ...userData,
        saved: result.data.saved
      };
      
      dispatch(setUserData(updatedUserData));
      
      if (onSaveUpdate) {
        onSaveUpdate();
      }
    } catch (error) {
      console.log("API error:", error);
    }
  };

  return (
    <div className="w-[90%] flex flex-col gap-[10px] bg-white items-center shadow-2xl shadow-black rounded-2xl pb-[20px]">
      {/* Post Header */}
      <div className="w-full h-[80px] flex justify-between items-center px-[10px]">
        <div className="flex justify-center items-center md:gap-[20px] gap-[10px]" onClick={() => navigate(`/profile/${post.author?.username}`)}>
          <div className="md:w-[60px] md:h-[60px] w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={post.author?.profileImage || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-semibold w-[150px] truncate">
            {post.author?.username}
          </div>
        </div>
        {actualUser?._id !== post.author?._id && (
          <FollowButton
            tailwind={
              "px-[10px] md:w-[80px] w-[60px] py-[5px] h-[30px] md:h-[40px] bg-black text-white rounded-2xl text-[14px] md:text-[16px]"
            }
            targetUserId={post.author?._id}
          />
        )}
      </div>

      {/* Post Media */}
      <div className="w-[90%] flex items-center justify-center">
        {post.mediaType === "image" && (
          <div className="w-[90%] flex items-center justify-center">
            <img
              src={post.media}
              alt=""
              className="w-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {post.mediaType === "video" && (
          <div className="w-[80%] flex flex-col items-center justify-center">
            <VideoPlayer media={post.media} />
          </div>
        )}
      </div>

      {/* Likes & Comments */}
      <div className="flex justify-start items-center gap-[20px] w-[90%] mt-[10px]">
        <div className="flex justify-center items-center gap-[5px]">
          {!post.likes?.includes(actualUser?._id) && (
            <GoHeart
              className="w-[25px] cursor-pointer h-[25px]"
              onClick={handleLike}
            />
          )}
          {post.likes?.includes(actualUser?._id) && (
            <GoHeartFill
              className="w-[25px] cursor-pointer h-[25px] text-red-600"
              onClick={handleLike}
            />
          )}
          <span>{post.likes?.length || 0}</span>
        </div>

        <div
          className="flex justify-center items-center gap-[5px]"
          onClick={() => setShowComment((prev) => !prev)}
        >
          <MdOutlineComment className="w-[25px] cursor-pointer h-[25px]" />
          <span>{post.comments?.length || 0}</span>
        </div>
        <div onClick={handleSaved}>
          {!userData.saved?.includes(post?._id) && (
            <MdOutlineBookmarkBorder className="w-[25px] cursor-pointer h-[25px]" />
          )}
          {userData.saved?.includes(post?._id) && (
            <GoBookmarkFill className="w-[25px] cursor-pointer h-[25px]" />
          )}
        </div>
      </div>

      {post.caption && (
        <div className="w-full px-[20px] gap-[10px] flex justify-start items-center">
          <h1>{post.author?.username}</h1>
          <div>{post.caption}</div>
        </div>
      )}

      {showComment && (
        <div className="w-full flex flex-col gap-[30px] pb-[20px]">
          <div className="w-full h-[80px] flex items-center justify-between px-[20px] relative">
            <div className="md:w-[60px] md:h-[60px] w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
              <img
                src={actualUser?.profileImage || dp}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              className="px-[10px] border-b-2 border-b-gray-500 w-[90%] outline-none h-[40px]"
              placeholder="Write Comment..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button
              className="absolute right-[20px] cursor-pointer"
              onClick={handleComment}
            >
              <IoSendSharp className="w-[25px] h-[25px]" />
            </button>
          </div>
          <div className="w-full max-h-[300px] overflow-auto">
            {post.comments?.map((com, index) => (
              <div
                key={index}
                className="w-full px-[20px] py-[20px] flex items-center gap-[20px] border-b-2 border-b-gray-200"
              >
                <div className="md:w-[60px] md:h-[60px] w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                  <img
                    src={com.author?.profileImage || dp}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-semibold mr-2">{com.author?.username}</span>
                  {com.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;