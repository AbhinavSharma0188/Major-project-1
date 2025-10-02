import axios from "axios";
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";
import logo from "../assets/logo.png";
import Notifications from "../pages/Notifications";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";

function LeftHome() {
  const dispatch = useDispatch();
  const { userData, suggestedUsers } = useSelector((state) => state.user);
  const { notificationData } = useSelector(state => state.user);
  const [showNotification, setShowNotification] = useState(false);

  console.log("Redux userData:", userData);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      console.log(result);
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  // Determine profile image correctly
  const profileImage =
    userData?.profileImage || userData?.user?.profileImage || dp;
  console.log("Notification", notificationData);

  return (
    <div className={`w-[25%] hidden lg:block h-[100vh] bg-black border-r-2 border-gray-900 ${showNotification ? "overflow-hidden" : "overflow-auto"}`}>
      {/* Header */}
      <div className="w-full h-[100px] flex items-center justify-between p-[20px]">
        <img src={logo} alt="Logo" className="w-[80px]" />
        <div className="relative z-[100]" onClick={() => setShowNotification(prev => !prev)}>
          <FaRegHeart className="w-[25px] h-[25px] text-white cursor-pointer hover:scale-110 transition-transform" />
          {notificationData?.length > 0 && notificationData.some((noti) => noti.isRead === false) && (
            <div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px] animate-pulse'></div>
          )}
        </div>
      </div>

      {!showNotification && (
        <>
          {/* Profile Section */}
          <div className="flex items-center gap-[10px] w-full px-[10px] justify-between border-b-2 border-b-gray-900 py-[10px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="text-white font-semibold text-[18px]">
                  {userData?.user?.username || userData?.username || "Guest User"}
                </div>
                <div className="text-gray-400 text-[15px] font-semibold">
                  {userData?.user?.name || userData?.name || "username"}
                </div>
              </div>
            </div>
            <div
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={handleLogout}
            >
              Log Out
            </div>
          </div>

          {/* Suggested Users */}
          <div className="w-full flex flex-col gap-[20px] p-[20px]">
            <h1 className="text-white text-[19px]">Suggested Users</h1>
            {suggestedUsers &&
              suggestedUsers.slice(0, 3).map((user, index) => (
                <OtherUser key={index} user={user} />
              ))}
          </div>
        </>
      )}

      {showNotification && (
        <div className="w-full h-full animate-fadeIn">
          {/* Notification Header */}
          <div className="w-full h-[80px] flex items-center justify-between px-[20px] border-b-2 border-gray-800 bg-gradient-to-r from-gray-900 to-black">
            <h1 className="text-white text-[24px] font-bold tracking-wide">Notifications</h1>
            <IoMdClose 
              className="w-[30px] h-[30px] text-white cursor-pointer hover:rotate-90 transition-transform duration-300" 
              onClick={() => setShowNotification(false)}
            />
          </div>
          
          {/* Notifications Content */}
          <div className="w-full h-[calc(100vh-180px)] overflow-auto">
            <Notifications />
          </div>
        </div>
      )}
    </div>
  );
}

export default LeftHome;