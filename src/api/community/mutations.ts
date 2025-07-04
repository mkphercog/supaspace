import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
import { COMMUNITY_TITLE_MAX_LENGTH, SB_TABLE } from "src/constants";
import { ROUTES } from "src/routes";
import { supabaseClient } from "src/supabase-client";
import {
  Community,
  CreateCommunityInput,
  CreateDbCommunityInput,
} from "src/types";

export const useCreateCommunityMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ description, name, userId }: CreateCommunityInput) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.communities)
        .insert<CreateDbCommunityInput>({
          description,
          name,
          user_id: userId,
        });

      if (error?.code === "23505") {
        toast.error("This community name is already taken.");
        throw new Error(error.message);
      } else if (error?.code === "23514") {
        toast.error(
          `Community name is too long, max length: ${COMMUNITY_TITLE_MAX_LENGTH}`,
        );
        throw new Error();
      } else if (error) {
        toast.error("Oops! Something went wrong. Please try again later.");
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.communities] });
      navigate(ROUTES.community.list());
    },
  });

  return {
    createCommunity: mutateAsync,
    isCreateCommunityLoading: isPending,
  };
};

export const useDeleteCommunityMutation = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id }: Pick<Community, "id">) => {
      const { error } = await supabaseClient
        .from(SB_TABLE.communities)
        .delete()
        .eq("id", id);

      if (error) throw new Error();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.communities],
      });
    },
  });

  return {
    deleteCommunity: mutateAsync,
    isDeleteCommunityLoading: isPending,
  };
};
