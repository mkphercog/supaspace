import { Route, Routes } from "react-router";
import { HomePage } from "./pages/HomePage";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostDetailsPage } from "./pages/PostDetailsPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { UserSettingsPage } from "./pages/UserSettingsPage";
import { NotFound } from "./components/NotFound";
import { useAuth } from "./context/AuthContext";
import { AppInfoPage } from "./pages/AppInfoPage";
import { Loader } from "./components/Loader";
import { Overlay, Typography } from "./components/ui";
import { Sidebar } from "./components/layout/Sidebar/Sidebar";
import { Topbar } from "./components/layout/Topbar/Topbar";

const App = () => {
  const { isDeleteUserWithDataPending } = useAuth();

  return (
    <div className="flex overflow-hidden bg-black">
      <Sidebar />

      <div className="h-screen overflow-y-auto w-full grow bg-black text-gray-100 relative">
        <Topbar />
        <div className=" p-4">
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
    </div>
  );
};

export default App;
