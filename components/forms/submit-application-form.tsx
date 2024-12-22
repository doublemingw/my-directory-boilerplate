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
  CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { submitApplication, submitApplicationFormData } from "@/actions/submit-application";
import { AllSubmitAppConfigs } from "@/config/submit-app";
import { applicationSchema } from "@/lib/validations/schema";
import { AppTypeListQueryResult, UserQueryResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import confetti from 'canvas-confetti';
import { HourglassIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface SubmitApplicationFormProps {
  lang: string;
  user: Pick<User, "id" | "name">;
  appTypeList: AppTypeListQueryResult;
  sanityUser: UserQueryResult;
}

// https://ui.shadcn.com/docs/components/form
// https://nextjs.org/learn/dashboard-app/mutating-data
export function SubmitApplicationForm({ lang, user, appTypeList, sanityUser }: SubmitApplicationFormProps) {
  const formConfig = AllSubmitAppConfigs[lang];
  const router = useRouter();
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [coverImageId, setCoverImageId] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  // https://nextjs.org/learn/dashboard-app/mutating-data#4-pass-the-id-to-the-server-action
  // Note: Using a hidden input field in your form also works (e.g. <input type="hidden" name="id" value={invoice.id} />). 
  // However, the values will appear as full text in the HTML source, which is not ideal for sensitive data like IDs.
  const submitApplicationWithId = submitApplication.bind(null, user.id);

  console.log("SubmitApplicationForm, appTypeList", appTypeList);
  const correntAppTypeList = appTypeList.filter(appType => {
    return appType.slug !== 'new' && appType.slug !== 'featured';
  });
  console.log("SubmitApplicationForm, correntAppTypeList", correntAppTypeList);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  console.log("SubmitApplicationForm, selectedTypes", selectedTypes);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<submitApplicationFormData>({
    // resolver: zodResolver(applicationSchema),
    resolver: async (data, context, options) => {
      // customize schema validation, manual add types to form data
      console.log("SubmitApplicationForm, validate formData", data);
      // imageId and types input elements are not registered with react-hook-form,
      // so we need to add them manually in order to validate them.
      // 20240604, schema not validate imageId, so remove imageId
      const updatedFormData = {
        ...data,
        // imageId,
        // coverImageId,
        types: selectedTypes,
      };
      console.log("SubmitApplicationForm, validate updatedFormData", updatedFormData);
      return zodResolver(applicationSchema)(updatedFormData, context, options);
    },
    defaultValues: {
      name: "",
      link: "",
      imageId: "",
      coverImageId: "", // defined in submitApplicationFormData
      description: "",
      types: selectedTypes,
    },
  })

  const onSubmit = handleSubmit(data => {
    console.log('SubmitApplicationForm, onSubmit, data:', data);
    startTransition(async () => {
      const { status } = await submitApplicationWithId({
        ...data,
        imageId,
        coverImageId,
        types: selectedTypes,
        sanityUser,
      });
      console.log('SubmitApplicationForm, status:', status);
      if (status === "success") {
        confetti();
        reset();
        toast.success(formConfig.form.success);
        router.push(`/${lang}/dashboard/applist`);
      } else {
        toast.success(formConfig.form.error);
      }
    });
  });

  const handleUpload = async (e) => {
    console.log('SubmitApplicationForm, handleUpload, file:', e.target.files[0]);
    const file = e.target.files[0];
    if (!file) {
      console.log('SubmitApplicationForm, handleUpload, file is null');
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      e.target.value = '';
      console.error('SubmitApplicationForm, Image size should be less than 1MB.');
      toast.error('Image size should be less than 1MB.'); // TODO: translate
      return;
    }

    setIsUploading(true);
    const imageAsset = await uploadImage(file);
    if (!imageAsset) {
      e.target.value = '';
      console.log('SubmitApplicationForm, Upload Image failed, please try again.');
      toast.error('Upload Image failed, please try again.'); // TODO: translate
      return;
    }
    console.log('SubmitApplicationForm, handleUpload, imageId:', imageAsset._id);
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
    console.log('SubmitApplicationForm, uploadImage, asset url:', asset.url);
    return asset;
  };

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          {/* <CardTitle>Submit Application</CardTitle> */}
          <CardDescription>
            {/* Please enter the information of your application. */}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="name">
                {formConfig.form.name}
              </Label>
              <div className="w-full flex flex-col">
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
                  {correntAppTypeList.length > 0 && correntAppTypeList.map((item) => (
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
              <div className="w-full flex flex-col">
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
                <Label className="min-w-[100px]" htmlFor="error_link">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.link.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[100px]" htmlFor="description">
                {formConfig.form.desc}
              </Label>
              <div className="w-full flex flex-col">
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
                <Label className="min-w-[100px]" htmlFor="error_description">
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
                required
                onChange={handleUpload}
                accept="image/*" />

              {imageUrl &&
                <Image alt="app logo image" className="border sm:w-max-[600px]"
                  height={64} width={64}
                  placeholder='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgBAMAAAAQtmoLAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURe7u8LO0vunq7N7e4sHCyszM05J1rm8AAAB2SURBVFjD7dXdCYAwDEbRmAkMOEDQBZRMUHCBIu6/iq2tj4IVxL/vQClC74MVIhEAAPwNt0l6yju3uhsMsmrSwbxXUt8YdGZOJrPDQeCl324AwVsDGSNXEGQXBnPkS16aSRVfGsGJoHjyPXB6EymHhV8xAMDnLNyhJR10BfPFAAAAAElFTkSuQmCC'
                  src={imageUrl} />
              }
            </div>
            {errors?.imageId && (
              <div className="flex gap-4 items-center">
                <Label className="min-w-[100px]" htmlFor="error_imageId">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.imageId.message}</p>
              </div>
            )}

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
                  placeholder='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA8AAAAIcBAMAAADLc9pIAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAPUExURe7u8LO0vtfY3cXGzeTl6OOciQMAAAoUSURBVHja7N1tYprAGgZQoywgqAvQpAuQ2AVozP7XdBUFXphBTdt7b6vn/EodwRkeZxi+7GQCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN3y+va3+5Ptyire3N1v6/6Qqy9d73rcuy+Wvfsa0LMudTf0HvX/8SsBXl/q7A/5Ggx/Bd8LoAr6+1F8d8O9U7l903J7l9wO+vtRfHfB3GvwATtuzXH034BtL/c0Bf6vBD2D2SwHP/t2AZ08WsB784Ipf2gcX/+4+OFZ9/wxRP/Ms+ikCLrbb3fcDvr7UXx1wqPr6qQbr753o+K8dav4vz2QJWMAC/pcDrgQsYAELWMAC/neOmccCLu4OeHf9xSsB38i9+HZR5pxW8XjHwcXusuGKr/qP9+P3enDF9PP40mIXA+6Wqh2ObwgHxpeAp9vjYv0teDi+VP4YdtrT+z5yAe++iu7w9fimn6HedW2nVfMJ78fltvn+2C8KVT/VpTh+xm6kHY/SK5fNll2e/30076VSv3T8sncB9/to1byht87p4NU6jtoy2f7dR8aAj+tZXP6clf16Teuq1B/xOmmrXf7MtzAWNVW/1KVdQ6YdjxjwZWuUm+4ds2Y77EYCbpZpe2v9vmnzajcQtFt0k359mvBCwNPuu9CsrAwdfXlJZBOqkEl4WNRUvUwCTtrxcAHPuzC7WIp2O8zzAc/KfkSXgKthmt37wtq76C5vDAHvuz+77rYKAc+axWZl9rsz+NTN9YDTdjxewF2Y3Ti1L8vsl70JuKiShU4BH4abaxpXsxkO723sIeBu2W5lYW3zy7K7dCWTyej6m6oXw0Zl2vF4Addhbnv7pfOGWLxvxwJ+qUfOr9PcrHntVFovdd5m4X3l9u2910fO3ebjbdss3QU867Z0vbIfn9uyLTzV9vKV2Z3r+PH1+V4m0/y0aKwHZ9rxcAEvzju5Yh0imDW7r+lIwNWlQ9Y9IO7MTruyz64/nJaf75o1xg52mqCfOumqH3A3xZo13e/Q1uDydTyu8POczc9L+WAOnBY1Vf/x4+1U9uNoN9KOhws49qJFSCC8IQl42pserULAu+bPTbOmeZf/Kozbl4UW/UnWtFtyHdfcftiiXeG+re56uPtMi7qqF3EwzrXjAQNedFt01w1xYb6bBBxmQuswCjbhhJnwfh625aZbutncm37A+14dwtcpfB1X7ZewGU9W6S54UDQScK4dDxjwqhvYVu3o+Jqequy2UtXbG8/bgOeT4UxpGs8gvXbjwy57qjKkOgtvKsNI3n5GlU6eJ6NFIwHn2vF4Acc+tmq/2KsrARdhSjwNE9UyHBPPJ2PdqkiPSZqAwxRrH+bG63A01X7GHwg4247HCzhtbhUbmwl4Fmck1eXvGOo+s7X2TfksPXBtAq56HfQ1zLpf24AnvxdwbHG2HY8X8C4Mopvmj+W1gHvDWdXNrJZhGpsE3L72kl5ZuFQj7Kd71wRmYR44zwyvk/F98NUenG3HYwf82myD12sBD89ZrjIBl6MBr9PCSzVCx+9VbHoJIn4B4jnrTPMW9wScbccT9OD+IUMm4N4l4v1lqbt7cJXuoKftqYvlZDBzvoSySCq2L0fH6LRoNOC0HQ8ccJPbrDeG5gPeXA14lnTSr7cqBLzMBhw/92VwZnyR1PbK4yhpUT7gMteOJwi4P8BmAu5tvpfbARfvVTgvnJ5avFQjdu3+UUsu4MnopcJM0WjAaTsEXG+YbaspHw/4vT3/m/abEHA8lVb34O4zLov2A973LiUmY3SvKD+LzrbjsQPepHvQNOCiHMgF3K4hXLBZDA8+ewGv48C6H35GGvDlmtFil59H94qyPTjfjifowfvvBnxtiG7zbU7njwX81bvvYxhwZohurkXmEh4W3RfwRsDLsPXuC/ic78dX26unIwEfeld213cE/I2EswFPBfz7PbiOrblgeHWIrs5XLlf39+D2fq/cSeR+kR783X3wanydcR9cdNPZWwGfVtp91j4XW3p37WUHkDta6hWNBvw45zb+4Cz6roDL9o9l/+zWeMDzMHbcGfBlip4/ZxmKsrNoAV85TNrcF3DVuwf26nHwaZ1ddXLnwvL3x6/Hf3igK7rjRMcTBfy9M1lXAw5hxoBzZ7Lq0ni3450B19O4kY7YFuUDrp4v4E0Tz/3noq/tg+PqZzfORderXMdrincGPBvviLN0BjgI+PUZe/B0eIvrMODc9fxsD44xvYThcpELuDd4ZO+RGnmE6copivQsTHHjvoRnCPjm5cLc1cCxgBfJzHqfvx687M/AcqmNBHzldqr11YBfHvb3764HPCkHF8KHAWcHxbsDHrmjY9XvVFVmJzwe8PJGQ8NbBnd0bJ4r4E07+2wPJzN3VRa5I5PcPng2uHzQfuZ8LLmX9P7KP9uD49S5KB/1N0pv9OD94Kz/MOBs97qxDw634sa7KotBNdoxejZ2TaL9jHTuUDV3hSZF+YCz7XiGgGddHyvKsfui2620ux7wqjsmDTdgN29drwbVaObYRbx4WGQC7m53D1Pl+XhReCijrWeuHc8QcNGd46tGn2xozuMf5uMBd2PgITywFG64OAyfTaq3efs1+NmcdVwltZ22pc23qGierEiLBgEv4pAwbMcz7IPP3W11eWApE3D3dFH6+M/wpEb94O1n71JR1bx8SI+Xp3GMPgdVVJnavoTSbiV1nGnR8Lm5TdNhM+14hh586W/1XQ5l9rcqm+cD36rkEdzevrf+ppwfI1x0Ae/D6utIpv3HGJbd4LF4q59MXCS1XZ9L63u9zgvMeg+G94qSqm/fq+VIO54i4HAXxvwlF3B8rjZzL23vYkPzUwFhaIzXAXeDarQXHA7xSt4uM0QPHu1tA06LelWPzxxn2vEUAYeNu5rlAu5txNV4wJNwrTUce83Gn/APE7P18AnwXm0PudLzkumj47FyVXwyPG3HU+yDm53vaV+WDzhsxM34cXD3tp+n1S9iBeLPbwxvz14OholF7jj4vd+9u0lWWpT99YmRdjxHD2427kfz0zbpGaND+iMsuVt21u0trDHgJoKP3PFPG2iT8Ef+RMdh0PPCqeVM0fD3YxYj7Xga79ty++PaG4rjJGl7+78jOs6wcj9l9bmtFtubG/WwLa+8qzjWcfGx676U3d1Zg6JkraFpd7YDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+0x4cEgAAAAAI+v/aGRYAAAAAAAAAAAAAAAAAAIBJ5YvTRA+/XogAAAAASUVORK5CYII='
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
          <div className="w-full flex items-center justify-between gap-8">
            <Button
              type="submit"
              variant={"default"}
              className=""
              disabled={isPending}
            >
              {(isPending || isUploading) && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              <span>{isPending ? formConfig.form.submiting :
                (isUploading ? formConfig.form.imageUploading : formConfig.form.submit)}
              </span>
            </Button>

            <div className="text-sm text-primary dark:text-foreground flex items-center gap-2">
              <HourglassIcon className="size-4 inline-block" />
              <span>{formConfig.form.notice}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
