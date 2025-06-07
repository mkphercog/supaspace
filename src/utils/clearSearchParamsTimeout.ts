export const clearSearchParamsTimeout = (
  callback: (param: string | null) => void,
  timeout = 5000,
  paramKey = "goTo",
): ReturnType<typeof setTimeout> => {
  return setTimeout(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete(paramKey);
    window.history.replaceState({}, "", url.toString());
    callback(null);
  }, timeout);
};
