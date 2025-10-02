import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack, IoMdSend } from "react-icons/io";
import { LuImage } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";
import ReceiverMessage from "../components/ReceiverMessage";
import SenderMessage from "../components/SenderMessage";
import { setMessages } from "../redux/messageSlice";

function MessageArea() {
  const navigate = useNavigate();
  const { username } = useParams();
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { userData } = useSelector(state => state.user);
  const { socket } = useSelector(state => state.socket);
  const dispatch = useDispatch();
  
  const [input, setInput] = useState("");
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUser = userProfile || selectedUser;
  const currentUserId = userData?.user?._id || userData?._id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) return;
      
      if (selectedUser && (selectedUser.username === username || selectedUser.userName === username)) {
        setUserProfile(selectedUser);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${serverUrl}/api/user/getprofile/${username}`, {
          withCredentials: true
        });
        setUserProfile(response.data.user || response.data);
        
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, selectedUser]);

  useEffect(() => {
    if (currentUser?._id) {
      const getAllMessages = async () => {
        try {
          const result = await axios.get(`${serverUrl}/api/message/getall/${currentUser._id}`, {withCredentials: true});
          dispatch(setMessages(result.data));
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };
      getAllMessages();
    }
  }, [currentUser?._id, dispatch]);

  useEffect(() => {
    if (!socket) {
      console.log("Socket not available");
      return;
    }
    
    console.log("Setting up socket listener");
    
    const handleNewMessage = (newMessage) => {
      console.log("New message received:", newMessage);
      dispatch(setMessages([...(messages || []), newMessage]));
    };
    
    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch, messages]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim() && !backendImage) return;
    
    try {
      const formData = new FormData();
      
      if (input.trim()) {
        formData.append("message", input);
      }
      
      if (backendImage) {
        formData.append("image", backendImage);
      }
      
      const result = await axios.post(
        `${serverUrl}/api/message/send/${currentUser._id}`, 
        formData, 
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      dispatch(setMessages([...(messages || []), result.data]));
      
      setInput("");
      setFrontendImage(null);
      setBackendImage(null);
      
      if (imageInput.current) {
        imageInput.current.value = '';
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[100vh] bg-black flex items-center justify-center">
        <div className="text-white text-[18px]">Loading user...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="w-full h-[100vh] bg-black flex items-center justify-center">
        <div className="text-white text-[18px]">User not found</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[100vh] bg-black relative">
      <div className="flex items-center gap-[15px] px-[20px] py-[10px] fixed top-0 z-[100] bg-black w-full">
        <div className="h-[80px] flex items-center gap-[20px] px-[20px]">
          <IoMdArrowRoundBack
            className="text-white w-[25px] h-[25px] cursor-pointer"
            onClick={() => navigate(`/`)}
          />
        </div>

        <div
          className="w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
          onClick={() => navigate(`/profile/${currentUser.username || currentUser.userName}`)}
        >
          <img
            src={currentUser.profileImage || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-white font-semibold text-[18px]">
          <div>{currentUser.username || currentUser.userName || "Unknown User"}</div>
          <div className="text-[14px] text-gray-400">{currentUser.name || "No name"}</div>
        </div>
      </div>
      
      <div className="w-full h-[80%] pt-[100px] pb-[80px] lg:pb-[80px] flex flex-col gap-[20px] overflow-auto bg-black px-[20px]">
        {messages && Array.isArray(messages) && messages.length > 0 ? (
          messages.map((mess, index) => {
            if (!currentUserId) {
              return <ReceiverMessage key={index} message={mess} />;
            }
            
            const isCurrentUserMessage = String(mess.sender) === String(currentUserId);
            
            return isCurrentUserMessage ? (
              <SenderMessage key={index} message={mess} />
            ) : (
              <ReceiverMessage key={index} message={mess} />
            );
          })
        ) : (
          <div className="text-white text-center">No messages yet</div>
        )}
      </div>
      
      <div className="w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-black z-[100]">
        <form className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#131616] flex items-center gap-[10px] px-[20px] relative" onSubmit={handleSendMessage}>
          {frontendImage && (
            <div className="w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden">
              <img src={frontendImage} alt="" className="h-full object-cover" />
            </div>
          )}
          
          <input type="file" accept="image/*" hidden ref={imageInput} onChange={handleImage} />
          <input
            type="text"
            placeholder="Message"
            className="w-full h-full px-[20px] text-[18px] text-white outline-0 bg-transparent"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <div onClick={() => imageInput.current.click()}>
            <LuImage className="w-[28px] h-[28px] text-white cursor-pointer" />
          </div>
          {(input.trim() || frontendImage) && (
            <button 
              type="submit"
              className="w-[60px] h-[40px] rounded-full bg-gradient-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center cursor-pointer"
            >
              <IoMdSend className="w-[25px] h-[25px] text-white" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default MessageArea;