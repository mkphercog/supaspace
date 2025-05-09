import { FC } from "react";
import Cropper from "react-easy-crop";

import { CloseIcon } from "src/assets/icons";
import {
  BaseForm,
  Button,
  Card,
  FormImageInput,
  Typography,
  useBaseForm,
} from "src/shared/UI";

import { UseAvatarSectionReturnType } from "./useAvatarSection";

type AvatarCropperProps = Pick<
  UseAvatarSectionReturnType,
  "cropper" | "editor" | "handleFileChange" | "clearAvatarSectionStates"
>;

export const AvatarCropper: FC<AvatarCropperProps> = ({
  cropper,
  editor,
  clearAvatarSectionStates,
  handleFileChange,
}) => {
  const formParams = useBaseForm({ defaultValues: { newUserAvatarFile: "" } });

  return (
    <div className="fixed inset-0 w-full z-50 flex flex-col items-center justify-center gap-5 bg-[rgba(10,10,10,0.99)]">
      <Button
        ariaLabel="Close avatar editor"
        variant="ghost"
        className="absolute top-[10px] right-[20px]"
        onClick={clearAvatarSectionStates}
      >
        <CloseIcon className="h-10 w-10 md:h-8 md:w-8" />
      </Button>

      <Card ref={editor.avatarEditorCardRef} className="w-[90%] md:w-[60%]">
        <div className="self-center">
          {/* Fake BaseForm just to use FormImageInput in this case */}
          <BaseForm formParams={formParams} onSubmit={() => {}}>
            <FormImageInput
              labelText="Choose photo"
              name="newUserAvatarFile"
              onChange={handleFileChange}
            />
          </BaseForm>
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
              image={cropper.imageSrc}
              crop={cropper.crop}
              onCropChange={cropper.setCrop}
              zoom={cropper.zoom}
              onZoomChange={cropper.setZoom}
              onCropComplete={cropper.setCroppedAreaPixels}
              aspect={1}
              cropShape="round"
              zoomWithScroll
              minZoom={1}
              maxZoom={4}
              zoomSpeed={0.1}
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
            editor.close();
            editor.submitPreview();
          }}
          disabled={!cropper.imageSrc}
        >
          See preview
        </Button>
      </Card>
    </div>
  );
};
