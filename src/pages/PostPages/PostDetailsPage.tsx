import { useParams } from "react-router";

import { PostDetails } from "./components/PostDetails";

export const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <PostDetails postId={Number(id)} />
    </div>
  );
};
