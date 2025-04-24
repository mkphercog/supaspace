import { Button, Card, Typography } from "../../ui";
import { UserAvatar } from "../../UserAvatar";
import { DeleteAvatarButton } from "./DeleteAvatarButton";
import { NextChangeAbility } from "../NextChangeAbility/NextChangeAbility";
import { FILE_MAX_SIZE_IN_kB, useAvatarSection } from "./useAvatarSection";
import { AvatarCropper } from "./AvatarCropper";

export const AvatarSection = () => {
  const { api, cropper, editor, clearAvatarSectionStates, handleFileChange } =
    useAvatarSection();

  return (
    <>
      <Card isLoading={api.isLoading}>
        <Typography.Header as="h4" color="gray">
          Avatar
        </Typography.Header>

        <div className="flex flex-col gap-10 justify-center items-center">
          {editor.isPreviewMode && (
            <div className="flex flex-col items-center p-4 rounded-md bg-white/15">
              <Typography.Text color="blue" size="lg" className="font-bold">
                Avatar is in preview mode
              </Typography.Text>

              <Typography.Text
                color={editor.isCorrectFileSize ? "red" : "lime"}
                size="sm"
              >
                {`New avatar size: ${editor.croppedFileSize}
              kB (max size ${FILE_MAX_SIZE_IN_kB} kB)`}
              </Typography.Text>
            </div>
          )}

          <UserAvatar
            avatarUrl={editor.croppedImageUrl || cropper.imageSrc}
            size="5xl"
            isPhotoView
          />

          <div className="flex gap-4">
            {!editor.isPreviewMode && (
              <DeleteAvatarButton deleteUserAvatar={api.deleteUserAvatar} />
            )}

            <Button
              variant="primary"
              onClick={editor.open}
              disabled={!editor.canChange}
            >
              Edit avatar
            </Button>
          </div>

          {editor.croppedImageUrl && (
            <div className="flex gap-4">
              <Button variant="secondary" onClick={clearAvatarSectionStates}>
                Clear
              </Button>

              <Button
                variant="success"
                onClick={api.handleSubmitNewAvatar}
                disabled={editor.isCorrectFileSize}
              >
                Submit
              </Button>
            </div>
          )}
        </div>

        <NextChangeAbility dataType="avatar" />
      </Card>

      {editor.isOpen && (
        <AvatarCropper
          cropper={cropper}
          editor={editor}
          handleFileChange={handleFileChange}
          clearAvatarSectionStates={clearAvatarSectionStates}
        />
      )}
    </>
  );
};
