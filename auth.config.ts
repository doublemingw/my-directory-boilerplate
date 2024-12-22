import { env } from "@/env.mjs";
import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,

      // https://github.com/dubinc/oss-gallery/blob/main/auth.config.ts
      // Unknown argument `username`. Available options are marked with ?.
      // profile(profile) {
      //   return {
      //     id: profile.id.toString(),
      //     name: profile.name || profile.login,
      //     email: profile.email,
      //     image: profile.avatar_url,
      //     username: profile.login,
      //   };
      // },
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig