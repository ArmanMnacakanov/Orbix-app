import React, { useContext, useMemo } from "react";
import { VideoContext } from "../context/videocontext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Функция для форматирования ISO 8601 (PT4M33S -> 4:33)
const formatDuration = (duration) => {
  if (!duration) return "";
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match?.[1]) || 0;
  const minutes = parseInt(match?.[2]) || 0;
  const seconds = parseInt(match?.[3]) || 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const decodeHtml = (html) => {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const VideoCard = ({ video, showLikeIndicator = false, isCompact = false }) => {
  const { isVideoLiked } = useContext(VideoContext);

  const videoId = video.id?.videoId || video.id;
  const isLiked = isVideoLiked(videoId);

  const { title, channelTitle, formattedDate, thumbnailUrl, duration } =
    useMemo(() => {
      return {
        // ✔ поддержка ОБОИХ форматов
        title: decodeHtml(video.snippet?.title || video.title || "No title"),
        channelTitle: video.snippet?.channelTitle || video.channelTitle || "Unknown",

        thumbnailUrl:
          video.snippet?.thumbnails?.medium?.url ||
          video.snippet?.thumbnails?.high?.url ||
          video.thumbnail,

        duration: formatDuration(video.contentDetails?.duration),

        formattedDate: video.snippet?.publishedAt
          ? new Date(video.snippet.publishedAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
            })
          : "",
      };
    }, [video]);

  // --- КОМПАКТНЫЙ ВИД ---
  if (isCompact) {
    return (
      <Link to={`/watch/${videoId}`} className="group block w-full">
        <div className="flex gap-3 items-start">
          <div className="relative flex-shrink-0 w-40 aspect-video overflow-hidden rounded-xl bg-white/5">
            <img
              src={thumbnailUrl}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              alt={title}
            />
            {duration && (
              <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
                {duration}
              </div>
            )}
          </div>

          <div className="flex flex-col min-w-0 pt-1">
            <h3 className="text-white text-[13px] font-medium leading-snug line-clamp-2 group-hover:text-indigo-400 transition-colors">
              {title}
            </h3>
            <p className="text-gray-500 text-[11px] mt-1 truncate">
              {channelTitle}
            </p>
            <p className="text-gray-600 text-[10px]">{formattedDate}</p>
          </div>
        </div>
      </Link>
    );
  }

  // --- ОБЫЧНЫЙ ВИД ---
  return (
    <div className="relative group">
      <Link to={`/watch/${videoId}`} className="block">
        <motion.div
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={false}
          className="relative p-3 rounded-2xl bg-[#1a1a1a] border border-white/5 group-hover:bg-[#222] group-hover:border-white/10 transition-all duration-200 ease-out will-change-transform"
        >
          <div className="relative overflow-hidden rounded-xl aspect-video mb-3 bg-[#111]">
            <img
              src={thumbnailUrl}
              className="w-full h-full object-cover"
              alt={title}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

            {duration && (
              <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-0.5 rounded text-[11px] font-bold text-white">
                {duration}
              </div>
            )}

            {showLikeIndicator && isLiked && (
              <div className="absolute top-2 left-2 bg-red-600 p-1.5 rounded-full shadow-lg">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase">
              {(channelTitle || "?")[0]}
            </div>

            <div className="flex flex-col min-w-0">
              <h3 className="text-white text-sm font-medium leading-snug line-clamp-2 h-10">
                {title}
              </h3>

              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                <span className="truncate">{channelTitle}</span>
                <span className="w-0.5 h-0.5 bg-gray-600 rounded-full" />
                <span className="whitespace-nowrap">{formattedDate}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
};

export default VideoCard;