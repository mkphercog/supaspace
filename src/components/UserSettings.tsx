import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabaseClient } from "../supabase-client";
import { QUERY_KEYS } from "../api/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import { UserAvatar } from "./UserAvatar";
import { NotFound } from "./NotFound";
import { Button, Card, Typography } from "./ui";

export const UserSettings = () => {
  const { currentSession, dbUserData, signOut, deleteUserWithData } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileError, setSelectedFileError] = useState<string | null>(
    null
  );
  const queryClient = useQueryClient();
  const userAvatarUrlRef = useRef<HTMLInputElement>(null);

  if (!currentSession) {
    return <NotFound />;
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeAvatarDialog = () => {
    setIsAvatarDialogOpen(false);
  };

  const openAvatarDialog = () => {
    setIsAvatarDialogOpen(true);
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
      setSelectedFileError(null);
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

    if (avatarsImagesPathsToDelete.length) {
      const { error: removeError } = await supabaseClient.storage
        .from("avatars")
        .remove(avatarsImagesPathsToDelete);

      if (removeError) {
        throw new Error(removeError.message);
      }
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
    setSelectedFileError(null);
    if (userAvatarUrlRef.current) {
      userAvatarUrlRef.current.value = "";
    }
  };

  const deleteUserAvatar = async () => {
    if (!dbUserData) return;

    const { data, error } = await supabaseClient.storage
      .from("avatars")
      .list(dbUserData.id);

    if (error) {
      throw new Error(error.message);
    }

    const userAvatarsPathsToDelete =
      data?.map((file) => `${dbUserData.id}/${file.name}`) ?? [];

    if (userAvatarsPathsToDelete.length) {
      const { error: deleteAvatarError } = await supabaseClient.storage
        .from("avatars")
        .remove(userAvatarsPathsToDelete);

      const { error: avatarErrorTable } = await supabaseClient
        .from("users")
        .update({ avatar_url: null })
        .eq("id", dbUserData.id);

      if (deleteAvatarError || avatarErrorTable) {
        throw new Error(
          deleteAvatarError?.message || avatarErrorTable?.message
        );
      }

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.me] });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-16 max-w-5xl mx-auto">
        <Card>
          <div className="flex justify-between items-center">
            <Typography.Header as="h4" color="gray" className="mb-0!">
              Account info
            </Typography.Header>

            <Button
              onClick={signOut}
              variant="ghost"
              className="text-purple-500"
            >
              Sign out
            </Button>
          </div>

          <div className="w-full flex flex-col gap-3 items-center">
            <UserAvatar
              avatarUrl={dbUserData?.avatar_url}
              size="5xl"
              isPhotoView={true}
            />
            <Button
              variant="ghost"
              onClick={openAvatarDialog}
              className="text-red-500"
              disabled={!dbUserData?.avatar_url}
            >
              Delete avatar
            </Button>

            <form
              onSubmit={handleSubmitNewAvatar}
              className="flex flex-col gap-4 w-full"
            >
              <div>
                <label htmlFor="userAvatarUrl" className="block mb-1">
                  Upload new avatar
                </label>
                <input
                  id="userAvatarUrl"
                  name="userAvatarUrl"
                  ref={userAvatarUrlRef}
                  type="file"
                  accept="image/*"
                  className={`
                    w-full text-sm rounded-md p-2 block
                    border border-gray-500 hover:border-purple-600 focus:outline-none
                    bg-[rgba(10,10,10,0.8)] text-gray-200 focus:border-purple-600
                    transition-colors duration-300
                    hover:cursor-pointer
                    file:hidden
                  `}
                  onChange={handleFileChange}
                  required
                />
                {selectedFileError && (
                  <Typography.Text color="red">
                    {selectedFileError}
                  </Typography.Text>
                )}
              </div>
              <Button
                className="self-end"
                type="submit"
                disabled={!selectedFile || !!selectedFileError}
              >
                Change avatar
              </Button>
            </form>
          </div>

          <div className="flex gap-2">
            <Typography.Text>Display name:</Typography.Text>
            <Typography.Text color="lightPurple" className="font-semibold">
              {dbUserData?.display_name}
            </Typography.Text>
          </div>

          <div className="flex gap-2">
            <Typography.Text>Your e-mail:</Typography.Text>
            <Typography.Text color="lightPurple" className="font-semibold">
              {dbUserData?.email}
            </Typography.Text>
          </div>

          <div className="flex gap-2">
            <Typography.Text>Account created at:</Typography.Text>
            <Typography.Text color="lightPurple" className="font-semibold">
              {new Date(dbUserData?.created_at || "").toLocaleString()}
            </Typography.Text>
          </div>
        </Card>

        <Card>
          <Typography.Header as="h4" color="gray">
            Change display name
          </Typography.Header>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmitChangeDisplayName}
          >
            <div>
              <label htmlFor="userDisplayName" className="block mb-1">
                New display name
              </label>
              <input
                id="userDisplayName"
                name="userDisplayName"
                type="text"
                autoComplete="off"
                className={`
                  w-full text-sm rounded-md p-2 block         
                  border border-gray-500 hover:border-purple-600 focus:outline-none
                  bg-transparent focus:border-purple-600
                  transition-colors duration-300
                  hover:cursor-text
                `}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={dbUserData?.display_name}
              />
            </div>
            <Button
              type="submit"
              disabled={
                !displayName || displayName === dbUserData?.display_name
              }
              className="self-end"
            >
              Change
            </Button>
          </form>
        </Card>

        <Card>
          <Typography.Header as="h4" color="gray">
            Delete account with all data
          </Typography.Header>

          <Typography.Text>
            Deleting your account is a permanent action. This cannot be undone,
            and all your data will be lost forever.
          </Typography.Text>
          <Button
            className="self-end"
            variant="destructive"
            onClick={openDialog}
          >
            Delete account
          </Button>
        </Card>
      </div>

      {isDialogOpen && (
        <dialog
          className="fixed top-0 bottom-0 w-full  h-screen z-50 bg-[rgba(10,10,10,0.8)] backdrop-blur-sm flex items-center justify-center"
          onClick={closeDialog}
        >
          <div className="flex flex-col gap-4 max-w-[60%] bg-gray-700/30 rounded-xl p-5 text-white border border-white/10 shadow-lg">
            <Typography.Header as="h4" color="red">
              Are you sure you want to delete your account with all your data?
            </Typography.Header>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteUserWithData();
                  closeDialog();
                }}
                variant="destructive"
              >
                Yes, delete permanently
              </Button>
            </div>
          </div>
        </dialog>
      )}

      {isAvatarDialogOpen && (
        <dialog
          className="fixed top-0 bottom-0 w-full  h-screen z-50 bg-[rgba(10,10,10,0.8)] backdrop-blur-sm flex items-center justify-center"
          onClick={closeDialog}
        >
          <div className="flex flex-col max-w-[60%] gap-4 bg-gray-700/30 rounded-xl p-5 text-white border border-white/10 shadow-lg">
            <Typography.Header as="h4" color="red">
              Are you sure you want to delete your avatar?
            </Typography.Header>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={closeAvatarDialog}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  deleteUserAvatar();
                  closeAvatarDialog();
                }}
                variant="destructive"
              >
                Yes, delete permanently
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
