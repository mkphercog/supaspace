import MDEditor from "@uiw/react-md-editor";

import { Card } from "src/shared/UI";

import appInfoText from "../content/appInfo.md?raw";
import changelogText from "../content/changelog.md?raw";

export const AppInfo = () => {
  return (
    <div className="flex flex-col gap-y-16 max-w-5xl mx-auto">
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
