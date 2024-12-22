"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarNavItem } from "types";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";

interface DashboardNavProps {
  items: SidebarNavItem[];
  lang: string;
}

export function DashboardNav({ items, lang }: DashboardNavProps) {
  const pathname = usePathname();
  // console.log('DashboardNav, lang:', lang, 'pathname:', pathname);
  if (!items?.length) {
    return null;
  }

  return (
    <nav className="sticky top-24 grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link key={index} 
              href={item.disabled ? `/${lang}` : `/${lang}${item.href}`}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm",
                  "hover:bg-accent hover:text-primary hover:font-semibold dark:hover:text-primary-foreground",
                  pathname === `/${lang}${item.href}` ? "dark:bg-accent text-primary dark:text-foreground font-semibold" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 size-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        )
      })}
    </nav>
  )
}
