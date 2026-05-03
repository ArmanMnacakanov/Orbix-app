import { createContext, useState } from "react";

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [likedVideos, setLikedVideos] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);

  const getId = (video) => video?.id?.videoId || video?.id;

  // ❤️ like
  const toggleLike = (video) => {
    const id = getId(video);

    setLikedVideos((prev) => {
      const exists = prev.find((v) => getId(v) === id);

      if (exists) {
        return prev.filter((v) => getId(v) !== id);
      }

      return [...prev, video];
    });
  };

  const isVideoLiked = (id) => {
    return likedVideos.some((v) => getId(v) === id);
  };

  // 📺 history
  const addToHistory = (video) => {
    const id = getId(video);

    setWatchHistory((prev) => {
      const filtered = prev.filter((v) => getId(v) !== id);
      return [video, ...filtered].slice(0, 50);
    });
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        setVideos,
        selectedVideo,
        setSelectedVideo,

        likedVideos,
        toggleLike,
        isVideoLiked,

        watchHistory,
        addToHistory,

        getId,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
