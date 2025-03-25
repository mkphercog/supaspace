import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext.hook";
import { createNewCommunity } from "../api/community";
import { QUERY_KEYS } from "../api/queryKeys";

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createNewCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.communities] });
      navigate("/communities");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create new community
      </h2>
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Community name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={3}
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !user || !name || !description}
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isPending ? "Creating..." : "Create Community"}
      </button>
      {isError && <p className="text-red-500">Error creating community.</p>}
    </form>
  );
};
