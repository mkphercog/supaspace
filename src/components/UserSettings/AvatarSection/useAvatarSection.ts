import { ChangeEvent, useEffect, useState } from "react";
import {
  useDeleteAvatarMutation,
  useEditUserAvatarMutation,
} from "../../../api/users";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import { getCroppedImg } from "./canvasUtils";
import { Area } from "react-easy-crop";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useCanChangeField } from "../NextChangeAbility/useNextChangeAbility";

export const FILE_MAX_SIZE_IN_kB = 200;
const INITIAL_CROP_STATE: Pick<Area, "x" | "y"> = { x: 0, y: 0 };

export const useAvatarSection = () => {
  const { dbUserData, isUserDataFetching } = useAuth();
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
    setImageSrc(dbUserData?.avatar_url || "");
  };

  const avatarEditorCardRef = useClickOutside<HTMLElement>(
    clearAvatarSectionStates,
  );

  useEffect(() => {
    if (!dbUserData) return;
    setImageSrc(dbUserData.avatar_url);
  }, [dbUserData]);

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
        croppedAreaPixels,
      );
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
      isCorrectFileSize: croppedFileSize > FILE_MAX_SIZE_IN_kB,
      canChange,
    },
    clearAvatarSectionStates,
    handleFileChange,
  };
};

export type UseAvatarSectionReturnType = ReturnType<typeof useAvatarSection>;
