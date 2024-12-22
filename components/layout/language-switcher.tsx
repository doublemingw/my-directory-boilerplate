"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const pathName = usePathname();
  const redirectedPathName = (locale: string) => {
    if (!pathName) {
      console.log('LanguageSwitcher, redirectedPathName, pathName is null');
      return "/";
    }
    const segments = pathName.split("/");
    // console.log('LanguageSwitcher, redirectedPathName, segments:', segments);
    segments[1] = locale;
    const redirectUrl = segments.join("/"); // TODO(javayhu) search params not considered!!!
    // console.log('LanguageSwitcher, redirectedPathName, redirectUrl:', redirectUrl);
    return redirectUrl;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="size-8 px-0">
          <GlobeIcon className="size-5" />
          {/* <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
          <span className="sr-only">Language Switcher</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          {/* <Icons.sun className="mr-2 size-4" /> */}
          {/* <span>English</span> */}
          <Link href={redirectedPathName('en')} prefetch={false}
            className="flex items-center">
            🇬🇧{"    "}English
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {/* <Icons.moon className="mr-2 size-4" /> */}
          {/* <span>简体中文</span> */}
          <Link href={redirectedPathName('zh')} prefetch={false}
            className="flex items-center">
            🇨🇳{"    "}简体中文
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
