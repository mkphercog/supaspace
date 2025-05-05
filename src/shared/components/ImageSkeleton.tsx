import { FC, useState } from "react";
import { PhotoView } from "react-photo-view";

type Props = {
  src: string;
  alt: string;
  className?: string;
  withPhotoView?: boolean;
};

export const ImageSkeleton: FC<Props> = ({
  src,
  alt,
  className,
  withPhotoView,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const imageElement = (
    <img
      src={src}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      className={`
        w-full h-full object-cover object-center
        transition-opacity duration-500 
        ${isLoaded ? "opacity-100" : "opacity-0"}
      `}
    />
  );

  return (
    <div
      className={`
        w-full rounded-2xl relative overflow-hidden
        ${withPhotoView ? "cursor-pointer" : ""} 
        ${className}
      `}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-purple-900/60 animate-pulse rounded" />
      )}

      <div className="w-full h-full flex items-center justify-center">
        {withPhotoView ? (
          <PhotoView src={src}>{imageElement}</PhotoView>
        ) : (
          imageElement
        )}
      </div>
    </div>
  );
};
