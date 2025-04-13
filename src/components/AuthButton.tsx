import { FC } from "react";
import { GoogleLogoIcon } from "../assets/icons/GoogleLogoIcon";
import { useAuth } from "../context/AuthContext.hook";
import { UserAvatar } from "./UserAvatar";
import { useNavigate } from "react-router";

type AuthButtonProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
};

export const AuthButton: FC<AuthButtonProps> = ({ isMenuOpen, toggleMenu }) => {
  const { dbUserData, signInWithGoogle, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = dbUserData?.display_name || dbUserData?.email;

  const goToSettings = () => {
    navigate({ pathname: "/settings" });
    toggleMenu();
  };

  if (!dbUserData) {
    return (
      <div className="w-full flex justify-end">
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 bg-purple-600 px-3 py-1 rounded transition-colors hover:cursor-pointer hover:bg-purple-700"
        >
          Sign in
          <GoogleLogoIcon />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-4 items-end justify-end md:flex-row">
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleMenu}
          >
            <UserAvatar avatarUrl={dbUserData.avatar_url} />
            <span className="text-gray-300">{displayName}</span>
          </button>
        </div>

        {dbUserData.id && isMenuOpen && (
          <div
            className={`
              flex flex-row gap-3 md:flex-col md:p-1
              opacity-100 md:opacity-0 md:absolute md:bottom-0 md:right-0
              bg-transparent rounded-b-lg
              md:border md:border-white/10 md:shadow-lg md:border-t-0
              md:translate-y-full
              ${isMenuOpen ? "md:animate-fade-in" : "md:animate-fade-out"}
            `}
          >
            <button
              onClick={goToSettings}
              className="bg-gray-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-gray-600"
            >
              Setting
            </button>
            <button
              onClick={() => {
                signOut();
                toggleMenu();
              }}
              className="bg-purple-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-purple-600"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
