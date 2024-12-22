"use server";

import { auth } from "@/auth";
import { shareResourceSchema } from "@/lib/validations/schema";
import { UserQueryResult } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type ShareResourceFormData = {
  name: string;
  link: string;
  imageId: string;
  description: string;
  sanityUser: UserQueryResult;
};

// https://nextjs.org/learn/dashboard-app/fetching-data#using-server-components-to-fetch-data
// If you are using React Server Components (fetching data on the server), you can skip the API layer, and query your database directly without risking exposing your database secrets to the client.
export async function shareResource(userId: string, data: ShareResourceFormData) {
  try {
    const session = await auth();
    if (!session?.user || session?.user.id !== userId) {
      console.log("shareResource, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("shareResource, username:", session?.user?.name);

    const { sanityUser } = data;
    console.log("shareResource, data:", data);
    console.log("shareResource, sanityUser:", sanityUser);
    const { name, link } = shareResourceSchema.parse(data);
    console.log("shareResource, name:", name, "link:", link);

    const res = await client.create({
      _type: "submission",
      name,
      link,
      status: "reviewing",
      user: {
        _type: "reference",
        _ref: sanityUser?._id,
      },
      date: new Date().toISOString(),
    });
 
    if (!res) {
      console.log("shareResource, fail");
      return { status: "error" };
    }

    console.log("shareResource, success, res:", res);
    revalidatePath('/dashboard');
    return { status: "success" };
  } catch (error) {
    console.log("shareResource, error", error);
    return { status: "error" };
  }
}