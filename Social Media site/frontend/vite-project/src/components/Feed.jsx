import { BiMessageAltDetail } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Post from "../pages/Post";
import Nav from "./Nav";
import StoryDp from "./StoryDp";


function Feed() {
  const {postData}=useSelector(state=>state.post)
  const {userData,notificationData}=useSelector(state=>state.user)
  const {storyList,currentUserStory}=useSelector(state=>state.story)
  const navigate=useNavigate();

  return (
    <div className="lg:w-[50%] w-full bg-black min-h-[100vh] lg:h-[100vh] relative overflow-y-auto">
      
      {/* Header visible ONLY on small screens */}
      <div className="w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden">
        <img src={logo} alt="Logo" className="w-[80px]" />
        <div className="flex items-center gap-[10px]">
       <div className='relative' onClick={()=>navigate("/notifications")}>
                 <FaRegHeart className='text-[white] w-[25px] h-[25px]'/>
                 {notificationData?.length>0 && notificationData.some((noti)=>noti.isRead===false) && (<div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]'></div>)}
                
                   </div>
        <BiMessageAltDetail  className="w-[25px] h-[25px] text-white" onClick={()=>navigate('/messages')}/>
        </div>
      </div>

      {/* Stories Section */}
      <div className="flex w-full overflow-auto gap-[10px] items-center p-[20px]">
        <StoryDp username={"Your Story"} ProfileImage={userData?.user?.profileImage} story={currentUserStory}/>
        {storyList?.map((story,index)=>(
           <StoryDp username={story?.author?.username} ProfileImage={story?.author?.profileImage} story={story} key={index}/>


        ))}
        
      </div>
      <div className="w-full min-h-[100vh]  flex flex-col items-center gap-[20px] p-[10px] pt-[40px] bg-white rounded-t-[60px] relative pb-[120px]">
<Nav/>
{postData && postData.map((post,index)=>(
  <Post post={post} key={index}/>
))}
      </div>
      
      
    </div>
  );
}

export default Feed;
