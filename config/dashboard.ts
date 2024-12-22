import { DashboardConfig } from "types"

const enDashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Settings",
      href: "/dashboard",
      icon: "settings",
    },
    {
      title: "Application List",
      href: "/dashboard/applist",
      icon: "dashboard",
    },
    {
      title: "Submit Application",
      href: "/dashboard/app",
      icon: "aperture",
    },
    {
      title: "Share Product",
      href: "/dashboard/submit",
      icon: "share",
    },
  ],
}

const zhDashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "设置",
      href: "/dashboard",
      icon: "settings",
    },
    {
      title: "应用列表",
      href: "/dashboard/applist",
      icon: "dashboard",
    },
    {
      title: "提交应用",
      href: "/dashboard/app",
      icon: "aperture",
    },
    {
      title: "推荐产品",
      href: "/dashboard/submit",
      icon: "share",
    },
  ],
}

export const AllDashboardConfigs:{[key: string]: DashboardConfig} = {
  en: enDashboardConfig,
  zh: zhDashboardConfig,
}
