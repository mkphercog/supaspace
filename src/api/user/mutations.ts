import { User } from "@supabase/supabase-js";
import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import {
  NICKNAME_MAX_LENGTH,
  ONE_DAY_IN_SEC,
  SB_STORAGE,
  SB_TABLE,
} from "src/constants";
import { supabaseClient } from "src/supabase-client";
import { CreateDbUserData, DbUserData, UserData } from "src/types";

import { mapDbUserDataToUserData } from "./utils";

export const insertUserDataToDb = async (
  userData: User | null,
  callback: (userData: UserData) => void,
  signOut: () => void,
) => {
  if (!userData) throw new Error("---- No user data. ----");

  const filePath = `${userData.id}/userAvatar-${Date.now()}.webp`;
  const fetchedUserAvatar = await fetch(userData.user_metadata.avatar_url);
  if (!fetchedUserAvatar.ok) {
    signOut();
    throw new Error("❌ Error during fetching user avatar from Google.");
  }
  const avatarBlob = await fetchedUserAvatar.blob();

  const { error: uploadError } = await supabaseClient.storage
    .from(SB_STORAGE.avatars)
    .upload(filePath, avatarBlob, {
      contentType: avatarBlob.type,
      upsert: true,
      cacheControl: `${ONE_DAY_IN_SEC}`,
    });

  if (uploadError) throw new Error(`❌ ${uploadError.message}`);
  console.info("---- ✅ User AVATAR saved in DB correctly. ----");

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from(SB_STORAGE.avatars).getPublicUrl(filePath);

  const dbUserData: DbUserData = {
    id: userData.id,
    email: userData.email || "",
    full_name_from_auth_provider: userData.user_metadata.full_name,
    avatar_url: publicUrl,
    avatar_url_updated_at: null,
    nickname: null,
    nickname_updated_at: null,
    created_at: userData.created_at,
  };

  const { error } = await supabaseClient.from(SB_TABLE.users).insert<
    CreateDbUserData
  >(
    dbUserData,
  );

  if (error) throw new Error(`❌ ${error.message}`);
  console.info("---- ✅ User DATA saved in DB correctly. ----");

  callback(mapDbUserDataToUserData(dbUserData));
};

export const useDeleteUserWithDataMutation = (
  { onSuccess }: Pick<MutateOptions, "onSuccess">,
) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const session = await supabaseClient.auth.getSession();

      const { error } = await supabaseClient.functions.invoke(
        "delete-user-with-data",
        {
          headers: {
            Authorization: `Bearer ${session.data.session?.access_token}`,
          },
        },
      );

      if (error) throw new Error();
    },
    onSuccess,
  });

  return {
    deleteUserWithData: mutateAsync,
    isDeleteUserWithDataLoading: isPending,
  };
};

// --------------------------------- BEGIN - NICKNAME ---------------------------------
export const useSetNicknameMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (
      { userId, nickname }: { userId: string; nickname: string },
    ) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.users)
        .update<Pick<DbUserData, "nickname">>({ nickname })
        .eq("id", userId);

      if (error?.code === "23505") {
        toast.error("This nickname is already taken.");
        throw new Error();
      } else if (error?.code === "23514") {
        toast.error(`Nickname too long, max length: ${NICKNAME_MAX_LENGTH}`);
        throw new Error();
      } else if (error?.message.includes("24 hours")) {
        toast.error(error.message);
        throw new Error();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.me] });
    },
  });

  return {
    setNewUserNickname: mutateAsync,
    isSetNewUserNicknameLoading: isPending,
  };
};

export const useDeleteNicknameMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (
      { userId }: { userId: string },
    ) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.users)
        .update<Pick<DbUserData, "nickname">>({ nickname: null })
        .eq("id", userId);

      if (error) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.me] });
    },
  });

  return {
    deleteUserNickname: mutateAsync,
    isDeleteNicknameLoading: isPending,
  };
};
// --------------------------------- END - NICKNAME ---------------------------------

// --------------------------------- BEGIN - AVATAR ---------------------------------
export const useEditUserAvatarMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const filePath = `${userId}/userAvatar-${Date.now()}.webp`;
      const { data: avatarsList } = await supabaseClient.storage
        .from(SB_STORAGE.avatars)
        .list(userId);

      const avatarsImagesPathsToDelete = avatarsList?.map((file) =>
        `${userId}/${file.name}`
      ) ?? [];

      if (avatarsImagesPathsToDelete.length) {
        const { error: removeError } = await supabaseClient.storage
          .from(SB_STORAGE.avatars)
          .remove(avatarsImagesPathsToDelete);

        if (removeError) {
          toast.error("Oops! Something went wrong. Please try again later.");
          throw new Error(removeError.message);
        }
      }

      const { error } = await supabaseClient.storage
        .from(SB_STORAGE.avatars)
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
          cacheControl: `${ONE_DAY_IN_SEC}`,
        });

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from(SB_STORAGE.avatars).getPublicUrl(
        filePath,
      );

      const { error: updateAvatarUrlError } = await supabaseClient
        .from(SB_TABLE.users)
        .update<Pick<DbUserData, "avatar_url">>({
          avatar_url: publicUrl,
        })
        .eq("id", userId);

      if (updateAvatarUrlError) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(updateAvatarUrlError.message);
      }

      const { error: avatarUrlUpdatedAtError } = await supabaseClient
        .from(SB_TABLE.users)
        .update<Pick<DbUserData, "avatar_url_updated_at">>({
          avatar_url_updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (avatarUrlUpdatedAtError) {
        throw new Error(avatarUrlUpdatedAtError.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.me] });
    },
  });

  return {
    editUserAvatar: mutateAsync,
    isEditUserAvatarLoading: isPending,
  };
};

type DeleteAvatarProps = {
  userId: UserData["id"];
  userAvatarPathToDelete: string;
};

export const useDeleteAvatarMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (
      { userId, userAvatarPathToDelete }: DeleteAvatarProps,
    ) => {
      const { error: deleteAvatarError } = await supabaseClient.storage
        .from(SB_STORAGE.avatars)
        .remove([userAvatarPathToDelete]);

      const { error: avatarErrorTable } = await supabaseClient
        .from(SB_TABLE.users)
        .update<Pick<DbUserData, "avatar_url">>({ avatar_url: null })
        .eq("id", userId);

      if (deleteAvatarError || avatarErrorTable) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.me] });
    },
  });

  return {
    deleteUserAvatar: mutateAsync,
    isDeleteUserAvatarLoading: isPending,
  };
};
// --------------------------------- END - AVATAR ---------------------------------
