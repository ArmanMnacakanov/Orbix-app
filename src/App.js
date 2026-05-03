import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// Добавляем .jsx ко всем кастомным файлам
import { VideoProvider } from "./context/videocontext.jsx";
import HomePage from "./pages/homepage.jsx";
import VideoPlayerPage from "./pages/videoplayerpage.jsx";
import LikesPage from "./pages/likespage.jsx"
import Navbar from "./components/navbar.jsx";

function App() {
  return (
    <VideoProvider>
      <Router>
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-violet-950 to-black text-white font-semibold">
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch/:videoId" element={<VideoPlayerPage />} />
            <Route path="/likes" element={<LikesPage />} />
          </Routes>
        </div>
      </Router>
    </VideoProvider>
  );
}

export default App;