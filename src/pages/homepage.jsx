import React, { useEffect, useState, useContext } from "react";
import { VideoContext } from "../context/videocontext";
import VideoCard from "../components/videocard";
import { youtubeAPI } from "../services/youtubeapi";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const { videos, setVideos } = useContext(VideoContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      // Если видео уже есть в контексте, не показываем лоадер повторно для мягкого перехода
      if (videos.length === 0) setLoading(true);
      
      try {
        const data = await youtubeAPI.getPopularVideos(24);

        if (!data || data.length === 0) {
          setError("Видео не найдены");
          return;
        }

        const formatted = data.map((item) => ({
          id: item.id,
          snippet: item.snippet,
          contentDetails: item.contentDetails,
          statistics: item.statistics
        }));

        setVideos(formatted);
        setError(null);
      } catch (err) {
        console.error("HOME ERROR:", err);
        setError("Ошибка загрузки видео");
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  // Компонент скелетона для красивой загрузки
  const Skeleton = () => (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-video bg-white/5 rounded-2xl" />
      <div className="w-3/4 h-4 bg-white/5 rounded" />
      <div className="w-1/2 h-3 bg-white/5 rounded" />
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 text-white bg-[#050505]">
      {/* Сообщение об ошибке */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 text-red-400 p-4 mb-8 rounded-2xl border border-red-500/20 text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Показываем 12 скелетонов во время загрузки
            [...Array(12)].map((_, i) => <Skeleton key={i} />)
          ) : (
            // Плавное появление списка видео
            <AnimatePresence>
              {videos?.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.05 // Эффект "водопада"
                  }}
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;