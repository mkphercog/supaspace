import { PostList } from "../components/PostList";

export const HomePage = () => {
  return (
    <div className="pt-0 md:pt-10">
      <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Recent posts
      </h2>
      <PostList />
    </div>
  );
};
