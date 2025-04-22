export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.crossOrigin = "Anonymous";
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
): Promise<{ blobUrl: string; cleanup: () => void; file: File }> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = image.width;
  canvas.height = image.height;

  ctx.translate(image.width / 2, image.height / 2);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");
  if (!croppedCtx) throw new Error("Could not get cropped canvas context");

  const maxOutputSize = 500;
  const scale = Math.min(
    maxOutputSize / pixelCrop.width,
    maxOutputSize / pixelCrop.height,
    1,
  );

  const outputWidth = pixelCrop.width * scale;
  const outputHeight = pixelCrop.height * scale;

  croppedCanvas.width = outputWidth;
  croppedCanvas.height = outputHeight;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blobFile) => {
        if (!blobFile) {
          reject(new Error("Could not create blob from cropped canvas"));
          return;
        }
        const blobUrl = URL.createObjectURL(blobFile);
        const cleanup = () => URL.revokeObjectURL(blobUrl);
        resolve({
          blobUrl,
          cleanup,
          file: new File([blobFile], "userAvatar", { type: blobFile.type }),
        });
      },
      "image/jpeg",
    );
  });
}
