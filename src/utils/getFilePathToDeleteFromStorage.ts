type Props = {
  storagePrefix: string;
  fullFileUrl: string;
};

export const getFilePathToDeleteFromStorage = (
  { storagePrefix, fullFileUrl }: Props,
) => {
  const prefixIndex = fullFileUrl.indexOf(storagePrefix);

  const filePathToDelete = fullFileUrl.slice(
    prefixIndex + storagePrefix.length,
  );

  return filePathToDelete;
};
