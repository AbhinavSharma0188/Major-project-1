// SenderMessage.jsx
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

function SenderMessage({ message }) {
  const { userData } = useSelector(state => state.user);
  const scroll = useRef();

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]); // Use the entire message object as dependency

  return (
    <div 
      ref={scroll} 
      className="w-fit max-w-[75%] bg-gradient-to-br from-[#8B5CF6] via-[#A855F7] to-[#EC4899] shadow-lg rounded-[20px] rounded-tr-[4px] px-[16px] py-[12px] relative ml-auto right-0 flex flex-col gap-[8px] backdrop-blur-sm"
    >
      {message.image && 
        <img 
          src={message.image} 
          alt="" 
          className="h-[220px] w-full object-cover rounded-[16px] shadow-md"
        />                   
      }
      {message.message && 
        <div className="text-[16px] text-white leading-relaxed break-words font-medium drop-shadow-sm">
          {message.message}
        </div>
      }
      <div className="text-[11px] text-white/80 self-end mt-[2px] font-medium">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="w-[28px] h-[28px] rounded-full cursor-pointer overflow-hidden absolute right-[-12px] bottom-[-2px] border-2 border-black shadow-lg">
        <img 
          src={userData?.user?.profileImage || dp} 
          alt="" 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  );
}

export default SenderMessage;