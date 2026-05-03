import axios from "axios";

const API_KEY = "AIzaSyDPyYTE8gRyi1B0mpluljFo5Jd7z800xDM";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

const handleError = (error, name) => {
  console.error(`❌ ${name} ERROR:`, error?.response?.data || error);
  throw error;
};

export const youtubeAPI = {
  // 🎥 Популярные видео
  getPopularVideos: async (maxResults = 20) => {
    try {
      const response = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "snippet,statistics,contentDetails",
          chart: "mostPopular",
          regionCode: "US",
          maxResults,
          key: API_KEY,
        },
      });
      return response.data.items || [];
    } catch (error) {
      handleError(error, "POPULAR VIDEOS");
      return [];
    }
  },

  // 🔎 Поиск видео
  searchVideos: async (query, maxResults = 20) => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          part: "snippet",
          q: query,
          type: "video",
          maxResults,
          key: API_KEY,
        },
      });
      return response.data.items || [];
    } catch (error) {
      handleError(error, "SEARCH VIDEOS");
      return [];
    }
  },

  // 🎬 НОВЫЙ МЕТОД: Получение данных для списка ID (нужен для Related Videos)
  getVideosByIds: async (ids) => {
    try {
      const response = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "snippet,statistics,contentDetails",
          id: ids,
          key: API_KEY,
        },
      });
      return response.data.items || [];
    } catch (error) {
      handleError(error, "VIDEOS BY IDS");
      return [];
    }
  },

  // 🎬 Видео по ID
  getVideoById: async (videoId) => {
    try {
      const response = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: "snippet,statistics,contentDetails",
          id: videoId,
          key: API_KEY,
        },
      });
      return response.data.items?.[0] || null;
    } catch (error) {
      handleError(error, "VIDEO BY ID");
      return null;
    }
  },
};