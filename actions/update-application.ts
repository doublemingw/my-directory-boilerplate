"use server";

import { auth } from "@/auth";
import { applicationSchema } from "@/lib/validations/schema";
import { UserQueryResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type updateApplicationFormData = {
  lang: string;
  applicationId: string;
  name: string;
  link: string;
  imageId: string;
  coverImageId: string;
  description: string;
  types: string[];
  status: string;
  sanityUser: UserQueryResult;
};

// https://nextjs.org/learn/dashboard-app/mutating-data
export async function updateApplication(userId: string, data: updateApplicationFormData) {
  try {
    const session = await auth();
    if (!session?.user || session?.user.id !== userId) {
      console.log("updateApplication, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("updateApplication, username:", session?.user?.name);

    const { lang, applicationId, imageId, coverImageId, types, status, sanityUser } = data;
    console.log("updateApplication, data:", data);
    const { name, link, description } = applicationSchema.parse(data);
    console.log("updateApplication, applicationId:", applicationId,
      "name:", name, "link:", link, "description:", description);

    const submitData = {
      _type: "application",
      _id: applicationId,
      name,
      link,
      description,
      // if image changed, change status to "reviewing", otherwise keep current status
      status: (imageId || coverImageId) ? "reviewing" : status,
      user: {
        _type: "reference",
        _ref: sanityUser?._id,
      },
      // date: new Date().toISOString(),
      types: types.map(type => ({
        _type: 'reference',
        _ref: type,
        _key: `key-${type}`,
      })),
      ...(imageId ?
        {
          image: {
            _type: "image",
            asset: {
              _type: 'reference',
              _ref: imageId
            }
          }
        } : {}),
      ...(coverImageId ?
        {
          cover: {
            _type: "image",
            asset: {
              _type: 'reference',
              _ref: coverImageId
            }
          }
        } : {})
    };

    console.log("updateApplication, submitData:", submitData);
    const res = await client.patch(applicationId).set(submitData).commit();
    if (!res) {
      console.log("updateApplication, fail");
      return { status: "error" };
    }

    console.log("updateApplication, success, res:", res);
    revalidatePath(`/${lang}/dashboard/app`);
    return { status: "success" };
  } catch (error) {
    console.log("updateApplication, error", error);
    return { status: "error" };
  }
}