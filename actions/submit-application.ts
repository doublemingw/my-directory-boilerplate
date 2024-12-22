"use server";

import { auth } from "@/auth";
import { applicationSchema } from "@/lib/validations/schema";
import { UserQueryResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type submitApplicationFormData = {
  name: string;
  link: string;
  imageId: string;
  coverImageId: string;
  description: string;
  types: string[];
  sanityUser: UserQueryResult;
};

// https://nextjs.org/learn/dashboard-app/mutating-data
export async function submitApplication(userId: string, data: submitApplicationFormData) {
  try {
    const session = await auth();
    if (!session?.user || session?.user.id !== userId) {
      console.log("submitApplication, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("submitApplication, username:", session?.user?.name);

    const { imageId, coverImageId, types, sanityUser } = data;
    console.log("submitApplication, data:", data);
    const { name, link, description } = applicationSchema.parse(data);
    console.log("submitApplication, name:", name, "link:", link,
      "description:", description);

    const submitData = {
      _type: "application",
      name,
      link,
      description,
      status: "reviewing",
      user: {
        _type: "reference",
        _ref: sanityUser?._id,
      },
      date: new Date().toISOString(),
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

    console.log("submitApplication, submitData:", submitData);

    const res = await client.create(submitData);
    if (!res) {
      console.log("submitApplication, fail");
      return { status: "error" };
    }

    console.log("submitApplication, success, res:", res);

    // Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time. 
    // Along with prefetching, this cache ensures that users can quickly navigate between routes 
    // while reducing the number of requests made to the server.
    // Since you're updating the data displayed in the invoices route, you want to clear this cache and trigger a new request to the server. 
    // You can do this with the revalidatePath function from Next.js.
    revalidatePath('/dashboard/app');
    return { status: "success" };
  } catch (error) {
    console.log("submitApplication, error", error);
    return { status: "error" };
  }
}