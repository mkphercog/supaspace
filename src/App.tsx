import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import { AnimatedBackground, Sidebar, Topbar } from "./components/layout";
import { useAuth } from "./context/AuthContext";
import { FullPageLoader } from "./components/FullPageLoader";
const HomePage = lazy(() => import("./pages/HomePage"));
const CreatePostPage = lazy(() => import("./pages/CreatePostPage"));
const PostDetailsPage = lazy(() => import("./pages/PostDetailsPage"));
const CreateCommunityPage = lazy(() => import("./pages/CreateCommunityPage"));
const CommunitiesPage = lazy(() => import("./pages/CommunitiesPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const UserSettingsPage = lazy(() => import("./pages/UserSettingsPage"));
const AppInfoPage = lazy(() => import("./pages/AppInfoPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const App = () => {
  const location = useLocation();
  const { isDeleteUserWithDataLoading } = useAuth();

  return (
    <div className="flex overflow-hidden">
      <Sidebar />

      <div className="h-dvh overflow-y-auto w-full grow text-gray-100 relative">
        <Topbar />

        <div className="max-w-7xl mx-auto px-3 py-16">
          <Suspense fallback={<FullPageLoader />} key={location.key}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path="/post/:id" element={<PostDetailsPage />} />
              <Route
                path="/community/create"
                element={<CreateCommunityPage />}
              />
              <Route path="/communities" element={<CommunitiesPage />} />
              <Route path="/community/:id" element={<CommunityPage />} />
              <Route path="/settings" element={<UserSettingsPage />} />
              <Route path="/info" element={<AppInfoPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>

        {isDeleteUserWithDataLoading && (
          <FullPageLoader message="Deleting account, please wait..." />
        )}
      </div>

      <ToastContainer theme="dark" position="top-center" newestOnTop={true} />
      <AnimatedBackground />
    </div>
  );
};

export default App;
