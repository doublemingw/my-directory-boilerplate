import { z } from "zod";

// https://nextjs.org/learn/dashboard-app/mutating-data
export const applicationSchema = z.object({
    name: z.string()
        .min(1, { message: "Must be 1 or more characters long" })
        .max(32, { message: "Must be 32 or fewer characters long" }),
    types: z.array(z.string())
        .min(1, { message: "Must select at least one type" }),
    link: z.string()
        .url({ message: "Invalid url" }),
    description: z.string()
        .min(3, { message: "Must be 3 or more characters long" })
        .max(256, { message: "Must be 256 or fewer characters long" }),
    // imageId: z.string()
    //     .min(1, { message: "Must upload an image" })
})

export const shareResourceSchema = z.object({
    name: z.string()
        .min(1, { message: "Must be 1 or more characters long" })
        .max(32, { message: "Must be 32 or fewer characters long" }),
    link: z.string()
        .url({ message: "Invalid url" }),
})
