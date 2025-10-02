import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import dp from "../assets/dp.webp";
import { setProfileData, setUserData } from "../redux/userSlice";

function EditProfile() {
  const { userData } = useSelector((state) => state.user);
  const imageInput = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [frontendImage, setFrontendImage] = useState(dp);
  const [backendImage, setBackendImage] = useState(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        if (res.data.user) {
          dispatch(setUserData({ user: res.data.user })); // keep the .user wrapper
          dispatch(setProfileData(res.data.user));
        }
      } catch (err) {
        console.error("Fetch user error:", err);
      }
    };
    fetchUser();
  }, [dispatch]);

  // Sync form fields when userData changes
  useEffect(() => {
    if (userData?.user) {
      setName(userData.user.name || "");
      setUsername(userData.user.username || "");
      setBio(userData.user.bio || "");
      setProfession(userData.user.profession || "");
      setGender(userData.user.gender || "");
      setFrontendImage(userData.user.profileImage || dp);
    }
  }, [userData]);

  // Handle image selection
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
    }
  };

  // Handle profile update
  const handleEditProfile = async () => {
    if (loading) return; // prevent double submission
    setLoading(true);

    try {
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("username", username);
      formdata.append("bio", bio);
      formdata.append("profession", profession);
      formdata.append("gender", gender);
      if (backendImage) formdata.append("profileImage", backendImage);

      const result = await axios.post(
        `${serverUrl}/api/user/editprofile`,
        formdata,
        { withCredentials: true }
      );

      if (result.data.user) {
        // ✅ Keep Redux shape consistent
        dispatch(setUserData({ user: result.data.user }));
        dispatch(setProfileData(result.data.user));

        // Navigate safely
        navigate(`/profile/${result.data.user.username}`);
      } else {
        console.error("No user returned from editProfile:", result.data);
      }
    } catch (error) {
      console.error("Edit profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <IoMdArrowRoundBack
          className="text-white w-[25px] h-[25px] cursor-pointer"
          onClick={() =>
            navigate(`/profile/${userData?.user?.username || ""}`)
          }
        />
        <h1 className="text-white font-semibold text-[20px]">Edit Profile</h1>
      </div>

      {/* Profile Image */}
      <div
        className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-2 border-black rounded-full cursor-pointer overflow-hidden"
        onClick={() => imageInput.current.click()}
      >
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          hidden
          onChange={handleImage}
        />
        <img
          src={frontendImage}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className="text-blue-500 text-center text-[18px] font-semibold cursor-pointer"
        onClick={() => imageInput.current.click()}
      >
        Change Your Profile Picture
      </div>

      {/* Form Inputs */}
      <input
        type="text"
        placeholder="Enter Your Name"
        className="w-[90%] max-w-[600px] h-[60px] bg-black border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <input
        type="text"
        placeholder="Enter Your Username"
        className="w-[90%] max-w-[600px] h-[60px] bg-black border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <input
        type="text"
        placeholder="Bio"
        className="w-[90%] max-w-[600px] h-[60px] bg-black border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
      />
      <input
        type="text"
        placeholder="Profession"
        className="w-[90%] max-w-[600px] h-[60px] bg-black border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold"
        onChange={(e) => setProfession(e.target.value)}
        value={profession}
      />
      <input
        type="text"
        placeholder="Gender"
        className="w-[90%] max-w-[600px] h-[60px] bg-black border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold"
        onChange={(e) => setGender(e.target.value)}
        value={gender}
      />

      {/* Save Button */}
      <button
        className="px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl"
        onClick={handleEditProfile}
        disabled={loading}
      >
        {loading ? <ClipLoader size={30} color="black" /> : "Save Profile"}
      </button>
    </div>
  );
}

export default EditProfile;
