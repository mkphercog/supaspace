import { Dispatch } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase-client";
import { DbUserDataType } from "../types/users";
import { QUERY_KEYS } from "./queryKeys";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchUserData = (userId: DbUserDataType["id"] | undefined) => {
 return useQuery({
  queryFn: async () => {
   if (!userId) return null;

   const { data, error } = await supabaseClient
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

   if (error) {
    return null;
   }

   return data as DbUserDataType;
  },
  queryKey: [QUERY_KEYS.me, userId],
  retry: false,
 });
};

export const insertUserDataToDb = async (
 userData: User | null,
 setDbUserData: Dispatch<React.SetStateAction<DbUserDataType | null>>,
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
  display_name: userData.user_metadata.full_name,
  email: userData.email || "",
  avatar_url: publicUrl,
 };

 const { error } = await supabaseClient.from("users").insert(newDbUserData);

 if (error) throw new Error(`❌ ${error.message}`);
 console.info("---- ✅ User DATA saved in DB correctly. ----");

 setDbUserData(newDbUserData);
};

export const useDeleteUserWithData = (
 { onSuccess }: { onSuccess: () => void },
) => {
 return useMutation({
  mutationFn: async () => {
   const session = await supabaseClient.auth.getSession();
   await supabaseClient.functions.invoke(
    "delete-user-with-data",
    {
     headers: {
      Authorization: `Bearer ${session.data.session?.access_token}`,
     },
    },
   );
  },
  onError: () => {
   alert("An error occurred while deleting your account and user data.");
  },
  onSuccess,
 });
};
