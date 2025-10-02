import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import VideoPlayer from "./VideoPlayer";

function StoryCard({ storyData }) {
  const { userData: storyUserData } = useSelector((state) => state.story);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showViewers, setShowViewers] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Move navigation outside of setState
          setTimeout(() => navigate("/"), 0);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [navigate]);

  // Circle Progress Bar Calculations
  const size = 44;
  const stroke = 4;
  const center = size / 2;
  const radius = center - stroke;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  // Check if this is user's own story
  const isOwnStory =
    storyData?.authorId === storyUserData?._id ||
    storyData?.author?._id === storyUserData?._id;

  const profileImage =
    storyData?.author?.profileImage ||
    (isOwnStory ? storyUserData?.profileImage : null) ||
    dp;
  const username =
    storyData?.author?.userName ||
    storyData?.author?.username ||
    (isOwnStory ? storyUserData?.userName || storyUserData?.username : null) ||
    "Unknown User";

  if (!storyData) {
    return (
      <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center items-center">
        <div className="text-white">Loading story...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
      {/* Circular Progress Bar */}
      <svg width={size} height={size} className="absolute top-4 right-5 z-30">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#555"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#fff"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.15s linear" }}
        />
      </svg>
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600 z-20">
        <div
          className="h-full bg-white transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      {!showViewers && <>
      
      <div className="flex items-center gap-[10px] absolute top-[30px] px-[10px] z-10">
        <IoMdArrowRoundBack
          className="text-white w-[25px] h-[25px] cursor-pointer"
          onClick={() => navigate(`/`)}
        />
        <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-white rounded-full cursor-pointer overflow-hidden">
          <img
            src={profileImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-[150px] font-semibold text-white truncate">
          {username}
        </div>
      </div>

      <div className="w-full h-[90vh] flex items-center justify-center">
        {storyData?.mediaType === "image" && (
          <div className="w-[90%] flex items-center justify-center">
            <img
              src={storyData.media}
              alt=""
              className="w-[80%] rounded-2xl object-cover"
            />
          </div>
        )}

        {storyData?.mediaType === "video" && (
          <div className="w-[80%] flex flex-col items-center justify-center">
            <VideoPlayer media={storyData.media} showControls={false} initialMuted={false} />
          </div>
        )}
      </div>

      {storyData?.author?.username === userData?.user?.username && (
        <div className="w-full h-[70px] flex items-center gap-[10px] text-white cursor-pointer left-0 p-2 absolute bottom-0" onClick={() => setShowViewers(true)}>
          <div className="text-white flex items-center gap-[5px]">
            <FaEye />
            {storyData?.viewers?.length}
          </div>
          <div className="flex relative">
            {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
              <div
                key={viewer._id || index}
                className={`w-[30px] h-[30px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${
                  index > 0 ? `absolute left-[${index * 9}px]` : ""
                }`}
              >
                <img
                  src={viewer?.profileImage || dp}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}</>}

      {showViewers && <>
      
      <div className='w-full h-[30%] flex items-center justify-center mt-[100px] cursor-pointer py-[30px] overflow-hidden' onClick={() => setShowViewers(false)}>
        {storyData?.mediaType == "image" && <div className='h-full flex items-center justify-center'>
          <img src={storyData?.media} alt="" className='h-full rounded-2xl object-cover' />
        </div>}

        {storyData?.mediaType == "video" && <div className='h-full flex flex-col items-center justify-center'>
          <VideoPlayer media={storyData?.media} showControls={false} initialMuted={false} />
        </div>}
      </div>
      <div className="w-full h-[70%] border-t-2 border-t-gray-800 p-[20px]">
        <div className="text-white flex items-center gap-[10px]">
           <FaEye /><span>{storyData?.viewers?.length}<span> Viewers</span></span>  
        </div>
        <div className="w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]">
        {storyData?.viewers?.map((viewer, index) => (
          <div key={viewer._id || index} className="w-full flex items-center gap-[20px]">
            <div className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] border-2 border-white rounded-full cursor-pointer overflow-hidden">
              <img
                src={viewer?.profileImage || dp}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-[150px] font-semibold text-white truncate">
              {viewer?.username}
            </div>
          </div>
        ))}
        </div>
      </div>
      </>}
      
    </div>
  );
}

export default StoryCard;