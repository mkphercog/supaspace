import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import {
  CreateDbNotificationInput,
  CreateNotificationInput,
  Notification,
} from "src/types";

import { QUERY_KEYS } from "..";
import { mapCreateNotificationsToDbCreateNotifications } from "./utils";

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newNotifications: CreateNotificationInput[]) => {
      const mapedNotifications = mapCreateNotificationsToDbCreateNotifications(
        newNotifications,
      );

      const { error } = await supabaseClient
        .from(SB_TABLE.notifications)
        .insert<CreateDbNotificationInput>(mapedNotifications);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications] });
    },
  });

  return {
    createNotification: mutateAsync,
    isCreateNotificationLoading: isPending,
  };
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (notificationId: Notification["id"]) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.notifications)
        .update<Pick<CreateDbNotificationInput, "is_read">>({
          is_read: true,
        })
        .eq("id", notificationId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications] });
    },
  });

  return {
    markNotificationAsRead: mutateAsync,
    isMarkNotificationAsReadLoading: isPending,
  };
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (receiverId: Notification["receiverId"]) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.notifications)
        .update<Pick<CreateDbNotificationInput, "is_read">>({
          is_read: true,
        })
        .eq("receiver_id", receiverId)
        .eq("is_read", false);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.notifications] });
    },
  });

  return {
    markAllNotificationsAsRead: mutateAsync,
    isMarkAllNotificationsAsReadLoading: isPending,
  };
};
