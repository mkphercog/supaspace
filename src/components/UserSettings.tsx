import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { supabaseClient } from "../supabase-client";
import { QUERY_KEYS } from "../api/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { UserAvatar } from "./UserAvatar";
import { NotFound } from "./NotFound";

export const UserSettings = () => {
  const { currentSession, dbUserData, signOut, deleteUserAccount } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileError, setSelectedFileError] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();

  if (!currentSession) {
    return <NotFound />;
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const handleSubmitChangeDisplayName = async (e: FormEvent) => {
    e.preventDefault();

    const { error } = await supabaseClient
      .from("users")
      .update({ display_name: displayName })
      .eq("id", dbUserData?.id);

    if (error) throw new Error(`❌ ${error.message}`);

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.me] });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      setSelectedFile(null);
      setSelectedFileError(null);
      return;
    }

    if (event.target.files[0].size > 500000) {
      setSelectedFileError("Your file is too big, max size: 500kB.");
    } else {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmitNewAvatar = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedFile) return;

    const filePath = `${dbUserData?.id}/userAvatar-${Date.now()}`;

    const { data: avatarsList } = await supabaseClient.storage
      .from("avatars")
      .list(dbUserData?.id);

    const avatarsImagesPathsToDelete =
      avatarsList?.map((file) => `${dbUserData?.id}/${file.name}`) ?? [];

    const { error: removeError } = await supabaseClient.storage
      .from("avatars")
      .remove(avatarsImagesPathsToDelete);

    if (removeError) {
      throw new Error(removeError.message);
    }

    const { error } = await supabaseClient.storage
      .from("avatars")
      .upload(filePath, selectedFile, { upsert: true });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabaseClient.storage.from("avatars").getPublicUrl(filePath);

    const { error: updateAvatarUrlError } = await supabaseClient
      .from("users")
      .update({
        avatar_url: publicUrl,
      })
      .eq("id", dbUserData?.id);

    if (updateAvatarUrlError) {
      throw new Error(updateAvatarUrlError.message);
    }

    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.me] });
    setSelectedFile(null);
  };

  return (
    <>
      <div className="flex flex-col gap-y-10 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Settings
        </h2>

        <section className="relative group">
          <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-15 pointer-events-none"></div>
          <div className="relative flex flex-col gap-3 border border-white/10 p-5 bg-[rgba(12,13,15,0.9)] rounded-[20px]">
            <h3 className="text-2xl font-semibold mb-4">Account info</h3>

            <div className="w-full flex flex-col gap-3 items-center">
              <UserAvatar avatarUrl={dbUserData?.avatar_url} size="5xl" />
              <form
                onSubmit={handleSubmitNewAvatar}
                className="flex flex-col gap-4 w-full"
              >
                <div>
                  <label className="block mb-2 font-medium" htmlFor="imageUrl">
                    Upload new avatar
                  </label>
                  <input
                    id="imageUrl"
                    type="file"
                    accept="image/*"
                    className={`
                      px-4 mr-4 py-2.5
                      block w-full text-sm border rounded-lg cursor-pointer
                      text-gray-200 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400
                      transition-all hover:cursor-pointer hover:bg-gray-800
                      file:hidden
                    `}
                    onChange={handleFileChange}
                    required
                  />
                  {selectedFileError && (
                    <p className="text-red-400">{selectedFileError}</p>
                  )}
                </div>
                <button
                  className="self-end bg-purple-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-purple-600 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
                  disabled={!selectedFile || !!selectedFileError}
                >
                  Change avatar
                </button>
              </form>
            </div>

            <p className="text-sm md:text-base">
              Display name:{" "}
              <span className="font-semibold text-gray-400 ">
                {dbUserData?.display_name}
              </span>
            </p>
            <p className="text-sm md:text-base">
              Your e-mail:{" "}
              <span className="font-semibold text-gray-400 ">
                {dbUserData?.email}
              </span>
            </p>
            <p className="text-sm md:text-base">
              Account created at:{" "}
              <span className="font-semibold text-gray-400">
                {new Date(dbUserData?.created_at || "").toLocaleString()}
              </span>
            </p>
            <button
              onClick={() => {
                signOut();
              }}
              className="self-end bg-purple-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-purple-600"
            >
              Sign out
            </button>
          </div>
        </section>

        <section className="relative group">
          <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-15 pointer-events-none"></div>
          <div className="relative flex flex-col gap-3 border border-white/10 p-5 bg-[rgba(12,13,15,0.9)] rounded-[20px]">
            <h3 className="text-2xl font-semibold mb-4">Change display name</h3>
            <form
              className="flex flex-col gap-3"
              onSubmit={handleSubmitChangeDisplayName}
            >
              <input
                placeholder={`Current name: ${dbUserData?.display_name}`}
                type="text"
                className="w-full border border-white/10 bg-transparent p-2 rounded"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <button
                type="submit"
                disabled={
                  !displayName || displayName === dbUserData?.display_name
                }
                className="self-end bg-purple-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-purple-600 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                Change
              </button>
            </form>
          </div>
        </section>

        <section className="relative group">
          <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-15 pointer-events-none"></div>
          <div className="relative flex flex-col gap-3 border border-white/10 p-5 bg-[rgba(12,13,15,0.9)] rounded-[20px]">
            <h3 className="text-2xl font-semibold mb-4">
              Delete account with all data
            </h3>
            <p className="text-sm md:text-base">
              Deleting your account is a permanent action. This cannot be
              undone, and all your data will be lost forever.
            </p>
            <button
              onClick={openDialog}
              className="self-end bg-red-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-red-600"
            >
              Delete account
            </button>
          </div>
        </section>
      </div>

      {isDialogOpen && (
        <dialog
          className="fixed top-0 bottom-0 w-full h-screen z-50 bg-[rgba(10,10,10,0.8)] backdrop-blur-sm flex items-center justify-center"
          onClick={closeDialog}
        >
          <div className="flex flex-col gap-4 bg-gray-700/30 rounded-xl p-5 text-white border border-white/10 shadow-lg">
            <p>
              Are you sure you want to delete your account with all your data?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="bg-purple-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-purple-600"
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteUserAccount();
                  closeDialog();
                }}
                className="bg-red-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-red-600"
              >
                Yes, delete permanently
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
