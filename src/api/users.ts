import { Dispatch } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase-client";
import { DbUserDataType } from "../types/users";
import { QUERY_KEYS } from "./queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { NICKNAME_MAX_LENGTH } from "../components/UserSettings/NicknameSection/validationSchema";
import { AuthContextType } from "../context/AuthContext/AuthContext";

type FetchUserDataErrorsType =
  | "NO_LOGGED_USER"
  | "NO_USER_IN_AUTH"
  | "USER_IN_AUTH_BUT_NO_IN_USERS_TABLE";

export const useFetchUserData = (userId: DbUserDataType["id"] | undefined) => {
  const { data, isFetching } = useQuery<
    DbUserDataType | FetchUserDataErrorsType
  >({
    queryFn: async () => {
      if (!userId) {
        return "NO_LOGGED_USER";
      }

      const { data: userAuth, error: authUserError } = await supabaseClient.auth
        .getUser();

      if (!userAuth.user || authUserError) {
        console.info("---- ℹ️ There is no user in auth db ----");
        return "NO_USER_IN_AUTH";
      }

      const { data, error } = await supabaseClient
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (!data || error) {
        console.info(
          "---- ⚙️ No user in the DB, starting the process of adding.  ----",
        );
        return "USER_IN_AUTH_BUT_NO_IN_USERS_TABLE";
      }

      console.info(
        "---- ℹ️ The user already exists in the DB, no action needed. ----",
      );
      return data as DbUserDataType;
    },
    queryKey: [QUERY_KEYS.me, userId],
    retry: false,
    enabled: !!userId,
  });

  return {
    userData: data,
    isUserDataFetching: isFetching,
  };
};

export const insertUserDataToDb = async (
  userData: User | null,
  setDbUserData: Dispatch<React.SetStateAction<AuthContextType["dbUserData"]>>,
  signOut: () => void,
) => {
  if (!userData) throw new Error("---- No user data. ----");

  const filePath = `${userData.id}/userAvatar-${Date.now()}`;
  const fetchedUserAvatar = await fetch(userData.user_metadata.avatar_url);
  if (!fetchedUserAvatar.ok) {
    signOut();
    throw new Error("❌ Error during fetching user avatar from Google.");
  }
  const avatarBlob = await fetchedUserAvatar.blob();

  const { error: uploadError } = await supabaseClient.storage
    .from("avatars")
    .upload(filePath, avatarBlob, { upsert: true });

  if (uploadError) throw new Error(`❌ ${uploadError.message}`);
  console.info("---- ✅ User AVATAR saved in DB correctly. ----");

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("avatars").getPublicUrl(filePath);

  const newDbUserData: DbUserDataType = {
    id: userData.id,
    created_at: userData.created_at,
    nickname: userData.user_metadata.full_name,
    email: userData.email || "",
    avatar_url: publicUrl,
    full_name_from_auth_provider: userData.user_metadata.full_name,
    nickname_updated_at: null,
  };

  const { error } = await supabaseClient.from("users").insert(newDbUserData);

  if (error) throw new Error(`❌ ${error.message}`);
  console.info("---- ✅ User DATA saved in DB correctly. ----");

  setDbUserData(newDbUserData);
};

export const useDeleteUserWithData = (
  { onSuccess }: { onSuccess: () => void },
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

export const useSetNicknameMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (
      { userId, nickname }: { userId: string; nickname: string },
    ) => {
      const { error } = await supabaseClient
        .from("users")
        .update({ nickname })
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
      { userId, nickname }: { userId: string; nickname: string },
    ) => {
      const { error } = await supabaseClient
        .from("users")
        .update({ nickname })
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

export const useDeleteAvatarMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const { data, error } = await supabaseClient.storage
        .from("avatars")
        .list(userId);

      if (error) throw new Error();

      const userAvatarsPathsToDelete = data?.map((file) =>
        `${userId}/${file.name}`
      ) ?? [];

      if (userAvatarsPathsToDelete.length) {
        const { error: deleteAvatarError } = await supabaseClient.storage
          .from("avatars")
          .remove(userAvatarsPathsToDelete);

        const { error: avatarErrorTable } = await supabaseClient
          .from("users")
          .update({ avatar_url: null })
          .eq("id", userId);

        if (deleteAvatarError || avatarErrorTable) throw new Error();
      }
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

export const useEditUserAvatarMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const filePath = `${userId}/userAvatar-${Date.now()}`;
      const { data: avatarsList } = await supabaseClient.storage
        .from("avatars")
        .list(userId);

      const avatarsImagesPathsToDelete = avatarsList?.map((file) =>
        `${userId}/${file.name}`
      ) ?? [];

      if (avatarsImagesPathsToDelete.length) {
        const { error: removeError } = await supabaseClient.storage
          .from("avatars")
          .remove(avatarsImagesPathsToDelete);

        if (removeError) {
          toast.error("Oops! Something went wrong. Please try again later.");
          throw new Error(removeError.message);
        }
      }

      const { error } = await supabaseClient.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
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
        .eq("id", userId);

      if (updateAvatarUrlError) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(updateAvatarUrlError.message);
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
