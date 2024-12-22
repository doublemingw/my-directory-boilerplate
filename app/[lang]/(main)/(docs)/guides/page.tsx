import { allAuthors, allGuides } from "contentlayer/generated";
import { compareDesc } from "date-fns";

import { FeaturePageHeader } from "@/components/feature-page-header";
import { AllGuideConfigs } from "@/config/guide";
import { formatDate } from "@/lib/utils";
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "Guides",
  description:
    "This section includes helpful guides to help you quick start your indie applications",
}

interface GuidesPageProps {
  params: { lang: string };
}

export default function GuidesPage({ params }: GuidesPageProps) {
  const { lang } = params;
  console.log('AppListLayout, language:', lang); // language: en
  const pageConfig = AllGuideConfigs[lang];

  const guides = allGuides
    .filter((guide) => guide.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date))
    });

  return (
    <main>
      <div className="pb-16">
        {/* Page Header */}
        <div className="bg-linear py-10">
          <FeaturePageHeader className="container"
            heading={pageConfig.title}
            text={pageConfig.subtitle} />
        </div>

        <section className="container">
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
              guides.map((item) => {
                const authors = item.authors.map((author) =>
                  allAuthors.find(({ slug }) => slug === `/authors/${author}`)
                );
                // console.log('GuidesPage, slug:', item.slug);
                // const link = `/${lang}${item.slug}`;
                // console.log('GuidesPage, link:', link);
                return (
                  <article key={item._id} className="group relative cursor-pointer overflow-hidden 
                  rounded-xl border p-5 md:py-5 space-y-4 transition-all 
                  hover:bg-accent md:scale-100 md:hover:scale-105">

                    {/* Image */}
                    {item.image && (
                      <Image
                        alt={item.title}
                        src={item.image}
                        width={600}
                        height={338}
                        className="rounded-md bg-muted transition-colors mx-auto"
                      />
                    )}

                    {/* Title & Description */}
                    <h2 className="line-clamp-2 font-heading text-xl">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="line-clamp-2 text-muted-foreground">
                        {item.description}
                      </p>
                    )}

                    {/* Authors & Date */}
                    <div className="flex items-center justify-between">
                      {item.authors?.length ? (
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
                                  width={20}
                                  height={20}
                                  className="border rounded-full bg-white"
                                />
                                <div className="flex-1 text-left leading-tight space-y-1">
                                  <p className="">{author.title}</p>
                                </div>
                              </Link>
                            ) : null
                          )}
                        </div>
                      ) : null}

                      {item.date && (
                        <time
                          dateTime={item.date}
                          className="text-sm text-muted-foreground"
                        >
                          {/* Published on  */}
                          {formatDate(item.date)}
                        </time>
                      )}
                    </div>

                    <Link href={`/${lang}${item.slug}`} className="absolute inset-0">
                      <span className="sr-only">View</span>
                    </Link>
                  </article>
                )
              }
              )
            }
          </div>
        </section>
      </div>
    </main>
  )
}
