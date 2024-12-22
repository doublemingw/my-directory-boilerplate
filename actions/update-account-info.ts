"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { accountInfoSchema } from "@/lib/validations/account";
import { client } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";

export type AccountInfoFormData = {
  name: string;
  link: string;
  sanityUserId: string;
};

export async function updateAccountInfo(userId: string, data: AccountInfoFormData) {
  try {
    const session = await auth();
    if (!session?.user || session?.user.id !== userId) {
      console.log("updateAccountInfo, unauthorized");
      throw new Error("Unauthorized");
    }

    const { sanityUserId } = data;
    console.log("updateAccountInfo, sanityUserId:", sanityUserId);
    const originalName = session.user.name || "";
    console.log("updateAccountInfo, username:", originalName);
    const { name, link } = accountInfoSchema.parse(data);
    console.log("updateAccountInfo, name:", name, "link:", link);

    if (originalName !== name) {
      // Update the user name in database
      console.log("updateAccountInfo, update name in database");
      const updateResult = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: name,
        },
      });
      if (!updateResult) {
        console.log("updateAccountInfo, fail to update name in database, result", updateResult);
        return { status: "error" };
      }
    }

    const submitData = {
      _type: "user",
      _id: sanityUserId,
      name,
      link,
    };

    console.log("updateAccountInfo, submitData:", submitData);
    const res = await client.patch(sanityUserId).set(submitData).commit();
    if (!res) {
      console.log("updateAccountInfo, fail");
      return { status: "error" };
    }

    console.log("updateAccountInfo, success, res", res);
    revalidatePath('/dashboard/settings');
    return { status: "success" };
  } catch (error) {
    console.log("updateAccountInfo, error", error);
    return { status: "error" };
  }
}