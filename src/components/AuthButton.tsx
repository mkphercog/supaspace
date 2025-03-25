import { GoogleLogoIcon } from "../assets/icons/GoogleLogoIcon";
import { useAuth } from "../context/AuthContext.hook";

export const AuthButton = () => {
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
    <div className="w-full flex justify-end">
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
          className="bg-red-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-red-600 "
        >
          Sign out
        </button>
      </div>
    </div>
  );
};
