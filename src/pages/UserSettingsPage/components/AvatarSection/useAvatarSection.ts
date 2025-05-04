import { ChangeEvent, useEffect, useState } from "react";
import { Area } from "react-easy-crop";
import { toast } from "react-toastify";

import {
  useDeleteAvatarMutation,
  useEditUserAvatarMutation,
} from "src/api/user";
import { AVATAR_MAX_FILE_SIZE_IN_kB } from "src/constants";
import { useAuth } from "src/context";
import { useClickOutside } from "src/hooks";
import { getCroppedImg } from "src/utils";

import { useCanChangeField } from "../NextChangeAbility/useNextChangeAbility";

const INITIAL_CROP_STATE: Pick<Area, "x" | "y"> = { x: 0, y: 0 };

export const useAvatarSection = () => {
  const { userData, isUserDataFetching } = useAuth();
  const { canChange } = useCanChangeField("avatar");
  const { editUserAvatar, isEditUserAvatarLoading } =
    useEditUserAvatarMutation();
  const { deleteUserAvatar, isDeleteUserAvatarLoading } =
    useDeleteAvatarMutation();

  const [isAvatarEditorOpen, setIsAvatarEditorOpen] = useState(false);
  const [selectedFileAfterCropp, setSelectedFileAfterCropp] = useState<
    File | null
  >(null);
  const [crop, setCrop] = useState<Pick<Area, "x" | "y">>(INITIAL_CROP_STATE);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [cleanupUrl, setCleanupUrl] = useState<() => void>(() => () => {});

  const clearAvatarSectionStates = () => {
    setIsAvatarEditorOpen(false);
    setSelectedFileAfterCropp(null);
    setCroppedAreaPixels(null);
    setCrop(INITIAL_CROP_STATE);
    setZoom(1);
    setCroppedImageUrl("");
    cleanupUrl();
    setImageSrc(userData?.avatarUrl || "");
  };

  const avatarEditorCardRef = useClickOutside<HTMLElement>(
    clearAvatarSectionStates,
  );

  useEffect(() => {
    if (!userData) return;
    setImageSrc(userData.avatarUrl || "");
  }, [userData]);

  useEffect(() => {
    return () => {
      cleanupUrl();
    };
  }, [cleanupUrl]);

  const handleSubmitAvatarPreview = async () => {
    if (!croppedAreaPixels) return;
    try {
      const { blobUrl, cleanup, file } = await getCroppedImg({
        imageSrc,
        pixelCrop: croppedAreaPixels,
        max: {
          width: 500,
          height: 500,
        },
        outputFilename: "userAvatar",
      });
      setSelectedFileAfterCropp(file);
      cleanupUrl();
      setCleanupUrl(() => cleanup);
      setCroppedImageUrl(blobUrl);
    } catch (error) {
      console.error("Cropping error", error);
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
    if (!selectedFileAfterCropp || !userData) return;

    toast
      .promise(
        async () =>
          await editUserAvatar({
            userId: userData.id,
            file: selectedFileAfterCropp,
          }),
        {
          pending: `🚀 Updating avatar`,
          success: `Avatar updated successfully!`,
        },
      )
      .then(() => {
        clearAvatarSectionStates();
      });
  };

  const croppedFileSize = Number(selectedFileAfterCropp?.size) / 1024;

  return {
    api: {
      isLoading: isUserDataFetching || isEditUserAvatarLoading ||
        isDeleteUserAvatarLoading,
      deleteUserAvatar,
      handleSubmitNewAvatar,
    },
    cropper: {
      imageSrc,
      crop,
      setCrop,
      zoom,
      setZoom,
      setCroppedAreaPixels: (_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
      },
    },
    editor: {
      avatarEditorCardRef,
      isOpen: isAvatarEditorOpen,
      open: () => setIsAvatarEditorOpen(true),
      close: () => setIsAvatarEditorOpen(false),
      submitPreview: handleSubmitAvatarPreview,
      croppedImageUrl,
      isPreviewMode: !!selectedFileAfterCropp,
      croppedFileSize: croppedFileSize.toFixed(2),
      isCorrectFileSize: croppedFileSize > AVATAR_MAX_FILE_SIZE_IN_kB,
      canChange,
    },
    clearAvatarSectionStates,
    handleFileChange,
  };
};

export type UseAvatarSectionReturnType = ReturnType<typeof useAvatarSection>;
