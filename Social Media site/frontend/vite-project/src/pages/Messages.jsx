import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from '../assets/dp.webp';
import OnlineUsers from "../components/OnlineUsers";
import { setSelectedUser } from "../redux/messageSlice";

function Messages() {
  const { userData } = useSelector((state) => state.user);
  const { prevChatUsers, selectedUsers } = useSelector((state) => state.message);
  const { onlineUsers } = useSelector((state) => state.socket);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  return (
    <div className="w-full min-h-[100vh]  flex flex-col bg-black gap-[20px] p-[10px]">
      <div className="w-full h-[80px] flex  items-center gap-[20px] px-[20px]">
        <IoMdArrowRoundBack
          className="text-white w-[25px] h-[25px]  lg:hidden cursor-pointer"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white font-semibold text-[20px]">Messages</h1>
      </div>
      
      <div className="w-full h-[80px] flex gap-[20px] justify-start items-center overflow-x-auto p-[20px] border-b-2 border-gray-800">
        {userData?.user?.following?.map((user, index) => (
          (onlineUsers?.includes(user._id)) && <OnlineUsers key={index} user={user}/>
        ))}
      </div>
      
      <div className="w-full h-full overflow-auto flex flex-col gap-[20px]">
        {prevChatUsers?.map((user, index) => (
          <div 
            key={index} 
            className="text-white cursor-pointer w-full flex items-center gap-[10px]" 
            onClick={() => {
              dispatch(setSelectedUser(user))
              navigate(`/messageArea/${user.username || user.userName}`)
            }}
          >
            {onlineUsers?.includes(user._id) ? (
              <OnlineUsers user={user}/>
            ) : (
              <div className="w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                <img
                  src={user.profileImage || dp}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-semibold">{user.username || user.userName}</div>
              <div className="text-sm text-gray-400">
                {onlineUsers?.includes(user._id) ? (
                  <span className="text-[#0080ff]">Active now</span>
                ) : (
                  user.name
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;