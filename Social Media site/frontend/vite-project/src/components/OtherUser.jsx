import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import dp from "../assets/dp.webp"
import FollowButton from "./FollowButton"

function OtherUser({user}) {
    const {userData}=useSelector(state=>state.user)
    const navigate=useNavigate()
  return (
    <div className="w-full h-[80px] flex items-center justify-between border-b-2 border-b-gray-800">
        <div className=" flex items-center gap-[10px] ">
                <div className="w-[50px] h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden"onClick={()=>navigate(`/profile/${user.username}`)}>
                  <img
                    src={user.profileImage || dp}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
        
                <div>
                  <div className="text-white font-semibold text-[18px]">
                    {user.username || "Guest User"}
                  </div>
                  <div className="text-gray-400 text-[15px]  font-semibold">
                    {user.name || "username"}
                  </div>
                </div>
                
             </div>
             <FollowButton tailwind={"px-[10px] w-[100px] py-[5px] h-[40px] bg-white rounded-2xl"} targetUserId={user._id}/>
             
    </div>
  )
}

export default OtherUser