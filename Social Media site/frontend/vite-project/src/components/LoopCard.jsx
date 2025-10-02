import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoSendSharp } from "react-icons/io5";
import { MdOutlineComment } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";
import { setLoopData } from "../redux/loopSlice";
import FollowButton from "./FollowButton";

function LoopCard({ loop }) {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const dispatch = useDispatch();
  const [showComment, setShowComment] = useState(false);
  const commentRef = useRef();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { loopData } = useSelector((state) => state.loop);

  const currentLoop = loopData.find((item) => item._id === loop._id) || loop;

  const [likes, setLikes] = useState(
    Array.isArray(currentLoop.likes) ? currentLoop.likes : []
  );
  const [likesCount, setLikesCount] = useState(
    Array.isArray(currentLoop.likes) ? currentLoop.likes.length : 0
  );

  useEffect(() => {
    const updatedLikes = Array.isArray(currentLoop.likes)
      ? currentLoop.likes
      : [];
    setLikes(updatedLikes);
    setLikesCount(updatedLikes.length);
  }, [currentLoop.likes]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;
    isPlaying ? video.pause() : video.play();
    setIsPlaying(!isPlaying);
  };

  const isLiked = () => {
    const userId = userData?.user?._id || userData?.user?.id;
    if (!userId || !Array.isArray(likes)) return false;
    const userIdString = String(userId);
    return likes.some((likeId) => String(likeId) === userIdString);
  };

  const handleLike = async () => {
    const userId = userData?.user?._id || userData?.user?.id;
    if (!userId || isLiking) return;

    setIsLiking(true);

    try {
      const userIdString = String(userId);
      const currentlyLiked = isLiked();

      let newLikes;
      if (currentlyLiked) {
        newLikes = likes.filter((likeId) => String(likeId) !== userIdString);
      } else {
        newLikes = [...likes, userId];
      }

      setLikes(newLikes);
      setLikesCount(newLikes.length);

      const result = await axios.put(
        `${serverUrl}/api/loop/like/${currentLoop._id}`,
        {},
        { withCredentials: true }
      );

      if (result.data) {
        const updatedLoop = result.data;
        const updatedLoops = loopData.map((p) =>
          p._id === currentLoop._id ? updatedLoop : p
        );
        dispatch(setLoopData(updatedLoops));

        const serverLikes = Array.isArray(updatedLoop.likes)
          ? updatedLoop.likes
          : [];
        setLikes(serverLikes);
        setLikesCount(serverLikes.length);
      }
    } catch (error) {
      console.log(error);
      const originalLikes = Array.isArray(currentLoop.likes)
        ? currentLoop.likes
        : [];
      setLikes(originalLikes);
      setLikesCount(originalLikes.length);
      alert("Failed to update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        {
          withCredentials: true,
        }
      );
      const updatedLoop = result.data;
      const updatedLoops = loopData.map((p) =>
        p._id === loop._id ? updatedLoop : p
      );

      dispatch(setLoopData(updatedLoops));
      
      setMessage(""); // Clear the message after commenting
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
      }
    };
    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showComment]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, [currentLoop]);

  const handleVideoError = () => {};
  useEffect(() => {
  if (!socket) return;
  
  const handleLikedLoop = (updatedData) => {
    dispatch(setLoopData(
      loopData.map((p) =>
        p._id === updatedData.loopId ? { ...p, likes: updatedData.likes } : p
      )
    ));
  };

  const handleCommentedLoop = (updatedData) => {
    dispatch(setLoopData(
      loopData.map((p) =>
        p._id === updatedData.loopId
          ? { ...p, comments: updatedData.comments }
          : p
      )
    ));
  };

  socket.on("likedLoop", handleLikedLoop);
  socket.on("commentedLoop", handleCommentedLoop);

  return () => {
    socket.off("likedLoop", handleLikedLoop);
    socket.off("commentedLoop", handleCommentedLoop);
  };
}, [socket, dispatch, loopData]);
  

  return (

    <div className="w-full lg:w-[480px] h-[100vh] flex items-center justify-center bg-black relative overflow-hidden">
      {/* Back Button - Mobile only */}
<div className="absolute top-4 left-4 z-[100] md:hidden">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center justify-center w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all duration-200"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>
</div>
      {/* Comments Drawer */}
      <div
        ref={commentRef}
        className={`absolute z-[200] bottom-0 w-full h-[500px] shadow-2xl shadow-black p-[10px] transition-transform duration-500 ease-in-out rounded-t-4xl bg-black left-0 ${
          showComment ? "translate-y-0" : "translate-y-[100%]"
        }`}
      >
        <h1 className="text-white text-[20px] text-center font-semibold">
          Comments
        </h1>

        {(!currentLoop.comments || currentLoop.comments.length === 0) && (
          <div className="text-center text-white text-[20px] font-semibold mt-[50px]">
            No Comments Yet
          </div>
        )}

        <div className="w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]">
          {currentLoop.comments?.map((com, index) => (
            <div
              key={index}
              className="w-full flex flex-col gap-[5px] border-b-[1px] border-gray-800 justify-center pb-[10px] mt-[10px]"
            >
              <div
                className="flex justify-start items-center md:gap-[20px] gap-[10px]"
                onClick={() =>
                  navigate(
                    `/profile/${com.author?.userName || com.author?.username}`
                  )
                }
              >
                <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-white rounded-full cursor-pointer overflow-hidden">
                  <img
                    src={com.author?.profileImage || dp}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-[150px] font-semibold text-white truncate">
                  {com.author?.userName ||
                    com.author?.username ||
                    "Unknown User"}
                </div>
              </div>
              {/* comment text */}
              <div className="text-white text-sm ml-[50px]">{com.message}</div>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="w-full fixed bottom-0 h-[80px] flex items-center justify-between px-[20px] py-[20px] bg-black">
          <div className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={loop.author?.profileImage || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="text"
            className="px-[10px] border-b-2 border-b-gray-500 w-[90%] text-white outline-none h-[40px] placeholder:text-white bg-transparent"
            placeholder="Write Comment..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
         {message&& <button
            className="absolute right-[20px] cursor-pointer"
            onClick={handleComment}
          >
            <IoSendSharp className="w-[25px] h-[25px] text-white" />
          </button>}
        </div>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        src={currentLoop?.media}
        loop
        playsInline
        controls
        onError={handleVideoError}
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Progress bar */}
      <div className="absolute bottom-0 w-full h-[4px] bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Author + Follow */}
      <div className="absolute bottom-[100px] left-0 w-full px-4 flex items-center">
        <div className="flex items-center gap-3 bg-black/40 px-3 py-2 rounded-2xl">
          <div className="w-[40px] h-[40px] border-2 border-white rounded-full overflow-hidden">
            <img
              src={currentLoop.author?.profileImage || dp}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="font-semibold text-white text-[15px] max-w-[150px] truncate">
              {currentLoop.author?.username}
            </div>
            <FollowButton
              targetUserId={currentLoop.author?._id}
              tailwind="px-3 py-[2px] text-xs rounded-xl text-white border border-white hover:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Caption */}
      {currentLoop.caption && (
        <div className="absolute bottom-[55px] left-4 text-white text-[14px] leading-snug font-normal max-w-[85%] line-clamp-3 drop-shadow-md">
          {currentLoop.caption}
        </div>
      )}

      {/* Like + Comment */}
      <div className="absolute right-0 flex flex-col gap-[20px] text-white bottom-[180px] justify-center px-[10px]">
        <div className="flex flex-col items-center cursor-pointer">
          <div
            onClick={handleLike}
            className={`transition-transform duration-200 ${
              isLiking ? "scale-110" : "hover:scale-110"
            }`}
          >
            {isLiked() ? (
              <GoHeartFill className="w-[25px] h-[25px] text-red-500 drop-shadow-md" />
            ) : (
              <GoHeart className="w-[25px] h-[25px] hover:text-red-300 transition-colors" />
            )}
          </div>
          <div className="text-sm font-medium mt-1">{likesCount}</div>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer"
          onClick={() => setShowComment(true)}
        >
          <MdOutlineComment className="w-[25px] h-[25px] hover:text-blue-300 transition-colors" />
          <div className="text-sm font-medium mt-1">
            {currentLoop.comments?.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoopCard;
