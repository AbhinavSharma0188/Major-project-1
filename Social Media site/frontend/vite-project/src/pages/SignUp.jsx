import axios from "axios";
import { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import logo2 from '../assets/logo.png';
import logo from "../assets/logo2.png";
import { setUserData } from "../redux/userSlice";

function SignUp() {
  const [inputClicked, setInputClicked] = useState({
    name: false,
    username: false,
    email: false,
    password: false,
  });
  const [err,setErr]=useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [name,setName]=useState("")
  const [username,setUserName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const[loading,setLoading]=useState(false)
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleSignup=async()=>{
    setLoading(true)
    setErr("")
    try {
      const res=await axios.post(`${serverUrl}/api/auth/signup`,{name,username,email,password},{withCredentials:true})
   dispatch(setUserData(res.data))
      setLoading(false)
    } catch (error) {
      setErr(error.response?.data?.message)
      console.log(error);
      setLoading(false)
      
    }

  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
        {/* Left Side */}
        <div className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[20px]">
          {/* Header */}
          <div className="flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]">
            <span>Sign Up to </span>
            <img src={logo} alt="" className="w-[70px]" />
          </div>

          {/* Name */}
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black"
            onClick={() => setInputClicked((prev) => ({ ...prev, name: true }))}
          >
            <label
              htmlFor="name"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${inputClicked.name ? "top-[-8px] text-[12px]" : "top-[12px]"}`}
            >
              Enter your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
            onChange={(e)=>setName(e.target.value)} value={name}/>
          </div>

          {/* Username */}
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black"
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, username: true }))
            }
          >
            <label
              htmlFor="userName"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${
                  inputClicked.username
                    ? "top-[-8px] text-[12px]"
                    : "top-[12px]"
                }`}
            >
              Enter your Username
            </label>
            <input
              type="text"
              id="userName"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
            onChange={(e)=>setUserName(e.target.value)} value={username} />
          </div>

          {/* Email */}
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black"
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, email: true }))
            }
          >
            <label
              htmlFor="email"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${
                  inputClicked.email ? "top-[-8px] text-[12px]" : "top-[12px]"
                }`}
            >
              Enter your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
            onChange={(e)=>setEmail(e.target.value)} value={email} />
          </div>

          {/* Password */}
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl  border-2 border-black"
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, password: true }))
            }
          >
            <label
              htmlFor="password"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${
                  inputClicked.password
                    ? "top-[-8px] text-[12px]"
                    : "top-[12px]"
                }`}
            >
              Enter your Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
            onChange={(e)=>setPassword(e.target.value)} value={password} />
            {!showPassword ? (
              <IoIosEye
                className="absolute cursor-pointer right-[20px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <IoIosEyeOff
                className="absolute cursor-pointer right-[20px] w-[25px] h-[25px]"
                onClick={() => setShowPassword(false)}
              />
            )}
            
           
          </div>
          <button className="w-[70%] px-[20px] py-[10px] bg-black text-white h-[50px] rounded-2xl font-semibold hover:bg-gray-800 mt-[30px] transition cursor-pointer"onClick={handleSignup} disabled={loading}>
           {loading?<ClipLoader size={30} color="white"/>:"Sign Up"} 
          </button>
          <p className="cursor-pointer text-gray-800" onClick={()=>navigate("/signin")}>
            Already have an account ?<span className="border-b-2 border-b-black pb-[3px] text-black">Sign In</span>
          </p>
          {err&& <p className="text-red-500">{err}</p>}
        </div>

        {/* Right Side */}
        <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-black flex-col gap-[10px] text-white text-[16px] font-semibold rounded-1-[30px] shadow-2xl shadow-black">
          <img src={logo2} alt="" className="w-[40%]" />
          <p>Not just a platform. It’s a Vybe.</p>
          {/* Right panel content */}
        </div>
      </div>
    </div>
  );
}

export default SignUp;
