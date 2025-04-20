import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Loader } from "./Loader";
import { Card } from "./ui";

export const AppInfo = () => {
  const [appInfoText, setAppInfoText] = useState<string | null>(null);
  const [changelogText, setChangelogText] = useState<string | null>(null);

  useEffect(() => {
    fetch("/appInfo.md")
      .then((res) => res.text())
      .then((appInfoText) => setAppInfoText(appInfoText));

    fetch("/changelog.md")
      .then((res) => res.text())
      .then((changelogText) => setChangelogText(changelogText));
  }, []);

  if (!appInfoText || !changelogText) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col gap-y-16">
      <Card>
        <MDEditor.Markdown
          source={appInfoText}
          className="pl-1 bg-transparent!"
        />
      </Card>

      <Card>
        <MDEditor.Markdown
          source={changelogText}
          className="pl-1 bg-transparent!"
        />
      </Card>
    </div>
  );
};
