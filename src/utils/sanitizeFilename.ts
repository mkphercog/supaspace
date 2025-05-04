export const sanitizeFilename = (filename: string) => {
  return filename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^\.+/, "")
    .replace(/\.+$/, "");
};
