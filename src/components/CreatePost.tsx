import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext.hook";
import { NewPostType } from "../types/post.type";
import { CommunityFromDbType } from "../types/community.type";
import { createNewPost } from "../api/posts";
import { fetchCommunities } from "../api/community";
import { QUERY_KEYS } from "../api/queryKeys";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: communities } = useQuery<CommunityFromDbType[], Error>({
    queryKey: [QUERY_KEYS.communities],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: NewPostType; imageFile: File }) => {
      if (!user) throw new Error("You must be logged in to add new post");

      return createNewPost(data.post, data.imageFile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] });
      navigate("/");
    },
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedFile) return;

    mutate({
      post: {
        title,
        content,
        avatar_url: user?.user_metadata.avatar_url || null,
        community_id: communityId,
      },
      imageFile: selectedFile,
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  return (
    <form className="max-w-2xl mx-auto space-y-4" onSubmit={handleSubmit}>
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
        <textarea
          id="content"
          value={content}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          required
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
      </div>

      <button
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer disabled:bg-gray-500 disabled:cursor-not-allowed"
        type="submit"
        disabled={isPending || !user || !title || !content || !selectedFile}
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && <p className="text-red-500">Error creating post.</p>}
    </form>
  );
};
