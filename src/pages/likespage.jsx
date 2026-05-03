import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { VideoContext } from "../context/videocontext";
const LikesPage = () => {
  const { likedVideos } = useContext(VideoContext);

  return (
    <div className="min-h-screen bg-black  text-white p-6">

      <h1 className="text-2xl font-bold mb-4">
        Liked Videos
      </h1>

      {likedVideos.length === 0 ? (
        <p className="text-gray-400">
          No liked videos
        </p>
      ) : (
      <div className="flex flex-col pt-6 gap-4">
  {likedVideos.map((video) => (
    <Link
      key={video.id}
      to={`/watch/${video.id}`}
      className="flex gap-3 bg-white/5 hover:bg-white/10 transition p-2 rounded-xl"
    >
      {/* Thumbnail */}
      <div className="min-w-[140px] max-w-[140px] h-[80px] overflow-hidden rounded-lg">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between">
        <h2 className="text-sm font-semibold line-clamp-2">
          {video.title}
        </h2>

        <p className="text-gray-400 text-xs mt-1">
          {video.channel}
        </p>
      </div>
    </Link>
  ))}
</div>
      )}

    </div>
  );
};

export default LikesPage;