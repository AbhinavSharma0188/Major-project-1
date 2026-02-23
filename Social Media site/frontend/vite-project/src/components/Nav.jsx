import { FaPlusSquare, FaSearch } from "react-icons/fa";
import { GoHomeFill } from "react-icons/go";
import { RiVideoLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import logo from "../assets/logo.png"; // Added this

function Nav() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  return (
    <div
      className="w-[90%] lg:w-[40%] h-[80px] bg-black flex items-center justify-around
      fixed bottom-[20px] left-1/2 -translate-x-1/2 rounded-full shadow-2xl shadow-black z-[100] text-white text-[26px]"
    >
      {/* Home */}
      <GoHomeFill className="cursor-pointer" onClick={()=>navigate('/')}/>

      {/* Search */}
      <FaSearch className="cursor-pointer" onClick={()=>navigate('/search')}/>

      {/* Add Post */}
      <FaPlusSquare className="cursor-pointer"onClick={()=>navigate('/upload')} />

      {/* Reels / Video */}
      <RiVideoLine className="cursor-pointer" onClick={()=>navigate('/loops')} />

      {/* Profile */}
      <div
        className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
        onClick={() => navigate(`/profile/${userData?.user?.username}`)}
      >
        <img
         src={userData?.user?.profileImage || userData?.profileImage || dp}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* FlowForge Project Link - Added this block */}
      <a 
        href="https://flow-forge-frontend.onrender.com/watch-video/699747af9e397fc42a9d9ee2" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center hover:scale-110 transition-transform"
      >
        <img src={logo} alt="FlowForge" className="w-[30px] h-[30px] object-contain rounded-full" />
      </a>
    </div>
  );
}

export default Nav;
