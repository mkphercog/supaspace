import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { useCreateNewCommunity } from "../api/community";
import { Button } from "./ui/Button";
import { NotFound } from "./NotFound";

export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { dbUserData, currentSession } = useAuth();

  const { mutate, isPending, isError } = useCreateNewCommunity();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };

  if (!currentSession) {
    return <NotFound />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-4 flex flex-col gap-2"
    >
      <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create new community
      </h2>
      <div>
        <label htmlFor="communityName" className="block mb-1 font-medium">
          Community name
        </label>
        <input
          id="communityName"
          name="communityName"
          type="text"
          value={name}
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
          className={`
            w-full text-sm rounded-md p-2 block         
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-transparent focus:border-purple-600
            transition-colors duration-300
            hover:cursor-text
          `}
          required
        />
      </div>
      <div>
        <label
          htmlFor="communityDescription"
          className="block mb-1 font-medium"
        >
          Description
        </label>
        <textarea
          id="communityDescription"
          name="communityDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`
            w-full text-sm rounded-md p-2 block         
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-transparent focus:border-purple-600
            transition-colors duration-300
            hover:cursor-text
          `}
          rows={5}
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
