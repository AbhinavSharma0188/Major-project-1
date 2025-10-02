import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [inputClicked, setInputClicked] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleStep1 = async () => {
    setLoading(true);
    setErr("");
    setSuccess("");
    if (!email) {
      setErr("Email is required.");
      setLoading(false);
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/sendOtp`,
        { email },
        { withCredentials: true }
      );
      setSuccess("OTP sent successfully. Check your email.");
      console.log(result.data);
      setStep(2);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleStep2 = async () => {
    setLoading(true);
    setErr("");
    setSuccess("");
    if (!otp) {
      setErr("OTP is required.");
      setLoading(false);
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyOtp`,
        { email, otp },
        { withCredentials: true }
      );
      setSuccess("OTP verified successfully.");
      console.log(result.data);
      setStep(3);
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleStep3 = async () => {
    setLoading(true);
    setErr("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      setErr("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/resetPassword`,
        { email, password: newPassword },
        { withCredentials: true }
      );
      setSuccess("Password reset successful. Redirecting to Sign In...");
      console.log(result.data);

      // redirect after 2s
      setTimeout(() => navigate("/signin"), 2000);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col justify-center items-center">
      {/* Step UI */}
      {step === 1 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <h2 className="text-[30px] font-semibold">Forgot Password</h2>
          <div
            className="relative flex items-center mt-[30px] justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked((prev) => ({ ...prev, email: true }))}
          >
            <label
              htmlFor="email"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${inputClicked.email ? "top-[-8px] text-[12px]" : "top-[12px]"}`}
            >
              Enter your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          {err && <p className="text-red-500 mt-2">{err}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white h-[50px] rounded-2xl font-semibold hover:bg-gray-800 mt-[30px] transition cursor-pointer"
            disabled={loading}
            onClick={handleStep1}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <h2 className="text-[30px] font-semibold">Verify OTP</h2>
          <div
            className="relative flex items-center mt-[30px] justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked((prev) => ({ ...prev, otp: true }))}
          >
            <label
              htmlFor="otp"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${inputClicked.otp ? "top-[-8px] text-[12px]" : "top-[12px]"}`}
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
          </div>
          {err && <p className="text-red-500 mt-2">{err}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white h-[50px] rounded-2xl font-semibold hover:bg-gray-800 mt-[30px] transition cursor-pointer"
            disabled={loading}
            onClick={handleStep2}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Submit"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]">
          <h2 className="text-[30px] font-semibold">Reset Password</h2>

          {/* New Password */}
          <div
            className="relative flex items-center mt-[30px] justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked((prev) => ({ ...prev, newPassword: true }))}
          >
            <label
              htmlFor="newPassword"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${inputClicked.newPassword ? "top-[-8px] text-[12px]" : "top-[12px]"}`}
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
          </div>

          {/* Confirm Password */}
          <div
            className="relative flex items-center mt-[20px] justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
            onClick={() => setInputClicked((prev) => ({ ...prev, confirmNewPassword: true }))}
          >
            <label
              htmlFor="confirmNewPassword"
              className={`absolute left-[20px] px-[15px] bg-white text-[15px] text-gray-700 transition-all duration-200
                ${inputClicked.confirmNewPassword ? "top-[-8px] text-[12px]" : "top-[12px]"}`}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              className="w-full h-full rounded-2xl px-[20px] outline-none border-0"
              required
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              value={confirmNewPassword}
            />
          </div>

          {err && <p className="text-red-500 mt-2">{err}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}

          <button
            className="w-[70%] px-[20px] py-[10px] bg-black text-white h-[50px] rounded-2xl font-semibold hover:bg-gray-800 mt-[30px] transition cursor-pointer"
            disabled={loading}
            onClick={handleStep3}
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
