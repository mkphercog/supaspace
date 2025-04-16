import { FC } from "react";
import { GoogleLogoIcon } from "../assets/icons/GoogleLogoIcon";
import { useAuth } from "../context/AuthContext.hook";
import { UserAvatar } from "./UserAvatar";
import { useNavigate } from "react-router";
import { Button } from "./ui/Button";

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
        <Button onClick={signInWithGoogle} className="flex items-center gap-2">
          Sign in
          <GoogleLogoIcon />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="w-full flex flex-col gap-4 items-end justify-end md:flex-row">
        <div className="flex items-center space-x-4">
          <Button
            className="flex items-center gap-2"
            onClick={toggleMenu}
            variant="ghost"
          >
            <UserAvatar avatarUrl={dbUserData.avatar_url} />
            <span className="text-inherit transition-colors duration-300">
              {displayName}
            </span>
          </Button>
        </div>

        {dbUserData.id && isMenuOpen && (
          <div
            className={`
              flex flex-row gap-3 md:flex-col md:px-4 md:py-2
              opacity-100 md:opacity-0 md:absolute md:bottom-0 md:right-0
              bg-transparent rounded-b-lg
              md:border md:border-white/10 md:shadow-lg md:border-t-0
              md:translate-y-full
              ${isMenuOpen ? "md:animate-fade-in" : "md:animate-fade-out"}
            `}
          >
            <Button onClick={goToSettings} variant="secondary">
              Setting
            </Button>
            <Button
              onClick={() => {
                signOut();
                toggleMenu();
              }}
            >
              Sign out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
