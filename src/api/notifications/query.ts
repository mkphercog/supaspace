import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "src/api";
import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import { DbNotification, UserData } from "src/types";

import { mapDbNotificationsToNotifications } from "./utils";

export const useFetchNotifications = (userId: UserData["id"] | undefined) => {
  const { data, error, isLoading } = useQuery<DbNotification[], Error>({
    queryKey: [QUERY_KEYS.notifications, userId],
    queryFn: async () => {
      if (!userId) throw new Error("There is no user ID.");

      const { data, error } = await supabaseClient
        .from(SB_TABLE.notifications)
        .select(
          "*, author:users(id, nickname, full_name_from_auth_provider)",
        )
        .eq("receiver_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return data;
    },
    enabled: !!userId,
  });

  return {
    notifications: mapDbNotificationsToNotifications(data || []),
    areNotificationsLoading: isLoading,
    notificationsError: error,
  };
};
