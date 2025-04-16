import { Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { UserSettingsPage } from "./pages/UserSettingsPage";
import { NotFound } from "./components/NotFound";
import { useAuth } from "./context/AuthContext.hook";
import { AppInfoPage } from "./pages/AppInfoPage";
import { Loader } from "./components/Loader";

const App = () => {
  const { isDeleteUserWithDataPending } = useAuth();

  return (
    <div className="min-h-screen bg-black text-gray-100 transition-opacity duration-700 pt-20 relative">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostDetailsPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/info" element={<AppInfoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {isDeleteUserWithDataPending && (
        <div className="fixed inset-0 bg-gray-950/90 z-[1000] flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Your account is deleting, please wait...
          </h2>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default App;
