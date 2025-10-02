import axios from "axios";
import { useRef, useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { serverUrl } from "../App";
import VideoPlayer from "../components/VideoPlayer";
import { setLoopData } from "../redux/loopSlice";
import { setPostData } from "../redux/postSlice";
import { setCurrentUserStory } from "../redux/storySlice";

function Upload() {
  const [uploadType, setUploadType] = useState("post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const mediaInput = useRef();
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { storyData } = useSelector((state) => state.story);
  const { loopData } = useSelector((state) => state.loop);
  const [loading, setLoading] = useState(false);

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log(file);
    if (file.type.includes("image")) {
      setMediaType("image");
    } else {
      setMediaType("video");
    }
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  const uploadPost = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/post/upload`,
        formData,
        { withCredentials: true }
      );
      dispatch(setPostData([...postData, result.data]));
      console.log(result);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const uploadStory = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/story/upload`,
        formData,
        { withCredentials: true }
      );
      dispatch(setCurrentUserStory(result.data))
     
      console.log(result);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const uploadLoop = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/loop/upload`,
        formData,
        { withCredentials: true }
      );
      dispatch(setLoopData([...loopData, result.data]));
      console.log(result);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = () => {
    setLoading(true);
    if (uploadType === "post") {
      uploadPost();
    }
    if (uploadType === "story") {
      uploadStory();
    }
    if (uploadType === "loop") {
      uploadLoop(); // ✅ fixed
    }
  };

  return (
    <div className="w-full h-[100vh] bg-black flex flex-col items-center">
      {/* Header */}
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <IoMdArrowRoundBack
          className="text-white w-[25px] h-[25px] cursor-pointer"
          onClick={() => navigate(`/`)}
        />
        <h1 className="text-white font-semibold text-[20px]">Upload Media</h1>
      </div>

      {/* Toggle Buttons */}
      <div className="w-[90%] max-w-[600px] h-[80px] bg-white rounded-full flex justify-around items-center gap-[10px]">
        <div
          className={`${
            uploadType === "post"
              ? "bg-black text-white shadow-2xl shadow-black"
              : ""
          } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
          onClick={() => setUploadType("post")}
        >
          Post
        </div>
        <div
          className={`${
            uploadType === "story"
              ? "bg-black text-white shadow-2xl shadow-black"
              : ""
          } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
          onClick={() => setUploadType("story")}
        >
          Story
        </div>
        <div
          className={`${
            uploadType === "loop"
              ? "bg-black text-white shadow-2xl shadow-black"
              : ""
          } w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black`}
          onClick={() => setUploadType("loop")}
        >
          Loop
        </div>
      </div>

      {!frontendMedia && (
        <div
          className="w-[80%] max-w-[500px] h-[250px] bg-black border-gray-800 border-2 flex flex-col justify-center items-center gap-[8px] mt-[15vh] rounded-2xl cursor-pointer hover:bg-gray-600"
          onClick={() => mediaInput.current.click()}
        >
          <FaPlusSquare className="cursor-pointer text-white w-[25px] h-[25px]" />
          <div className="text-white text-[19px] font-semibold">
            Upload {uploadType}
          </div>
        </div>
      )}

      {frontendMedia && (
        <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]">
          {mediaType === "image" && (
            <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col justify-center items-center">
              <img
                src={frontendMedia}
                alt="preview"
                className="h-[60%] rounded-2xl"
              />
              {uploadType !== "story" && (
                <input
                  type="text"
                  className="w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]"
                  placeholder="Write caption"
                  onChange={(e) => setCaption(e.target.value)}
                  value={caption}
                />
              )}
            </div>
          )}
          {mediaType === "video" && (
            <div className="w-[80%] max-w-[500px] h-[250px] flex flex-col justify-center items-center">
              <VideoPlayer media={frontendMedia} />
              {uploadType !== "story" && (
                <input
                  type="text"
                  className="w-full border-b-gray-400 border-b-2 outline-none px-[10px] py-[5px] text-white mt-[20px]"
                  placeholder="Write caption"
                  onChange={(e) => setCaption(e.target.value)}
                  value={caption}
                />
              )}
            </div>
          )}
        </div>
      )}

      {frontendMedia && (
        <button
          onClick={handleUpload}
          className="px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white mt-[50px] cursor-pointer rounded-2xl"
        >
          {loading ? <ClipLoader size={30} /> : ` Upload ${uploadType}`}
        </button>
      )}

      {/* Hidden Input */}
      <input type="file" accept={uploadType=="loop"?"video/*":""}hidden ref={mediaInput} onChange={handleMedia} />
    </div>
  );
}

export default Upload;
