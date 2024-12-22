"use server";

import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type deleteApplicationFormData = {
  lang: string;
  applicationId: string;
};

// https://nextjs.org/learn/dashboard-app/mutating-data
export async function deleteApplication(userId: string, data: deleteApplicationFormData) {
  try {
    const session = await auth();
    if (!session?.user || session?.user.id !== userId) {
      console.log("deleteApplication, unauthorized");
      throw new Error("Unauthorized");
    }
    console.log("deleteApplication, username:", session?.user?.name);

    // console.log("deleteApplication, data:", data);
    const { lang, applicationId } = data;
    console.log("deleteApplication, lang:", lang, " applicationId:", applicationId);    

    const res = await client.delete(applicationId);
    if (!res) {
      console.log("deleteApplication, fail");
      return { status: "error" };
    }

    console.log("deleteApplication, success, res:", res);
    revalidatePath(`/${lang}/dashboard/app`);
    return { status: "success" };
  } catch (error) {
    console.log("deleteApplication, error", error);
    return { status: "error" };
  }
}