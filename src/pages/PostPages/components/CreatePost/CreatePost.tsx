import cn from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useFetchCommunities } from "src/api/community";
import { useCreatePostMutation } from "src/api/posts";
import { POST_CONTENT_MAX_LENGTH, POST_TITLE_MAX_LENGTH } from "src/constants";
import { useAuth } from "src/context";
import { ImageSkeleton } from "src/shared/components";
import {
  BaseForm,
  Button,
  Card,
  FormImageInput,
  FormTextInput,
  RequiredHint,
  useBaseForm,
  FormSelect,
  FormMDEditor,
  Typography,
} from "src/shared/UI";
import { getCroppedImg, sanitizeFilename } from "src/utils";

import {
  INITIAL_FORM_STATE,
  validationSchema,
  PostFormType,
} from "./validationSchema";

export const CreatePost = () => {
  const { userData } = useAuth();
  const { communityList } = useFetchCommunities();
  const [localImageUrl, setLocalImageUrl] = useState<string | undefined>(
    undefined
  );
  const { createPost, isCreatePostLoading } = useCreatePostMutation();
  const formParams = useBaseForm({
    validationSchema,
    defaultValues: INITIAL_FORM_STATE,
  });

  useEffect(() => {
    if (!localImageUrl) return;

    return () => {
      URL.revokeObjectURL(localImageUrl);
    };
  }, [localImageUrl]);

  const handleSubmit = async ({
    postTitle,
    postContent,
    postImage,
    postCommunityId,
  }: PostFormType) => {
    if (!userData || !postImage) return;

    toast.promise(
      async () =>
        await createPost({
          postData: {
            title: postTitle.trim(),
            content: postContent,
            userId: userData.id,
            communityId: postCommunityId,
          },
          imageFile: postImage,
        }),
      {
        pending: `🚀 Creating post ${postTitle}`,
        success: `Post created successfully!`,
      }
    );
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const postImageUrl = URL.createObjectURL(file);

      try {
        const { blobUrl, file: croppedFile } = await getCroppedImg({
          imageSrc: postImageUrl,
          pixelCrop: {
            width: null,
            height: null,
            x: 0,
            y: 0,
          },
          max: {
            width: 1000,
            height: 500,
          },
          outputFilename: sanitizeFilename(file.name),
        });
        formParams.setValue("postImage", croppedFile);
        formParams.trigger("postImage");
        setLocalImageUrl(blobUrl);
      } catch (error) {
        console.error("Cropping error", error);
      }
    }
  };

  const titleValue = formParams.watch("postTitle");
  const contentValue = formParams.watch("postContent");
  const imageValue = formParams.watch("postImage");

  const isSubmitDisabled =
    isCreatePostLoading ||
    !userData ||
    !titleValue ||
    !contentValue ||
    !imageValue;

  return (
    <Card className="max-w-2xl mx-auto" isLoading={isCreatePostLoading}>
      <BaseForm
        className="flex flex-col gap-3"
        formParams={formParams}
        onSubmit={handleSubmit}
      >
        <FormTextInput
          name="postTitle"
          labelText="Title"
          maxLength={POST_TITLE_MAX_LENGTH}
          showCounter
          isRequired
        />

        <FormMDEditor
          labelText="Content"
          name="postContent"
          maxLength={POST_CONTENT_MAX_LENGTH}
          showCounter
          isRequired
        />

        <FormSelect
          labelText="Choose community"
          name="postCommunityId"
          optionList={communityList
            .filter((community) => community.id !== -1)
            .map((community) => ({
              id: community.id,
              value: community.name,
            }))}
        />

        <FormImageInput
          labelText="Upload image"
          name="postImage"
          onChange={handleFileChange}
          isRequired
        />

        <RequiredHint />

        <Button className="self-end" type="submit" disabled={isSubmitDisabled}>
          {isCreatePostLoading ? "Creating..." : "Create post"}
        </Button>
      </BaseForm>

      <div className={cn({ hidden: !imageValue })}>
        <Typography.Text className="font-semibold mb-2">
          Image preview
        </Typography.Text>

        <ImageSkeleton
          src={localImageUrl}
          alt="Post image preview"
          withPhotoView
        />
      </div>
    </Card>
  );
};
