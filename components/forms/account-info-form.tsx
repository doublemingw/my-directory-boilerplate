"use client"

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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { accountInfoSchema } from "@/lib/validations/account";
import { toast } from "sonner";

import { updateAccountInfo, type AccountInfoFormData } from "@/actions/update-account-info";
import { AllSettingsConfigs } from "@/config/settings";
import { UserQueryResult } from "@/sanity.types";

interface AccountInfoFormProps {
  lang: string;
  user: Pick<User, "id" | "name">;
  sanityUser: UserQueryResult;
}

export function AccountInfoForm({ lang, user, sanityUser }: AccountInfoFormProps) {
  const formConfig = AllSettingsConfigs[lang];
  const [isPending, startTransition] = useTransition();
  const updateAccountInfoWithId = updateAccountInfo.bind(null, user.id);
  console.log('AccountInfoForm, sanityUser:', sanityUser);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AccountInfoFormData>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      name: user?.name || "",
      link: sanityUser?.link || "",
    },
  })

  const onSubmit = handleSubmit(data => {
    startTransition(async () => {
      const { status } = await updateAccountInfoWithId({
        ...data,
        sanityUserId: sanityUser?._id,
      });
      console.log('AccountInfoForm, status:', status);
      if (status === "success") {
        toast.success(formConfig.form.success);
      } else {
        toast.error(formConfig.form.error);
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            {/* {formConfig.form.title} */}
          </CardTitle>
          <CardDescription>
            {formConfig.form.subtitle}
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
