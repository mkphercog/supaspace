import { useParams } from "react-router";
import { PostDetails } from "../components/PostDetails";

const PostDetailsPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <PostDetails post_id={Number(id)} />
    </div>
  );
};

export default PostDetailsPage;
