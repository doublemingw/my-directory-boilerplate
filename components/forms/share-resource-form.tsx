"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { Icons } from "@/components/shared/icons";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { shareResource, ShareResourceFormData } from "@/actions/share-resource";
import { shareResourceSchema } from "@/lib/validations/schema";

import { AllShareResourceConfigs } from "@/config/share-resource";
import { UserQueryResult } from "@/sanity.types";
import confetti from 'canvas-confetti';

interface ShareResourceFormProps {
  lang: string;
  user: Pick<User, "id" | "name">;
  sanityUser: UserQueryResult;
}

export function ShareResourceForm({ lang, user, sanityUser }: ShareResourceFormProps) {
  const [isPending, startTransition] = useTransition();
  const shareResourceWithId = shareResource.bind(null, user.id);
  console.log('ShareResourceForm, sanityUser:', sanityUser);
  const formConfig = AllShareResourceConfigs[lang];

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ShareResourceFormData>({
    resolver: zodResolver(shareResourceSchema),
    defaultValues: {
      name: "",
      link: "",
    },
  })

  const onSubmit = handleSubmit(data => {
    startTransition(async () => {
      const { status } = await shareResourceWithId({
        ...data,
        sanityUser: sanityUser,
      });
      console.log('ShareResourceForm, status:', status);
      if (status === "success") {
        confetti();
        reset();
        toast.success(formConfig.form.success);
      } else {
        toast.success(formConfig.form.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          {/* <CardTitle>Submit Application</CardTitle> */}
          <CardDescription>
            {formConfig.form.title}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex gap-4 items-center">
              <Label className="min-w-[50px]" htmlFor="name">
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
                <Label className="min-w-[50px]" htmlFor="error_name">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
              </div>
            )}

            <div className="flex gap-4 items-center">
              <Label className="min-w-[50px]" htmlFor="link">
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
                <Label className="min-w-[50px]" htmlFor="error_link">
                </Label>
                <p className="px-1 text-xs text-red-600">{errors.link.message}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/25 pt-6">
          <button
            type="submit"
            className={cn(buttonVariants())}
            disabled={isPending}
          >
            {(isPending) && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            <span>{isPending ? formConfig.form.submiting : formConfig.form.submit}</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
