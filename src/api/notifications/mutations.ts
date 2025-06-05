import { useMutation, useQueryClient } from "@tanstack/react-query";

import { SB_TABLE } from "src/constants";
import { supabaseClient } from "src/supabase-client";
import {
  CreateDbNotificationInput,
  CreateNotificationInput,
  Notification,
} from "src/types";

import { QUERY_KEYS } from "..";

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (
      { authorId, type, receiverId, isRead, content, postId }:
        CreateNotificationInput,
    ) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.notifications)
        .insert<CreateDbNotificationInput>({
          author_id: authorId,
          receiver_id: receiverId,
          content,
          type,
          post_id: postId,
          is_read: isRead,
        });

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
