import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { serverUrl } from '../App';
import { setSuggestedUsers } from '../redux/userSlice';

function useSuggestedUsers() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user); // ✅ correct

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/suggested`, {
          withCredentials: true,
        });
        dispatch(setSuggestedUsers(result.data));
      } catch (error) {
        console.log(error);
      }
    };

    if (userData) {
      fetchUser(); // ✅ fetch only if user is logged in
    }
  }, [dispatch, userData]);
}

export default useSuggestedUsers;
