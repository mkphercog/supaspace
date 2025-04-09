import { FC } from "react";
import { GoogleLogoIcon } from "../assets/icons/GoogleLogoIcon";
import { useAuth } from "../context/AuthContext.hook";
import { UserAvatar } from "./UserAvatar";

type AuthButtonProps = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  openDialog: () => void;
};

export const AuthButton: FC<AuthButtonProps> = ({
  isMenuOpen,
  toggleMenu,
  openDialog,
}) => {
  const { user, signInWithGoogle, signOut } = useAuth();

  const displayName = user?.user_metadata.name || user?.email;

  if (!user) {
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
            <UserAvatar avatarUrl={user.user_metadata?.avatar_url} />
            <span className="text-gray-300">{displayName}</span>
          </button>
        </div>

        {user.id && isMenuOpen && (
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
              onClick={() => {
                signOut();
                toggleMenu();
              }}
              className="bg-purple-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-purple-600"
            >
              Sign out
            </button>
            <button
              onClick={openDialog}
              className="bg-red-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-red-600"
            >
              Delete account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
