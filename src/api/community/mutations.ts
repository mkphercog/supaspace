import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { QUERY_KEYS } from "src/api";
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
        .from("communities")
        .insert<CreateDbCommunityInput>({
          description,
          name,
          user_id: userId,
        });

      if (error) {
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
        .from("communities")
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
