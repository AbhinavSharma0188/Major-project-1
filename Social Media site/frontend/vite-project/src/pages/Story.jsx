import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import StoryCard from "../components/StoryCard";
import { setStoryData } from "../redux/storySlice";

function Story() {
    const { storyData } = useSelector((state) => state.story);
    const { userData } = useSelector((state) => state.user);
    const [userNotFound, setUserNotFound] = useState(false);
    const [hasMarkedViewed, setHasMarkedViewed] = useState(false);

    const { username } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleStory = async () => {
        dispatch(setStoryData(null));
        setHasMarkedViewed(false); // Reset when fetching new story
        try {
            const result = await axios.get(`${serverUrl}/api/story/getbyusername/${username}`, {
                withCredentials: true
            });
            dispatch(setStoryData(result.data[0]));
            setUserNotFound(false);
        } catch (error) {
            console.log("Full error:", error.response?.data);
            
            if (error.response?.status === 404) {
                console.log("User not found");
                setUserNotFound(true);
                dispatch(setStoryData([]));
            }
        }
    };

    // Mark story as viewed after it loads
    useEffect(() => {
        const markAsViewed = async () => {
            if (storyData?._id && !hasMarkedViewed) {
                const currentUserId = userData?._id || userData?.user?._id;
                const currentUsername = userData?.username || userData?.user?.username;
                
                // Don't mark as viewed if it's the user's own story
                if (username !== currentUsername) {
                    try {
                        await axios.put(
                            `${serverUrl}/api/story/view/${storyData._id}`, 
                            {}, 
                            { withCredentials: true }
                        );
                        setHasMarkedViewed(true);
                        console.log("Story marked as viewed");
                    } catch (error) {
                        console.log("Error marking story as viewed:", error);
                    }
                }
            }
        };

        markAsViewed();
    }, [storyData, hasMarkedViewed, username, userData]);

    useEffect(() => {
        if (username) {
            handleStory();
        }
    }, [username]);

    return (
        <div className="w-full h-[100vh] flex bg-black justify-center items-center">
            <StoryCard storyData={storyData}/>
        </div>
    );
}

export default Story;