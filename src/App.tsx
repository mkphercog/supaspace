import { RouterProvider } from "react-router";

import { BROWSER_ROUTER } from "src/routes";

const App = () => {
  return <RouterProvider router={BROWSER_ROUTER} />;
};

export default App;
