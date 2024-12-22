'use client';

import { AllApplicationConfigs } from '@/config/application';
import { AppQueryResult } from '@/sanity.types';
import { notFound } from 'next/navigation';
import AppDetailClient from './app-detail-client';
import AppHeaderClient from './app-header-client';
import { Comment } from './comment';

export default function AppSingleClient({ lang, app }: { lang: string; app: AppQueryResult }) {
  console.log('AppSingleClient, app:', app);
  if (!app) {
    console.error('AppSingleClient, app not found');
    return notFound();
  }
  const appConfig = AllApplicationConfigs[lang];

  return (
    <>
      {/* removed container here, and add it to children components */}
      <div className="min-h-screen pb-16">
        <div className="mx-auto space-y-8">
          {/* App Info */}
          <AppHeaderClient lang={lang} app={app} />

          {/* Content & Details */}
          <div className="container grid gap-8 md:grid-cols-12">
            <div className="order-2 md:order-1 md:col-span-6 lg:col-span-7 flex flex-col gap-4">
              {/* introduction */}
              <h2 className="text-xl font-semibold mb-4">
                {appConfig.introduction}
              </h2>

              {/* description */}
              <p className="text-base text-muted-foreground leading-loose">
                {app.description}
              </p>
            </div>

            <div className="order-3 md:order-2 md:col-span-1"></div>

            {/* Details */}
            <div className='order-1 md:order-3 md:col-span-5 lg:col-span-4'>
              <AppDetailClient lang={lang} app={app} />
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="container mt-32 pt-8 border-t">
          <div className='mx-auto max-w-5xl'>
            <Comment lang={lang} />
          </div>
        </div>
      </div>
    </>
  )
}
