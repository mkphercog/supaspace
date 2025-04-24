import { useAuth } from "../../context/AuthContext";
import { AccountInfoSection } from "./AccountInfoSection";
import { AvatarSection } from "./AvatarSection/AvatarSection";
import { NicknameSection } from "./NicknameSection/NicknameSection";
import { DeleteAccountSection } from "./DeleteAccountSection";
import NotFoundPage from "../../pages/NotFoundPage";

export const UserSettings = () => {
  const { currentSession } = useAuth();

  if (!currentSession) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex flex-col gap-y-16 max-w-4xl mx-auto">
      <AvatarSection />
      <AccountInfoSection />
      <NicknameSection />
      <DeleteAccountSection />
    </div>
  );
};
