import { AccountInfoSection } from "./AccountInfoSection";
import { AvatarSection } from "./AvatarSection/AvatarSection";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { EmailSubscribeSection } from "./EmailSubscribeSection";
import { NicknameSection } from "./NicknameSection/NicknameSection";

export const UserSettings = () => {
  return (
    <div className="flex flex-col gap-y-16 max-w-4xl mx-auto">
      <AvatarSection />
      <AccountInfoSection />
      <NicknameSection />
      <EmailSubscribeSection />
      <DeleteAccountSection />
    </div>
  );
};
