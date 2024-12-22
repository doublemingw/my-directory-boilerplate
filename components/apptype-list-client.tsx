'use client';

import { cn } from '@/lib/utils';
import { AppTypeListQueryResult } from '@/sanity.types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppTypeListClientProps {
  lang: string;
  categoryList: AppTypeListQueryResult;
}

export default function AppTypeListClient({ lang, categoryList }: AppTypeListClientProps) {
  // console.log('AppTypeListClient, lang:', lang);
  // console.log('AppTypeListClient, categoryList:', categoryList);
  const pathname = usePathname();
  // /en/apptype/web-app, category is web-app
  const category = pathname.split('/').pop();

  return (
    <div className="flex flex-wrap gap-2">
      {
        categoryList.map((item) => (
          <Link
            key={item._id}
            href={`/${lang}/apptype/${item.slug}`}
            className={
              cn(
                'border text-sm font-medium py-1 px-3 cursor-pointer rounded-full',
                'hover:bg-primary/90 hover:text-primary-foreground',
                'dark:text-foreground dark:hover:bg-primary-800',
                category === item.slug ? "bg-primary text-primary-foreground" : "",
              )
            }
          >
            {item.name}
          </Link>
        ))}
    </div>
  )
}
