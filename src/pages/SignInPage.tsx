import { GoogleLogoIcon } from "src/assets/icons";
import { Button, Card, Typography } from "src/components/ui";
import { useAuth } from "src/context";

export const SignInPage = () => {
  const { signInWithGoogle } = useAuth();

  return (
    <div>
      <Typography.Header>Sign in</Typography.Header>
      <Card className=" max-w-2xl mx-auto">
        <Typography.Header as="h3" color="gray">
          Available methods
        </Typography.Header>

        <Button
          className="self-center flex justify-center items-center gap-3 rounded-4xl! mt-10 mb-20"
          variant="dark"
          onClick={signInWithGoogle}
        >
          <GoogleLogoIcon className="shrink w-[32px]" />
          <Typography.Text className="font-bold">
            Sign in with Google
          </Typography.Text>
        </Button>
      </Card>
    </div>
  );
};
