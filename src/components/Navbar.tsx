import { useState } from "react";
import { Link, NavLink, NavLinkRenderProps } from "react-router";
import { useAuth } from "../context/AuthContext.hook";

const getNavLinkDesktopClassNames = ({ isActive }: NavLinkRenderProps) => {
  return `text-gray-300 hover:text-white transition-colors ${
    isActive && "text-purple-500"
  }`;
};

const getNavLinkMobileClassNames = ({ isActive }: NavLinkRenderProps) => {
  return `block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 ${
    isActive && "text-purple-500"
  }`;
};

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGoogle, signOut, user } = useAuth();

  const displayName = user?.user_metadata.name || user?.email;
  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-xl font-bold text-white">
            Supa<span className="text-purple-500">{`.space()`}</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={getNavLinkDesktopClassNames}>
              Home
            </NavLink>
            <NavLink to="/create" className={getNavLinkDesktopClassNames}>
              Create Post
            </NavLink>
            <NavLink to="/communities" className={getNavLinkDesktopClassNames}>
              Communities
            </NavLink>
            <NavLink
              to="/community/create"
              className={getNavLinkDesktopClassNames}
            >
              Create Community
            </NavLink>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded cursor-pointer hover:bg-red-700 "
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-blue-500 px-3 py-1 rounded transition-all hover:cursor-pointer hover:bg-blue-600"
              >
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" className={getNavLinkMobileClassNames}>
              Home
            </NavLink>
            <NavLink to="/create" className={getNavLinkMobileClassNames}>
              Create Post
            </NavLink>
            <NavLink to="/communities" className={getNavLinkMobileClassNames}>
              Communities
            </NavLink>
            <NavLink
              to="/community/create"
              className={getNavLinkMobileClassNames}
            >
              Create Community
            </NavLink>
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-300">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 px-3 py-1 rounded cursor-pointer hover:bg-red-700 "
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-blue-500 px-3 py-1 rounded transition-all hover:cursor-pointer hover:bg-blue-600"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
