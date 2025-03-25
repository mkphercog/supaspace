import { Link } from "react-router";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-4xl md:text-6xl leading-14 md:leading-20 font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Page not found
      </h2>

      <Link
        to="/"
        className="text-2xl font-bold text-purple-500 hover:underline"
      >
        Go to home page
      </Link>
    </div>
  );
};
