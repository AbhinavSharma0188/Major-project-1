import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setPrevChatUsers } from "../redux/messageSlice";

function usePrevChatUsers() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [loading, setLoading] = useState(!userData);
  const {messages} = useSelector(state => state.message);

   const fetchUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/message/prevChats`, {
        withCredentials: true,
      });
      
      console.log("🔍 Prev chats API response:", result.data);
      
      dispatch(setPrevChatUsers(result.data));
      
      return result.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    if (userData) return;

    fetchUser().finally(() => {
      setLoading(false);
    });
  }, [messages]);

  const refetchUser = () => {
    return fetchUser();
  };

  return { userData, loading, refetchUser };
}

export default usePrevChatUsers;