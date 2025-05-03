import { NoRocketIcon } from "src/assets/icons";
import { ROUTES } from "src/routes";
import { Card, Typography } from "src/shared/UI";

export const NotFoundPage = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="w-full flex flex-col gap-10 items-center justify-center">
        <Typography.Header className="mb-0!">Page not found</Typography.Header>
        <NoRocketIcon className="text-gray-200 rounded-2xl bg-gradient-to-r from-pink-700 to-purple-700 w-40 h-40" />
        <Typography.Link
          to={ROUTES.root()}
          className="text-2xl font-bold text-gray-300"
        >
          Go to dashboard
        </Typography.Link>
      </div>
    </Card>
  );
};
