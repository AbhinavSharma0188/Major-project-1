import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { io } from 'socket.io-client';
import useAllLoops from "./hooks/getAllLoops";
import useAllNotifications from "./hooks/getAllNotifications";
import useAllPosts from "./hooks/getAllPosts";
import useAllStories from "./hooks/getAllStories";
import useCurrentUser from "./hooks/getCurrentUsers";
import useFollwingList from "./hooks/getFollowingList";
import usePrevChatUsers from "./hooks/getPrevUsers";
import useSuggestedUsers from "./hooks/getSuggestedUsers";
import EditProfile from "./pages/EditProfile";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Loops from "./pages/Loops";
import MessageArea from "./pages/MessageArea";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Story from "./pages/Story";
import Upload from "./pages/Upload";
import { setOnlineUsers, setSocket, setSocketDisconnected } from "./redux/SocketSlice";
import { setNotificationData } from "./redux/userSlice";

export const serverUrl = "http://localhost:8000";

function Hello() {
  const { userData } = useSelector(state => state.user);
  const { notificationData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  
  const socketRef = useRef(null);
   
  const { loading } = useCurrentUser();
  useSuggestedUsers();
  useAllPosts();
  useAllLoops();
  useAllStories();
  useFollwingList();
  usePrevChatUsers();
  useAllNotifications();

  useEffect(() => {
    if (userData?.user?._id && !socketRef.current) {
      const socketIo = io(serverUrl, {
        query: {
          userId: userData.user._id
        }
      });
      
      socketRef.current = socketIo;
      
      // Store socket in Redux
      dispatch(setSocket(socketIo));
      
      socketIo.on('getOnlineUsers', (users) => {
        dispatch(setOnlineUsers(users));
        console.log("Online users:", users);
      });

      // ✅ REAL-TIME NOTIFICATION LISTENER
      socketIo.on('newNotification', (notification) => {
        console.log("🔔 New notification received:", notification);
        
        // Add the new notification to the beginning of the array
        const updatedNotifications = [notification, ...notificationData];
        dispatch(setNotificationData(updatedNotifications));
        
        // Optional: Show browser notification
        if (Notification.permission === "granted") {
          new Notification("New Notification", {
            body: `${notification.sender?.username} ${notification.message}`,
            icon: notification.sender?.profileImage || "/logo.png"
          });
        }
      });

      socketIo.on('connect', () => {
        console.log('✅ Socket connected');
      });

      socketIo.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });
      
    } else if (!userData && socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      dispatch(setSocketDisconnected());
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [userData, dispatch, notificationData]);

  // ✅ Request browser notification permission on mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-black flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path="/signin" element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path="/profile/:username" element={userData ? <Profile /> : <Navigate to="/signin" />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/editprofile" element={userData ? <EditProfile /> : <Navigate to="/signin" />} />
      <Route path="/upload" element={userData ? <Upload /> : <Navigate to="/signin" />} />
      <Route path="/loops" element={userData ? <Loops /> : <Navigate to="/signin" />} />
      <Route path="/story/:username" element={userData ? <Story /> : <Navigate to="/signin" />} />
      <Route path='/search' element={userData?<Search/>:<Navigate to={"/signin"}/>}/>
      <Route path="/messages" element={userData ? <Messages /> : <Navigate to="/signin" />} />
      <Route path="/messageArea/:username" element={userData ? <MessageArea /> : <Navigate to="/signin" />} />
      <Route path='/notifications' element={userData?<Notifications/>:<Navigate to={"/signin"}/>}/>
    </Routes>
  );
}

export default Hello;