import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { useCreateNewCommunity } from "../api/community";
import { Button } from "./ui/Button";

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { dbUserData } = useAuth();

  const { mutate, isPending, isError } = useCreateNewCommunity();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-4 flex flex-col gap-2"
    >
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
      <Button
        type="submit"
        className="self-end"
        disabled={isPending || !dbUserData || !name || !description}
      >
        {isPending ? "Creating..." : "Create Community"}
      </Button>
      {isError && <p className="text-red-500">Error creating community.</p>}
    </form>
  );
};
