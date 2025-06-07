import { useQueryClient } from "@tanstack/react-query";

export const useInvalidateMultipleQueries = () => {
  const queryClient = useQueryClient();

  const invalidateMultipleQueries = (
    queriesList: Array<Array<unknown>>,
  ) => {
    queriesList.forEach((key) =>
      queryClient.invalidateQueries({ queryKey: key })
    );
  };

  return { invalidateMultipleQueries };
};
