import { Link } from "react-router";
import { Overlay, Typography } from "./ui";

export const NotFound = () => {
  return (
    <Overlay>
      <Typography.Header>Page not found</Typography.Header>
      <Link to="/" className="text-2xl font-bold text-gray-300 hover:underline">
        Go to home page
      </Link>
    </Overlay>
  );
};
