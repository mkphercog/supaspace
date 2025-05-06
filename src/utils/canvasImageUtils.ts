export const createImage = (url: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.crossOrigin = "Anonymous";
    image.src = url;
  });
};

type GetCroppedImg = (props: {
  imageSrc: string;
  pixelCrop: {
    x: number;
    y: number;
    width: number | null;
    height: number | null;
  };
  max: {
    width: number;
    height: number;
  };
  outputFilename: string;
}) => Promise<{ blobUrl: string; cleanup: () => void; file: File }>;

export const getCroppedImg: GetCroppedImg = async (
  { imageSrc, pixelCrop, max, outputFilename },
) => {
  const image = await createImage(imageSrc);
  const pixelCropWidth = pixelCrop.width ? pixelCrop.width : image.width;
  const pixelCropHeight = pixelCrop.height ? pixelCrop.height : image.height;

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

  const scale = Math.min(
    max.width / pixelCropWidth,
    max.height / pixelCropHeight,
    1,
  );

  const outputWidth = pixelCropWidth * scale;
  const outputHeight = pixelCropHeight * scale;

  croppedCanvas.width = outputWidth;
  croppedCanvas.height = outputHeight;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCropWidth,
    pixelCropHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  const webpFormat = "image/webp";
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
          file: new File([blobFile], outputFilename, { type: webpFormat }),
        });
      },
      webpFormat,
      0.8,
    );
  });
};
