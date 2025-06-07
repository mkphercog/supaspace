import { version as currentAppVersion } from "../../package.json";

const localStorageKey = "supaspace-appVersion";

export const useGetAppVersion = () => {
  const appVersionFromStorage = localStorage.getItem(localStorageKey);

  const saveAppVersionToStorage = () => {
    if (!appVersionFromStorage || appVersionFromStorage !== currentAppVersion) {
      localStorage.setItem(localStorageKey, currentAppVersion);
    }
  };

  return {
    currentAppVersion,
    saveAppVersionToStorage,
    isAppUpdate: !appVersionFromStorage ||
      appVersionFromStorage !== currentAppVersion,
  };
};
