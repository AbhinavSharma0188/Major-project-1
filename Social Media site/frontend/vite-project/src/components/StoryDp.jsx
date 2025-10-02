import axios from "axios";
import { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";

function StoryDp({ ProfileImage, username, story }) {
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const { storyData, storyList } = useSelector(state => state.story);
  const [viewed, setViewed] = useState(false);

  useEffect(() => {
    // Check if current user has viewed this story
    const currentUserId = userData?._id || userData?.user?._id;
    
    if (story?.viewers?.some((viewer) =>
      viewer?._id?.toString() === currentUserId?.toString() || 
      viewer?.toString() === currentUserId?.toString()
    )) {
      setViewed(true);
    } else {
      setViewed(false);
    }
  }, [story, userData, storyData, storyList]);
  // Add this right after the useEffect in StoryDp.jsx
console.log("Story Debug:", {
  username: username,
  hasStory: !!story,
  storyId: story?._id,
  viewers: story?.viewers,
  currentUserId: userData?._id || userData?.user?._id,
  viewed: viewed
});

  const handleViewers = async () => {
    if (!story?._id) return;
    
    try {
      await axios.put(`${serverUrl}/api/story/view/${story._id}`, {}, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  };

 const handleClick = () => {
    const currentUsername = userData?.username || userData?.user?.username;
    
    if (!story && username === "Your Story") {
      navigate("/upload");
    } else if (story && username === "Your Story") {
      // Don't call handleViewers here for your own story
      navigate(`/story/${currentUsername}`);
    } else if (story) {
      // Don't call handleViewers here - let Story.jsx handle it
      navigate(`/story/${username}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-[80px]">
      <div 
        className={`w-[80px] h-[80px] ${
          !story 
            ? "" 
            : !viewed 
              ? "bg-gradient-to-b from-blue-500 to-blue-950" 
              : "bg-gradient-to-r from-gray-500 to-gray-800"
        } rounded-full flex items-center justify-center relative cursor-pointer`} 
        onClick={handleClick}
      >
        <div className="w-[70px] h-[70px] border-2 border-black rounded-full overflow-hidden">
          <img 
            src={ProfileImage || dp} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Plus icon - only when no story exists and it's "Your Story" */}
        {!story && username === "Your Story" && (
          <FiPlusCircle className="text-blue-500 absolute bottom-[8px] bg-white right-[10px] rounded-full w-[22px] h-[22px]" />
        )}
      </div>
      
      <div className="text-[14px] text-center truncate w-full text-white mt-1">
        {username}
      </div>
    </div>
  );
}

export default StoryDp;