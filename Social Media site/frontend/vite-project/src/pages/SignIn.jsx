import axios from "axios";
import { useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import logo2 from "../assets/logo.png";
import logo from "../assets/logo2.png";
import { setUserData } from "../redux/userSlice";

function SignIn() {
  const [inputClicked, setInputClicked] = useState({
    username: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignin = async () => {
    setLoading(true);
    setErr("");

    if (!username || !password) {
      setErr("Please fill in both fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { username, password },
        { withCredentials: true }
      );

      console.log("Login success:", res.data);

      // ✅ Save user to Redux and localStorage
      dispatch(setUserData(res.data.user || res.data));
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));

      navigate("/", { replace: true });
      console.log("API Response Structure:", res.data);
console.log("res.data.user:", res.data.user);
console.log("What we're dispatching:", res.data.user || res.data);
    } catch (error) {
      console.log(error);
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      <div className="w-[90%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
        {/* Left Side */}
        <div className="w-full lg:w-[50%] h-full bg-white flex justify-center flex-col items-center p-[10px] gap-[20px]">
          {/* Header */}
          <div className="flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]">
            <span>Sign In to </span>
            <img src={logo} alt="" className="w-[70px]" />
          </div>

          {/* Username */}
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, username: true }))
            }
          >
            <label
              htmlFor="userName"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${inputClicked.username ? "top-[-8px] text-[12px]" : "top-[12px]"}`}
            >
              Enter your Username
            </label>
            <input
              type="text"
              id="userName"
              autoComplete="username"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setUserName(e.target.value)}
              value={username}
            />
          </div>

          {/* Password */}
          <div
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, password: true }))
            }
          >
            <label
              htmlFor="password"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${inputClicked.password ? "top-[-8px] text-[12px]" : "top-[12px]"}`}
            >
              Enter your Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
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

          {/* Forgot Password */}
          <div
            className="w-[90%] px-[20px] cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password
          </div>

          {/* Error */}
          {err && <p className="text-red-500">{err}</p>}

          {/* Button */}
          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white h-[50px] rounded-2xl font-semibold hover:bg-gray-800 mt-[30px] transition cursor-pointer"
            onClick={handleSignin}
            disabled={loading}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Sign In"}
          </button>

          {/* Navigate to SignUp */}
          <p
            className="cursor-pointer text-gray-800"
            onClick={() => navigate("/signup")}
          >
            Don’t have an account?{" "}
            <span className="border-b-2 border-b-black pb-[3px] text-black">
              Sign Up
            </span>
          </p>
        </div>

        {/* Right Side */}
        <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-black flex-col gap-[10px] text-white text-[16px] font-semibold shadow-2xl shadow-black">
          <img src={logo2} alt="" className="w-[40%]" />
          <p>Not just a platform. It’s a Vybe.</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
