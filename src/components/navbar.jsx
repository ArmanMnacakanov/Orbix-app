import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { VideoContext } from "../context/videocontext";
import { youtubeAPI } from "../services/youtubeapi";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setVideos } = useContext(VideoContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const navItems = [
    { path: "/", label: "Главная" },
    { path: "/likes", label: "Понравившиеся" },
  ];

  // Оптимизированная функция поиска
  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // 1. Мгновенно закрываем мобильное окно и уходим на главную
    if (showMobileSearch) setShowMobileSearch(false);
    if (location.pathname !== "/") navigate("/");

    // Очищаем поле сразу для визуальной легкости
    setSearchQuery("");

    try {
      // 2. Выполняем тяжелый запрос в "фоне" для UI
      const searchResults = await youtubeAPI.searchVideos(query, 20);
      setVideos(searchResults);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-6">
      <div
        className="
        relative flex items-center justify-between
        w-full max-w-5xl h-14 px-4
        bg-black/40 backdrop-blur-2xl 
        border border-white/10 rounded-2xl md:rounded-3xl
        shadow-2xl overflow-hidden
      "
      >
        {/* --- UI КОНТЕНТ --- */}
        <AnimatePresence mode="wait">
          {!showMobileSearch && (
            <motion.div
              key="nav-content"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full"
            >
              <Link to="/" className="flex items-center gap-2 group">
                {/* Иконка */}
                <div
                  className="
    w-12 h-8 flex items-center justify-center
    bg-violet-700 rounded-lg
    shadow-md
    group-hover:scale-105 transition
  "
                >
                  ▶
                </div>

                {/* Текст */}
                <span
                  className="
    text-xl font-bold tracking-tight text-white
    group-hover:text-gray-200 transition
  "
                >
                  ORBIX
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative px-3 py-1.5 text-xs font-medium transition-colors ${
                        location.pathname === item.path
                          ? "text-black"
                          : "text-gray-400"
                      }`}
                    >
                      {location.pathname === item.path && (
                        <motion.span
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white rounded-lg"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  ))}
                </div>

                <button
                  onClick={() => setShowMobileSearch(true)}
                  className="md:hidden p-2 text-white/70 hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- ДЕСКТОПНЫЙ ПОИСК --- */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-1/2">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-1.5 focus:bg-white/10 outline-none transition-all focus:border-white/30"
            />
          </form>
        </div>

        {/* --- МОБИЛЬНЫЙ ПОИСК --- */}
        <AnimatePresence>
          {showMobileSearch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black flex items-center px-4 z-50 md:hidden"
            >
              <form
                onSubmit={handleSearch}
                className="flex items-center w-full gap-3"
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Найти видео..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 text-white rounded-xl px-4 py-2 outline-none focus:border-white/40"
                />
                <button
                  type="button"
                  onClick={() => setShowMobileSearch(false)}
                  className="text-sm text-gray-400 active:text-white"
                >
                  Отмена
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;
