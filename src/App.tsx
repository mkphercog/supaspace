import { Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";

const App = () => {
  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePostPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
