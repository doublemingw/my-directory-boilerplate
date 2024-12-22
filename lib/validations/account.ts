import * as z from "zod";

export const accountInfoSchema = z.object({
  name: z.string()
    .min(1, { message: "Must be 1 or more characters long" })
    .max(32, { message: "Must be 32 or fewer characters long" }),
  link: z.string()
    .url({ message: "Invalid url" }),
})
