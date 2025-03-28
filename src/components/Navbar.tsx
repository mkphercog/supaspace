import { useState } from "react";
import { Link, NavLink, NavLinkRenderProps } from "react-router";
import { AuthButton } from "./AuthButton";
import { NavMenuIcon } from "../assets/icons/NavMenuIcon";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-sm border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-lg md:text-xl font-mono font-bold text-white"
          >
            <img
              src="/favicon.ico"
              alt="supa.space() logo"
              className="w-[35px] h-[35px] rounded-full object-cover"
            />
            <p>
              Supa<span className="text-purple-500">{`.space()`}</span>
            </p>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={getNavLinkDesktopClassNames}>
              Home
            </NavLink>
            <NavLink to="/create" className={getNavLinkDesktopClassNames}>
              New post
            </NavLink>
            <NavLink to="/communities" className={getNavLinkDesktopClassNames}>
              Communities
            </NavLink>
            <NavLink
              to="/community/create"
              className={getNavLinkDesktopClassNames}
            >
              New community
            </NavLink>
          </div>

          <div className="hidden md:flex items-center">
            <AuthButton />
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 focus:outline-none"
              aria-label="Toggle menu"
            >
              <NavMenuIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="w-full h-screen" onClick={closeMenu}>
          <div className="md:hidden bg-[rgba(10,10,10,0.9)]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <AuthButton />
              <NavLink
                to="/"
                onClick={closeMenu}
                className={getNavLinkMobileClassNames}
              >
                Home
              </NavLink>
              <NavLink
                to="/create"
                onClick={closeMenu}
                className={getNavLinkMobileClassNames}
              >
                New post
              </NavLink>
              <NavLink
                to="/communities"
                onClick={closeMenu}
                className={getNavLinkMobileClassNames}
              >
                Communities
              </NavLink>
              <NavLink
                to="/community/create"
                onClick={closeMenu}
                className={getNavLinkMobileClassNames}
              >
                New community
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
