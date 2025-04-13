import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { supabaseClient } from "../supabase-client";
import { QUERY_KEYS } from "../api/queryKeys";
import { useQueryClient } from "@tanstack/react-query";

export const UserSettings = () => {
  const { dbUserData, signOut, deleteUserAccount } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const queryClient = useQueryClient();

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

  return (
    <>
      <div className="flex flex-col gap-3">
        <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Settings
        </h2>

        <section className="flex flex-col gap-3 border border-white/10 p-4 rounded">
          <h3 className="text-2xl font-semibold mb-4">Display name</h3>
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
        </section>

        <section className="flex flex-col gap-3 border border-white/10 p-4 rounded">
          <h3 className="text-2xl font-semibold mb-4">Sign out</h3>
          <button
            onClick={() => {
              signOut();
            }}
            className="self-end bg-purple-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-purple-600"
          >
            Sign out
          </button>
        </section>

        <section className="flex flex-col gap-3 border border-white/10 p-4 rounded">
          <h3 className="text-2xl font-semibold mb-4">
            Delete account with all data
          </h3>
          <p>
            Deleting your account is a permanent action. This cannot be undone,
            and all your data will be lost forever.
          </p>
          <button
            onClick={openDialog}
            className="self-end bg-red-500 px-3 py-1 rounded cursor-pointer transition-colors hover:bg-red-600"
          >
            Delete account
          </button>
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
