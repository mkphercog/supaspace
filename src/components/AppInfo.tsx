import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Loader } from "./Loader";

export const AppInfo = () => {
  const [appInfoText, setAppInfoText] = useState<string | null>(null);
  const [changelogText, setChangelogText] = useState<string | null>(null);

  useEffect(() => {
    fetch("/appInfo.md")
      .then((res) => res.text())
      .then((appInfoText) => {
        setAppInfoText(appInfoText);
      });

    fetch("/changelog.md")
      .then((res) => res.text())
      .then((changelogText) => {
        setChangelogText(changelogText);
      });
  }, []);

  if (!appInfoText || !changelogText) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-y-10 max-w-5xl mx-auto">
      <section className="relative group">
        <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-15 pointer-events-none"></div>
        <div className="relative flex flex-col gap-3 border border-white/10 p-5 bg-[rgba(12,13,15,0.9)] rounded-[20px]">
          <MDEditor.Markdown
            source={appInfoText}
            className="pl-1 bg-transparent!"
          />
        </div>
      </section>

      <section className="relative group">
        <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-15 pointer-events-none"></div>
        <div className="relative flex flex-col gap-3 border border-white/10 p-5 bg-[rgba(12,13,15,0.9)] rounded-[20px]">
          <MDEditor.Markdown
            source={changelogText}
            className="pl-1 bg-transparent!"
          />
        </div>
      </section>
    </div>
  );
};
