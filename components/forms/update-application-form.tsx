"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { deleteApplication } from "@/actions/delete-application";
import { updateApplication, updateApplicationFormData } from "@/actions/update-application";
import { AllAppListConfigs } from "@/config/app-list";
import { cn } from "@/lib/utils";
import { applicationSchema } from "@/lib/validations/schema";
import { AppTypeListQueryResult, internalGroqTypeReferenceTo, SanityImageCrop, SanityImageHotspot, UserQueryResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/utils";
import { CircleCheckIcon, CircleXIcon, Clock3Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

// copy from ApplicationListByUserQueryResult in sanity.types.ts
export type UpdateApplicationInfo = {
  _id: string;
  _type: "application";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  description?: string;
  link?: string;
  types: Array<{
    _id: string;
    _type: "appType";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name: string;
    slug: string | null;
    order?: number;
    date?: string;
  }> | null;
  featured?: boolean;
  status?: "approved" | "rejected" | "reviewing";
  reason?: "rejected: please upload a better image";
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  cover?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  user: {
    _id: string;
    _type: "user";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    name?: string;
    id?: string;
    email?: string;
    avatar?: string;
    link?: string;
    date?: string;
  } | null;
  date?: string;
}

interface UpdateApplicationFormProps {
  lang: string;
  user: Pick<User, "id" | "name">;
  application: UpdateApplicationInfo;
  appTypeList: AppTypeListQueryResult;
  sanityUser: UserQueryResult;
}

export function UpdateApplicationForm({ lang, user, application, appTypeList, sanityUser }: UpdateApplicationFormProps) {
  const formConfig = AllAppListConfigs[lang];
  console.log('UpdateApplicationForm, application:', application);
  const router = useRouter();
  const currentImageUrl = application.image ? urlForImage(application.image)?.url() : "";
  const currentCoverImageUrl = application.cover ? urlForImage(application.cover)?.url() : "";
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState(currentImageUrl);
  const [coverImageId, setCoverImageId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(currentCoverImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, startUpdateTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const updateApplicationWithId = updateApplication.bind(null, user.id);
  const deleteApplicationWithId = deleteApplication.bind(null, user.id);

  console.log("UpdateApplicationForm, appTypeList", appTypeList);
  // const correntAppTypeList = appTypeList.filter(appType => {
  //   return appType.slug !== 'new' && appType.slug !== 'featured';
  // });
  // console.log("UpdateApplicationForm, correntAppTypeList", correntAppTypeList);
  // const defaultTypes = appTypeList.map(appType => appType._id);
  // const fileteredAppTypeList = appTypeList.filter(appType => {
  //   return appType.slug === 'others'
  // });
  // console.log("UpdateApplicationForm, fileteredAppTypeList", fileteredAppTypeList);
  const defaultTypes = application.types?.map(appType => appType._id) ?? [];
  console.log("UpdateApplicationForm, defaultTypes", defaultTypes);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(defaultTypes);
  console.log("UpdateApplicationForm, selectedTypes", selectedTypes);

  // https://react-hook-form.com/docs/useform
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<updateApplicationFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // resolver: zodResolver(applicationSchema),
    resolver: async (data, context, options) => {
      // customize schema validation, manual add types to form data
      console.log("UpdateApplicationForm, validate formData", data);
      // imageId maybe empty, but it's ok for update application, so we don't need to validate it.
      const updatedFormData = {
        ...data,
        // imageId,
        types: selectedTypes,
      };
      console.log("UpdateApplicationForm, validate updatedFormData", updatedFormData);
      return zodResolver(applicationSchema)(updatedFormData, context, options);
    },

    defaultValues: {
      name: application.name ?? "",
      link: application.link ?? "",
      description: application.description ?? "",
      imageId: "",
      coverImageId: "", // defined in updateApplicationFormData
      types: selectedTypes,
    },
  })

  const onSubmit = (data: any) => {
    console.log('UpdateApplicationForm, onSubmit, data:', data);
    startUpdateTransition(async () => {
      const { status } = await updateApplicationWithId({
        ...data,
        lang: lang,
        applicationId: application._id,
        imageId,
        coverImageId,
        types: selectedTypes,
        status: application.status,
        sanityUser,
      });
      console.log('UpdateApplicationForm, status:', status);
      if (status === "success") {
        toast.success(formConfig.form.success);
        router.replace(`/${lang}/dashboard/applist`);
      } else {
        toast.success(formConfig.form.error);
      }
    });
  };

  const handleUpload = async (e) => {
    console.log('UpdateApplicationForm, handleUpload, file:', e.target.files[0]);
    const file = e.target.files[0];
    if (!file) {
      console.log('UpdateApplicationForm, handleUpload, file is null');
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      e.target.value = '';
      console.error('UpdateApplicationForm, Image size should be less than 1MB.');
      toast.error('Image size should be less than 1MB.');
      return;
    }

    setIsUploading(true);
    const imageAsset = await uploadImage(file);
    if (!imageAsset) {
      e.target.value = '';
      console.error('UpdateApplicationForm, Upload Image failed, please try again.');
      toast.error('Upload Image failed, please try again.'); // TODO: translate
      return;
    }
    console.log('UpdateApplicationForm, handleUpload, imageId:', imageAsset._id);
    setImageId(imageAsset._id);
    setImageUrl(imageAsset.url);
    setIsUploading(false);
  };

  const handleUploadCoverImage = async (e) => {
    console.log('SubmitApplicationForm, handleUploadCoverImage, file:', e.target.files[0]);
    const file = e.target.files[0];
    if (!file) {
      console.log('SubmitApplicationForm, handleUploadCoverImage, file is null');
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      e.target.value = '';
      toast.error('Image size should be less than 1MB.');
      return;
    }

    setIsUploading(true);
    const coverImageAsset = await uploadImage(file);
    if (!coverImageAsset) {
      e.target.value = '';
      toast.error('Upload Image failed, please try again.'); // TODO: translate
      return;
    }
    console.log('SubmitApplicationForm, handleUploadCoverImage, coverImageId:', coverImageAsset._id);
    setCoverImageId(coverImageAsset._id);
    setCoverImageUrl(coverImageAsset.url);
    setIsUploading(false);
  };

  const uploadImage = async (file) => {
    const asset = await client.assets.upload('image', file);
    console.log('UpdateApplicationForm, uploadImage, asset url:', asset.url);
    // setImageUrl(asset.url);
    // return asset._id;
    return asset;
  };

  const onDelete = async (e) => {
    console.log("UpdateApplicationForm, onDelete");
    startDeleteTransition(async () => {
      const { status } = await deleteApplicationWithId({
        lang: lang,
        applicationId: application._id,
      });
      console.log('UpdateApplicationForm, onDelete, status:', status);
      if (status === "success") {
        toast.success(formConfig.form.deleteSuccess);
        router.replace(`/${lang}/dashboard/applist`);
      } else {
        toast.success(formConfig.form.deleteError);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className={
        cn(
          // application.status === "rejected" ? "border-red-600" : "",
          // application.status === "reviewing" ? "border-yellow-600" : "",
          // application.status === "approved" ? "border-green-600" : "",
        )
      }>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-8">
            <span className="shrink-0 font-semibold text-primary dark:text-foreground">
              {application.name}
            </span>
            {/* <span className="text-sm text-muted-foreground">
              {application.date && formatDate(application.date)}
            </span> */}

            {/* if the application is rejected, then show the reason */}
            {
              application.status === "rejected" && application.reason &&
              <Badge variant="outline" className="text-base font-semibold text-red-600 flex items-center gap-2 bg-red-100 border-transparent">
                <CircleXIcon className="size-4 inline-block" />
                <span className="line-clamp-1">
                  {application.reason}
                </span>
              </Badge>
            }
            {
              application.status === "approved" &&
              <Badge variant="outline" className="text-base font-semibold text-green-600 flex items-center gap-2 bg-green-100 border-transparent">
                <CircleCheckIcon className="size-4 inline-block" />
                <span className="line-clamp-1">
                  {application.status}
                </span>
              </Badge>
            }
            {
              application.status === "reviewing" &&
              <Badge variant="outline" className="text-base font-semibold text-yellow-600 flex items-center gap-2 bg-yellow-100 border-transparent">
                <Clock3Icon className="size-4 inline-block" />
                <span className="line-clamp-1">
                  {application.status}
                </span>
              </Badge>
            }
          </CardTitle>
          <CardDescription>
            {/* Please enter the name and description of your application. */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="name">
                {formConfig.form.name}
              </Label>
              <div className="w-full flex flex-col space-y-4">
                <Input
                  id="name"
                  className="w-full"
                  autoComplete="off"
                  placeholder={formConfig.form.namePlaceHolder}
                  {...register("name")}
                />
              </div>
            </div>
            {errors?.name && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_name">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="name">
                {formConfig.form.types}
              </Label>
              <div className="w-full flex flex-wrap items-center gap-4">
                <ToggleGroup type="multiple" variant="outline" size={"sm"}
                  className="flex flex-wrap items-start justify-start"
                  value={selectedTypes}
                  onValueChange={setSelectedTypes}>
                  {appTypeList.length > 0 && appTypeList.map((item) => (
                    <ToggleGroupItem key={item._id} value={item._id}
                      aria-label={item.name ?? ''}
                      className={`${selectedTypes.includes(item._id) ? 'border-primary/50 dark:border-foreground/50 font-semibold' : ''}`}>
                      {item.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            </div>
            {errors?.types && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_types">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.types.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="link">
                {formConfig.form.link}
              </Label>
              <div className="w-full flex flex-col space-y-4">
                <Input
                  id="link"
                  className="w-full"
                  autoComplete="off"
                  placeholder={formConfig.form.linkPlaceHolder}
                  {...register("link")}
                />
              </div>
            </div>
            {errors?.link && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_name">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.link.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="description">
                {formConfig.form.desc}
              </Label>
              <div className="w-full flex flex-col space-y-4">
                <Textarea
                  id="description"
                  className="w-full"
                  autoComplete="off"
                  placeholder={formConfig.form.descPlaceHolder}
                  {...register("description")}
                />
              </div>
            </div>
            {errors?.description && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_name">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.description.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="imageFile">
                {formConfig.form.image}
              </Label>
              <Input id="imageFile" type="file"
                className="w-full"
                onChange={handleUpload}
                accept="image/*" />

              {imageUrl &&
                <Image alt="app logoimage" className="border sm:w-max-[600px]"
                  height={64} width={64}
                  placeholder='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgBAMAAAAQtmoLAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURe7u8LO0vunq7N7e4sHCyszM05J1rm8AAAB2SURBVFjD7dXdCYAwDEbRmAkMOEDQBZRMUHCBIu6/iq2tj4IVxL/vQClC74MVIhEAAPwNt0l6yju3uhsMsmrSwbxXUt8YdGZOJrPDQeCl324AwVsDGSNXEGQXBnPkS16aSRVfGsGJoHjyPXB6EymHhV8xAMDnLNyhJR10BfPFAAAAAElFTkSuQmCC'
                  src={imageUrl} />
              }
            </div>

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="coverImageFile">
                {formConfig.form.coverImage}
              </Label>
              <Input id="coverImageFile" type="file"
                className="w-full"
                required
                onChange={handleUploadCoverImage}
                accept="image/*" />

              {/* 960x540 => 480x270 => 128x64 */}
              {coverImageUrl &&
                <Image alt="app cover image" className="border sm:w-max-[600px]"
                  height={64} width={128}
                  placeholder='data:image/png;base64,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'
                  src={coverImageUrl} />
              }
            </div>
            {errors?.coverImageId && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_coverImageId">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.coverImageId.message}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/25 pt-6">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="submit"
                variant={"default"}
                className=""
                disabled={isUpdating || isDeleting || isUploading}
              >
                {(isUpdating || isUploading) && (
                  <Icons.spinner className="mr-2 size-4 animate-spin" />
                )}
                <span>{isUpdating ? formConfig.form.updating :
                  (isUploading ? formConfig.form.imageUploading : formConfig.form.update)}</span>
              </Button>
            </div>

            <Button
              onClick={onDelete}
              variant={"destructive"}
              className=""
              disabled={isUpdating || isDeleting || isUploading}
            >
              {(isDeleting) && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              <span>{isDeleting ? formConfig.form.deleting : formConfig.form.delete}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
