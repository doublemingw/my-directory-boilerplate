import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// https://create.t3.gg/en/usage/env-variables
// all EVs should be defined in runtimeEnv,
// and then split them into server or client EVs.
export const env = createEnv({
  server: {
    // This is optional because it's only used in development.
    // See https://next-auth.js.org/deployment.
    // NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    // GOOGLE_CLIENT_ID: z.string().min(1),
    // GOOGLE_CLIENT_SECRET: z.string().min(1),
    
    DATABASE_URL: z.string().min(1),

    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SANITY_API_WRITE_TOKEN: z.string().min(1),
    // SANITY_API_READ_TOKEN: z.string().min(1),
    // SANITY_API_WRITE_TOKEN: z.string().min(1),

    // RESEND_API_KEY: z.string().min(1),
    
    // STRIPE_API_KEY: z.string().min(1),
    // STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),

    // NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: z.string().min(1),
    // NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: z.string().min(1),
    // NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: z.string().min(1),
    // NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: z.string().min(1),
  },
  runtimeEnv: {
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    DATABASE_URL: process.env.DATABASE_URL,
    
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_WRITE_TOKEN: process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
    
    // SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    // SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN,

    // Resend
    // RESEND_API_KEY: process.env.RESEND_API_KEY,

    // Stripe
    // STRIPE_API_KEY: process.env.STRIPE_API_KEY,
    // STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    // NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
    // NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    // NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_MONTHLY_PLAN_ID,
    // NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_YEARLY_PLAN_ID,
  },
})
