import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.hook";
import { useCreateNewPost } from "../api/posts";
import { useFetchCommunities } from "../api/community";
import { Button } from "./ui/Button";
import MDEditor, { RefMDEditor, commands } from "@uiw/react-md-editor";
import { NotFound } from "./NotFound";

const COMMANDS_TO_HIDE = ["image", "comment"];

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileError, setSelectedFileError] = useState<string | null>(
    null
  );
  const [communityId, setCommunityId] = useState<number | null>(null);
  const { dbUserData, currentSession } = useAuth();

  const { data: communities } = useFetchCommunities();
  const { mutate, isPending, isError } = useCreateNewPost(dbUserData?.id);
  const MDEditorRef = useRef<RefMDEditor>(null);

  if (!currentSession) {
    return <NotFound />;
  }

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
    <>
      <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create new post
      </h2>

      <form
        className="max-w-2xl mx-auto space-y-4 flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="postTitle" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="postTitle"
            name="postTitle"
            type="text"
            value={title}
            className={`
            w-full text-sm rounded-md p-2 block         
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-transparent focus:border-purple-600
            transition-colors duration-300
            hover:cursor-text
          `}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label
            htmlFor="postContent"
            className="block mb-1 font-medium"
            onClick={() => MDEditorRef.current?.textarea?.focus()}
            onMouseEnter={() =>
              MDEditorRef.current?.container?.classList.add("border-purple-600")
            }
            onMouseLeave={() =>
              MDEditorRef.current?.container?.classList.remove(
                "border-purple-600"
              )
            }
          >
            Content
          </label>
          <MDEditor
            textareaProps={{
              id: "postContent",
              name: "postContent",
            }}
            ref={MDEditorRef}
            commands={commands
              .getCommands()
              .filter(
                (command) => !COMMANDS_TO_HIDE.includes(command.name || "")
              )}
            value={content}
            onChange={setContent}
            className="border border-gray-500 hover:border hover:border-purple-600"
          />
        </div>

        <div>
          <label htmlFor="postCommunity" className="block mb-1 font-medium">
            Select community
          </label>
          <select
            id="postCommunity"
            name="postCommunity"
            className={`
            w-full text-sm rounded-md p-2 block
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-[rgba(10,10,10,0.8)] text-gray-200 focus:border-purple-600
            transition-colors duration-300
            hover:cursor-pointer
          `}
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
          <label htmlFor="postImageUrl" className="block mb-1 font-medium">
            Upload image
          </label>
          <input
            id="postImageUrl"
            name="postImageUrl"
            type="file"
            accept="image/*"
            className={`
            w-full text-sm rounded-md p-2 block
            border border-gray-500 hover:border-purple-600 focus:outline-none
            bg-[rgba(10,10,10,0.8)] text-gray-200 focus:border-purple-600
            transition-colors duration-300
            hover:cursor-pointer
            file:hidden
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
    </>
  );
};
