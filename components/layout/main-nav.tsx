"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";
import * as React from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Icons } from "@/components/shared/icons";
import { AllSiteConfigs } from "@/config/site";
import { cn } from "@/lib/utils";
import { MainNavItem } from "types";
import { Logo } from "../shared/logo";

interface MainNavProps {
  lang: string;
  items?: MainNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ lang, items, children }: MainNavProps) {
  const segment = useSelectedLayoutSegment();
  const pathname = usePathname();
  // console.log('MainNav, lang: ', lang, ' segment: ', segment, ' pathname: ', pathname);
  const siteConfig = AllSiteConfigs[lang];
  // const { data: session, status } = useSession();

  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  }
  React.useEffect(() => {
    const closeMobileMenuOnClickOutside = (event: MouseEvent) => {
      if (showMobileMenu) {
        setShowMobileMenu(false);
      }
    }
    document.addEventListener("click", closeMobileMenuOnClickOutside);
    return () => {
      document.removeEventListener("click", closeMobileMenuOnClickOutside);
    }
  }, [showMobileMenu]);

  return (
    <div className="flex gap-6 md:gap-10">
      {/* logo */}
      <Link href={`/${lang}`} className="hidden items-center space-x-2 md:flex">
        <Logo />
        <span className="hidden text-xl font-bold text-gradient-indigo-purple md:inline-block">
          {siteConfig.name}
        </span>
      </Link>

      {/* navbar links */}
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {/* previous check condition: item.href.startsWith(`/${segment}`) */}
          {/* change to check pathname, more accurate, otherwise /dashboard will not work */}
          {/* font-heading  */}
          {items?.map((item, index) => (
            <Link key={index} prefetch={true}
              href={item.external ? item.href : (item.disabled ? "#" : `/${lang}${item.href}`)}
              target={item.external ? "_blank" : "_self"}
              className={cn(
                "flex items-center transition-colors",
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
      ) : null}

      {/* mobile nav */}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={toggleMobileMenu}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.menu />}
      </button>
      {showMobileMenu && items && (
        <MobileNav lang={lang} items={items}>{children}</MobileNav>
      )}
    </div>
  )
}
