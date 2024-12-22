import { AllApplicationConfigs } from "@/config/application";
import { AppQueryResult } from "@/sanity.types";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";

interface AppBreadCrumbProps {
  lang: string;
  app: AppQueryResult;
}

export default function AppBreadCrumb({ lang, app }: AppBreadCrumbProps) {
  const appConfig = AllApplicationConfigs[lang];

  return <Breadcrumb className="">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href={`/${lang}/apptype/new`}>
          {appConfig.title}
        </BreadcrumbLink>
      </BreadcrumbItem>
      {/* one app may have many apptypes, we simply pick the first one */}
      {/* 20240602, dont show apptype for now */}
      {/* {
        app && app.types && app.types.length > 0 &&
        <>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${lang}/apptype/${app.types[0].slug}`}>
              {app.types[0].name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </>
      } */}
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage className="font-medium">
          {app?.name}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>;
}