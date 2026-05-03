import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { youtubeAPI } from "../services/youtubeapi";
import { VideoContext } from "../context/videocontext";
import VideoCard from "../components/videocard";
import { motion } from "framer-motion";

const VideoPlayerPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(true);

  const { toggleLike, isVideoLiked, addToHistory } = useContext(VideoContext);

  // Функция нормализации данных для компонента VideoCard
  const normalize = (item) => ({
    id: item.id?.videoId || item.id,
    snippet: item.snippet,
    contentDetails: item.contentDetails,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingRelated(true);

        // 1. Загружаем основное видео
        const data = await youtubeAPI.getVideoById(videoId);
        if (!data) return;
        setVideo(data);

        // 2. Добавляем в историю (из контекста)
        addToHistory({
          id: videoId,
          title: data.snippet?.title,
          thumbnail: data.snippet?.thumbnails?.high?.url,
          channel: data.snippet?.channelTitle,
        });

        // 3. Получаем список похожих видео (через поиск по названию)
        const searchResult = await youtubeAPI.searchVideos(
          data.snippet.title,
          12,
        );

        // 4. Извлекаем ID и делаем запрос за деталями (длительность и т.д.)
        const relatedIds = searchResult
          .map((v) => v.id?.videoId)
          .filter((id) => id && id !== videoId)
          .join(",");

        if (relatedIds) {
          const detailedRelated = await youtubeAPI.getVideosByIds(relatedIds);
          // Сразу нормализуем при сохранении в стейт
          setRelatedVideos(detailedRelated.map(normalize));
        } else {
          setRelatedVideos([]);
        }
      } catch (err) {
        console.error("Error loading video page:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    loadData();
    // Прокрутка наверх при смене видео
    window.scrollTo(0, 0);
  }, [videoId]);

  if (!video) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="animate-pulse text-indigo-500 font-bold text-xl">
          Загрузка Orbix Player...
        </div>
      </div>
    );
  }

  const liked = isVideoLiked(videoId);

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-12 text-white px-4 md:px-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🎥 ПЛЕЕР И ИНФОРМАЦИЯ */}
        <div className="lg:col-span-2">
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-black">
            <iframe
              title="YouTube video player"
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold leading-tight">
              {video.snippet.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-xl uppercase">
                  {video.snippet.channelTitle?.[0]}
                </div>
                <div>
                  <p className="font-bold text-lg">
                    {video.snippet.channelTitle}
                  </p>
                  <p className="text-gray-500 text-sm">Автор Orbix</p>
                </div>
              </div>

              <button
                onClick={() => toggleLike(normalize(video))}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all active:scale-95 ${
                  liked
                    ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                {liked ? "❤️ В коллекции" : "🤍 Нравится"}
              </button>
            </div>

            <div className="mt-6 p-4 bg-white/5 rounded-2xl">
              <p className="text-gray-300 text-sm whitespace-pre-wrap">
                {video.snippet.description}
              </p>
            </div>
          </div>
        </div>

        {/* 🔗 ПРАВАЯ ПАНЕЛЬ: ПОХОЖИЕ ВИДЕО */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold mb-4 px-2 opacity-80 uppercase tracking-wider">
            Следующее видео
          </h2>

          <div className="flex flex-col gap-5">
            {loadingRelated
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse px-2">
                    <div className="w-40 aspect-video bg-white/10 rounded-xl flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                    </div>
                  </div>
                ))
              : relatedVideos.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <VideoCard video={item} isCompact={true} />
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
