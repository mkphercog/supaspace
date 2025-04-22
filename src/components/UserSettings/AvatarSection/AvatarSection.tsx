import Cropper from "react-easy-crop";
import { Button, Card, Typography } from "../../ui";
import { ChangeEvent, useState, useEffect } from "react";
import { getCroppedImg } from "./canvasUtils";
import { UserAvatar } from "../../UserAvatar";
import { useAuth } from "../../../context/AuthContext";
import { CloseIcon } from "../../../assets/icons";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { DeleteAvatarButton } from "./DeleteAvatarButton";
import {
  useDeleteAvatarMutation,
  useEditUserAvatarMutation,
} from "../../../api/users";
import { toast } from "react-toastify";

const FILE_MAX_SIZE_IN_kB = 200;

export const AvatarSection = () => {
  const { dbUserData } = useAuth();
  const avatarEditorCardRef = useClickOutside<HTMLElement>(() => {
    clearAvatarChangeState();
  });
  const { editUserAvatar, isEditUserAvatarLoading } =
    useEditUserAvatarMutation();
  const { deleteUserAvatar, isDeleteUserAvatarLoading } =
    useDeleteAvatarMutation();

  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [selectedFileAfterCropp, setSelectedFileAfterCropp] =
    useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [cleanupUrl, setCleanupUrl] = useState<() => void>(() => () => {});

  useEffect(() => {
    if (!dbUserData) return;
    setImageSrc(dbUserData.avatar_url);
  }, [dbUserData]);

  const clearAvatarChangeState = () => {
    setIsAvatarEditorOpen(false);
    setSelectedFileAfterCropp(null);
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedImage("");
    cleanupUrl();
    setImageSrc(dbUserData?.avatar_url || "");
  };

  useEffect(() => {
    return () => {
      cleanupUrl();
    };
  }, [cleanupUrl]);

  const handleSubmitAvatarPreview = async () => {
    if (!croppedAreaPixels) return;
    try {
      const { blobUrl, cleanup, file } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );
      setSelectedFileAfterCropp(file);
      cleanupUrl();
      setCleanupUrl(() => cleanup);
      setCroppedImage(blobUrl);
    } catch (e) {
      console.error("Cropping error", e);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitNewAvatar = async () => {
    if (!selectedFileAfterCropp || !dbUserData) return;

    toast
      .promise(
        async () =>
          await editUserAvatar({
            userId: dbUserData.id,
            file: selectedFileAfterCropp,
          }),
        {
          pending: `🚀 Updating avatar`,
          success: `Avatar updated successfully!`,
        }
      )
      .then(() => {
        clearAvatarChangeState();
      });
  };

  const newAvatartFileSize = Number(selectedFileAfterCropp?.size) / 1024;
  const isCorrectFileSize = newAvatartFileSize > FILE_MAX_SIZE_IN_kB;

  return (
    <Card isLoading={isEditUserAvatarLoading || isDeleteUserAvatarLoading}>
      <Typography.Header as="h4" color="gray">
        Avatar
      </Typography.Header>

      <div className="flex flex-col gap-10 justify-center items-center">
        {selectedFileAfterCropp && (
          <div className="flex flex-col items-center p-4 rounded-md bg-white/15">
            <Typography.Text color="blue" size="lg" className="font-bold">
              Avatar is in preview mode
            </Typography.Text>

            <Typography.Text
              color={isCorrectFileSize ? "red" : "lime"}
              size="sm"
            >
              {`New avatar size: ${newAvatartFileSize.toFixed(2)}
              kB (max size ${FILE_MAX_SIZE_IN_kB} kB)`}
            </Typography.Text>
          </div>
        )}

        <UserAvatar
          avatarUrl={croppedImage || dbUserData?.avatar_url}
          size="5xl"
          isPhotoView
        />

        <div className="flex gap-4">
          {!selectedFileAfterCropp && (
            <DeleteAvatarButton deleteUserAvatar={deleteUserAvatar} />
          )}

          <Button variant="primary" onClick={() => setIsAvatarEditorOpen(true)}>
            Edit avatar
          </Button>
        </div>

        {croppedImage && (
          <div className="flex gap-4">
            <Button variant="secondary" onClick={clearAvatarChangeState}>
              Clear
            </Button>

            <Button
              variant="success"
              onClick={handleSubmitNewAvatar}
              disabled={isCorrectFileSize}
            >
              Submit
            </Button>
          </div>
        )}
      </div>

      {isAvatarEditorOpen && (
        <div className="fixed inset-0 w-full bg-[rgba(10,10,10,0.99)] z-50 flex flex-col items-center justify-center gap-5">
          <Button
            variant="ghost"
            className=" absolute top-[10px] right-[20px]"
            onClick={clearAvatarChangeState}
          >
            <CloseIcon className="h-10 w-10 md:h-8 md:w-8" />
          </Button>

          <Card ref={avatarEditorCardRef} className="w-[90%] md:w-[60%]">
            <div className="self-center">
              <label htmlFor="userAvatarUrl" className="block mb-1">
                Choose photo
              </label>
              <input
                id="userAvatarUrl"
                name="userAvatarUrl"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-sm rounded-md p-2 block border border-gray-500 hover:border-purple-600 focus:outline-none bg-[rgba(10,10,10,0.8)] text-gray-200 transition-colors duration-300 hover:cursor-pointer file:hidden"
                required
              />
            </div>

            <div>
              <Typography.Text
                size="lg"
                color="blue"
                className="mb-1 font-semibold"
              >
                Avatar editor
              </Typography.Text>
              <div className="relative h-[400px] md:h-[500px]">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  zoomWithScroll
                  minZoom={1}
                  maxZoom={4}
                  zoomSpeed={0.1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedAreaPixels) => {
                    setCroppedAreaPixels(croppedAreaPixels);
                  }}
                  showGrid={false}
                  classes={{
                    containerClassName: "bg-black",
                  }}
                />
              </div>
            </div>
            <Button
              variant="success"
              className="self-center"
              onClick={() => {
                setIsAvatarEditorOpen(false);
                handleSubmitAvatarPreview();
              }}
              disabled={!imageSrc}
            >
              See preview
            </Button>
          </Card>
        </div>
      )}
    </Card>
  );
};
