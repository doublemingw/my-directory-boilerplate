import { notFound } from "next/navigation";

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { AllDashboardConfigs } from "@/config/dashboard";
import { AllNavConfigs } from "@/config/navbar";
import { getCurrentUser } from "@/lib/session";

interface DashboardLayoutProps {
  params: { lang: string };
  children?: React.ReactNode;
}

// This layout cant put inside (main), because it has a dashboard sidenav
export default async function DashboardLayout({
  params,
  children,
}: DashboardLayoutProps) {
  const { lang } = params;
  // console.log('DashboardLayout, lang:', lang);
  const navConfig = AllNavConfigs[lang];
  const dashboardConfig = AllDashboardConfigs[lang];

  const user = await getCurrentUser();
  if (!user) {
    console.log('DashboardLayout, user not found');
    return notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar lang={lang} items={navConfig.mainNav} scroll={false} />

      <div className="container pt-8 pb-16 grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav lang={lang} items={dashboardConfig.sidebarNav} />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
      <SiteFooter lang={lang} className="border-t" />
    </div>
  )
}
