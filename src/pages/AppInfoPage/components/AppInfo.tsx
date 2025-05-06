import { lazy } from "react";

import { Card } from "src/shared/UI";

const MDPreview = lazy(() => import("@uiw/react-markdown-preview"));

import appInfoText from "../content/appInfo.md?raw";
import changelogText from "../content/changelog.md?raw";

export const AppInfo = () => {
  return (
    <div className="flex flex-col gap-y-16 max-w-5xl mx-auto">
      <Card>
        <MDPreview
          source={appInfoText}
          className="pl-1 bg-transparent! text-slate-500"
        />
      </Card>

      <Card>
        <MDPreview source={changelogText} className="pl-1 bg-transparent!" />
      </Card>
    </div>
  );
};
