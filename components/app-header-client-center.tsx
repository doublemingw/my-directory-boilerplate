'use client';

import { AllApplicationConfigs } from '@/config/application';
import { AppQueryResult } from '@/sanity.types';
import { urlForImageWithSize } from '@/sanity/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AppBreadCrumb from './app-bread-crumb';
import { Badge } from './ui/badge';

export default function AppHeaderClient({ lang, app }: { lang: string; app: AppQueryResult }) {
  console.log('AppHeaderClient, app:', app);
  if (!app) {
    console.error('AppHeaderClient, app not found');
    return notFound();
  }
  const appConfig = AllApplicationConfigs[lang];

  return (
    <>
      {/* App Info */}
      <div className="w-screen py-6 bg-linear">
        <div className="container grid grid-cols-12 gap-8">

          <div className="col-span-12 flex flex-col gap-8">
            {/* Breadcrumb */}
            <AppBreadCrumb lang={lang} app={app} />

            {/* App Info */}
            <div className="flex flex-col items-center gap-6">

              {/* App icon & name */}
              <div className="flex items-center gap-6">
                <Image alt="image" className="rounded-sm"
                  height={48} width={48}
                  placeholder='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgBAMAAAAQtmoLAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAASUExURe7u8LO0vunq7N7e4sHCyszM05J1rm8AAAB2SURBVFjD7dXdCYAwDEbRmAkMOEDQBZRMUHCBIu6/iq2tj4IVxL/vQClC74MVIhEAAPwNt0l6yju3uhsMsmrSwbxXUt8YdGZOJrPDQeCl324AwVsDGSNXEGQXBnPkS16aSRVfGsGJoHjyPXB6EymHhV8xAMDnLNyhJR10BfPFAAAAAElFTkSuQmCC'
                  src={urlForImageWithSize(app.image, 96, 96)} />
              </div>

              {/* <div className='flex flex-col gap-2'> */}
                <h1 className="text-xl font-semibold font-heading">
                  {app.name}
                </h1>
              {/* </div> */}

              {/* Link */}
              {/* <div className="col-span-4 flex flex-col items-center justify-center">
                <Link
                  href={`${app.link}`}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "flex max-w-fit items-center justify-center rounded-full overflow-hidden px-6"
                  )}
                >
                  {appConfig.gotoApp}
                </Link>
              </div> */}

              {/* Apptype List */}
              {app.types && (
                <div className="flex flex-wrap gap-2 items-center">
                  {app.types.map((tag) => (
                    <Link key={tag._id} href={`/${lang}/apptype/${tag.slug}`}>
                      <Badge variant="outline" className="text-xs py-1 px-3 cursor-pointer
                            text-primary dark:text-foreground/80 border-violet-400
                            hover:border-transparent dark:hover:border-transparent
                            hover:bg-primary hover:text-primary-foreground dark:hover:text-primary-foreground
                            dark:hover:bg-primary-800 dark:border-primary-foreground/20">
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Link */}
          {/* {
            app.link &&
            <div className="col-span-4 flex flex-col items-center justify-center">
              <AppLinkButton lang={lang} link={app.link}>
                <span>访问应用</span>
              </AppLinkButton>
            </div>
          } */}
          {/* <div className="col-span-4 flex flex-col items-center justify-center">
            <Link
              href={`${app.link}`}
              className={cn(
                buttonVariants({ variant: "default" }),
                "flex max-w-fit items-center justify-center rounded-full overflow-hidden px-6"
              )}
            >
              {appConfig.gotoApp}
            </Link>
          </div> */}

          {/* Cover Image */}
          {/* {
            product.coverImage &&
            <>
              <div className="lg:col-span-4 transition-all md:scale-100 md:hover:scale-105">
                <Link
                  href={`${product.website}`}
                  target="_blank"
                >
                  <Image width={480} height={270}
                    alt={product.name ?? ""}
                    className="rounded-lg w-full"
                    placeholder='data:image/png;base64,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'
                    src={urlForImageWithSize(product.coverImage, 960, 540)} />
                </Link>
              </div>
            </>
          } */}
        </div>
      </div>
    </>
  )
}
