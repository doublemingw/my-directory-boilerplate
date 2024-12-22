import authConfig from "@/auth.config";
import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { client } from "./sanity/lib/client";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  // https://github.com/nextauthjs/next-auth/issues/9493#issuecomment-1871601543
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    // signIn: "/login",
    // error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },

    async jwt({ token, user, trigger }) {
      console.log('auth, jwt, trigger:', trigger);

      console.log('auth, jwt, user id:', user?.id);
      // console.log('auth, jwt, user:', user);
      // auth, jwt, user: {
      //   id: 'clwusgyhb0000jeeg1t2491bz',
      //   name: 'javayhux',
      //   email: 'hutiger818@gmail.com',
      //   emailVerified: null,
      //   image: 'https://avatars.githubusercontent.com/u/168693377?v=4',
      //   createdAt: 2024-05-31T14:38:06.479Z,
      //   updatedAt: 2024-05-31T14:38:06.479Z,
      //   stripeCustomerId: null,
      //   stripeSubscriptionId: null,
      //   stripePriceId: null,
      //   stripeCurrentPeriodEnd: null
      // }

      console.log('auth, jwt, token sub:', token?.sub);
      // console.log('auth, jwt, token:', token);
      // auth, jwt, token: {
      //   name: 'javayhux',
      //   email: 'hutiger818@gmail.com',
      //   picture: 'https://avatars.githubusercontent.com/u/168693377?v=4',
      //   sub: 'clwusgyhb0000jeeg1t2491bz'
      // }

      if (!token.sub) {
        // console.log("auth, jwt, no sub, token:", token);
        return token;
      }

      // the first time to login is signUp, then logout and login again is signIn
      if (trigger === "signUp") {
        // console.log('auth, signUp, user:', user);
        // console.log('auth, signUp, token:', token);

        // Check if user already exists in Sanity
        // according to sanity/lib/fetch.ts, dont cache in this case
        // sanity data has delay, so if user quick signin and logout,
        // same user may be created twice. 
        // what's more, if user signin and goto dashboard, no user will be found!!!
        // const link = (user.image && user.image?.indexOf("github") > -1) ? `https://github.com/${user.name}` : '';
        // _id defaults to user.id, that is great, keep id is same in database and sanity
        const submitData = {
          _type: "user",
          _id: user.id ?? token.sub,
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.image,
          date: new Date().toISOString(),
        };
        console.log("auth, signUp, sync user to sanity, submitData:", submitData);

        // use createIfNotExists instead of create, simplify logic, just one sql call
        const res = await client.createIfNotExists(submitData);
        console.log("auth, signUp, sync user to sanity, res:", res);
      } else {
        // trigger is not signUp, fetch user info from database then return token
        const dbUser = await getUserById(token.sub);
        if (!dbUser) {
          console.log("auth, jwt, no dbUser");
          return token;
        }

        token.name = dbUser.name;
        token.email = dbUser.email;
        token.picture = dbUser.image;
      }
      return token;
    },
  },
  ...authConfig,
  // debug: process.env.NODE_ENV !== "production"
})