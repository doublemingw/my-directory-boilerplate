import Link from "next/link";
import * as React from "react";

import { AllSiteConfigs } from "@/config/site";
import { useLockBody } from "@/hooks/use-lock-body";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MainNavItem } from "types";
import { Logo } from "../shared/logo";

interface MobileNavProps {
  lang: string;
  items: MainNavItem[];
  children?: React.ReactNode;
}

export function MobileNav({ lang, items, children }: MobileNavProps) {
  useLockBody();
  const pathname = usePathname();
  console.log('MobileNav, lang: ', lang, ' pathname: ', pathname);
  const siteConfig = AllSiteConfigs[lang];

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
      )}
    >
      <div className="relative border z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href={`/${lang}`} className="flex justify-center items-center space-x-2">
          <Logo />
          <span className="font-bold text-gradient-indigo-purple">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm space-y-2">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : `/${lang}${item.href}`}
              prefetch={true}
              className={cn(
                "flex w-full justify-center items-center p-2 transition-colors",
                "hover:text-primary hover:dark:text-primary-400",
                (pathname.indexOf(`${item.path}`) >= 0)
                  ? "text-primary dark:text-foreground font-bold"
                  : "text-foreground dark:text-muted-foreground hover:dark:text-foreground",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              <h3>{item.title}</h3>
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div >
  )
}
