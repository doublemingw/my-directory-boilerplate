"use client";

import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AllAuthConfigs } from "@/config/auth";
import { AllDashboardConfigs } from "@/config/dashboard";
import { Icons } from "../shared/icons";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  lang: string;
}

export function UserAccountNav({ lang }: UserAccountNavProps) {
  // console.log('UserAccountNav, lang:', lang);
  const authConfig = AllAuthConfigs[lang];
  const dashboardConfig = AllDashboardConfigs[lang];
  const { data: session, status } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: session?.user?.name || null, image: session?.user?.image || null }}
          className="size-7 border animate-fade-in transition-colors ease-out"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {session?.user?.name && <p className="font-medium">{session?.user?.name}</p>}

            {/* {session?.user?.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {session?.user?.email}
              </p>
            )} */}
          </div>
        </div>
        <DropdownMenuSeparator />

        {
          dashboardConfig.sidebarNav.map((item) => {
            const Icon = Icons[item.icon || "arrowRight"];
            return <DropdownMenuItem asChild key={item.href}>
              <Link href={`/${lang}${item.href}` ?? `/${lang}`}
                className="cursor-pointer flex items-center space-x-2.5">
                <Icon className="size-4" />
                <p className="">{item.title}</p>
              </Link>
            </DropdownMenuItem>
          })
        }

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `/${lang}`,
            });
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOutIcon className="size-4" />
            <p className="">
              {authConfig.logout}
            </p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}