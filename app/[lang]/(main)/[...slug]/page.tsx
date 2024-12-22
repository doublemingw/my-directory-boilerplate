import { notFound } from "next/navigation";
import { allPages } from "contentlayer/generated";

import { Mdx } from "@/components/content/mdx-components";

import "@/styles/mdx.css";
import { Metadata } from "next";

import { enSiteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

interface PageProps {
  params: {
    // lang: string,
    slug: string[]
  }
}

async function getPageFromParams(params) {
  const slug = params?.slug?.join("/");
  const page = allPages.find((page) => page.slugAsParams === slug);

  if (!page) {
    return null;
  }
  return page;
}

export async function generateStaticParams(): Promise<PageProps["params"][]> {
  return allPages.flatMap((page) => ({
    slug: page.slugAsParams.split("/"),
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = await getPageFromParams(params);
  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: absoluteUrl(page.slug),
    },
    openGraph: {
      type: "article",
      title: page.title,
      description: page.description,
      url: absoluteUrl(page.slug),
      images: [enSiteConfig.ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      site: absoluteUrl(page.slug),
      images: [enSiteConfig.ogImage],
    },
  }
}

export default async function PagePage({ params }: PageProps) {
  const page = await getPageFromParams(params);
  if (!page) {
    return notFound();
  }

  return (
    <article className="container py-6 lg:py-12">
      {/* Page Header */}
      <div className="space-y-4">
        <h1 className="inline-block font-heading text-3xl lg:text-4xl">
          {page.title}
        </h1>
        {page.description && (
          <p className="text-base text-muted-foreground">{page.description}</p>
        )}
      </div>
      <hr className="my-4" />

      {/* Page Content */}
      <Mdx code={page.body.code} />
    </article>
  )
}
