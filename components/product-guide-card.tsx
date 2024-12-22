import Link from "next/link";

import { ArrowUpRightIcon, NotepadTextIcon } from "lucide-react";

// copy from ProductQueryResult in sanity.types.ts
export interface ProductGuideCardProps {
  _id: string;
  _type: "guide";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug: string | null;
  excerpt?: string;
  link?: string;
  order?: number;
  date?: string;
};

export default function ProductGuideCard({ lang, guide }: { lang: string, guide: ProductGuideCardProps }) {
  const href = (guide.link && guide.link !== "") ? guide.link : `/${lang}/guides/${guide.slug}`;
  return (
    <section className="w-full">
      <Link target="_blank" href={href}>
        <div
          className="group cursor-pointer overflow-hidden p-5 md:py-5 
          rounded-lg border-[1.5px] border-primary dark:border-foreground
          transition-all md:scale-100 md:hover:scale-105"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <NotepadTextIcon className="size-5 text-primary dark:text-foreground" />
                <h2 className="my-auto line-clamp-1 font-semibold text-md text-violet-800 dark:text-foreground">
                  {guide.name}
                </h2>
              </div>
              <ArrowUpRightIcon className="size-5 text-violet-800 dark:text-foreground" />
            </div>

            <p className="my-6 text-sm line-clamp-2 text-violet-600 dark:text-foreground">
              {guide.excerpt}
            </p>
          </div>
        </div>
      </Link>
    </section>
  );
}
