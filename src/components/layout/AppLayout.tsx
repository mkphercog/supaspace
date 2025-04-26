import { Outlet, useNavigation } from "react-router";
import { ToastContainer } from "react-toastify";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar/Topbar";
import { AnimatedBackground } from "./AnimatedBackground";
import { FullPageLoader } from "../FullPageLoader";
import { useAuth } from "../../context/AuthContext";
import { AuthProvider } from "../../context/AuthContext/AuthContext.provider";
import { SidebarProvider } from "../../context/SidebarContext/SidebarContext.provider";

export const AppLayout = () => {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Layout />
      </SidebarProvider>
    </AuthProvider>
  );
};

const Layout = () => {
  const { isDeleteUserWithDataLoading } = useAuth();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <div className="flex overflow-hidden">
      <Sidebar />

      <div className="h-dvh overflow-y-auto w-full grow text-gray-100 relative">
        <Topbar />

        <div className="max-w-7xl mx-auto px-3 py-16">
          {isNavigating && <FullPageLoader />}
          <Outlet />
        </div>
      </div>

      {isDeleteUserWithDataLoading && (
        <FullPageLoader message="Deleting account, please wait..." />
      )}
      <ToastContainer theme="dark" position="top-center" newestOnTop={true} />
      <AnimatedBackground />
    </div>
  );
};
