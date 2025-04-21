import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import {
  AppInfoPage,
  CommunitiesPage,
  CommunityPage,
  CreateCommunityPage,
  CreatePostPage,
  HomePage,
  PostDetailsPage,
  UserSettingsPage,
} from "./pages";
import { AnimatedBackground, Sidebar, Topbar } from "./components/layout";
import { Overlay, Typography } from "./components/ui";
import { Loader } from "./components/Loader";
import { NotFound } from "./components/NotFound";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isDeleteUserWithDataPending } = useAuth();

  return (
    <div className="flex overflow-hidden">
      <Sidebar />

      <div className="h-screen overflow-y-auto w-full grow text-gray-100 relative">
        <Topbar />

        <div className="max-w-7xl mx-auto px-3 py-16">
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
          <Overlay>
            <Typography.Header as="h2">
              Your account is deleting, please wait...
            </Typography.Header>

            <Loader />
          </Overlay>
        )}
      </div>

      <ToastContainer theme="dark" position="top-center" />
      <AnimatedBackground />
    </div>
  );
};

export default App;
