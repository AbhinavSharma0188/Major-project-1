import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import FollowButton from "../components/FollowButton";
import Nav from "../components/Nav";
import Post from "../pages/Post";
import { setSelectedUser } from "../redux/messageSlice";
import { setProfileData, setUserData } from "../redux/userSlice";

function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const actualUser = userData?.user || userData;
  const navigate = useNavigate();
  const [postType, setPostType] = useState("posts");

  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getprofile/${username}`,
        { withCredentials: true }
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      console.log(result);
      dispatch(setUserData(null));
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  // Function to refresh profile data after save/unsave
  const handleSaveUpdate = async () => {
    await handleProfile();
  };

  useEffect(() => {
    handleProfile();
  }, [username, dispatch]);

  // Loading state - return early if profileData is not loaded yet
  if (!profileData) {
    return (
      <div className="w-full min-h-screen bg-black flex justify-center items-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Header */}
      <div className="w-full h-[80px] flex justify-between items-center px-[30px] text-white">
        <div
          onClick={() => {
            navigate("/");
          }}
        >
          <IoMdArrowRoundBack className="text-white w-[25px] h-[25px] cursor-pointer" />
        </div>
        <div className="text-[20px] font-semibold">{profileData?.username}</div>
        <div
          className="font-semibold cursor-pointer text-[20px] text-blue-500"
          onClick={handleLogout}
        >
          Log Out
        </div>
      </div>

      {/* Profile Info */}
      <div className="w-full h-[150px] flex items-start gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center">
        <div className="w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
          <img
            src={profileData?.profileImage || dp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-white text-[22px]">
            {profileData?.name}
          </div>
          <div className="text-[17px] text-white">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-[17px] text-white">{profileData?.bio}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full h-[100px] text-white flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px]">
        <div>
          <div className="text-white text-[22px] md:text-[30px] font-semibold">
            {profileData?.posts?.length || 0}
          </div>
          <div className="text-[18px] md:text-[22px] text-white">Posts</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-[20px]">
            <div className="flex relative">
              {profileData?.followers?.slice(0, 3).map((user, index) => (
                <div
                  key={user._id || index}
                  className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${
                    index > 0 ? `absolute left-[${index * 9}px]` : ""
                  }`}
                >
                  <img
                    src={user.profileImage || dp}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.followers?.length || 0}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-white">Followers</div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-[20px]">
            <div className="flex relative">
              {profileData?.following?.slice(0, 3).map((user, index) => (
                <div
                  key={user._id || index}
                  className={`w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden ${
                    index > 0 ? `absolute left-[${index * 9}px]` : ""
                  }`}
                >
                  <img
                    src={user.profileImage || dp}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-[22px] md:text-[30px] font-semibold">
              {profileData?.following?.length || 0}
            </div>
          </div>
          <div className="text-[18px] md:text-[22px] text-white">Following</div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]">
        {profileData._id === actualUser?._id && (
          <button
            className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl"
            onClick={() => {
              navigate("/editprofile");
            }}
          >
            Edit Profile
          </button>
        )}
        {profileData._id !== actualUser?._id && (
          <FollowButton
            tailwind={
              "px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl"
            }
            targetUserId={profileData._id}
            onFollowChange={handleProfile}
          />
        )}
        {profileData._id !== actualUser?._id && (
         <button className="px-[10px] min-w-[150px] py-[5px] h-[40px] bg-white cursor-pointer rounded-2xl" onClick={()=>{dispatch(setSelectedUser(profileData))
  navigate(`/messageArea/${profileData.username}`)
}}>
  Message
</button>
        )}
      </div>

      {/* Posts Section */}
      <div className="w-full min-h-[100vh] flex justify-center relative">
        <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-white relative">
          {/* Tab Navigation - Fixed at top */}
          <div className="w-[90%] max-w-[600px] h-[80px] bg-gray-100 rounded-full flex justify-around items-center gap-[10px] mt-[30px] mb-[20px]">
            <div
              className={`${
                postType === "posts"
                  ? "bg-black text-white shadow-2xl shadow-black"
                  : ""
              } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
              onClick={() => setPostType("posts")}
            >
              Posts
            </div>
            <div
              className={`${
                postType === "saved"
                  ? "bg-black text-white shadow-2xl shadow-black"
                  : ""
              } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
              onClick={() => setPostType("saved")}
            >
              Saved
            </div>
          </div>

          {/* Posts Content with proper spacing */}
          <div className="w-full flex flex-col items-center gap-[20px] pb-[100px]">
            {postType === "posts" && (
              <>
                {postData && postData.length > 0 ? (
                  postData
                    .filter((post) => post.author?._id === profileData?._id)
                    .map((post, index) => (
                      <Post
                        key={post._id || index}
                        post={post}
                        onSaveUpdate={handleSaveUpdate}
                      />
                    ))
                ) : (
                  <div className="text-gray-500 text-lg mt-[50px]">
                    No posts yet
                  </div>
                )}
              </>
            )}

            {/* Saved Posts Content */}
            {postType === "saved" && (
              <>
                {profileData.saved && profileData.saved.length > 0 ? (
                  profileData.saved.map((post, index) => (
                    <Post
                      key={post._id || index}
                      post={post}
                      onSaveUpdate={handleSaveUpdate}
                    />
                  ))
                ) : (
                  <div className="text-gray-500 text-lg mt-[50px]">
                    No saved posts yet
                  </div>
                )}
               
              </>
            )}
          </div>
        </div>
        <Nav />
      </div>
    </div>
  );
}

export default Profile;
