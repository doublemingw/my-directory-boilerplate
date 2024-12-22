import { notFound } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { ShareResourceForm } from "@/components/forms/share-resource-form";
import { AllShareResourceConfigs } from "@/config/share-resource";
import { getCurrentUser } from "@/lib/session";
import { UserQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { userQuery } from "@/sanity/lib/queries";

export const metadata = {
  title: "Share Resource",
  description: "Share your favorite products or articles or repositories.",
}

export default async function ShareResourcePage({ params }: { params: { lang: string }; }) {
  const { lang } = params;
  const pageConfig = AllShareResourceConfigs[lang];

  const user = await getCurrentUser();
  if (!user) {
    console.log("ShareResourcePage, user not found");
    return notFound();
  }
  console.log('ShareResourcePage, userid:', user.id, 'username:', user.name);

  const userQueryResult = await sanityFetch<UserQueryResult>({
    query: userQuery,
    params: {
      userId: user.id,
    },
    useCache: false,
  });
  if (!userQueryResult) {
    console.log("ShareResourcePage, userQueryResult not found");
    return notFound();
  }
  console.log('ShareResourcePage, sanityUser id:', userQueryResult._id, ' name:', userQueryResult.name);
  // console.log('ShareResourcePage, sanityUser:', userQueryResult);

  return (
    <DashboardShell>
      <DashboardHeader
        heading={pageConfig.title}
        text={pageConfig.subtitle}
      />
      <div className="grid gap-10">
        <ShareResourceForm lang={lang} user={{ id: user.id, name: user.name || "" }}
          sanityUser={userQueryResult} />
      </div>
    </DashboardShell>
  )
}
