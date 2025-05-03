import { Navigate, RouteObject, createBrowserRouter } from "react-router";

import { FullPageLoader } from "../components/FullPageLoader";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const ROUTES = {
  root: () => "/",
  auth: {
    signIn: () => "sign-in",
  },
  post: {
    root: () => "/post",
    create: () => "/post/create",
    detailsRoot: () => "/post/:id",
    details: (id: number) => `/post/${id}`,
  },
  community: {
    root: () => "/community",
    create: () => "/community/create",
    detailsRoot: () => "/community/:id",
    details: (id: number) => `/community/${id}`,
    list: () => "/community/list",
  },
  settings: () => "/settings",
  appInfo: () => "/app-info",
  notFound: () => "*",
};

const postRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={ROUTES.post.create()} replace />,
  },
  {
    path: ROUTES.post.create(),
    lazy: async () => {
      const { CreatePostPage } = await import("../pages/CreatePostPage");

      const Component = () => (
        <ProtectedRoute>
          <CreatePostPage />
        </ProtectedRoute>
      );

      return { Component };
    },
  },
  {
    path: ROUTES.post.detailsRoot(),
    lazy: async () => {
      const { PostDetailsPage } = await import("../pages/PostDetailsPage");

      return { Component: PostDetailsPage };
    },
  },
];

const communityRoutes: RouteObject[] = [
  {
    index: true,
    element: <Navigate to={ROUTES.community.list()} replace />,
  },
  {
    path: ROUTES.community.create(),
    lazy: async () => {
      const { CreateCommunityPage } = await import("../pages/CommunityPages");

      const Component = () => (
        <ProtectedRoute>
          <CreateCommunityPage />
        </ProtectedRoute>
      );

      return { Component };
    },
  },
  {
    path: ROUTES.community.detailsRoot(),
    lazy: async () => {
      const { CommunityPage } = await import("../pages/CommunityPages");

      return { Component: CommunityPage };
    },
  },
  {
    path: ROUTES.community.list(),
    lazy: async () => {
      const { CommunityListPage } = await import("../pages/CommunityPages");

      return { Component: CommunityListPage };
    },
  },
];

export const BROWSER_ROUTER = createBrowserRouter([
  {
    path: ROUTES.root(),
    Component: AppLayout,
    HydrateFallback: FullPageLoader,
    children: [
      {
        index: true,
        lazy: async () => {
          const { HomePage } = await import("../pages/HomePage");

          return { Component: HomePage };
        },
      },
      {
        path: ROUTES.auth.signIn(),
        lazy: async () => {
          const { SignInPage } = await import("../pages/SignInPage");

          return { Component: SignInPage };
        },
      },
      {
        path: ROUTES.post.root(),
        children: postRoutes,
      },
      {
        path: ROUTES.community.root(),
        children: communityRoutes,
      },
      {
        path: ROUTES.settings(),
        lazy: async () => {
          const { UserSettingsPage } = await import(
            "../pages/UserSettingsPage"
          );

          const Component = () => (
            <ProtectedRoute>
              <UserSettingsPage />
            </ProtectedRoute>
          );

          return { Component };
        },
      },
      {
        path: ROUTES.appInfo(),
        lazy: async () => {
          const { AppInfoPage } = await import("../pages/AppInfoPage");

          return { Component: AppInfoPage };
        },
      },
      {
        path: ROUTES.notFound(),
        lazy: async () => {
          const { NotFoundPage } = await import("../pages/NotFoundPage");

          return { Component: NotFoundPage };
        },
      },
    ],
  },
]);
