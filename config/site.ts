import { env } from "@/env.mjs";
import { SiteConfig } from "types";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const enSiteConfig: SiteConfig = {
  name: "INDIE HACKERS TOOLS",
  title: "Indie Hackers Tools - Discover Top Products for Efficient Indie Hacking",
  description:
    "Indie Hackers Tools - Explore the best products to help you ship next application faster and better",
  url: site_url,
  ogImage: `${site_url}/og.png?v=13`,
  links: {
    twitter: "https://x.com/javayhutx",
    github: "https://github.com/javayhu",
    coffee: "https://buymeacoffee.com/javayhu",
  },
  mailSupport: "javayhu@gmail.com",
  creator: "javayhu",
  subtitle: "Indie Hackers Tools - Explore the best products to help you ship next application faster and better",
};

const zhSiteConfig: SiteConfig = {
  name: "INDIE HACKERS TOOLS",
  title: "独立开发者导航站，发掘最优秀的工具，助力你快速发布下一个应用",
  description:
    "独立开发者导航站，发掘最优秀的工具，助力你快速发布下一个应用",
  url: site_url,
  ogImage: `${site_url}/og.png?v=13`,
  links: {
    twitter: "https://x.com/javayhu",
    github: "https://github.com/javayhu",
    coffee: "https://buymeacoffee.com/javayhu",
  },
  mailSupport: "javayhu@gmail.com",
  creator: "javayhu",
  subtitle: "独立开发者导航站，发掘最优秀的工具，助力你快速发布下一个应用",
};

export const AllSiteConfigs: {[key: string]: SiteConfig} = {
  en: enSiteConfig,
  zh: zhSiteConfig,
}