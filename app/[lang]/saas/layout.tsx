import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { AllNavConfigs } from "@/config/navbar";
import { getCurrentUser } from "@/lib/session";

interface MarketingLayoutProps {
  params: { lang: string };
  children: React.ReactNode;
}

export default async function MarketingLayout({
  params,
  children,
}: MarketingLayoutProps) {
  const { lang } = params;
  const user = await getCurrentUser();
  const navConfig = AllNavConfigs[lang];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar lang={lang} items={navConfig.mainNav} scroll={true} />
      <main className="container flex-1">{children}</main>
      <SiteFooter lang={lang} />
    </div>
  )
}
