import { allAuthors, allGuides } from "contentlayer/generated";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Comment } from "@/components/comment";
import { Mdx } from "@/components/content/mdx-components";
import { Icons } from "@/components/shared/icons";
import { DashboardTableOfContents } from "@/components/shared/toc";
import { getTableOfContents } from "@/lib/toc";

import "@/styles/mdx.css";
import { Metadata } from "next";

import { buttonVariants } from "@/components/ui/button";
import { AllGuideConfigs } from "@/config/guide";
import { env } from "@/env.mjs";
import { absoluteUrl, cn, formatDate } from "@/lib/utils";

interface GuidePageProps {
  params: {
    lang: string;
    slug: string[];
  }
}

async function getGuideFromParams(params) {
  const slug = params?.slug?.join("/");
  const guide = allGuides.find((guide) => guide.slugAsParams === slug);

  if (!guide) {
    return null;
  }

  return guide;
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = await getGuideFromParams(params);

  if (!guide) {
    return {};
  }

  const url = env.NEXT_PUBLIC_APP_URL;
  const ogUrl = new URL(`${url}/api/og`);
  ogUrl.searchParams.set("heading", guide.title);
  ogUrl.searchParams.set("type", "Guide");
  ogUrl.searchParams.set("mode", "dark");

  return {
    title: guide.title,
    description: guide.description,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      url: absoluteUrl(guide.slug),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
      images: [ogUrl.toString()],
    },
  }
}

// export async function generateStaticParams(): Promise<
//   GuidePageProps["params"][]
// > {
//   return allGuides.map((guide) => ({
//     slug: guide.slugAsParams.split("/"),
//   }))
// }

export default async function GuidePage({ params }: GuidePageProps) {
  const { lang } = params;
  const pageConfig = AllGuideConfigs[lang];

  const guide = await getGuideFromParams(params);
  // console.log('GuidePage, guide', guide); // too much logs in SSG mode

  if (!guide) {
    console.log('GuidePage, guide not found', guide);
    return notFound();
  }

  const toc = await getTableOfContents(guide.body.raw);
  const authors = guide.authors.map((author) =>
    allAuthors.find(({ slug }) => slug === `/authors/${author}`)
  );

  return (
    <div className="min-h-screen pt-8 pb-16">
      <main className="container lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 xl:gap-20">
        <div>
          {/* <DocsPageHeader heading={guide.title} text={guide.description} /> */}

          {/* Page Header */}
          <h1 className="mt-2 inline-block text-balance font-heading text-2xl leading-tight lg:text-3xl">
            {guide.title}
          </h1>

          <div className="mt-6 flex items-center justify-between">
            {authors?.length ? (
              <div className="flex space-x-4">
                {authors.map((author) =>
                  author ? (
                    <Link
                      key={author._id}
                      href={`https://x.com/${author.twitter}`}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <Image
                        src={author.avatar}
                        alt={author.title}
                        width={36}
                        height={36}
                        className="border rounded-full bg-white"
                      />
                      <div className="flex-1 text-left leading-tight space-y-1">
                        <p className="font-medium">{author.title}</p>
                        <p className="text-[12px] text-muted-foreground">
                          @{author.twitter}
                        </p>
                      </div>
                    </Link>
                  ) : null
                )}
              </div>
            ) : null}

            {guide.date && (
              <time
                dateTime={guide.date}
                className="text-sm text-muted-foreground"
              >
                {/* Published on  */}
                {formatDate(guide.date)}
              </time>
            )}

          </div>

          {/* Content */}
          <Mdx code={guide.body.code} />

          {/* See all guides */}
          <div>
            <hr className="my-4" />
            <div className="flex justify-center py-8">
              <Link href={`/${lang}/guides`}
                className={cn(buttonVariants({ variant: "default" }))} >
                <Icons.chevronLeft className="mr-2 size-4" />
                {pageConfig.seeAllGuides}
              </Link>
            </div>
          </div>
        </div>

        {/* Table of contents */}
        <div className="hidden text-sm lg:block">
          <div className="sticky top-24 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
            <DashboardTableOfContents toc={toc} />
          </div>
        </div>
      </main>

      {/* Comment */}
      <div className="container w-full mt-16 pt-8 border-t">
        <div className='mx-auto max-w-5xl'>
          <Comment lang={lang} />
        </div>
      </div>
    </div>
  )
}
