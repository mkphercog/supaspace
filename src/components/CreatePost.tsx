import { ChangeEvent, FormEvent, useState } from "react";
import { supabaseClient } from "../supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext.hook";
import { useNavigate } from "react-router";
import { CommunityType, fetchCommunities } from "./CommunityList";

type PostInput = {
  title: string;
  content: string;
  avatar_url: string | null;
  community_id?: number | null;
};

const createPost = async (post: PostInput, imageFile: File) => {
  const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("post-images")
    .upload(filePath, imageFile);

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabaseClient.storage.from("post-images").getPublicUrl(filePath);

  const { data, error } = await supabaseClient
    .from("posts")
    .insert({ ...post, image_url: publicUrl });
  if (error) throw new Error(error.message);

  return data;
};

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [communityId, setCommunityId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: communities } = useQuery<CommunityType[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data: { post: PostInput; imageFile: File }) =>
      createPost(data.post, data.imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
        <label htmlFor="community">Select community</label>
        <select id="community" onChange={handleCommunityChange}>
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
          className="w-full text-gray-200"
          onChange={handleFileChange}
          required
        />
      </div>

      <button
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer disabled:bg-purple-950 disabled:cursor-not-allowed"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Create Post"}
      </button>

      {isError && <p className="text-red-500"> Error creating post.</p>}
    </form>
  );
};
