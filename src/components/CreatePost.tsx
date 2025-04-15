import { ChangeEvent, FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { useCreateNewPost } from "../api/posts";
import { useFetchCommunities } from "../api/community";
import { Button } from "./ui/Button";
import MDEditor, { commands } from "@uiw/react-md-editor";

const COMMANDS_TO_HIDE = ["image", "comment"];

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileError, setSelectedFileError] = useState<string | null>(
    null
  );
  const [communityId, setCommunityId] = useState<number | null>(null);
  const { dbUserData } = useAuth();

  const { data: communities } = useFetchCommunities();

  const { mutate, isPending, isError } = useCreateNewPost(dbUserData?.id);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedFile || !dbUserData || !content) return;

    mutate({
      postData: {
        title,
        content,
        community_id: communityId,
        user_id: dbUserData.id,
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFileError(null);
      if (event.target.files[0].size > 500000) {
        setSelectedFileError("Your file is too big, max size: 500kB.");
      } else {
        setSelectedFile(event.target.files[0]);
      }
    }
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const isSubmitDisabled =
    isPending || !dbUserData || !title || !content || !selectedFile;

  return (
    <form
      className="max-w-2xl mx-auto space-y-4 flex flex-col gap-2"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block mb-2 font-medium" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium" htmlFor="content">
          Content
        </label>
        <MDEditor
          id="content"
          commands={commands
            .getCommands()
            .filter(
              (command) => !COMMANDS_TO_HIDE.includes(command.name || "")
            )}
          value={content}
          onChange={setContent}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium" htmlFor="community">
          Select community
        </label>
        <select
          className={`
            text-sm rounded block w-full p-2.5
            bg-gray-700 border-gray-600 text-white
            focus:ring-blue-500 focus:border-blue-500
            transition-all hover:cursor-pointer hover:bg-gray-800
            `}
          id="community"
          onChange={handleCommunityChange}
        >
          <option value=""> -- Choose a community -- </option>
          {communities?.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium" htmlFor="imageUrl">
          Upload image
        </label>
        <input
          id="imageUrl"
          type="file"
          accept="image/*"
          className={`
            block w-full text-sm border rounded-lg cursor-pointer
            text-gray-200 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400
            transition-all hover:cursor-pointer hover:bg-gray-800
            file:bg-gray-600 file:font-semibold file:px-4 file:mr-4 file:border-0 file:py-2.5 file:pointer-events-none
            `}
          onChange={handleFileChange}
          required
        />
        {selectedFileError && (
          <p className="text-red-400">{selectedFileError}</p>
        )}
      </div>

      <Button className="self-end" type="submit" disabled={isSubmitDisabled}>
        {isPending ? "Creating..." : "Create Post"}
      </Button>

      {isError && <p className="text-red-500">Error creating post.</p>}
    </form>
  );
};
