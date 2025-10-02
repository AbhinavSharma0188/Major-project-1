import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setCurrentUserStory } from "../redux/storySlice";
import { setFollowing, setUserData } from "../redux/userSlice";

function useCurrentUser() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(!userData);
  const {storyData} = useSelector(state => state.story);

  const fetchUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      
      console.log("🔍 Current user API response:", result.data);
      
      const completeUserData = {
        ...result.data,
        user: {
          ...result.data.user,
          saved: result.data.user.saved || []
        },
        saved: result.data.user.saved || []
      };
      
      dispatch(setUserData(completeUserData));
      
      // Extract just the IDs from populated following for Redux state
      const followingIds = result.data.user.following.map(user => 
        typeof user === 'string' ? user : user._id
      );
      dispatch(setFollowing(followingIds));
      
      // ✅ Fetch the full story with viewers populated if story exists
      if (result.data.user.story) {
        try {
          const storyResult = await axios.get(
            `${serverUrl}/api/story/getbyusername/${result.data.user.username}`,
            { withCredentials: true }
          );
          dispatch(setCurrentUserStory(storyResult.data[0])); // Full story object with viewers
        } catch (error) {
          console.log("Story fetch error:", error);
          dispatch(setCurrentUserStory(null));
        }
      } else {
        dispatch(setCurrentUserStory(null));
      }
      
      return completeUserData;
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
      throw error;
    }
  };

  useEffect(() => {
    if (userData) return;

    fetchUser().finally(() => {
      setLoading(false);
    });
  }, [dispatch, userData, storyData]);

  const refetchUser = () => {
    return fetchUser();
  };

  return { userData, loading, refetchUser };
}

export default useCurrentUser;