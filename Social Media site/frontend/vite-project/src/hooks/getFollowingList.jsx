import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setFollowing } from "../redux/userSlice";

function useFollwingList() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData); // get existing data
  const [loading, setLoading] = useState(!userData); // only loading if no userData
const {storyData}=useSelector(state=>state.story)
    const fetchUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/following/`, {
        withCredentials: true,
      });
      
      console.log("🔍 Following list API response:", result.data);
      
      dispatch(setFollowing(result.data));
     
      return result.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  useEffect(() => {
    if (userData) return; // ✅ if we already have userData, don't fetch

    fetchUser().finally(() => {
      setLoading(false);
    });
  }, [dispatch, userData,storyData]);

  // Expose refetch function for manual refreshing
  const refetchUser = () => {
    return fetchUser();
  };

  return { userData, loading, refetchUser };
}

export default useFollwingList;