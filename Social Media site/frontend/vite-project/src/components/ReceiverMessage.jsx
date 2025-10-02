// ReceiverMessage.jsx
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import dp from "../assets/dp.webp";

function ReceiverMessage({ message }) {
  const { userData } = useSelector(state => state.user);
  const { selectedUser } = useSelector(state => state.message);
  const scroll=useRef()
  

  useEffect(() => {
      if (scroll.current) {
        scroll.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [message]);
  return (
    <div ref ={scroll} className="w-fit max-w-[75%] bg-gray-800 shadow-lg rounded-[20px] rounded-tl-[4px] px-[16px] py-[12px] relative left-0 flex flex-col gap-[8px] backdrop-blur-sm border border-gray-700/30">
      {message.image && 
        <img src={message.image} alt="" className="h-[220px] w-full object-cover rounded-[16px] shadow-md"/>                   
      }
      {message.message && 
        <div className="text-[16px] text-gray-100 leading-relaxed break-words font-medium">
          {message.message}
        </div>
      }
      <div className="text-[11px] text-gray-400 self-start mt-[2px] font-medium">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="w-[28px] h-[28px] rounded-full cursor-pointer overflow-hidden absolute left-[-12px] bottom-[-2px] border-2 border-black shadow-lg">
        <img src={selectedUser.profileImage || dp} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default ReceiverMessage;