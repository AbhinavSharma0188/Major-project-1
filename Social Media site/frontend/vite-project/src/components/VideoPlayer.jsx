import { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import { IoIosVolumeOff } from "react-icons/io";

function VideoPlayer({ media, showControls = true, initialMuted = false }) {
  const videoTag = useRef();
  const [mute, setMute] = useState(initialMuted);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleClick = () => {
    if (isPlaying) {
      videoTag.current.pause();
      setIsPlaying(false);
    } else {
      videoTag.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setMute(!mute);
    videoTag.current.muted = !videoTag.current.muted;
  };

  useEffect(() => {
    const video = videoTag.current;
    if (!video) return;
    
    console.log("Video element exists");
    console.log("Video readyState:", video.readyState);
    console.log("Video error:", video.error);
    
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            video.play().catch(e => console.log("Play failed:", e));
            setIsPlaying(true)
        } else {
            video.pause();
            setIsPlaying(false)
        }
    }, {threshold: 0.6});
    
    observer.observe(video);
    
    return () => {
        observer.unobserve(video);
    };
  }, []);

  return (
    <div className="h-[100%] relative cursor-pointer max-w-full rounded-2xl overflow-hidden">
      <video
        ref={videoTag}
        src={media}
        autoPlay
        loop
        muted={mute}
        className="h-[100%] w-full rounded-2xl object-cover cursor-pointer"
        onClick={handleClick}
      />
      {showControls && (
        <div
          className="absolute bottom-[10px] right-[10px]"
          onClick={toggleMute}
        >
          {mute ? (
            <IoIosVolumeOff className="w-[20px] h-[20px] font-semibold text-white" />
          ) : (
            <FaVolumeUp className="w-[20px] h-[20px] font-semibold text-white" />
          )}
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;