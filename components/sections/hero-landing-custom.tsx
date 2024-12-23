import Link from "next/link";

import { Icons } from "@/components/shared/icons";
import { buttonVariants } from "@/components/ui/button";
import { AllSiteConfigs, enSiteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { LayoutGridIcon } from "lucide-react";

interface HeroLandingProps extends React.HTMLAttributes<HTMLElement> {
  lang: string;
}

export function HeroLanding({ lang }: HeroLandingProps) {
  // console.log('HeroLanding, lang:', lang);
  const siteConfig = AllSiteConfigs[lang];

  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex flex-col items-center gap-5 text-center">
        {/* Want animations? Check here: https://github.com/mickasmt/next-saas-stripe-starter/blob/76eb9f2b70b29c7a734ff0e5b047796ed2dac28d/app/(marketing)/page.tsx */}
        {/* href="https://twitter.com/miickasmt/status/1719892161095745801" */}
        <Link
          href="https://x.com/javay_hu"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "px-4 transition-all scale-100 hover:scale-105",
            "animate-fade-down opacity-0"
          )}
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          target="_blank"
        >
          <span className="mr-3">🎉</span> Introducing on{" "}
          <Icons.twitterBird className="ml-2 size-4" />
        </Link>

        <h1 className="animate-fade-up text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Kick off your next app {" "} <br />
          <span className="text-gradient-indigo-purple font-extrabold">
            Faster and Better
          </span>
        </h1>

        {/* text-muted-foreground text-balance / text-base */}
        <p
          className="max-w-2xl text-muted-foreground text-balance leading-normal sm:text-lg sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          {/* Build your next project using Next.js 14, Prisma, Neon, Auth.js
          v5, Resend, React Email, Shadcn/ui, Stripe. */}
          {siteConfig.subtitle}
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href={`/${lang}/group/new`}
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2 transition-all scale-100 hover:scale-105",
            )}
          >
            <span>🔥{" "}Expolre Products</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          <Link
            href={siteConfig.links.github}
            target="_blank"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "gap-2 transition-all scale-100 hover:scale-105",
            )}
          >
            <LayoutGridIcon className="size-4" />
            <p>
              {/* <span className="hidden sm:inline-block">View on</span>  */}
              {/* GitHub{" "} */}
              {/* <span className="font-semibold">{nFormatter(stars)}</span> */}
              Indie Apps
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
