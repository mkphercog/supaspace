import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NotFound } from "./NotFound";
import { Button, Card, Typography } from "./ui";
import { NicknameSection } from "./UserSettings/NicknameSection/NicknameSection";
import { AvatarSection } from "./UserSettings/AvatarSection/AvatarSection";

export const UserSettings = () => {
  const { currentSession, dbUserData, signOut, deleteUserWithData } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!currentSession) {
    return <NotFound />;
  }

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const isNickNameSameAsFullName =
    dbUserData?.nickname === dbUserData?.full_name_from_auth_provider;

  return (
    <>
      <div className="flex flex-col gap-y-16 max-w-4xl mx-auto">
        <AvatarSection />

        <Card>
          <div className="flex justify-between items-center">
            <Typography.Header as="h4" color="gray" className="mb-0!">
              Account info
            </Typography.Header>

            <Button onClick={signOut} variant="ghost">
              Sign out
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Typography.Text>Full name:</Typography.Text>
            <Typography.Text color="lightPurple" className="font-semibold">
              {dbUserData?.full_name_from_auth_provider}
            </Typography.Text>
          </div>

          {!isNickNameSameAsFullName && (
            <div className="flex flex-col md:flex-row gap-2">
              <Typography.Text>Nickname:</Typography.Text>
              <Typography.Text color="lightPurple" className="font-semibold">
                {dbUserData?.nickname}
              </Typography.Text>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-2">
            <Typography.Text>E-mail:</Typography.Text>
            <Typography.Text color="lightPurple" className="font-semibold">
              {dbUserData?.email}
            </Typography.Text>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Typography.Text>Account created at:</Typography.Text>
            <Typography.Text color="lightPurple" className="font-semibold">
              {new Date(dbUserData?.created_at || "").toLocaleString()}
            </Typography.Text>
          </div>
        </Card>

        <NicknameSection />

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
    </>
  );
};
